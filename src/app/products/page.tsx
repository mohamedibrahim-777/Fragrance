import Link from "next/link";
import { Heart } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { parseImages } from "@/lib/utils";
import { WishlistCount } from "./WishlistCount";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 sm:py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">
            {q ? `Results for "${q}"` : "All products"}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
        <Link
          href="/wishlist"
          className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-black"
        >
          <Heart size={16} />
          <span>Wishlist</span>
          <WishlistCount />
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="rounded border border-border bg-surface p-8 text-center text-ink-muted">
          Nothing here yet.
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
  );
}
