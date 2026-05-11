import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  const customers = await prisma.user.findMany({
    where: { role: "Customer" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
      orders: { select: { total: true } },
    },
  });

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">All customers</h2>
        <span className="text-sm text-ink-muted">{customers.length} total</span>
      </div>

      {customers.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">No customers yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-muted">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">Orders</th>
                <th className="py-2 pr-3">Joined</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="py-3 pr-3 font-semibold text-ink">{c.name}</td>
                  <td className="py-3 pr-3 text-ink-muted">{c.email}</td>
                  <td className="py-3 pr-3 text-ink-muted">{c.phone ?? "—"}</td>
                  <td className="py-3 pr-3 text-ink">{c._count.orders}</td>
                  <td className="py-3 pr-3 text-ink-muted">
                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="rounded-full border border-brand px-3 py-1 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
