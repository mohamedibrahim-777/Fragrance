import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { Eye, Users, TrendingUp, CreditCard } from "lucide-react";
import { RefreshButton } from "../_components/AdminButtons";
import { RangeButtons } from "./RangeButtons";

export const dynamic = "force-dynamic";

const RANGE_DAYS: Record<string, number> = { "7d": 7, "14d": 14, "30d": 30, "90d": 90 };

export default async function AdminAnalytics({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const range = searchParams.range && RANGE_DAYS[searchParams.range] ? searchParams.range : "30d";
  const numDays = RANGE_DAYS[range];

  const since = new Date();
  since.setDate(since.getDate() - numDays + 1);
  since.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });

  const today = new Date();
  const days: { date: string; count: number; revenue: number }[] = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: 0, revenue: 0 });
  }
  const dayMap = new Map(days.map((d) => [d.date, d]));
  for (const o of orders) {
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    const day = dayMap.get(key);
    if (day) {
      day.count++;
      day.revenue += o.total;
    }
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const W = 800;
  const H = 220;
  const points = days.map((d, i) => {
    const x = (i / Math.max(days.length - 1, 1)) * (W - 40) + 20;
    const y = H - 20 - (d.count / maxCount) * (H - 40);
    return [x, y] as const;
  });
  const path = points
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(" ");

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-ink">Analytics</h1>
        <div className="flex gap-2">
          <RefreshButton />
          <RangeButtons active={range} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <StatCard label="Total Orders" value={totalOrders.toString()} icon={Eye} sub={`Last ${numDays} days`} />
        <StatCard label="Total Revenue" value={formatINR(totalRevenue)} icon={Users} sub={`Last ${numDays} days`} />
        <StatCard label="Avg Order Value" value={formatINR(avgOrder)} icon={TrendingUp} sub="In selected range" />
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Daily Orders</h2>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full">
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1={20}
              x2={W - 20}
              y1={20 + p * (H - 40)}
              y2={20 + p * (H - 40)}
              stroke="#E8DAC8"
              strokeDasharray="3 3"
            />
          ))}
          <path d={path} stroke="#8B5A2B" strokeWidth="2.5" fill="none" />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#8B5A2B" />
          ))}
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-ink-muted">
          <span>{days[0].date.slice(5)}</span>
          <span>{days[Math.floor(days.length / 2)].date.slice(5)}</span>
          <span>{days[days.length - 1].date.slice(5)}</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-ink-muted" />
          <h2 className="text-lg font-bold text-ink">Order Payment Modes</h2>
        </div>
        <div className="mt-4 grid items-center gap-6 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-40 w-40">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E8DAC8" strokeWidth="14" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#8B5A2B"
                strokeWidth="14"
                strokeDasharray="251.2 0"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-brand" />
                  <div>
                    <p className="font-semibold text-ink">Demo / Razorpay</p>
                    <p className="text-xs text-ink-muted">{totalOrders} orders (100%)</p>
                  </div>
                </div>
                <p className="font-bold text-ink">{formatINR(totalRevenue)}</p>
              </div>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-sm">
              <span className="text-ink-muted">Total</span>
              <span className="font-bold text-ink">
                {totalOrders} orders / {formatINR(totalRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string;
  icon: typeof Eye;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{label}</p>
        <Icon size={16} className="text-ink-muted" />
      </div>
      <p className="mt-3 text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{sub}</p>
    </div>
  );
}
