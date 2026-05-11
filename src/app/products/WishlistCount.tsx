"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/store";

export function WishlistCount() {
  const items = useWishlist((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || items.length === 0) return null;
  return (
    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-black">
      {items.length}
    </span>
  );
}
