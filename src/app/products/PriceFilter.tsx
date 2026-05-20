"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Bucket = {
  label: string;
  min?: number;
  max?: number;
};

const BUCKETS: Bucket[] = [
  { label: "All" },
  { label: "Under ₹200", max: 200 },
  { label: "₹200–500", min: 200, max: 500 },
  { label: "₹500–1000", min: 500, max: 1000 },
  { label: "₹1000+", min: 1000 },
];

export function PriceFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const currentMin = params.get("min");
  const currentMax = params.get("max");

  function isActive(b: Bucket): boolean {
    const bMin = b.min !== undefined ? String(b.min) : null;
    const bMax = b.max !== undefined ? String(b.max) : null;
    return bMin === currentMin && bMax === currentMax;
  }

  function pick(b: Bucket) {
    const next = new URLSearchParams(params.toString());
    if (b.min !== undefined) next.set("min", String(b.min));
    else next.delete("min");
    if (b.max !== undefined) next.set("max", String(b.max));
    else next.delete("max");
    router.push(`/products${next.toString() ? `?${next.toString()}` : ""}`);
  }

  return (
    <div className="mb-6 flex items-center gap-3 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.3em] text-tertiary/60">
        Price
      </span>
      {BUCKETS.map((b) => {
        const active = isActive(b);
        return (
          <button
            key={b.label}
            onClick={() => pick(b)}
            className={`text-xs tracking-wider uppercase px-3 py-1 rounded-sm transition-colors ${
              active
                ? "text-tertiary border-b border-tertiary"
                : "text-on-surface-variant hover:text-tertiary"
            }`}
          >
            {b.label}
          </button>
        );
      })}
    </div>
  );
}
