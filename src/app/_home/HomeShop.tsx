"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";

type Cat = { slug: string; name: string };
type Item = {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  categorySlug: string;
};

export function HomeShop({
  categories,
  products,
}: {
  categories: Cat[];
  products: Item[];
}) {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.categorySlug === active);
  }, [active, products]);

  const top = filtered.slice(0, 4);

  return (
    <>
      {/* Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active === c.slug ? "chip chip-active" : "chip"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Best Sellers heading */}
      <div className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-ink">Best sellers</h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-brand transition hover:text-brand-hover"
          >
            View all →
          </Link>
        </div>
        {top.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-border bg-surface p-8 text-center text-ink-muted">
            No products in this category yet.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {top.map((p) => (
              <ProductCard
                key={p.id}
                productId={p.id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                mrp={p.mrp}
                image={p.image}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
