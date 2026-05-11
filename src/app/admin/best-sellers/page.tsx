import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BestSellers() {
  const items = await prisma.orderItem.groupBy({
    by: ["productId", "productName"],
    _sum: { quantity: true, lineTotal: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 20,
  });

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="text-lg font-bold text-ink">Best sellers</h2>
      <p className="text-xs text-ink-muted">
        Ranked by units sold across all orders.
      </p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          No orders yet — once customers place orders, top products will appear here.
        </p>
      ) : (
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-muted">
              <th className="py-2 pr-3">#</th>
              <th className="py-2 pr-3">Product</th>
              <th className="py-2 pr-3">Units sold</th>
              <th className="py-2 pr-3">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr
                key={it.productId}
                className="border-b border-border last:border-0"
              >
                <td className="py-3 pr-3 font-bold text-brand">#{i + 1}</td>
                <td className="py-3 pr-3 font-semibold text-ink">
                  {it.productName}
                </td>
                <td className="py-3 pr-3 text-ink">{it._sum.quantity ?? 0}</td>
                <td className="py-3 pr-3 font-bold text-brand">
                  {formatINR(it._sum.lineTotal ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
