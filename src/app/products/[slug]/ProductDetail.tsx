"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, useWishlist, useAuth } from "@/lib/store";
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
  const user = useAuth((s) => s.user);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishItems = useWishlist((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wished = mounted && wishItems.some((i) => i.productId === product.id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const off =
    product.mrp > product.price
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
      if (!user) {
        router.push("/login?next=/checkout");
      } else {
        router.push("/checkout");
      }
      return;
    }
    {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  const features =
    product.features.length > 0
      ? product.features.slice(0, 3)
      : ["Deep Wood", "Creamy Heart", "Subtle Spice"];

  return (
    <main className="flex-grow max-w-container-max-width mx-auto w-full px-gutter py-margin grid grid-cols-1 md:grid-cols-12 gap-margin mt-16">
      {/* Image Section (Left Split) */}
      <div className="md:col-span-6">
        <div className="relative rounded-full overflow-hidden shadow-[0_0_40px_rgba(217,119,7,0.15)] border border-outline-variant/30 aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={product.name}
            className="w-full h-full object-cover"
            src={product.images[activeImg] ?? ""}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface-container-highest/90 to-transparent backdrop-blur-sm">
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-surface-container rounded border border-outline-variant/50 font-label-sm text-label-sm text-tertiary uppercase">
                AUTHENTIC
              </span>
              <span className="px-3 py-1 bg-surface-container rounded border border-outline-variant/50 font-label-sm text-label-sm text-tertiary uppercase">
                SLOW BURN
              </span>
              {off > 0 && (
                <span className="px-3 py-1 bg-primary-container rounded border border-error/50 font-label-sm text-label-sm text-on-primary-container uppercase">
                  {off}% OFF
                </span>
              )}
            </div>
          </div>
        </div>
        {product.images.length > 1 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-16 w-16 overflow-hidden rounded border ${
                  i === activeImg
                    ? "border-tertiary shadow-[0_0_10px_rgba(247,189,72,0.3)]"
                    : "border-outline-variant/40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Section (Right Split) */}
      <div className="md:col-span-6 flex flex-col justify-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
            {product.categoryName} · SKU {product.sku}
          </p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            {product.name}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            {product.description}
          </p>
          <div className="font-headline-lg text-headline-lg text-tertiary flex items-baseline gap-3 flex-wrap">
            {formatINR(product.price)}
            {product.mrp > product.price && (
              <span className="font-body-md text-body-md text-outline line-through">
                {formatINR(product.mrp)}
              </span>
            )}
            <span className="font-body-md text-body-md text-on-surface-variant">
              · {product.stock > 10 ? "In stock" : `Only ${product.stock} left`}
            </span>
          </div>
        </div>

        {/* Fragrance Notes Chips */}
        <div className="space-y-3">
          <h3 className="font-headline-md text-headline-md text-secondary">
            Fragrance Profile
          </h3>
          <div className="flex flex-wrap gap-3">
            {features.map((f) => (
              <div
                key={f}
                className="px-4 py-2 bg-surface-container-low border border-outline/40 rounded-full font-label-sm text-label-sm text-on-surface flex items-center gap-2 shadow-[inset_0_0_10px_rgba(217,119,7,0.05)]"
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Ritual Usage Guide (Bento) */}
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <h3 className="font-headline-md text-headline-md text-secondary">
            Ritual Usage
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container border border-outline-variant/50 p-4 rounded-xl flex items-start gap-4 hover:shadow-[0_0_20px_rgba(217,119,7,0.1)] transition-shadow">
              <span
                className="material-symbols-outlined text-tertiary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                spa
              </span>
              <div>
                <h4 className="font-headline-md text-body-lg text-on-surface mb-1">
                  Meditation
                </h4>
                <p className="font-body-md text-label-sm text-on-surface-variant">
                  Grounds the mind for deep stillness.
                </p>
              </div>
            </div>
            <div className="bg-surface-container border border-outline-variant/50 p-4 rounded-xl flex items-start gap-4 hover:shadow-[0_0_20px_rgba(217,119,7,0.1)] transition-shadow">
              <span
                className="material-symbols-outlined text-tertiary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <div>
                <h4 className="font-headline-md text-body-lg text-on-surface mb-1">
                  Aarti
                </h4>
                <p className="font-body-md text-label-sm text-on-surface-variant">
                  Purifies the altar space.
                </p>
              </div>
            </div>
            <div className="bg-surface-container border border-outline-variant/50 p-4 rounded-xl flex items-start gap-4 hover:shadow-[0_0_20px_rgba(217,119,7,0.1)] transition-shadow sm:col-span-2">
              <span
                className="material-symbols-outlined text-tertiary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                self_improvement
              </span>
              <div>
                <h4 className="font-headline-md text-body-lg text-on-surface mb-1">
                  Evening Relaxation
                </h4>
                <p className="font-body-md text-label-sm text-on-surface-variant">
                  Clears residual daily energies, fostering a calm transition to rest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Qty + CTA */}
        <div className="pt-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded border border-outline-variant/40 bg-surface-container-low">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-tertiary hover:text-secondary-fixed-dim transition"
                aria-label="Decrease"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="min-w-[2.5rem] text-center font-label-sm tracking-widest text-on-surface">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="px-3 py-2 text-tertiary hover:text-secondary-fixed-dim transition"
                aria-label="Increase"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleAdd(false)}
              className="w-full sm:w-auto bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest py-4 px-8 rounded border border-tertiary/50 hover:shadow-[0_0_25px_rgba(217,119,7,0.3)] transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shopping_bag
              </span>
              {added ? "Added to Ritual Bag" : "Add to Ritual Bag"}
            </button>
            <button
              onClick={() => handleAdd(true)}
              className="w-full sm:w-auto bg-tertiary text-on-tertiary font-label-sm text-label-sm uppercase tracking-widest py-4 px-8 rounded border border-tertiary/50 hover:shadow-[0_0_25px_rgba(247,189,72,0.4)] transition-all duration-300 flex items-center justify-center gap-3"
            >
              Buy Now
            </button>
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
              className={`p-4 rounded border transition-all duration-300 ${
                wished
                  ? "bg-primary-container text-on-primary-container border-error/50"
                  : "bg-surface-container-low text-tertiary border-outline-variant/40 hover:shadow-[0_0_20px_rgba(247,189,72,0.2)]"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: wished ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
