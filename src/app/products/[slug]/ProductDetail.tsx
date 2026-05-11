"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart, useWishlist } from "@/lib/store";
import { formatINR } from "@/lib/utils";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  features: string[];
  price: number;
  mrp: number;
  stock: number;
  sku: string;
  categoryName: string;
};

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishItems = useWishlist((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wished = mounted && wishItems.some((i) => i.productId === product.id);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const off = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  function handleAdd(buyNow = false) {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
      },
      qty
    );
    if (buyNow) {
      router.push("/cart");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">
        {product.categoryName}
      </p>

      <div className="mt-4 grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-lg border border-border bg-brass-soft/30">
            <motion.img
              key={active}
              src={product.images[active] ?? ""}
              alt={product.name}
              className="h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-16 w-16 overflow-hidden rounded border ${
                    i === active ? "border-brass" : "border-border"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-brass">
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-ink-muted line-through">
                  {formatINR(product.mrp)}
                </span>
                <span className="rounded bg-maroon px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  {off}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-muted">Inclusive of all taxes · SKU {product.sku}</p>

          <p className="mt-6 text-base leading-relaxed text-ink-muted">
            {product.description}
          </p>

          {product.features.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-ink">
                  <Check size={14} className="text-brass" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* Qty + actions */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded border border-border">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-ink-muted transition hover:text-brass"
                aria-label="Decrease"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-[2.5rem] text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="px-3 py-2 text-ink-muted transition hover:text-brass"
                aria-label="Increase"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-xs text-ink-muted">
              {product.stock > 10 ? "In stock" : `Only ${product.stock} left`}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {/* Add to Cart — emerald green */}
            <button
              onClick={() => handleAdd(false)}
              style={{ backgroundColor: "#1F7A4D" }}
              className="inline-flex items-center justify-center gap-2 rounded px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:brightness-110"
            >
              {added ? (
                <>
                  <Check size={16} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Add to cart
                </>
              )}
            </button>

            {/* Buy Now — brand amber */}
            <button
              onClick={() => handleAdd(true)}
              className="rounded bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-black shadow-brass transition hover:bg-brand-hover"
            >
              Buy now
            </button>

            {/* Wishlist — rose pink */}
            <button
              onClick={() =>
                toggleWish({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  mrp: product.mrp,
                  image: product.images[0] ?? "",
                })
              }
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              style={{
                backgroundColor: wished ? "#DC2C5C" : "transparent",
                borderColor: "#DC2C5C",
                color: wished ? "#FFFFFF" : "#DC2C5C",
              }}
              className="inline-flex items-center justify-center gap-2 rounded border-2 px-6 py-3 text-sm font-bold uppercase tracking-wider shadow-md transition hover:brightness-110"
            >
              <Heart size={16} className={wished ? "fill-white" : ""} />
              {wished ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
