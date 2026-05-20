"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/store";

export function AuthSync() {
  const setUser = useAuth((s) => s.setUser);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setUser(j.data ?? null);
      })
      .catch(() => {});
  }, [setUser]);
  return null;
}
