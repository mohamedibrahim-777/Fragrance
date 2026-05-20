"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

type Item = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  image: string;
};

export function SearchClient({ products }: { products: Item[] }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }, [q, products]);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 sm:py-10">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brass">
          Search
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Find your agarbatti
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Type a fragrance, weight, or keyword. Showing all products by default.
        </p>
      </div>

      {/* Search input */}
      <div className="mx-auto mt-8 max-w-xl">
        <div className="flex items-center gap-3 rounded-full border-2 border-brass bg-surface px-5 py-3 shadow-sm focus-within:border-ruby focus-within:shadow-md">
          <Search size={18} className="text-brass" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try: sandalwood, jasmine, rose, temple…"
            className="flex-1 bg-transparent text-base text-ink placeholder:text-ink-muted focus:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear"
              className="rounded-full p-1 text-ink-muted transition hover:text-ruby"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Results header */}
      <div className="mt-10 flex items-end justify-between">
        <h2 className="text-lg font-medium text-ink">
          {q.trim()
            ? `${filtered.length} result${filtered.length === 1 ? "" : "s"} for "${q.trim()}"`
            : `All products (${products.length})`}
        </h2>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="text-ink-muted">
            No products match{" "}
            <span className="font-semibold text-ink">&ldquo;{q}&rdquo;</span>.
            Try a different fragrance.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
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
  );
}
