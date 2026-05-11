import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetail({
  params,
}: {
  params: { id: string };
}) {
  const customer = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
      addresses: true,
    },
  });
  if (!customer) notFound();

  const lifetimeValue = customer.orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/customers"
        className="text-sm text-ink-muted hover:text-brand"
      >
        ← Back to customers
      </Link>

      {/* Profile */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-muted">
              Customer
            </p>
            <h2 className="mt-1 text-2xl font-bold text-ink">{customer.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">{customer.email}</p>
            {customer.phone && (
              <p className="text-sm text-ink-muted">{customer.phone}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-ink-muted">
              Lifetime value
            </p>
            <p className="mt-1 text-2xl font-bold text-brand">
              {formatINR(lifetimeValue)}
            </p>
            <p className="text-xs text-ink-muted">
              {customer.orders.length} order
              {customer.orders.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          Joined {new Date(customer.createdAt).toLocaleString("en-IN")}
        </p>
      </div>

      {/* Addresses */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="text-base font-bold text-ink">Saved addresses</h3>
        {customer.addresses.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">None saved.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {customer.addresses.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-border p-3 text-sm"
              >
                <p className="font-semibold text-ink">{a.label}</p>
                <p className="text-ink-muted">
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.pincode}
                </p>
                <p className="text-ink-muted">📞 {a.phone}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Orders */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="text-base font-bold text-ink">Order history</h3>
        {customer.orders.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">No orders yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {customer.orders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-semibold text-ink hover:text-brand"
                  >
                    Order #{o.id.slice(-8).toUpperCase()}
                  </Link>
                  <p className="text-xs text-ink-muted">
                    {new Date(o.createdAt).toLocaleString("en-IN")} ·{" "}
                    {o.items.length} item{o.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand">{formatINR(o.total)}</p>
                  <p className="text-xs uppercase tracking-wider text-ink-muted">
                    {o.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
