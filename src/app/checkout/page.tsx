"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, useAuth } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const user = useAuth((s) => s.user);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[700px] px-5 py-10 sm:py-14 text-center">
        <h1 className="font-display text-4xl font-medium">Nothing to check out</h1>
        <p className="mt-3 text-ink-muted">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded bg-brass px-7 py-3 text-sm font-medium uppercase tracking-wider text-black shadow-brass hover:bg-brass-hover"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[700px] px-5 py-10 sm:py-14 text-center">
        <h1 className="font-display text-4xl font-medium">Please sign in to continue</h1>
        <p className="mt-3 text-ink-muted">
          You&apos;ll need an account to place this order. Your cart will be waiting.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/login?next=/checkout"
            className="rounded bg-brass px-7 py-3 text-sm font-medium uppercase tracking-wider text-black shadow-brass hover:bg-brass-hover"
          >
            Sign in
          </Link>
          <Link
            href="/register?next=/checkout"
            className="rounded border border-border bg-surface px-7 py-3 text-sm font-medium uppercase tracking-wider text-ink hover:border-brass hover:text-brass"
          >
            Create account
          </Link>
        </div>
        <p className="mt-6 text-xs text-ink-muted">
          Demo account: <code>customer@shri.local</code> / <code>customer123</code>
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const shippingAddress = {
      name: fd.get("name"),
      line1: fd.get("line1"),
      line2: fd.get("line2"),
      city: fd.get("city"),
      state: fd.get("state"),
      pincode: fd.get("pincode"),
      phone: fd.get("phone"),
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Order failed");
      clear();
      router.push(`/order-success/${json.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 sm:py-10">
      <h1 className="font-display text-4xl font-medium text-ink">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Address */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="font-display text-xl text-ink">Shipping address</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field name="name" label="Full name" defaultValue={user.name} required />
            <Field name="phone" label="Phone" type="tel" required />
            <Field name="line1" label="Address line 1" required full />
            <Field name="line2" label="Address line 2" full />
            <Field name="city" label="City" required />
            <Field name="state" label="State" defaultValue="Tamil Nadu" required />
            <Field name="pincode" label="Pincode" required />
          </div>

          <h2 className="mt-8 font-display text-xl text-ink">Payment</h2>
          <div className="mt-3 rounded border border-brass bg-brass-soft/40 p-4 text-sm">
            <strong className="text-brass">Demo mode</strong> — no real payment. Your order
            will be marked <em>paid</em> automatically for showcase purposes.
          </div>

          {error && (
            <p className="mt-4 rounded border border-danger bg-danger/10 p-3 text-sm text-danger">
              {error}
            </p>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-lg border border-border bg-surface p-6">
          <h2 className="font-display text-xl text-ink">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span className="text-ink">
                  {i.name}
                  <span className="text-ink-muted"> × {i.quantity}</span>
                </span>
                <span className="whitespace-nowrap">{formatINR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Shipping</dt>
              <dd>{shipping === 0 ? "FREE" : formatINR(shipping)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="text-brass">{formatINR(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 block w-full rounded bg-brass py-3 text-sm font-medium uppercase tracking-wider text-black shadow-brass transition hover:bg-brass-hover disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place order (${formatINR(total)})`}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  full,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-ink outline-none transition focus:border-brass"
      />
    </label>
  );
}
