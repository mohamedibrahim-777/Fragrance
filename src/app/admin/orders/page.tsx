import { prisma } from "@/lib/db";
import {
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertTriangle,
  PackageCheck,
} from "lucide-react";
import { RefreshButton, ExportButton } from "../_components/AdminButtons";
import { OrdersTable } from "./OrdersClient";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700" },
  paid: { bg: "bg-green-50", text: "text-green-700" },
  shipped: { bg: "bg-slate-50", text: "text-slate-700" },
  cancelled: { bg: "bg-red-50", text: "text-red-700" },
  failed: { bg: "bg-rose-50", text: "text-rose-700" },
  delivered: { bg: "bg-purple-50", text: "text-purple-700" },
};

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  const statusCount = (s: string) => orders.filter((o) => o.status === s).length;

  const orderRows = orders.map((o) => ({
    id: o.id,
    status: o.status,
    total: o.total,
    itemCount: o.items.length,
    customerName: o.user.name,
    customerEmail: o.user.email,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-ink">Order Status Dashboard</h1>
        <div className="flex gap-2">
          <ExportButton type="orders" label="Export CSV" />
          <RefreshButton />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatusCard label="Pending" count={statusCount("pending")} icon={Clock} kind="pending" />
        <StatusCard label="Paid" count={statusCount("paid")} icon={CheckCircle2} kind="paid" />
        <StatusCard label="Shipped" count={statusCount("shipped")} icon={Truck} kind="shipped" />
        <StatusCard label="Cancelled" count={statusCount("cancelled")} icon={XCircle} kind="cancelled" />
        <StatusCard label="Failed" count={statusCount("failed")} icon={AlertTriangle} kind="failed" />
        <StatusCard label="Delivered" count={statusCount("delivered")} icon={PackageCheck} kind="delivered" />
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-ink">
        Total Orders: {orders.length}
      </p>

      <OrdersTable orders={orderRows} />
    </>
  );
}

function StatusCard({
  label,
  count,
  icon: Icon,
  kind,
}: {
  label: string;
  count: number;
  icon: typeof Clock;
  kind: keyof typeof STATUS_STYLES;
}) {
  const s = STATUS_STYLES[kind];
  return (
    <div className={`rounded-2xl border border-border ${s.bg} px-4 py-3 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${s.text}`}>
          <Icon size={16} />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className={`text-lg font-extrabold ${s.text}`}>{count}</span>
      </div>
    </div>
  );
}
