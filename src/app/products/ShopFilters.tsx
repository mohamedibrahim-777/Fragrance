"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Cat = { slug: string; name: string };

export function ShopFilters({
  categories,
  active,
}: {
  categories: Cat[];
  active: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function setCat(slug: string) {
    const next = new URLSearchParams(params.toString());
    if (slug === "all") next.delete("cat");
    else next.set("cat", slug);
    router.push(`/products${next.toString() ? `?${next.toString()}` : ""}`);
  }

  return (
    <div className="flex gap-unit flex-wrap">
      {categories.map((c) => {
        const isActive = c.slug === active;
        return (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={`px-5 py-2.5 rounded-sm font-label-sm text-label-sm uppercase tracking-widest relative overflow-hidden transition-colors ${
              isActive
                ? "bg-surface-container text-tertiary shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] border-t border-l border-outline-variant/40 border-b border-r border-surface-container-lowest hover:bg-surface-variant"
                : "bg-surface-container-lowest text-outline shadow-[inset_0_1px_0_rgba(255,255,255,0.02),_0_2px_4px_rgba(0,0,0,0.3)] border-t border-l border-outline-variant/20 border-b border-r border-black hover:text-tertiary hover:border-outline-variant/40"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            <span
              className={`relative z-10 ${
                isActive ? "drop-shadow-[0_0_8px_rgba(247,189,72,0.4)]" : ""
              }`}
            >
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
