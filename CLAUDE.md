# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Next.js dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Run production build
npm run lint         # next lint (ESLint with eslint-config-next)
npm run seed         # tsx prisma/seed.ts — seed dev SQLite DB

npx prisma migrate dev    # Apply / create migrations against dev.db
npx prisma generate       # Regenerate @prisma/client after schema change
npx prisma studio         # Inspect dev.db in browser
```

Vitest, jsdom, and @testing-library are installed as devDependencies, but no test files, `vitest.config.*`, or `test`/`test:*` script exist yet. Adding tests requires creating both the config and a script.

`DATABASE_URL` and `JWT_SECRET` come from env. No `.env*` file is committed — `src/lib/auth.ts` falls back to a hard-coded `JWT_SECRET` in dev. Prisma's `datasource` requires `DATABASE_URL`; create `.env` with `DATABASE_URL="file:./prisma/dev.db"` before running migrations or the app.

## Architecture

Next.js 14 App Router e-commerce app (fragrance store) with a single Prisma/SQLite database serving both customer storefront and admin panel from the same Next process.

**Stack:** Next.js 14.2 (App Router, RSC by default) · TypeScript strict · Prisma 6 + SQLite · Tailwind · Zustand (client state) · @tanstack/react-query · Zod · react-hook-form · bcryptjs + jsonwebtoken (auth). Path alias `@/*` → `src/*`.

**Auth (`src/lib/auth.ts`):** Custom JWT in an `httpOnly` cookie `shri_auth` (7-day expiry). `getCurrentUser()` is the server-side identity primitive — call it in Server Components, route handlers, and `layout.tsx` files. Roles are a string column on `User` (`"Customer"` default, `"Admin"` for admin access). The admin layout (`src/app/admin/layout.tsx`) guards the entire `/admin` subtree by checking `user.role === "Admin"` and redirecting/denying otherwise; individual admin pages assume the gate already ran. API routes under `src/app/api/admin/*` must re-check the role themselves — layouts do not protect route handlers.

**Prisma client (`src/lib/db.ts`):** Singleton pattern via `globalThis` to survive Next.js dev hot-reload. Always import `prisma` from `@/lib/db`; do not instantiate `PrismaClient` directly elsewhere.

**Client state (`src/lib/store.ts`):** Three Zustand stores persisted to localStorage:
- `useCart` (key `shri-cart`) — cart items + `count()`/`subtotal()` selectors
- `useWishlist` (key `shri-wishlist`)
- `useAuth` (key `shri-auth`) — **mirror only**, kept in sync with the server session by `src/components/AuthSync.tsx`. The cookie + `getCurrentUser()` is the source of truth; never trust `useAuth` for authorization decisions.

All three are `"use client"`. Server Components must not import from `store.ts`.

**Data model (`prisma/schema.prisma`):** Core models — `User` ↔ `Address`/`Order`, `Category` (self-referential `parentId` hierarchy via `CatHierarchy` relation), `Product` (single `categoryId`, `images` and `features` stored as **stringified JSON** because SQLite has no array type — parse on read, stringify on write), `Order` → `OrderItem` (with `shippingAddress` also stored as a JSON string), `Coupon`. Prices are `Float`.

**Routing layout:**
- `src/app/` — public routes: `products`, `collections`, `cart`, `checkout`, `wishlist`, `search`, `my-orders`, `order-success`, `profile`, `login`, `register`, `(legal)`, `_home`
- `src/app/admin/` — admin UI, gated by `admin/layout.tsx`; has its own `_components/` (sidebar etc.)
- `src/app/api/` — route handlers: `auth/{login,logout,me,register}`, `orders`, `admin/{products,orders,users,coupons,export}`

Customer order placement hits `/api/orders`; admin CRUD lives under `/api/admin/*`. Forms validate with Zod + react-hook-form before POSTing.

## Conventions

- Server Components are the default — only add `"use client"` when you need state, effects, or browser APIs.
- `getCurrentUser()` (not the Zustand `useAuth`) for any server-side auth/role check.
- When changing `schema.prisma`, run `npx prisma migrate dev` and `npx prisma generate`; commit the new migration folder under `prisma/migrations/`.
- JSON-string columns (`Product.images`, `Product.features`, `Order.shippingAddress`) — remember to `JSON.parse`/`JSON.stringify` at the boundary.
- Admin route handlers under `/api/admin/*` must independently verify `user.role === "Admin"`; the layout guard does not cover them.
