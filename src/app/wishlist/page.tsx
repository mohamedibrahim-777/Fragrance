"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useWishlist, useCart } from "@/lib/store";
import { formatINR } from "@/lib/utils";

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const removeWish = useWishlist((s) => s.remove);
  const addCart = useCart((s) => s.add);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[700px] px-5 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface text-brand">
          <Heart size={28} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Tap the heart on any product to save it for later.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-brand px-7 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-hover"
        >
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Saved for you
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            My Wishlist
          </h1>
        </div>
        <p className="text-sm text-ink-muted">
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <div
            key={p.productId}
            className="rounded-2xl border border-border bg-surface p-4 transition hover:border-brand/40"
          >
            <Link href={`/products/${p.slug}`} className="block">
              <div className="aspect-square overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-tight text-white">
                {p.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-base font-bold text-brand">
                  {formatINR(p.price)}
                </span>
                {p.mrp > p.price && (
                  <span className="text-xs text-ink-muted line-through">
                    {formatINR(p.mrp)}
                  </span>
                )}
              </div>
            </Link>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  addCart({
                    productId: p.productId,
                    slug: p.slug,
                    name: p.name,
                    price: p.price,
                    image: p.image,
                  });
                }}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-black transition hover:bg-brand-hover"
              >
                <ShoppingCart size={14} /> Add
              </button>
              <button
                onClick={() => removeWish(p.productId)}
                aria-label="Remove from wishlist"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-muted transition hover:border-danger hover:text-danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
