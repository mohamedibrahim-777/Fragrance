---
Task ID: 1
Agent: Main Agent
Task: Fix "My Account" (dashboard) page and live preview

Work Log:
- Investigated the dashboard page at /dashboard
- Found the dev server was not running
- Verified the build succeeds (all pages compile correctly)
- Verified the dashboard HTML renders correctly with all sections (Priya, My Orders, Wishlist, Rewards, Settings, Profile, Addresses)
- Found the dev server kept crashing due to OOM (Out of Memory) - the dashboard was 2051 lines with heavy Recharts library and extensive Framer Motion animations
- Optimized the dashboard page by:
  - Removing `recharts` entirely - replaced AreaChart with lightweight CSS-based bar chart
  - Removing `AnimatePresence`, `useInView` hooks
  - Removing `AnimatedCounter`, `TempleDivider`, `CustomTooltip` components
  - Simplifying Framer Motion to minimal usage (just one page-level fade)
  - Removing complex animation variants (sidebarItemVariants, staggerContainer, staggerItem)
  - Replacing whileHover/whileTap with CSS transitions
- Dashboard reduced from 2051 lines to 1133 lines
- Build succeeds after optimization
- Server stability improved significantly - production server handled 12+ consecutive checks
- All pages (homepage, dashboard, admin) return 200 OK

Stage Summary:
- Dashboard page optimized and working correctly
- All interactive features preserved (sidebar nav, order tracking, wishlist, rewards, addresses, profile, settings, notifications, cart)
- Server runs and serves pages correctly
- Live preview should work when server is running
