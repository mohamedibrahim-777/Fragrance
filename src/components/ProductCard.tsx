"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, useWishlist } from "@/lib/store";
import { formatINR, SOLID_DARK } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  productId?: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  category?: string;
  description?: string;
  featured?: boolean;
};

export function ProductCard({
  productId,
  slug,
  name,
  price,
  mrp,
  image,
  category,
  description,
  featured,
}: Props) {
  const off = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishItems = useWishlist((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pid = productId ?? slug;
  const wished = mounted && wishItems.some((i) => i.productId === pid);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({ productId: pid, slug, name, price, image });
  }

  function handleWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWish({ productId: pid, slug, name, price, mrp, image });
  }

  if (featured) {
    return (
      <article className="md:col-span-8 group relative rounded-sm overflow-hidden bronze-card candle-glow lift flex flex-col md:flex-row h-[500px]">
        <Link href={`/products/${slug}`} className="contents">
          <div className="w-full md:w-3/5 h-1/2 md:h-full relative overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest to-transparent z-10 md:bg-gradient-to-r md:from-surface-container-highest md:via-surface-container-highest/50 md:to-transparent opacity-90" />
            {image && (
              <Image
                alt={name}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                placeholder="blur"
                blurDataURL={SOLID_DARK}
                priority={featured}
                className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out [transform:translateZ(0)] will-change-transform"
                src={image}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary-container/10 to-transparent mix-blend-overlay z-10" />
          </div>
          <div className="w-full md:w-2/5 p-gutter flex flex-col justify-center relative z-20">
            <div className="flex gap-unit mb-unit flex-wrap">
              {category && (
                <span className="px-3 py-1 bg-surface-container-lowest text-secondary-fixed-dim rounded-sm font-label-sm text-label-sm uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] border-t border-l border-outline-variant/30 border-b border-r border-black">
                  {category}
                </span>
              )}
              <span className="px-3 py-1 bg-surface-container-lowest text-secondary-fixed-dim rounded-sm font-label-sm text-label-sm uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] border-t border-l border-outline-variant/30 border-b border-r border-black">
                Signature
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-tertiary mb-2 group-hover:text-tertiary-fixed transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {name}
            </h2>
            <p className="font-body-md text-body-md text-outline mb-6 line-clamp-3">
              {description ?? "Hand-rolled in the South Indian tradition. A deeply grounding, meditative aroma that lingers for hours."}
            </p>
            <div className="flex justify-between items-center mt-auto border-t border-outline-variant/20 pt-4">
              <span className="font-headline-md text-headline-md text-primary drop-shadow-[0_0_8px_rgba(255,180,168,0.2)]">
                {formatINR(price)}
              </span>
              <button
                onClick={handleAdd}
                className="bg-primary-container text-on-primary-container px-6 py-3 rounded-sm font-label-sm text-label-sm uppercase tracking-widest border-t border-l border-error/30 border-b border-r border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.5)] hover:bg-error-container hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),_0_0_20px_rgba(181,38,25,0.4)] transition-[background-color,box-shadow] duration-200 flex items-center gap-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2">
                  Add to Tray
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                </span>
              </button>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="md:col-span-4 group relative rounded-sm overflow-hidden bronze-card candle-glow lift flex flex-col h-[500px]">
      <Link href={`/products/${slug}`} className="contents">
        <div className="w-full h-3/5 relative overflow-hidden bg-black border-b border-outline-variant/30">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest to-transparent z-10 opacity-80" />
          {image && (
            <Image
              alt={name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              placeholder="blur"
              blurDataURL={SOLID_DARK}
              className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out [transform:translateZ(0)] will-change-transform"
              src={image}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary-container/5 to-transparent mix-blend-overlay z-10" />
          {off > 0 && (
            <span className="absolute top-3 left-3 z-20 px-3 py-1 bg-surface-container-lowest text-tertiary rounded-sm font-label-sm text-label-sm uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] border-t border-l border-outline-variant/30 border-b border-r border-black">
              {off}% OFF
            </span>
          )}
          <button
            onClick={handleWish}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 right-3 z-20 p-2 rounded-sm border-t border-l border-outline-variant/30 border-b border-r border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] transition-colors ${
              wished
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container-lowest text-tertiary hover:bg-surface-variant hover:text-tertiary-fixed"
            }`}
          >
            <span
              className="material-symbols-outlined relative z-10 text-[18px]"
              style={{ fontVariationSettings: wished ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>

        <div className="p-gutter flex flex-col flex-grow relative z-20">
          {category && (
            <div className="flex gap-unit mb-unit">
              <span className="px-3 py-1 bg-surface-container-lowest text-secondary-fixed-dim rounded-sm font-label-sm text-label-sm uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] border-t border-l border-outline-variant/30 border-b border-r border-black">
                {category}
              </span>
            </div>
          )}
          <h2 className="font-headline-md text-headline-md text-tertiary mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-1">
            {name}
          </h2>
          <p className="font-body-md text-body-md text-outline text-sm mb-4 line-clamp-2">
            {description ?? "Hand-rolled artisanal incense, capturing the essence of South Indian temple offerings."}
          </p>
          <div className="flex justify-between items-center mt-auto border-t border-outline-variant/20 pt-4">
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary text-xl drop-shadow-[0_0_8px_rgba(255,180,168,0.2)]">
                {formatINR(price)}
              </span>
              {mrp > price && (
                <span className="text-xs text-outline line-through">
                  {formatINR(mrp)}
                </span>
              )}
            </div>
            <button
              onClick={handleAdd}
              aria-label="Add to tray"
              className="text-tertiary bg-surface-container-lowest hover:bg-surface-variant hover:text-tertiary-fixed transition-colors p-2 rounded-sm border-t border-l border-outline-variant/30 border-b border-r border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(247,189,72,0.2)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              <span className="material-symbols-outlined relative z-10 text-[20px]">
                add_shopping_cart
              </span>
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}
