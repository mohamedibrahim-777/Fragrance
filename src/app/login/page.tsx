"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/store";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
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

      <a
        href={`/api/auth/google/start?next=${encodeURIComponent(next)}`}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded border border-border bg-white py-3 text-sm font-medium text-black transition hover:border-brass hover:shadow-brass"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.86 2.69-6.61z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34A9 9 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.95 10.7A5.41 5.41 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.99-2.34z" fill="#FBBC05"/>
          <path d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.96l2.99 2.34C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </a>

      <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-widest text-ink-muted">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
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
          <li><code>admin@shri.com</code> / <code>admin@1234</code></li>
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
