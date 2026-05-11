"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[700px] px-5 py-10 sm:py-14 text-center">
        <div className="mb-4 flex justify-center gap-3 text-3xl">
          <span role="img" aria-label="diya">🪔</span>
          <span className="text-brass">❀</span>
          <span role="img" aria-label="diya">🪔</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brass">
          Empty basket
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">
          Your basket is empty
        </h1>
        <p className="lotus-divider my-5">❀</p>
        <p className="text-ink-muted">
          Browse the catalog and add a few pooja essentials to begin.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded bg-brass px-7 py-3 text-sm font-medium uppercase tracking-wider text-black shadow-brass transition hover:bg-brass-hover"
        >
          Shop the catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 sm:py-10">
      {/* Page header in temple-plaque style */}
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brass">
          🪔 &nbsp; Your basket &nbsp; 🪔
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Your basket
        </h1>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3 text-brass">
          <span className="h-px w-16 bg-brass/40" />
          <span>❀</span>
          <span className="h-px w-16 bg-brass/40" />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Items — temple-plaque card */}
        <div className="overflow-hidden rounded-lg border-2 border-brass/30 bg-surface shadow-sm">
          <div className="tanjore-band" />
          <div className="tanjore-weave" />
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 p-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded border border-brass/30 bg-brass-soft/30">
                  {/* Kolam dots overlay */}
                  <svg
                    className="pointer-events-none absolute left-1 top-1 z-10 h-5 w-5 text-brass/70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <circle cx="3" cy="3" r="1" />
                    <circle cx="9" cy="3" r="1" />
                    <circle cx="3" cy="9" r="1" />
                  </svg>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-base font-medium leading-snug text-ink hover:text-brass"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-brass">
                    {formatINR(item.price)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded border border-brass/40 bg-brass-soft/20">
                      <button
                        onClick={() => setQty(item.productId, item.quantity - 1)}
                        className="px-2 py-1.5 text-ink-muted hover:text-brass"
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQty(item.productId, item.quantity + 1)}
                        className="px-2 py-1.5 text-ink-muted hover:text-brass"
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.productId)}
                      className="flex items-center gap-1 text-xs text-ink-muted hover:text-maroon"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
                <p className="hidden text-base font-semibold text-ink sm:block">
                  {formatINR(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="tanjore-weave" />
          <div className="tanjore-band" />
        </div>

        {/* Summary — temple-plaque */}
        <aside className="h-fit overflow-hidden rounded-lg border-2 border-brass/40 bg-surface shadow-brass">
          <div className="tanjore-band" />
          <div className="tanjore-weave" />
          <div className="bg-[radial-gradient(ellipse_at_top,#F2E6CC,transparent_80%)] p-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brass">
              Order summary
            </p>
            <p className="lotus-divider mt-3">❀</p>
            <dl className="mt-5 space-y-2 text-left text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Shipping</dt>
                <dd>
                  {shipping === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    formatINR(shipping)
                  )}
                </dd>
              </div>
              <div className="mt-4 flex justify-between border-t-2 border-dashed border-brass/40 pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd className="text-lg text-brass">{formatINR(total)}</dd>
              </div>
            </dl>
            {subtotal < 999 && (
              <p className="mt-3 text-xs text-ink-muted">
                🪔 Add {formatINR(999 - subtotal)} more for free shipping.
              </p>
            )}
            <Link
              href="/checkout"
              className="mt-6 block rounded bg-brass py-3 text-center text-sm font-medium uppercase tracking-wider text-black shadow-brass transition hover:bg-brass-hover"
            >
              Proceed to Checkout
            </Link>
            <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-ink-muted">
              🪔 Made with devotion · Tamil Nadu 🪔
            </p>
          </div>
          <div className="tanjore-weave" />
          <div className="tanjore-band" />
        </aside>
      </div>
    </div>
  );
}
