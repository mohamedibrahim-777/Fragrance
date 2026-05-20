"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import { OrderStatusSelect, DeleteRowButton } from "../_components/AdminButtons";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  itemCount: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
};

const STATUS_PILL: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
  failed: "bg-rose-100 text-rose-700",
  delivered: "bg-purple-100 text-purple-700",
};

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "today", label: "Today's Orders" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
] as const;

type TabKey = typeof TABS[number]["key"];

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [tab, setTab] = useState<TabKey>("all");

  const filtered = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    return orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      if (tab === "today") return now - t < dayMs;
      if (tab === "week") return now - t < 7 * dayMs;
      if (tab === "month") return now - t < 30 * dayMs;
      return true;
    });
  }, [orders, tab]);

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${
              tab === t.key
                ? "bg-brand text-white"
                : "border border-border bg-white text-ink hover:border-brand"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2/50 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="py-3 pl-4 pr-3">Order ID</th>
                <th className="py-3 pr-3">Customer</th>
                <th className="py-3 pr-3">Items</th>
                <th className="py-3 pr-3">Total</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3">Date</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-ink-muted">
                    No orders in this range.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const pill = STATUS_PILL[o.status] ?? STATUS_PILL.pending;
                  return (
                    <tr
                      key={o.id}
                      className="border-b border-border last:border-0 hover:bg-surface-2/30"
                    >
                      <td className="py-3 pl-4 pr-3 font-mono text-xs font-bold text-ink">
                        {o.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-ink">{o.customerName}</p>
                        <p className="text-xs text-ink-muted">{o.customerEmail}</p>
                      </td>
                      <td className="py-3 pr-3 text-ink">{o.itemCount} items</td>
                      <td className="py-3 pr-3 font-bold text-ink">{formatINR(o.total)}</td>
                      <td className="py-3 pr-3">
                        <span className={`mr-2 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${pill}`}>
                          ● {o.status}
                        </span>
                        <div className="mt-1 inline-block">
                          <OrderStatusSelect id={o.id} status={o.status} />
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-xs text-ink-muted">
                        {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="rounded-md border border-border px-3 py-1 text-xs font-semibold text-ink hover:border-brand hover:text-brand"
                          >
                            View
                          </Link>
                          <DeleteRowButton
                            endpoint={`/api/admin/orders/${o.id}`}
                            label="Delete this order permanently?"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
