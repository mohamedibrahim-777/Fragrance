import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR, parseImages } from "@/lib/utils";
import { Pencil } from "lucide-react";
import {
  RefreshButton,
  ExportButton,
  AddProductButton,
  DeleteRowButton,
} from "../_components/AdminButtons";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-ink">Products</h1>
        <div className="flex gap-2">
          <RefreshButton />
          <AddProductButton />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        <ExportButton type="products" />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2/50 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="py-3 pl-4 pr-3">Image</th>
                <th className="py-3 pr-3">Product</th>
                <th className="py-3 pr-3">Category</th>
                <th className="py-3 pr-3">Price</th>
                <th className="py-3 pr-3">Stock</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = parseImages(p.images)[0] ?? "";
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-2/30">
                    <td className="py-3 pl-4 pr-3">
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="font-mono text-[10px] text-ink-muted">
                        {p.id.slice(0, 10)}...
                      </p>
                    </td>
                    <td className="py-3 pr-3 text-ink">{p.category.name}</td>
                    <td className="py-3 pr-3 font-semibold text-ink">{formatINR(p.price)}</td>
                    <td className="py-3 pr-3 text-ink">{p.stock}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          p.isActive
                            ? "bg-success/15 text-success"
                            : "bg-ink-muted/15 text-ink-muted"
                        }`}
                      >
                        {p.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          aria-label="Edit"
                          className="rounded-md p-1.5 text-ink-muted hover:bg-brand-soft hover:text-brand-hover"
                        >
                          <Pencil size={15} />
                        </Link>
                        <DeleteRowButton
                          endpoint={`/api/admin/products/${p.id}`}
                          label={`Delete "${p.name}"? It will be hidden from the store.`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
