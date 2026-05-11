import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminInventory() {
  const products = await prisma.product.findMany({
    orderBy: { stock: "asc" },
    include: { category: true },
  });
  const lowStock = products.filter((p) => p.stock < 20).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total SKUs" value={products.length.toString()} />
        <Stat
          label="Total stock units"
          value={products
            .reduce((s, p) => s + p.stock, 0)
            .toLocaleString("en-IN")}
        />
        <Stat
          label="Low-stock alerts"
          value={lowStock.toString()}
          tone={lowStock > 0 ? "danger" : "ok"}
        />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-lg font-bold text-ink">Stock levels</h2>
        <p className="text-xs text-ink-muted">
          Sorted by lowest first. Click a product to edit its stock value.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-muted">
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">Stock</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="py-3 pr-3 font-semibold text-ink">{p.name}</td>
                  <td className="py-3 pr-3 text-ink-muted">
                    {p.category.name}
                  </td>
                  <td className="py-3 pr-3 text-brand">
                    {formatINR(p.price)}
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        p.stock < 10
                          ? "bg-danger/15 text-danger"
                          : p.stock < 20
                            ? "bg-brand-soft text-brand-hover"
                            : "bg-success/15 text-success"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="rounded-full border border-brand px-3 py-1 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
                    >
                      Adjust
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "danger";
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-bold ${
          tone === "danger" ? "text-danger" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
