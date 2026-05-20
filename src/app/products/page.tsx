import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "./ShopFilters";
import { PriceFilter } from "./PriceFilter";

export const dynamic = "force-dynamic";

function parseBound(v: string | undefined): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { cat?: string; sort?: string; min?: string; max?: string };
}) {
  const activeCat = searchParams.cat ?? "all";
  const sort = searchParams.sort ?? "new";
  const min = parseBound(searchParams.min);
  const max = parseBound(searchParams.max);

  const priceWhere =
    min !== undefined || max !== undefined
      ? {
          price: {
            ...(min !== undefined ? { gte: min } : {}),
            ...(max !== undefined ? { lte: max } : {}),
          },
        }
      : {};

  const prismaOrderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
      ? { price: "desc" as const }
      : sort === "name"
      ? { name: "asc" as const }
      : { createdAt: "desc" as const };

  const [categories, productsRaw] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: { not: null }, isActive: true },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(activeCat !== "all" ? { category: { slug: activeCat } } : {}),
        ...priceWhere,
      },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: prismaOrderBy,
    }),
  ]);

  const products =
    sort === "discount"
      ? [...productsRaw].sort((a, b) => {
          const da = a.mrp > 0 ? (a.mrp - a.price) / a.mrp : 0;
          const db = b.mrp > 0 ? (b.mrp - b.price) / b.mrp : 0;
          return db - da;
        })
      : productsRaw;

  const allCats = [{ slug: "all", name: "All" }, ...categories];

  return (
    <main className="flex-grow pt-[140px] pb-margin px-gutter max-w-container-max-width mx-auto w-full relative">
      <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-outline-variant/0 via-outline-variant/10 to-outline-variant/0 -z-10" />
      <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-outline-variant/0 via-outline-variant/10 to-outline-variant/0 -z-10" />

      <header className="mb-margin flex flex-col md:flex-row justify-between items-end gap-gutter border-b weathered-border pb-gutter relative">
        <div className="absolute bottom-0 left-0 w-1/3 h-px bg-gradient-to-r from-tertiary/40 to-transparent" />
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.45em] text-tertiary/70">
            ✦ The Sanctuary ✦
          </p>
          <h1
            className="font-headline-xl text-headline-xl text-tertiary mb-unit"
            style={{ textShadow: "0 4px 20px rgba(247,189,72,0.15)" }}
          >
            Sacred Fragrances
          </h1>
          <p className="font-body-lg text-body-lg text-outline max-w-2xl">
            Hand-rolled in the South Indian tradition. Each fragrance is an
            offering — designed to elevate your daily rituals.
          </p>
          <p className="mt-3 text-xs text-tertiary/70">
            {products.length} product{products.length === 1 ? "" : "s"}
            {activeCat !== "all" ? ` in ${activeCat.replace(/^agarbatti-/, "")}` : ""}
          </p>
        </div>
        <ShopFilters categories={allCats} active={activeCat} />
      </header>

      <PriceFilter />

      {/* Sort bar */}
      <div className="mb-6 flex items-center justify-end gap-3 flex-wrap">
        <span className="text-[10px] uppercase tracking-[0.3em] text-tertiary/60">Sort</span>
        <SortLink current={sort} value="new" label="Newest" sp={searchParams} />
        <SortLink current={sort} value="price-asc" label="Price ↑" sp={searchParams} />
        <SortLink current={sort} value="price-desc" label="Price ↓" sp={searchParams} />
        <SortLink current={sort} value="name" label="Name A–Z" sp={searchParams} />
        <SortLink current={sort} value="discount" label="Discount %" sp={searchParams} />
      </div>

      {products.length === 0 ? (
        <div className="rounded-sm border border-outline-variant/30 bg-surface-container/40 p-12 text-center">
          <p className="text-tertiary text-lg mb-2">No fragrances found</p>
          <p className="text-sm text-on-surface-variant">
            Try a different category or check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
          {products.map((p) => {
            const img = parseImages(p.images)[0] ?? "";
            return (
              <ProductCard
                key={p.id}
                productId={p.id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                mrp={p.mrp}
                image={img}
                category={p.category.name}
                description={p.description}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

function SortLink({
  current,
  value,
  label,
  sp,
}: {
  current: string;
  value: string;
  label: string;
  sp: { cat?: string; sort?: string; min?: string; max?: string };
}) {
  const qs = new URLSearchParams();
  if (sp.cat && sp.cat !== "all") qs.set("cat", sp.cat);
  if (sp.min) qs.set("min", sp.min);
  if (sp.max) qs.set("max", sp.max);
  if (value !== "new") qs.set("sort", value);
  const href = `/products${qs.toString() ? `?${qs.toString()}` : ""}`;
  const active = current === value;
  return (
    <a
      href={href}
      className={`text-xs tracking-wider uppercase px-2 py-1 rounded-sm transition-colors ${
        active ? "text-tertiary border-b border-tertiary" : "text-on-surface-variant hover:text-tertiary"
      }`}
    >
      {label}
    </a>
  );
}
