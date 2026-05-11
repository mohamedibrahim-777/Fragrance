import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SalesReport() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Bucket by date (yyyy-mm-dd)
  const byDay = new Map<string, { count: number; total: number }>();
  for (const o of orders) {
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    const cur = byDay.get(key) ?? { count: 0, total: 0 };
    cur.count += 1;
    cur.total += o.total;
    byDay.set(key, cur);
  }
  const rows = Array.from(byDay.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total orders" value={totalOrders.toString()} />
        <Stat label="Total revenue" value={formatINR(totalRevenue)} />
        <Stat label="Average order value" value={formatINR(avgOrderValue)} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-lg font-bold text-ink">Daily sales</h2>
        {rows.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No orders yet.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-muted">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Orders</th>
                <th className="py-2 pr-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.date} className="border-b border-border last:border-0">
                  <td className="py-3 pr-3 text-ink">
                    {new Date(r.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 pr-3 text-ink">{r.count}</td>
                  <td className="py-3 pr-3 font-bold text-brand">
                    {formatINR(r.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{value}</p>
    </div>
  );
}
