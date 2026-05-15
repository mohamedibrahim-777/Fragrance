"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, Menu, X, Bell, Search, TrendingUp, TrendingDown,
  IndianRupee, ChevronDown, Landmark, Flame, Sparkles,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Eye,
} from "lucide-react";

// ── Color Palette ──────────────────────────────────────
const colors = {
  maroon: "#800020",
  saffron: "#FF6F00",
  templeGold: "#D4AF37",
  warmCream: "#FFF8E7",
  deep: "#1A0A2E",
};

// ── Mock Data ──────────────────────────────────────────
const statsData = [
  { title: "Total Revenue", value: "₹12,45,678", change: "+12.5%", trend: "up" as const, icon: IndianRupee },
  { title: "Orders", value: "1,234", change: "+8.2%", trend: "up" as const, icon: ShoppingCart },
  { title: "Customers", value: "5,678", change: "+3.1%", trend: "up" as const, icon: Users },
  { title: "Conversion Rate", value: "3.2%", change: "-0.4%", trend: "down" as const, icon: BarChart3 },
];

const monthlyRevenue = [
  { month: "Jan", value: 65000 }, { month: "Feb", value: 72000 }, { month: "Mar", value: 85000 },
  { month: "Apr", value: 78000 }, { month: "May", value: 92000 }, { month: "Jun", value: 105000 },
  { month: "Jul", value: 98000 }, { month: "Aug", value: 112000 }, { month: "Sep", value: 120000 },
  { month: "Oct", value: 115000 }, { month: "Nov", value: 130000 }, { month: "Dec", value: 142000 },
];

const orderCategories = [
  { label: "Incense", value: 35, color: colors.saffron },
  { label: "Oils", value: 25, color: colors.templeGold },
  { label: "Puja Kits", value: 20, color: colors.maroon },
  { label: "Dhoop", value: 12, color: "#C2185B" },
  { label: "Others", value: 8, color: colors.deep },
];

const recentOrders = [
  { id: "ORD-7892", customer: "Rajesh Kumar", product: "Chandan Premium Incense", amount: "₹2,450", status: "Delivered", date: "2024-01-15" },
  { id: "ORD-7891", customer: "Priya Sharma", product: "Sandalwood Oil 50ml", amount: "₹1,890", status: "Processing", date: "2024-01-15" },
  { id: "ORD-7890", customer: "Arun Iyer", product: "Temple Puja Kit", amount: "₹3,200", status: "Shipped", date: "2024-01-14" },
  { id: "ORD-7889", customer: "Meena Nair", product: "Jasmine Dhoop Sticks", amount: "₹650", status: "Delivered", date: "2024-01-14" },
  { id: "ORD-7888", customer: "Vikram Patel", product: "Frankincense Resin", amount: "₹1,100", status: "Cancelled", date: "2024-01-13" },
  { id: "ORD-7887", customer: "Lakshmi Reddy", product: "Rose Attar Perfume", amount: "₹4,500", status: "Delivered", date: "2024-01-13" },
  { id: "ORD-7886", customer: "Suresh Menon", product: "Agarbatti Variety Pack", amount: "₹780", status: "Processing", date: "2024-01-12" },
  { id: "ORD-7885", customer: "Kavitha Iyengar", product: "Camphor Tablets Box", amount: "₹320", status: "Shipped", date: "2024-01-12" },
];

const topProducts = [
  { name: "Chandan Premium Incense", sales: 342, revenue: 83900, maxRevenue: 83900 },
  { name: "Sandalwood Oil 50ml", sales: 278, revenue: 52500, maxRevenue: 83900 },
  { name: "Temple Puja Kit", sales: 195, revenue: 62400, maxRevenue: 83900 },
  { name: "Jasmine Dhoop Sticks", sales: 412, revenue: 26800, maxRevenue: 83900 },
  { name: "Rose Attar Perfume", sales: 156, revenue: 70200, maxRevenue: 83900 },
];

const customerAnalytics = [
  { month: "Jan", new: 120, returning: 340 }, { month: "Feb", new: 145, returning: 380 },
  { month: "Mar", new: 160, returning: 420 }, { month: "Apr", new: 135, returning: 390 },
  { month: "May", new: 180, returning: 450 }, { month: "Jun", new: 210, returning: 510 },
  { month: "Jul", new: 195, returning: 480 }, { month: "Aug", new: 230, returning: 540 },
  { month: "Sep", new: 250, returning: 580 }, { month: "Oct", new: 240, returning: 560 },
  { month: "Nov", new: 270, returning: 620 }, { month: "Dec", new: 300, returning: 680 },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: Package, label: "Products", key: "products" },
  { icon: ShoppingCart, label: "Orders", key: "orders" },
  { icon: Users, label: "Customers", key: "customers" },
  { icon: BarChart3, label: "Analytics", key: "analytics" },
  { icon: Settings, label: "Settings", key: "settings" },
];

// ── SVG Bar Chart ──────────────────────────────────────
function BarChart() {
  const maxVal = Math.max(...monthlyRevenue.map((d) => d.value));
  const chartW = 700;
  const chartH = 240;
  const barW = 36;
  const gap = (chartW - monthlyRevenue.length * barW) / (monthlyRevenue.length + 1);

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH + 40}`} className="w-full h-auto">
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const y = chartH - pct * chartH;
        const val = Math.round((maxVal * pct) / 1000);
        return (
          <g key={i}>
            <line x1={0} y1={y} x2={chartW} y2={y} stroke="#e5e0d5" strokeWidth={0.5} strokeDasharray="4,4" />
            <text x={0} y={y - 4} fontSize={10} fill="#888" textAnchor="start">{val}k</text>
          </g>
        );
      })}
      {monthlyRevenue.map((d, i) => {
        const x = gap + i * (barW + gap);
        const barH = (d.value / maxVal) * chartH;
        const y = chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill="url(#barGrad)" className="transition-all duration-300 hover:opacity-80" />
            <text x={x + barW / 2} y={chartH + 16} fontSize={10} fill="#666" textAnchor="middle">{d.month}</text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.saffron} />
          <stop offset="100%" stopColor={colors.maroon} />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── SVG Donut Chart ────────────────────────────────────
function DonutChart() {
  const total = orderCategories.reduce((s, c) => s + c.value, 0);
  const cx = 120, cy = 120, r = 80, strokeW = 30;
  const circumference = 2 * Math.PI * r;
  const segments = orderCategories.reduce<{ color: string; dashLen: number; offset: number }[]>((acc, cat) => {
    const pct = cat.value / total;
    const dashLen = pct * circumference;
    const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dashLen : 0;
    acc.push({ color: cat.color, dashLen, offset });
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 240 240" className="w-48 h-48 shrink-0">
        {segments.map((seg, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={strokeW}
            strokeDasharray={`${seg.dashLen} ${circumference - seg.dashLen}`} strokeDashoffset={-seg.offset}
            transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-500" />
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize={22} fontWeight="bold" fill={colors.deep}>{total}%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={11} fill="#888">Total</text>
      </svg>
      <div className="flex flex-col gap-2">
        {orderCategories.map((cat, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="text-gray-600">{cat.label}</span>
            <span className="font-semibold ml-auto" style={{ color: cat.color }}>{cat.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SVG Area Chart ──────────────────────────────────────
function AreaChart() {
  const maxVal = Math.max(...customerAnalytics.map((d) => d.new + d.returning));
  const chartW = 600, chartH = 200, padX = 30, padY = 10;
  const plotW = chartW - padX * 2, plotH = chartH - padY * 2;
  const toPoint = (idx: number, val: number) => ({
    x: padX + (idx / (customerAnalytics.length - 1)) * plotW,
    y: padY + plotH - (val / maxVal) * plotH,
  });
  const returningPoints = customerAnalytics.map((d, i) => toPoint(i, d.returning));
  const newPoints = customerAnalytics.map((d, i) => toPoint(i, d.new));
  const toPathD = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const toAreaD = (pts: { x: number; y: number }[]) => `${toPathD(pts)} L${pts[pts.length - 1].x},${padY + plotH} L${pts[0].x},${padY + plotH} Z`;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} className="w-full h-auto">
      {[0, 0.5, 1].map((pct, i) => {
        const y = padY + plotH - pct * plotH;
        return <line key={i} x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="#e5e0d5" strokeWidth={0.5} strokeDasharray="4,4" />;
      })}
      <path d={toAreaD(returningPoints)} fill={`${colors.maroon}15`} />
      <path d={toPathD(returningPoints)} fill="none" stroke={colors.maroon} strokeWidth={2} />
      <path d={toAreaD(newPoints)} fill={`${colors.saffron}20`} />
      <path d={toPathD(newPoints)} fill="none" stroke={colors.saffron} strokeWidth={2} />
      {returningPoints.map((p, i) => <circle key={`r${i}`} cx={p.x} cy={p.y} r={3} fill={colors.maroon} />)}
      {newPoints.map((p, i) => <circle key={`n${i}`} cx={p.x} cy={p.y} r={3} fill={colors.saffron} />)}
      {customerAnalytics.map((d, i) => {
        const x = padX + (i / (customerAnalytics.length - 1)) * plotW;
        return <text key={i} x={x} y={chartH + 16} fontSize={9} fill="#888" textAnchor="middle">{d.month}</text>;
      })}
    </svg>
  );
}

// ── Status Badge ───────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    Delivered: { bg: "bg-emerald-100", text: "text-emerald-700" },
    Processing: { bg: "bg-amber-100", text: "text-amber-700" },
    Shipped: { bg: "bg-sky-100", text: "text-sky-700" },
    Cancelled: { bg: "bg-red-100", text: "text-red-700" },
  };
  const s = map[status] ?? { bg: "bg-gray-100", text: "text-gray-700" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>{status}</span>;
}

// ── Diya Icon for sidebar ──────────────────────────────
function DiyaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <ellipse cx="12" cy="8" rx="3" ry="6" fill="url(#diyaFlame)" opacity="0.9" />
      <ellipse cx="12" cy="10" rx="1.5" ry="3.5" fill="#FFD700" opacity="0.8" />
      <path d="M4 18 Q4 14 12 14 Q20 14 20 18 L18 22 Q18 23 12 23 Q6 23 6 22 Z" fill="url(#diyaBowl)" />
      <defs>
        <linearGradient id="diyaFlame" x1="9" y1="2" x2="15" y2="14">
          <stop offset="0%" stopColor="#FF6F00" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFBF00" />
        </linearGradient>
        <linearGradient id="diyaBowl" x1="4" y1="14" x2="20" y2="23">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Main Page ──────────────────────────────────────────
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: colors.warmCream }}>
      {/* ── CSS keyframe animations ──────────────────── */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.3); }
          50% { box-shadow: 0 0 18px 6px rgba(212,175,55,0.15); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes goldBorderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes diyaFlicker {
          0%, 100% { transform: scale(1); opacity: 1; }
          25% { transform: scale(1.08); opacity: 0.92; }
          50% { transform: scale(0.95); opacity: 1; }
          75% { transform: scale(1.04); opacity: 0.96; }
        }
        .sidebar-enter { animation: slideInLeft 0.3s ease-out; }
        .card-enter { animation: fadeIn 0.5s ease-out both; }
        .card-enter-1 { animation-delay: 0.05s; }
        .card-enter-2 { animation-delay: 0.10s; }
        .card-enter-3 { animation-delay: 0.15s; }
        .card-enter-4 { animation-delay: 0.20s; }
        .gold-glow { animation: pulseGold 3s ease-in-out infinite; }
        .diya-animate { animation: diyaFlicker 2s ease-in-out infinite; }
        .gold-border-flow {
          border-image: linear-gradient(90deg, ${colors.templeGold}, ${colors.saffron}, #FFD700, ${colors.templeGold}) 1;
          animation: goldBorderFlow 3s linear infinite;
          background-size: 200% auto;
        }
        .temple-header-bg {
          background: linear-gradient(180deg, #1A0A2E 0%, ${colors.maroon} 60%, #3D1C00 100%);
        }
        .stat-gradient-revenue { background: linear-gradient(135deg, ${colors.saffron}12, ${colors.templeGold}08); }
        .stat-gradient-orders { background: linear-gradient(135deg, ${colors.maroon}10, ${colors.saffron}06); }
        .stat-gradient-customers { background: linear-gradient(135deg, ${colors.templeGold}10, ${colors.maroon}06); }
        .stat-gradient-conversion { background: linear-gradient(135deg, ${colors.deep}08, ${colors.maroon}06); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${colors.templeGold}60; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${colors.templeGold}; }
      `}</style>

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} shrink-0 temple-header-bg text-white flex flex-col transition-all duration-300 relative z-30 sidebar-enter`}>
        {/* Temple ornamental top */}
        <div className="px-5 pt-5 pb-3" style={{ borderBottom: `1px solid ${colors.templeGold}30` }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center gold-glow" style={{ backgroundColor: colors.templeGold, color: colors.deep }}>
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight" style={{ color: colors.templeGold }}>Shri Fragrance</h1>
              <p className="text-[10px] opacity-50 flex items-center gap-1">
                <span className="diya-animate inline-block">🔥</span> Admin Dashboard
              </p>
            </div>
          </div>
          {/* Decorative gold line */}
          <div className="mt-3 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${colors.templeGold}60, #FFD70040, ${colors.templeGold}60, transparent)` }} />
        </div>

        {/* Kolam dots background */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          {navItems.map((item, idx) => {
            const isActive = activeNav === item.key;
            return (
              <button key={item.key} onClick={() => setActiveNav(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 card-enter ${isActive ? "text-white shadow-lg" : "text-white/60 hover:text-white hover:bg-white/8"}`}
                style={{
                  ...(isActive ? { background: `linear-gradient(135deg, ${colors.saffron}, ${colors.maroon})`, animationDelay: `${idx * 0.05}s` } : {}),
                  animationDelay: `${idx * 0.05}s`
                }}>
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full diya-animate" style={{ backgroundColor: '#FFD700' }} />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4" style={{ borderTop: `1px solid ${colors.templeGold}25` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold gold-glow" style={{ backgroundColor: colors.templeGold, color: colors.deep }}>SA</div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">Shri Admin</p>
              <p className="text-[10px] opacity-40 truncate">admin@shrifragrance.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top Bar with temple gold border ────────── */}
        <header className="sticky top-0 z-20 flex items-center gap-3 px-4 md:px-6 py-3 border-b"
          style={{ backgroundColor: "#fff", borderColor: `${colors.templeGold}25` }}>
          {/* Temple gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${colors.templeGold}, ${colors.saffron}, ${colors.templeGold}, transparent)` }} />

          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="shrink-0 hover:bg-gray-100">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search products, orders, customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm" style={{ borderColor: `${colors.templeGold}30` }} />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white diya-animate"
                    style={{ backgroundColor: colors.saffron }}>3</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-3">
                  <h3 className="font-semibold text-base" style={{ color: colors.deep }}>Notifications</h3>
                  {[
                    { title: "New order #ORD-7893 received", time: "2 min ago", type: "order" },
                    { title: "Low stock alert: Sandalwood Oil", time: "15 min ago", type: "alert" },
                    { title: "Customer review: 5 stars on Chandan Incense", time: "1 hr ago", type: "review" },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: n.type === "alert" ? colors.saffron : colors.templeGold }} />
                      <div><p className="text-sm">{n.title}</p><p className="text-xs text-gray-400">{n.time}</p></div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold gold-glow" style={{ backgroundColor: colors.maroon, color: colors.warmCream }}>SA</div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-11 w-48 bg-white rounded-lg shadow-xl border py-1 z-50" style={{ borderColor: `${colors.templeGold}25` }}>
                    {["Profile", "Settings", "Billing", "Sign Out"].map((item) => (
                      <button key={item} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        style={item === "Sign Out" ? { color: colors.maroon } : undefined} onClick={() => setProfileOpen(false)}>{item}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content ──────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" style={{ backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.02) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: colors.deep }}>Dashboard</h2>
              <p className="text-sm text-gray-500 mt-0.5">Welcome back, Shri Admin. Here&apos;s your overview.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium gold-glow"
              style={{ backgroundColor: `${colors.templeGold}12`, color: colors.maroon }}>
              <Sparkles className="w-3.5 h-3.5" /> Navratri Season Active
            </div>
          </div>

          {/* ── Stats Cards ──────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, i) => {
              const gradients = ["stat-gradient-revenue", "stat-gradient-orders", "stat-gradient-customers", "stat-gradient-conversion"];
              const iconBgs = [colors.saffron, colors.maroon, colors.templeGold, colors.deep];
              const delayClass = `card-enter-${i + 1}`;
              return (
                <Card key={stat.title} className={`card-enter ${delayClass} border-0 shadow-md hover:shadow-lg transition-shadow duration-300`}
                  style={{ borderTop: `3px solid ${iconBgs[i]}` }}>
                  <CardContent className={`p-5 rounded-xl ${gradients[i]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: iconBgs[i], color: colors.warmCream }}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        stat.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: colors.deep }}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ── Charts Row ───────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base" style={{ color: colors.deep }}>Revenue Overview</CardTitle>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: colors.saffron }} /> +18.2% vs last year
                  </div>
                </div>
              </CardHeader>
              <CardContent><BarChart /></CardContent>
            </Card>

            <Card className="border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base" style={{ color: colors.deep }}>Order Distribution</CardTitle>
              </CardHeader>
              <CardContent><DonutChart /></CardContent>
            </Card>
          </div>

          {/* ── Orders Table & Top Products ──────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base" style={{ color: colors.deep }}>Recent Orders</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs gap-1" style={{ color: colors.saffron }}>
                    <Eye className="w-3.5 h-3.5" /> View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ borderColor: `${colors.templeGold}15` }}>
                        <th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3 hidden md:table-cell">Product</th>
                        <th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 hidden sm:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50/60 transition-colors" style={{ borderColor: `${colors.templeGold}10` }}>
                          <td className="px-6 py-3 font-medium" style={{ color: colors.deep }}>{order.id}</td>
                          <td className="px-6 py-3 text-gray-700">{order.customer}</td>
                          <td className="px-6 py-3 text-gray-500 hidden md:table-cell">{order.product}</td>
                          <td className="px-6 py-3 font-medium" style={{ color: colors.deep }}>{order.amount}</td>
                          <td className="px-6 py-3"><StatusBadge status={order.status} /></td>
                          <td className="px-6 py-3 text-gray-400 hidden sm:table-cell">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base" style={{ color: colors.deep }}>Top Products</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4 text-gray-400" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {topProducts.map((product, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 truncate pr-2">{product.name}</span>
                      <span className="text-xs font-semibold shrink-0" style={{ color: colors.saffron }}>₹{(product.revenue / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${(product.revenue / product.maxRevenue) * 100}%`, background: `linear-gradient(90deg, ${colors.saffron}, ${colors.templeGold})` }} />
                      </div>
                      <span className="text-xs text-gray-400 shrink-0 w-12 text-right">{product.sales} sold</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ── Customer Analytics ────────────────────── */}
          <Card className="border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base" style={{ color: colors.deep }}>Customer Analytics</CardTitle>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: colors.maroon }} />Returning</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: colors.saffron }} />New</span>
                </div>
              </div>
            </CardHeader>
            <CardContent><AreaChart /></CardContent>
          </Card>

          {/* ── Footer accent ────────────────────────── */}
          <div className="text-center py-4">
            <div className="h-px w-40 mx-auto mb-3" style={{ background: `linear-gradient(90deg, transparent, ${colors.templeGold}40, transparent)` }} />
            <p className="text-xs text-gray-400">Shri Fragrance Admin &middot; Crafted with devotion</p>
          </div>
        </main>
      </div>

      {/* ── Mobile sidebar overlay ──────────────────── */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
