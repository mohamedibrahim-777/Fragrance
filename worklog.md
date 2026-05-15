---
Task ID: 1
Agent: main
Task: Fix preview not working for Shri Fragrance e-commerce site

Work Log:
- Investigated why the Next.js dev/production server kept crashing (OOM kills)
- Changed from Next.js server to static export (output: "export") with Python HTTP server
- Removed API route that blocked static export
- Added images.unoptimized: true for static export compatibility
- Created custom Python server (custom-server.py) with X-Frame-Options and CSP headers for iframe embedding
- Fixed clean URL routing (/admin, /dashboard) by adding custom handler and index.html copies
- Added watchdog script to auto-restart server if it crashes
- Verified all pages return 200 through Caddy proxy on port 81
- Verified iframe headers are present in all responses

Stage Summary:
- Server running on port 3000 (Python custom-server.py) with watchdog
- Caddy on port 81 proxies to port 3000
- All pages accessible: /, /admin, /dashboard
- Iframe headers (X-Frame-Options: ALLOWALL, CSP frame-ancestors) are present
- Static assets (JS, CSS, images) all load correctly
- Preview URL: https://preview-chat-3d6a2bc6-029a-4362-bdea-f2c5cd7bf5c3.space.chatglm.site/

---
Task ID: 2
Agent: main
Task: Redesign Shri Fragrance site - fix broken animations and improve design

Work Log:
- Identified root cause: static export + Framer Motion = broken (opacity:0 elements never animate in)
- Rewrote all 3 pages (homepage, admin, dashboard) to use CSS-only animations instead of Framer Motion
- Created useScrollReveal hook using IntersectionObserver for scroll-triggered animations
- Elements start at opacity:0.3 (visible) and animate to opacity:1 when scrolled into view
- Added scroll-progress CSS animation
- Admin dashboard: pure SVG/CSS charts (no recharts), working sidebar toggle, notifications dialog
- User dashboard: working tabs, expandable orders, address management, settings with toggles
- Rebuilt static export, fixed routing (admin/index.html, dashboard/index.html)
- Started custom Python server with iframe headers on port 3000
- Started watchdog for auto-restart
- Verified 0 opacity:0 elements in all pages
- All static assets (CSS, JS, images) load correctly
- Server stable for 30+ seconds
- All pages return 200 through Caddy proxy

Stage Summary:
- All pages redesigned with CSS animations (no Framer Motion dependency)
- Homepage: hero, trust bar, features, products with tabs, heritage story, pooja guide, testimonials, newsletter, footer
- Admin: collapsible sidebar, stats cards, SVG bar/donut/line charts, orders table, top products
- Dashboard: profile header, stats, tabs (orders/wishlist/addresses/settings), interactive dialogs
- Preview working: https://preview-chat-3d6a2bc6-029a-4362-bdea-f2c5cd7bf5c3.space.chatglm.site/
