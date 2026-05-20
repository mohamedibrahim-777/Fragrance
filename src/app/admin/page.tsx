"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ensureAdminSeed, getSession, logout as authLogout, subscribeAuth, type Session } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, Menu, X, Bell, Search, TrendingUp, TrendingDown,
  IndianRupee, ChevronDown, Landmark, Flame, Sparkles,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Eye,
  ArrowLeft, Home, Plus, Edit3, Trash2, Filter,
  DollarSign, Star, Clock, CheckCircle2, XCircle,
  Truck, AlertCircle, RefreshCw, Download, Upload,
  Save, Mail, Phone, MapPin, Calendar, Tag, Percent,
  BarChart2, PieChart, Activity, TrendingUp as TrendIcon,
  UserPlus, Shield, Lock, BellRing, Globe, Palette,
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

const productsList = [
  { id: 1, name: "Javathu", category: "Floral", price: "₹299", stock: 200, status: "Active", sales: 187, rating: 4.8 },
  { id: 2, name: "Jasmine", category: "Floral", price: "₹249", stock: 250, status: "Active", sales: 256, rating: 4.9 },
  { id: 3, name: "Champa", category: "Floral", price: "₹279", stock: 180, status: "Active", sales: 198, rating: 4.7 },
  { id: 4, name: "Lavender", category: "Herbal", price: "₹269", stock: 160, status: "Active", sales: 142, rating: 4.6 },
  { id: 5, name: "Screw Pine", category: "Floral", price: "₹319", stock: 120, status: "Active", sales: 124, rating: 4.5 },
  { id: 6, name: "Rose", category: "Floral", price: "₹259", stock: 220, status: "Active", sales: 213, rating: 4.8 },
  { id: 7, name: "Sandal", category: "Premium", price: "₹399", stock: 140, status: "Active", sales: 287, rating: 4.9 },
  { id: 8, name: "Sacred Resin", category: "Premium", price: "₹499", stock: 90, status: "Active", sales: 156, rating: 4.9 },
];

const customersList = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@email.com", orders: 12, spent: "₹18,450", location: "Chennai", joined: "Jan 2023", status: "Active" },
  { id: 2, name: "Priya Sharma", email: "priya@email.com", orders: 24, spent: "₹45,200", location: "Mumbai", joined: "Mar 2022", status: "VIP" },
  { id: 3, name: "Arun Iyer", email: "arun@email.com", orders: 8, spent: "₹9,800", location: "Bangalore", joined: "Aug 2023", status: "Active" },
  { id: 4, name: "Meena Nair", email: "meena@email.com", orders: 3, spent: "₹2,150", location: "Kochi", joined: "Nov 2023", status: "New" },
  { id: 5, name: "Vikram Patel", email: "vikram@email.com", orders: 1, spent: "₹1,100", location: "Ahmedabad", joined: "Dec 2023", status: "Inactive" },
  { id: 6, name: "Lakshmi Reddy", email: "lakshmi@email.com", orders: 18, spent: "₹32,600", location: "Hyderabad", joined: "Feb 2022", status: "VIP" },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: Package, label: "Products", key: "products" },
  { icon: ShoppingCart, label: "Orders", key: "orders" },
  { icon: Users, label: "Customers", key: "customers" },
  { icon: BarChart3, label: "Analytics", key: "analytics" },
  { icon: Settings, label: "Settings", key: "settings" },
];

const bottomNavItems = [
  { icon: Home, label: "Back to Home", href: "/" },
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
  const map: Record<string, { bg: string; text: string; icon?: React.ReactNode }> = {
    Delivered: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
    Processing: { bg: "bg-amber-100", text: "text-amber-700", icon: <Clock className="w-3 h-3 mr-1" /> },
    Shipped: { bg: "bg-sky-100", text: "text-sky-700", icon: <Truck className="w-3 h-3 mr-1" /> },
    Cancelled: { bg: "bg-red-100", text: "text-red-700", icon: <XCircle className="w-3 h-3 mr-1" /> },
  };
  const s = map[status] ?? { bg: "bg-gray-100", text: "text-gray-700" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>{s.icon}{status}</span>;
}

function ProductStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    Active: { bg: "bg-emerald-100", text: "text-emerald-700" },
    "Low Stock": { bg: "bg-amber-100", text: "text-amber-700" },
    "Out of Stock": { bg: "bg-red-100", text: "text-red-700" },
  };
  const s = map[status] ?? { bg: "bg-gray-100", text: "text-gray-700" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>{status}</span>;
}

function CustomerStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    VIP: { bg: "bg-amber-100", text: "text-amber-700" },
    Active: { bg: "bg-emerald-100", text: "text-emerald-700" },
    New: { bg: "bg-sky-100", text: "text-sky-700" },
    Inactive: { bg: "bg-gray-100", text: "text-gray-500" },
  };
  const s = map[status] ?? { bg: "bg-gray-100", text: "text-gray-700" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>{status}</span>;
}

// ── Main Page ──────────────────────────────────────────
export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    ensureAdminSeed();
    const refresh = () => {
      const s = getSession();
      setSession(s);
      setAuthChecked(true);
      if (!s) router.replace('/login?next=/admin');
      else if (s.role !== 'admin') router.replace('/dashboard');
    };
    refresh();
    return subscribeAuth(refresh);
  }, [router]);

  const handleLogout = useCallback(() => {
    authLogout();
    router.replace('/login');
  }, [router]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");

  // ── SETTINGS STATE ──────────────────────────────────
  const [general, setGeneral] = useState({
    storeName: "Shri Fragrance",
    storeEmail: "admin@shrifragrance.com",
    currency: "INR (₹)",
    timezone: "Asia/Kolkata (IST)",
  });
  const [themeColor, setThemeColor] = useState<"maroon" | "templeGold" | "saffron">("maroon");
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState([
    { label: "New Order Alerts", desc: "Get notified for every new order", enabled: true },
    { label: "Low Stock Warnings", desc: "Alert when products fall below threshold", enabled: true },
    { label: "Customer Reviews", desc: "Notifications for new product reviews", enabled: false },
    { label: "Revenue Milestones", desc: "Celebrate revenue achievements", enabled: true },
  ]);
  const [pwd, setPwd] = useState({ current: "", next: "" });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const g = localStorage.getItem("shri:admin:general");
      if (g) setGeneral(JSON.parse(g));
      const a = localStorage.getItem("shri:admin:appearance");
      if (a) {
        const parsed = JSON.parse(a);
        if (parsed.themeColor) setThemeColor(parsed.themeColor);
        if (typeof parsed.darkMode === "boolean") setDarkMode(parsed.darkMode);
      }
      const n = localStorage.getItem("shri:admin:notifs");
      if (n) setNotifs(JSON.parse(n));
    } catch { /* ignore */ }
  }, []);

  // Reflect dark mode on the admin root
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("admin-dark", darkMode);
  }, [darkMode]);

  const saveGeneral = useCallback(() => {
    try { localStorage.setItem("shri:admin:general", JSON.stringify(general)); } catch {}
    toast({ title: "Settings saved", description: "General settings updated." });
  }, [general, toast]);

  const persistAppearance = useCallback((next: { themeColor?: typeof themeColor; darkMode?: boolean }) => {
    const merged = { themeColor: next.themeColor ?? themeColor, darkMode: next.darkMode ?? darkMode };
    try { localStorage.setItem("shri:admin:appearance", JSON.stringify(merged)); } catch {}
  }, [themeColor, darkMode]);

  const pickTheme = useCallback((c: typeof themeColor) => {
    setThemeColor(c);
    persistAppearance({ themeColor: c });
    toast({ title: "Theme updated", description: `Primary color set to ${c}.` });
  }, [persistAppearance, toast]);

  const toggleDark = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      persistAppearance({ darkMode: next });
      return next;
    });
  }, [persistAppearance]);

  const toggleNotif = useCallback((i: number) => {
    setNotifs(prev => {
      const next = prev.map((n, idx) => idx === i ? { ...n, enabled: !n.enabled } : n);
      try { localStorage.setItem("shri:admin:notifs", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const updatePassword = useCallback(() => {
    if (!pwd.current || !pwd.next) {
      toast({ title: "Missing fields", description: "Enter both current and new password." });
      return;
    }
    if (pwd.next.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters." });
      return;
    }
    setPwd({ current: "", next: "" });
    toast({ title: "Password updated", description: "Your password has been changed." });
  }, [pwd, toast]);

  // ── SECTION RENDERERS ──────────────────────────────

  const renderDashboard = () => (
    <>
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

      {/* Stats Cards */}
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

      {/* Charts Row */}
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

      {/* Orders Table & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base" style={{ color: colors.deep }}>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1" style={{ color: colors.saffron }} onClick={() => setActiveNav("orders")}>
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
                  {recentOrders.slice(0, 5).map((order) => (
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

      {/* Customer Analytics */}
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
    </>
  );

  const renderProducts = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.deep }}>Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your product inventory and catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1" style={{ borderColor: `${colors.templeGold}30` }}>
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button size="sm" className="text-xs gap-1 text-white" style={{ backgroundColor: colors.maroon }}>
            <Plus className="w-3.5 h-3.5" /> Add Product
          </Button>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: "48", icon: Package, color: colors.saffron },
          { label: "Active", value: "35", icon: CheckCircle2, color: "#16a34a" },
          { label: "Low Stock", value: "8", icon: AlertCircle, color: colors.saffron },
          { label: "Out of Stock", value: "5", icon: XCircle, color: colors.maroon },
        ].map((s, i) => (
          <Card key={i} className="border shadow-sm card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: colors.deep }}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Table */}
      <Card className="border shadow-md" style={{ borderColor: `${colors.templeGold}20` }}>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-base" style={{ color: colors.deep }}>Product Catalog</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Search products..." className="h-8 text-xs w-48" style={{ borderColor: `${colors.templeGold}30` }} />
              <Button variant="outline" size="sm" className="text-xs gap-1 h-8" style={{ borderColor: `${colors.templeGold}30` }}>
                <Filter className="w-3 h-3" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ borderColor: `${colors.templeGold}15` }}>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Sales</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50/60 transition-colors" style={{ borderColor: `${colors.templeGold}10` }}>
                    <td className="px-6 py-3 font-medium" style={{ color: colors.deep }}>{product.name}</td>
                    <td className="px-6 py-3 text-gray-500">{product.category}</td>
                    <td className="px-6 py-3 font-medium" style={{ color: colors.deep }}>{product.price}</td>
                    <td className="px-6 py-3">
                      <span className={product.stock === 0 ? "text-red-500 font-medium" : product.stock < 20 ? "text-amber-600 font-medium" : "text-gray-700"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{product.sales}</td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{product.rating}
                      </span>
                    </td>
                    <td className="px-6 py-3"><ProductStatusBadge status={product.status} /></td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-amber-50"><Edit3 className="w-3.5 h-3.5" style={{ color: colors.saffron }} /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderOrders = () => {
    const filtered = orderFilter === "All" ? recentOrders : recentOrders.filter(o => o.status === orderFilter);
    return (
      <>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.deep }}>Orders</h2>
            <p className="text-sm text-gray-500 mt-0.5">Track and manage customer orders</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1" style={{ borderColor: `${colors.templeGold}30` }}>
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
            <Button size="sm" className="text-xs gap-1 text-white" style={{ backgroundColor: colors.maroon }}>
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Orders", value: "1,234", icon: ShoppingCart, color: colors.saffron },
            { label: "Processing", value: "45", icon: Clock, color: colors.saffron },
            { label: "Shipped", value: "28", icon: Truck, color: "#0284c7" },
            { label: "Delivered", value: "1,148", icon: CheckCircle2, color: "#16a34a" },
          ].map((s, i) => (
            <Card key={i} className="border shadow-sm card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: colors.deep }}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((f) => (
            <button key={f} onClick={() => setOrderFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                orderFilter === f ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700 bg-gray-100"
              }`}
              style={orderFilter === f ? { backgroundColor: colors.maroon } : undefined}>
              {f}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <Card className="border shadow-md" style={{ borderColor: `${colors.templeGold}20` }}>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ borderColor: `${colors.templeGold}15` }}>
                    <th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50/60 transition-colors" style={{ borderColor: `${colors.templeGold}10` }}>
                      <td className="px-6 py-3 font-medium" style={{ color: colors.deep }}>{order.id}</td>
                      <td className="px-6 py-3 text-gray-700">{order.customer}</td>
                      <td className="px-6 py-3 text-gray-500">{order.product}</td>
                      <td className="px-6 py-3 font-medium" style={{ color: colors.deep }}>{order.amount}</td>
                      <td className="px-6 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-6 py-3 text-gray-400">{order.date}</td>
                      <td className="px-6 py-3">
                        <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" style={{ color: colors.saffron }}>
                          <Eye className="w-3 h-3" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderCustomers = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.deep }}>Customers</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your customer base and relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1" style={{ borderColor: `${colors.templeGold}30` }}>
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button size="sm" className="text-xs gap-1 text-white" style={{ backgroundColor: colors.maroon }}>
            <UserPlus className="w-3.5 h-3.5" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Customers", value: "5,678", icon: Users, color: colors.templeGold },
          { label: "VIP Members", value: "342", icon: Star, color: colors.saffron },
          { label: "New This Month", value: "120", icon: UserPlus, color: "#16a34a" },
          { label: "Avg. Order Value", value: "₹1,245", icon: IndianRupee, color: colors.deep },
        ].map((s, i) => (
          <Card key={i} className="border shadow-sm card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: colors.deep }}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customers Table */}
      <Card className="border shadow-md" style={{ borderColor: `${colors.templeGold}20` }}>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-base" style={{ color: colors.deep }}>Customer Directory</CardTitle>
            <Input placeholder="Search customers..." className="h-8 text-xs w-48" style={{ borderColor: `${colors.templeGold}30` }} />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ borderColor: `${colors.templeGold}15` }}>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Orders</th>
                  <th className="px-6 py-3">Total Spent</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customersList.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50/60 transition-colors" style={{ borderColor: `${colors.templeGold}10` }}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: colors.maroon }}>
                          {customer.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium" style={{ color: colors.deep }}>{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{customer.email}</td>
                    <td className="px-6 py-3 text-gray-700">{customer.orders}</td>
                    <td className="px-6 py-3 font-medium" style={{ color: colors.deep }}>{customer.spent}</td>
                    <td className="px-6 py-3 text-gray-500">{customer.location}</td>
                    <td className="px-6 py-3 text-gray-400">{customer.joined}</td>
                    <td className="px-6 py-3"><CustomerStatusBadge status={customer.status} /></td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-amber-50"><Eye className="w-3.5 h-3.5" style={{ color: colors.saffron }} /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-amber-50"><Mail className="w-3.5 h-3.5" style={{ color: colors.saffron }} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderAnalytics = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.deep }}>Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Detailed insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1" style={{ borderColor: `${colors.templeGold}30` }}>
            <Download className="w-3.5 h-3.5" /> Export Report
          </Button>
        </div>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Revenue", value: "₹12.4L", change: "+12.5%", trend: "up", icon: DollarSign },
          { label: "Avg. Order Value", value: "₹1,008", change: "+5.2%", trend: "up", icon: IndianRupee },
          { label: "Customer Lifetime Value", value: "₹3,450", change: "+8.1%", trend: "up", icon: Users },
          { label: "Return Rate", value: "2.4%", change: "-0.8%", trend: "up", icon: RefreshCw },
        ].map((s, i) => (
          <Card key={i} className="border shadow-sm card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.templeGold}15`, color: colors.templeGold }}>
                  <s.icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {s.change}
                </span>
              </div>
              <p className="text-xl font-bold" style={{ color: colors.deep }}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base" style={{ color: colors.deep }}>Revenue Trend</CardTitle>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: colors.saffron }} /> Monthly Breakdown
            </div>
          </div>
        </CardHeader>
        <CardContent><BarChart /></CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base" style={{ color: colors.deep }}>Order Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent><DonutChart /></CardContent>
        </Card>
        <Card className="border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base" style={{ color: colors.deep }}>Customer Growth</CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: colors.maroon }} />Returning</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: colors.saffron }} />New</span>
              </div>
            </div>
          </CardHeader>
          <CardContent><AreaChart /></CardContent>
        </Card>
      </div>

      {/* Top Performing Metrics */}
      <Card className="border shadow-md card-enter" style={{ borderColor: `${colors.templeGold}20` }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base" style={{ color: colors.deep }}>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topProducts.map((product, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-bold w-6 text-center" style={{ color: colors.templeGold }}>#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(product.revenue / product.maxRevenue) * 100}%`, background: `linear-gradient(90deg, ${colors.saffron}, ${colors.templeGold})` }} />
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold" style={{ color: colors.deep }}>₹{(product.revenue / 1000).toFixed(1)}k</p>
                <p className="text-xs text-gray-400">{product.sales} sold</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );

  const renderSettings = () => (
    <>
      <div>
        <h2 className="text-2xl font-bold" style={{ color: colors.deep }}>Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure your store and account preferences</p>
      </div>

      {/* General Settings */}
      <Card className="border shadow-md" style={{ borderColor: `${colors.templeGold}20` }}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2" style={{ color: colors.deep }}>
            <Globe className="w-5 h-5" style={{ color: colors.templeGold }} /> General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Store Name</label>
              <Input value={general.storeName} onChange={(e) => setGeneral(g => ({ ...g, storeName: e.target.value }))}
                className="h-9 text-sm" style={{ borderColor: `${colors.templeGold}30` }} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Store Email</label>
              <Input value={general.storeEmail} onChange={(e) => setGeneral(g => ({ ...g, storeEmail: e.target.value }))}
                className="h-9 text-sm" style={{ borderColor: `${colors.templeGold}30` }} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Currency</label>
              <Input value={general.currency} onChange={(e) => setGeneral(g => ({ ...g, currency: e.target.value }))}
                className="h-9 text-sm" style={{ borderColor: `${colors.templeGold}30` }} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Timezone</label>
              <Input value={general.timezone} onChange={(e) => setGeneral(g => ({ ...g, timezone: e.target.value }))}
                className="h-9 text-sm" style={{ borderColor: `${colors.templeGold}30` }} />
            </div>
          </div>
          <Button size="sm" onClick={saveGeneral} className="text-xs gap-1 text-white" style={{ backgroundColor: colors.maroon }}>
            <Save className="w-3.5 h-3.5" /> Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="border shadow-md" style={{ borderColor: `${colors.templeGold}20` }}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2" style={{ color: colors.deep }}>
            <Palette className="w-5 h-5" style={{ color: colors.templeGold }} /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: `${colors.templeGold}15` }}>
            <div>
              <p className="text-sm font-medium">Theme Color</p>
              <p className="text-xs text-gray-500">Primary brand color for your store</p>
            </div>
            <div className="flex items-center gap-2">
              {(["maroon", "templeGold", "saffron"] as const).map(key => (
                <button key={key} onClick={() => pickTheme(key)} aria-label={`Set theme to ${key}`}
                  className={`w-7 h-7 rounded-full border-2 shadow transition-all ${themeColor === key ? "ring-2 ring-offset-2 scale-110" : "border-white"}`}
                  style={{ backgroundColor: colors[key], ...(themeColor === key ? { boxShadow: `0 0 0 2px ${colors[key]}` } : {}) }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: `${colors.templeGold}15` }}>
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-gray-500">Enable dark mode for admin panel</p>
            </div>
            <button onClick={toggleDark} aria-label="Toggle dark mode"
              className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? "" : "bg-gray-300"}`}
              style={darkMode ? { backgroundColor: colors.templeGold } : undefined}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${darkMode ? "translate-x-[22px] left-0" : "left-1"}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border shadow-md" style={{ borderColor: `${colors.templeGold}20` }}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2" style={{ color: colors.deep }}>
            <BellRing className="w-5 h-5" style={{ color: colors.templeGold }} /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifs.map((setting, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: `${colors.templeGold}15` }}>
              <div>
                <p className="text-sm font-medium">{setting.label}</p>
                <p className="text-xs text-gray-500">{setting.desc}</p>
              </div>
              <button onClick={() => toggleNotif(i)} aria-label={`Toggle ${setting.label}`}
                className={`relative w-11 h-6 rounded-full transition-colors ${setting.enabled ? "" : "bg-gray-300"}`}
                style={setting.enabled ? { backgroundColor: colors.templeGold } : undefined}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${setting.enabled ? "translate-x-[22px] left-0" : "left-1"}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border shadow-md" style={{ borderColor: `${colors.templeGold}20` }}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2" style={{ color: colors.deep }}>
            <Shield className="w-5 h-5" style={{ color: colors.templeGold }} /> Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Current Password</label>
              <Input type="password" placeholder="Enter current password" value={pwd.current}
                onChange={(e) => setPwd(p => ({ ...p, current: e.target.value }))}
                className="h-9 text-sm" style={{ borderColor: `${colors.templeGold}30` }} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">New Password</label>
              <Input type="password" placeholder="Enter new password" value={pwd.next}
                onChange={(e) => setPwd(p => ({ ...p, next: e.target.value }))}
                className="h-9 text-sm" style={{ borderColor: `${colors.templeGold}30` }} />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={updatePassword} className="text-xs gap-1" style={{ borderColor: `${colors.templeGold}30`, color: colors.maroon }}>
            <Lock className="w-3.5 h-3.5" /> Update Password
          </Button>
        </CardContent>
      </Card>
    </>
  );

  // ── SECTION ROUTER ──────────────────────────────────
  const renderContent = () => {
    switch (activeNav) {
      case "dashboard": return renderDashboard();
      case "products": return renderProducts();
      case "orders": return renderOrders();
      case "customers": return renderCustomers();
      case "analytics": return renderAnalytics();
      case "settings": return renderSettings();
      default: return renderDashboard();
    }
  };

  // ── PAGE TITLES ─────────────────────────────────────
  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: "Dashboard", subtitle: "Welcome back, Shri Admin. Here's your overview." },
    products: { title: "Products", subtitle: "Manage your product inventory and catalog" },
    orders: { title: "Orders", subtitle: "Track and manage customer orders" },
    customers: { title: "Customers", subtitle: "Manage your customer base and relationships" },
    analytics: { title: "Analytics", subtitle: "Detailed insights and performance metrics" },
    settings: { title: "Settings", subtitle: "Configure your store and account preferences" },
  };

  // Gate the admin panel — show a loader until auth is verified.
  if (!authChecked || !session || session.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-temple-cream">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-temple-saffron border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-temple-deep/60">Checking access...</p>
        </div>
      </div>
    );
  }

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

        {/* Back to Home link */}
        <div className="px-3 py-2" style={{ borderTop: `1px solid ${colors.templeGold}25` }}>
          {bottomNavItems.map((item) => (
            <a key={item.href} href={item.href}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-white/60 hover:text-white hover:bg-white/8">
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
              <ArrowLeft className="w-3.5 h-3.5 ml-auto opacity-50" />
            </a>
          ))}
        </div>

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

          {/* Back to Home button */}
          <a href="/"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-md"
            style={{ backgroundColor: `${colors.maroon}10`, color: colors.maroon, border: `1px solid ${colors.maroon}20` }}>
            <ArrowLeft className="w-3.5 h-3.5" />
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Home</span>
          </a>

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
                <DialogTitle className="font-semibold text-base" style={{ color: colors.deep }}>Notifications</DialogTitle>
                <DialogDescription className="sr-only">Recent admin notifications and alerts.</DialogDescription>
                <div className="space-y-3">
                  <h3 className="sr-only">Recent activity</h3>
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
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold gold-glow" style={{ backgroundColor: colors.maroon, color: colors.warmCream }}>
                  {(session?.name ?? 'SA').slice(0, 2).toUpperCase()}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-11 w-56 bg-white rounded-lg shadow-xl border py-2 z-50" style={{ borderColor: `${colors.templeGold}25` }}>
                    <div className="px-4 pb-2 border-b" style={{ borderColor: `${colors.templeGold}15` }}>
                      <p className="text-sm font-semibold" style={{ color: colors.deep }}>{session?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{session?.email}</p>
                    </div>
                    {["Settings", "Logout"].map((item) => (
                      <button key={item} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        style={item === "Logout" ? { color: colors.maroon, fontWeight: 600 } : undefined}
                        onClick={() => {
                          setProfileOpen(false);
                          if (item === "Settings") setActiveNav("settings");
                          else if (item === "Logout") handleLogout();
                        }}>{item}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content ──────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" style={{ backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.02) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          {renderContent()}
        </main>
      </div>

      {/* ── Mobile sidebar overlay ──────────────────── */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
