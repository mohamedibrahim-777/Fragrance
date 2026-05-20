import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/my-orders");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8 sm:py-10">
      <h1 className="font-display text-4xl font-medium text-ink">My orders</h1>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border bg-surface p-10 text-center">
          <p className="text-ink-muted">No orders yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded bg-brass px-6 py-2 text-sm font-medium uppercase tracking-wider text-black shadow-brass hover:bg-brass-hover"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
                    Order #{o.id.slice(-8)}
                  </p>
                  <p className="mt-1 text-sm text-ink">
                    {new Date(o.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {" · "}
                    <span className="capitalize text-brass">{o.status}</span>
                  </p>
                </div>
                <p className="text-base font-semibold text-brass">
                  {formatINR(o.total)}
                </p>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-ink-muted">
                {o.items.map((item) => (
                  <li key={item.id}>
                    {item.productName} × {item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
