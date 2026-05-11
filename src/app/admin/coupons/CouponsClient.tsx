"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { DeleteRowButton, AddCouponButton } from "../_components/AdminButtons";
import { useRouter } from "next/navigation";

type CouponRow = {
  id: string;
  code: string;
  description: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
};

export function CouponsView({ coupons }: { coupons: CouponRow[] }) {
  const [tab, setTab] = useState<"coupons" | "referrals">("coupons");
  const router = useRouter();

  async function toggleActive(c: CouponRow) {
    const r = await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    const j = await r.json();
    if (!j.success) alert(j.error ?? "Failed");
    else router.refresh();
  }

  return (
    <>
      <div className="mt-5 inline-flex rounded-lg border border-border bg-white p-1">
        <button
          onClick={() => setTab("coupons")}
          className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
            tab === "coupons" ? "bg-brand-soft text-ink" : "text-ink-muted"
          }`}
        >
          🏷 Coupons
        </button>
        <button
          onClick={() => setTab("referrals")}
          className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
            tab === "referrals" ? "bg-brand-soft text-ink" : "text-ink-muted"
          }`}
        >
          👥 Referrals
        </button>
      </div>

      {tab === "referrals" ? (
        <div className="mt-6 rounded-2xl border border-border bg-white p-12 text-center shadow-sm">
          <h2 className="text-xl font-bold text-ink">No referral programs yet</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Set up referral codes for customers to invite friends and earn rewards.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex justify-end">
            <AddCouponButton />
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-5 py-3">
              <h2 className="font-bold text-ink">All Coupons</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/50 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    <th className="py-3 pl-4 pr-3">Code</th>
                    <th className="py-3 pr-3">Description</th>
                    <th className="py-3 pr-3">Type</th>
                    <th className="py-3 pr-3">Value</th>
                    <th className="py-3 pr-3">Min Order</th>
                    <th className="py-3 pr-3">Usage</th>
                    <th className="py-3 pr-3">Status</th>
                    <th className="py-3 pr-3">Expires</th>
                    <th className="py-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-sm text-ink-muted">
                        No coupons yet. Click &quot;Add Coupon&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-border last:border-0 hover:bg-surface-2/30"
                      >
                        <td className="py-3 pl-4 pr-3 font-bold text-ink">{c.code}</td>
                        <td className="py-3 pr-3 text-ink">{c.description}</td>
                        <td className="py-3 pr-3">
                          <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-hover">
                            {c.type}
                          </span>
                        </td>
                        <td className="py-3 pr-3 font-semibold text-ink">
                          {c.type === "Percentage" ? `${c.value}%` : `₹${c.value}`}
                        </td>
                        <td className="py-3 pr-3 text-ink-muted">₹{c.minOrder}</td>
                        <td className="py-3 pr-3 text-ink">
                          {c.usedCount} / {c.usageLimit ?? "∞"}
                        </td>
                        <td className="py-3 pr-3">
                          <button
                            onClick={() => toggleActive(c)}
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              c.isActive
                                ? "bg-success/15 text-success"
                                : "bg-ink-muted/15 text-ink-muted"
                            }`}
                          >
                            {c.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="py-3 pr-3 text-ink-muted">
                          {c.expiresAt
                            ? new Date(c.expiresAt).toLocaleDateString("en-IN")
                            : "-"}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleActive(c)}
                              aria-label="Toggle status"
                              className="rounded-md p-1.5 text-ink-muted hover:bg-brand-soft hover:text-brand-hover"
                            >
                              <Pencil size={14} />
                            </button>
                            <DeleteRowButton
                              endpoint={`/api/admin/coupons/${c.id}`}
                              label={`Delete coupon "${c.code}"?`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
