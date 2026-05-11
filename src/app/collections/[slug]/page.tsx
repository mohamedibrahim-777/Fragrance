import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { parseImages } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      children: { where: { isActive: true } },
    },
  });
  if (!category || !category.isActive) notFound();

  const childIds = category.children.map((c) => c.id);
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: { in: [category.id, ...childIds] },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 sm:py-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">
        <Link href="/products" className="hover:text-brass">All products</Link> /{" "}
        {category.name}
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium text-ink">
        {category.name}
      </h1>

      {category.children.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {category.children.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-ink-muted transition hover:border-brass hover:text-brass"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        {products.length === 0 ? (
          <p className="rounded border border-border bg-surface p-8 text-center text-ink-muted">
            No products in this collection yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const imgs = parseImages(p.images);
              return (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  mrp={p.mrp}
                  image={imgs[0] ?? ""}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
