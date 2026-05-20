import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });
  if (!order) notFound();

  const shipping = (() => {
    try {
      return JSON.parse(order.shippingAddress) as {
        name?: string;
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        phone?: string;
      };
    } catch {
      return null;
    }
  })();

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-sm text-ink-muted hover:text-brand">
        ← Back to orders
      </Link>

      {/* Order header */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-muted">
              Order
            </p>
            <h2 className="mt-1 font-mono text-2xl font-bold text-ink">
              #{order.id.slice(-8).toUpperCase()}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Placed {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-success">
              {order.status}
            </span>
            <p className="mt-2 text-2xl font-bold text-brand">
              {formatINR(order.total)}
            </p>
            <p className="text-xs text-ink-muted">{order.paymentMethod}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-base font-bold text-ink">Items</h3>
          <ul className="mt-4 divide-y divide-border">
            {order.items.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-ink">{it.productName}</p>
                  <p className="text-xs text-ink-muted">
                    {formatINR(it.unitPrice)} × {it.quantity}
                  </p>
                </div>
                <p className="font-bold text-ink">{formatINR(it.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd>{formatINR(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Shipping</dt>
              <dd>{order.shippingFee === 0 ? "FREE" : formatINR(order.shippingFee)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd className="text-brand">{formatINR(order.total)}</dd>
            </div>
          </dl>
        </div>

        {/* Customer + Shipping */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Customer
            </p>
            <p className="mt-2 font-bold text-ink">{order.user.name}</p>
            <p className="text-sm text-ink-muted">{order.user.email}</p>
            {order.user.phone && (
              <p className="text-sm text-ink-muted">{order.user.phone}</p>
            )}
            <Link
              href={`/admin/customers/${order.user.id}`}
              className="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-hover"
            >
              View customer →
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Shipping address
            </p>
            {shipping ? (
              <div className="mt-2 text-sm text-ink">
                <p className="font-semibold">{shipping.name}</p>
                <p className="text-ink-muted">
                  {shipping.line1}
                  {shipping.line2 ? `, ${shipping.line2}` : ""}
                </p>
                <p className="text-ink-muted">
                  {shipping.city}, {shipping.state} {shipping.pincode}
                </p>
                <p className="text-ink-muted">📞 {shipping.phone}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">{order.shippingAddress}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
