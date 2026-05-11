"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart, useWishlist } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  productId?: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  badge?: "Bestseller" | "New" | "Organic" | null;
  subtitle?: string;
  rating?: number;
};

export function ProductCard({
  productId,
  slug,
  name,
  price,
  mrp,
  image,
}: Props) {
  const off = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishItems = useWishlist((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pid = productId ?? slug;
  const wished = mounted && wishItems.some((i) => i.productId === pid);

  function handleWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWish({ productId: pid, slug, name, price, mrp, image });
  }

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({ productId: pid, slug, name, price, image });
  }

  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition group-hover:border-brand group-hover:shadow-md"
      >
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-surface-2/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {off > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-bold text-success">
              {off}% OFF
            </span>
          )}
          <button
            onClick={handleWish}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border transition ${
              wished
                ? "border-brand bg-brand text-white"
                : "border-border bg-white/90 text-ink-muted backdrop-blur hover:border-brand hover:text-brand"
            }`}
          >
            <Heart size={15} className={wished ? "fill-white" : ""} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-bold leading-snug text-ink group-hover:text-brand">
            {name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-extrabold text-ink">
              {formatINR(price)}
            </span>
            {mrp > price && (
              <span className="text-xs text-ink-muted line-through">
                {formatINR(mrp)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-hover"
          >
            <ShoppingCart size={13} /> Add to cart
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
