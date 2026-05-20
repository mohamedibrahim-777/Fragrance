"use client";

import { useState } from "react";

export function ListGridToggle({ children }: { children: (mode: "list" | "grid") => React.ReactNode }) {
  const [mode, setMode] = useState<"list" | "grid">("list");
  return (
    <>
      <div className="inline-flex rounded-lg border border-border bg-white p-1 text-sm">
        <button
          onClick={() => setMode("list")}
          className={`rounded-md px-3 py-1.5 font-semibold ${mode === "list" ? "bg-brand-soft text-ink" : "text-ink-muted"}`}
        >
          ☰ List
        </button>
        <button
          onClick={() => setMode("grid")}
          className={`rounded-md px-3 py-1.5 font-semibold ${mode === "grid" ? "bg-brand-soft text-ink" : "text-ink-muted"}`}
        >
          ⊞ Grid
        </button>
      </div>
      {children(mode)}
    </>
  );
}
