"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageInput } from "../AddProductDialog";

type Category = { id: string; slug: string; name: string };

type Initial = {
  name: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  isActive: boolean;
  categoryId: string;
  images: string;
  features: string;
};

export function ProductEditor({
  id,
  initial,
  sku,
  categories,
  previewImage,
}: {
  id: string;
  initial: Initial;
  sku: string;
  categories: Category[];
  previewImage: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    setErr(null);

    const images = form.images
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    const features = form.features
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: Number(form.stock),
        isActive: form.isActive,
        categoryId: form.categoryId,
        images,
        features,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setMsg("Saved.");
      router.refresh();
    } else {
      setErr(json.error ?? "Save failed");
    }
  }

  async function remove() {
    if (!confirm("Hide this product from the catalogue?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setErr(json.error ?? "Delete failed");
    }
  }

  const livePreview =
    form.images.split(/\n|,/).map((s) => s.trim()).filter(Boolean)[0] || previewImage;

  return (
    <div className="mt-4 grid gap-6 md:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-border bg-surface p-5">
        {livePreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={livePreview}
            alt=""
            className="aspect-square w-full rounded-lg object-cover"
          />
        ) : (
          <div className="aspect-square w-full rounded-lg bg-surface-2 grid place-items-center text-xs text-ink-muted">
            No image
          </div>
        )}
        <p className="mt-3 text-xs uppercase tracking-wider text-ink-muted">SKU</p>
        <p className="font-mono text-xs text-ink-muted">{sku}</p>
        <p className="mt-3 text-xs uppercase tracking-wider text-ink-muted">Product ID</p>
        <p className="font-mono text-[10px] text-ink-muted break-all">{id}</p>
      </aside>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-bold text-ink">Edit product</h2>

        <div className="mt-4 space-y-4">
          <Field label="Name *">
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            />
          </Field>

          <Field label="Category *">
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Price (₹) *">
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
                className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </Field>
            <Field label="MRP (₹) *">
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => set("mrp", Number(e.target.value))}
                className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", Number(e.target.value))}
                className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </Field>
          </div>

          <Field label="Images (upload files or paste URLs)">
            <ImageInput
              value={form.images}
              onChange={(v) => set("images", v)}
            />
          </Field>

          <Field label="Features (one per line or comma-separated)">
            <textarea
              value={form.features}
              onChange={(e) => set("features", e.target.value)}
              rows={3}
              placeholder="Hand-rolled, 100% natural, …"
              className="w-full rounded border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
            />
            Active (visible on storefront)
          </label>
        </div>

        {msg && (
          <p className="mt-3 rounded border border-brand bg-brand-soft p-2 text-sm text-ink">
            {msg}
          </p>
        )}
        {err && (
          <p className="mt-3 rounded border border-danger/40 bg-danger/10 p-2 text-sm text-danger">
            {err}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-brand px-6 py-2 text-sm font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            onClick={remove}
            className="rounded-full border-2 border-danger px-6 py-2 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
          >
            Hide / Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
