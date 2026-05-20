import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatINR, parseImages, SOLID_DARK } from "@/lib/utils";
import {
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { RefreshButton, ExportButton } from "./_components/AdminButtons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [customerCount, orderCount, productCount, totalRevenueAgg, recent, top] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);
  const totalRevenue = totalRevenueAgg._sum.total ?? 0;
  const productMap = await prisma.product.findMany({
    where: { id: { in: top.map((t) => t.productId) } },
  });
  const productLookup = new Map(productMap.map((p) => [p.id, p]));

  return (
    <>
      {/* Title row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-ink">Dashboard Overview</h1>
        <div className="flex gap-2">
          <RefreshButton />
          <ExportButton type="orders" label="Export Full Report" />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat href="/admin/analytics" label="Total Revenue" value={formatINR(totalRevenue)} icon={IndianRupee} />
        <Stat href="/admin/products" label="Products" value={productCount.toString()} icon={Package} />
        <Stat href="/admin/orders" label="Orders" value={orderCount.toString()} icon={ShoppingCart} />
        <Stat href="/admin/users" label="Active Users" value={customerCount.toString()} icon={Users} />
      </div>

      {/* Two-column lower */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Recent Orders</h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">No orders yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {recent.map((o) => (
                <li
                  key={o.id}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0"
                >
                  <div>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-semibold text-ink hover:text-brand"
                    >
                      {o.user.name}
                    </Link>
                    <p className="text-xs text-ink-muted">{o.user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink">{formatINR(o.total)}</p>
                    <p className="text-xs text-ink-muted">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Popular Products</h2>
          {top.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">No sales data yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {top.map((t) => {
                const p = productLookup.get(t.productId);
                const img = p ? parseImages(p.images)[0] ?? "" : "";
                return (
                  <li key={t.productId} className="flex items-center gap-3">
                    {img && (
                      <Image
                        src={img}
                        alt=""
                        width={48}
                        height={48}
                        placeholder="blur"
                        blurDataURL={SOLID_DARK}
                        className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-ink">
                        {t.productName}
                      </p>
                      <p className="text-sm font-bold text-brand">
                        {p ? formatINR(p.price) : ""}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function Stat({
  href,
  label,
  value,
  icon: Icon,
}: {
  href: string;
  label: string;
  value: string;
  icon: typeof Package;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted group-hover:text-brand transition-colors">{label}</p>
        <Icon size={18} className="text-ink-muted group-hover:text-brand transition-colors" />
      </div>
      <p className="mt-3 text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-wider text-ink-muted group-hover:text-brand transition-colors">
        View details →
      </p>
    </Link>
  );
}
