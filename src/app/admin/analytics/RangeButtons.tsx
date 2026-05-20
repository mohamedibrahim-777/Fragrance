"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const RANGES = ["7d", "14d", "30d", "90d"] as const;

export function RangeButtons({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  function setRange(r: string) {
    const params = new URLSearchParams(sp);
    params.set("range", r);
    router.push(`${pathname}?${params.toString()}`);
  }
  return (
    <>
      {RANGES.map((p) => (
        <button
          key={p}
          onClick={() => setRange(p)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            p === active
              ? "bg-brand text-white"
              : "border border-border bg-white text-ink hover:border-brand"
          }`}
        >
          {p}
        </button>
      ))}
    </>
  );
}
