"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

type Category = { id: string; slug: string; name: string };

export function AddProductDialog({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: categories[0]?.id ?? "",
    price: "",
    mrp: "",
    stock: "100",
    images: "",
    features: "",
    isActive: true,
  });

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function reset() {
    setForm({
      name: "",
      description: "",
      categoryId: categories[0]?.id ?? "",
      price: "",
      mrp: "",
      stock: "100",
      images: "",
      features: "",
      isActive: true,
    });
    setErr(null);
  }

  async function submit() {
    setErr(null);
    const price = Number(form.price);
    const mrp = Number(form.mrp);
    const stock = Number(form.stock);
    if (!form.name.trim()) return setErr("Name required");
    if (!form.categoryId) return setErr("Category required");
    if (Number.isNaN(price) || price <= 0) return setErr("Invalid price");
    if (Number.isNaN(mrp) || mrp <= 0) return setErr("Invalid MRP");
    if (Number.isNaN(stock) || stock < 0) return setErr("Invalid stock");

    const images = form.images
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    const features = form.features
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

    setBusy(true);
    try {
      const r = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          categoryId: form.categoryId,
          price,
          mrp,
          stock,
          images,
          features,
          isActive: form.isActive,
        }),
      });
      const j = await r.json();
      if (!j.success) {
        setErr(j.error ?? "Failed");
      } else {
        setOpen(false);
        reset();
        router.refresh();
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
      >
        <Plus size={14} /> Add Product
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-10">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-ink">Add product</h2>
              <button
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                className="rounded-md p-1.5 text-ink-muted hover:bg-surface-2"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <Field label="Name *">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full rounded border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  className="w-full rounded border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </Field>

              <Field label="Category *">
                <select
                  value={form.categoryId}
                  onChange={(e) => update("categoryId", e.target.value)}
                  className="w-full rounded border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
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
                    min={0}
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    className="w-full rounded border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </Field>
                <Field label="MRP (₹) *">
                  <input
                    type="number"
                    min={0}
                    value={form.mrp}
                    onChange={(e) => update("mrp", e.target.value)}
                    className="w-full rounded border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </Field>
                <Field label="Stock">
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => update("stock", e.target.value)}
                    className="w-full rounded border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </Field>
              </div>

              <Field label="Images (upload files or paste URLs, one per line)">
                <ImageInput
                  value={form.images}
                  onChange={(v) => update("images", v)}
                />
              </Field>

              <Field label="Features (one per line or comma-separated)">
                <textarea
                  value={form.features}
                  onChange={(e) => update("features", e.target.value)}
                  rows={2}
                  placeholder="Hand-rolled, 100% natural, …"
                  className="w-full rounded border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </Field>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                />
                Active (visible on storefront)
              </label>

              {err && (
                <p className="rounded border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                  {err}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-ink hover:bg-surface-2"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={busy}
                className="rounded-full bg-brand px-6 py-2 text-sm font-bold text-white hover:bg-brand-hover disabled:opacity-60"
              >
                {busy ? "Saving…" : "Create product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function ImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const urls = value
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setErr(null);
    setUploading(true);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!j.success) {
        setErr(j.error ?? "Upload failed");
        break;
      }
      added.push(j.url);
    }
    setUploading(false);
    if (added.length) {
      const next = [...urls, ...added].join("\n");
      onChange(next);
    }
  }

  function removeAt(i: number) {
    onChange(urls.filter((_, idx) => idx !== i).join("\n"));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-border bg-white px-3 py-2 text-sm font-semibold text-ink hover:border-brand">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
          {uploading ? "Uploading…" : "Upload images"}
        </label>
        <span className="text-xs text-ink-muted">or paste URLs below</span>
      </div>

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((u, i) => (
            <div
              key={`${u}-${i}`}
              className="relative h-16 w-16 overflow-hidden rounded border border-border bg-surface-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute right-0 top-0 rounded-bl bg-black/70 px-1 text-[10px] text-white hover:bg-danger"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="https://… / https://…"
        className="w-full rounded border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
      />

      {err && (
        <p className="rounded border border-danger/40 bg-danger/10 px-2 py-1 text-xs text-danger">
          {err}
        </p>
      )}
    </div>
  );
}
