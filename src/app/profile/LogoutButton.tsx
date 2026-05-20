"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";

export function LogoutButton() {
  const router = useRouter();
  const clear = useAuth((s) => s.clear);
  async function handle() {
    await fetch("/api/auth/logout", { method: "POST" });
    clear();
    router.push("/");
    router.refresh();
  }
  return (
    <button
      onClick={handle}
      className="rounded border border-border bg-surface px-5 py-2 text-sm font-medium text-ink-muted transition hover:border-danger hover:text-danger"
    >
      Sign out
    </button>
  );
}
