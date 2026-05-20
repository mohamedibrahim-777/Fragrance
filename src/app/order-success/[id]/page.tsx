import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatINR } from "@/lib/utils";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) notFound();
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order || order.userId !== user.id) notFound();

  const addr = JSON.parse(order.shippingAddress);

  return (
    <div className="mx-auto max-w-[700px] px-5 py-10 sm:py-12">
      <div className="rounded-lg border border-success/30 bg-success/5 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
          <Check size={24} />
        </div>
        <h1 className="mt-4 font-display text-3xl font-medium text-ink">
          Order placed successfully
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Thank you, {user.name}. Your order ID is <code className="text-ink">{order.id}</code>.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <h2 className="font-display text-xl text-ink">Items</h2>
        <ul className="mt-4 divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">
              <span>
                {item.productName}
                <span className="text-ink-muted"> × {item.quantity}</span>
              </span>
              <span>{formatINR(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd>{formatINR(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Shipping</dt>
            <dd>{order.shippingFee === 0 ? "FREE" : formatINR(order.shippingFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>Total paid</dt>
            <dd className="text-brass">{formatINR(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-6 text-sm">
        <h3 className="font-display text-lg text-ink">Shipping to</h3>
        <p className="mt-2 text-ink-muted">
          {addr.name}
          <br />
          {addr.line1}
          {addr.line2 ? <><br />{addr.line2}</> : null}
          <br />
          {addr.city}, {addr.state} {addr.pincode}
          <br />
          📞 {addr.phone}
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/products"
          className="flex-1 rounded border border-border bg-surface py-3 text-center text-sm font-medium uppercase tracking-wider text-ink hover:border-brass hover:text-brass"
        >
          Continue shopping
        </Link>
        <Link
          href="/my-orders"
          className="flex-1 rounded bg-brass py-3 text-center text-sm font-medium uppercase tracking-wider text-black shadow-brass hover:bg-brass-hover"
        >
          My orders
        </Link>
      </div>
    </div>
  );
}
