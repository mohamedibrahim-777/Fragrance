import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const cats = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { products: true } },
      parent: true,
    },
  });

  const tops = cats.filter((c) => !c.parentId);
  const subs = cats.filter((c) => c.parentId);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Categories</h2>
        <span className="text-sm text-ink-muted">{cats.length} total</span>
      </div>

      <div className="mt-4 space-y-4">
        {tops.map((top) => (
          <div
            key={top.id}
            className="rounded-lg border border-border bg-surface-2 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-ink">{top.name}</p>
                <p className="font-mono text-xs text-ink-muted">{top.slug}</p>
              </div>
              <span className="rounded-full bg-brand-soft px-3 py-0.5 text-xs font-bold text-brand-hover">
                {top._count.products} products
              </span>
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {subs
                .filter((s) => s.parentId === top.id)
                .map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded border border-border bg-white px-3 py-2 text-sm"
                  >
                    <span className="font-semibold text-ink">{s.name}</span>
                    <span className="text-xs text-ink-muted">
                      {s._count.products}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
