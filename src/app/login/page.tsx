"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const setUser = useAuth((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    const json = await res.json();
    if (!json.success) {
      setError(json.error ?? "Login failed");
      setLoading(false);
      return;
    }
    setUser(json.data);
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[440px] px-5 py-10 sm:py-12">
      <h1 className="font-display text-4xl font-medium text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Welcome back. Sign in to track orders and check out faster.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field name="email" label="Email" type="email" required />
        <Field name="password" label="Password" type="password" required />
        {error && (
          <p className="rounded border border-danger bg-danger/10 p-3 text-sm text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-brass py-3 text-sm font-medium uppercase tracking-wider text-black shadow-brass transition hover:bg-brass-hover disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        New here?{" "}
        <Link href={`/register${next !== "/" ? `?next=${next}` : ""}`} className="text-brass hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-10 rounded border border-border bg-brass-soft/30 p-4 text-xs text-ink-muted">
        <strong className="text-ink">Demo accounts</strong>
        <ul className="mt-1 space-y-0.5">
          <li><code>customer@shri.local</code> / <code>customer123</code></li>
          <li><code>admin@shri.local</code> / <code>admin123</code></li>
        </ul>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type,
  required,
}: {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brass"
      />
    </label>
  );
}
