import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebarLink } from "./_components/SidebarLink";
import { LogoutButton } from "../profile/LogoutButton";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", iconKey: "dashboard" },
  { href: "/admin/products", label: "Products", iconKey: "products" },
  { href: "/admin/orders", label: "Orders", iconKey: "orders" },
  { href: "/admin/users", label: "Users", iconKey: "users" },
  { href: "/admin/resellers", label: "Resellers", iconKey: "resellers" },
  { href: "/admin/coupons", label: "Coupons", iconKey: "coupons" },
  { href: "/admin/analytics", label: "Analytics", iconKey: "analytics" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "Admin") {
    return (
      <div className="mx-auto max-w-[700px] px-5 py-12 text-center">
        <h1 className="text-3xl font-bold text-ink">Access denied</h1>
        <p className="mt-2 text-sm text-ink-muted">
          You need admin permissions to view this page.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white"
        >
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-180px)] grid-cols-1 lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-border bg-white px-4 py-6 lg:sticky lg:top-[64px] lg:h-[calc(100vh-180px)]">
        <h2 className="mb-5 px-3 text-2xl font-extrabold tracking-tight text-brand-hover">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-1">
          {NAV.map((it) => (
            <AdminSidebarLink
              key={it.href}
              href={it.href}
              label={it.label}
              iconKey={it.iconKey}
            />
          ))}
        </nav>
        <div className="mt-6 border-t border-border pt-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="bg-surface-2/40 p-5 lg:p-8">{children}</div>
    </div>
  );
}
