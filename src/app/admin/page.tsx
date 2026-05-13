'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  motion, useInView, AnimatePresence,
} from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3,
  Warehouse, Settings, ArrowLeft, TrendingUp, TrendingDown,
  IndianRupee, ShoppingCart, UserCheck, AlertTriangle,
  Plus, Bell, FileText, ChevronLeft, ChevronRight,
  Flame, Sparkles, CircleDot, Menu, X
} from 'lucide-react'
// Recharts removed — using lightweight SVG/CSS charts
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

// ====== SAMPLE DATA ======

const monthlyRevenue = [
  { month: 'Jan', revenue: 645000 },
  { month: 'Feb', revenue: 780000 },
  { month: 'Mar', revenue: 920000 },
  { month: 'Apr', revenue: 870000 },
  { month: 'May', revenue: 1050000 },
  { month: 'Jun', revenue: 1120000 },
  { month: 'Jul', revenue: 980000 },
  { month: 'Aug', revenue: 1240000 },
  { month: 'Sep', revenue: 1180000 },
  { month: 'Oct', revenue: 1350000 },
  { month: 'Nov', revenue: 1280000 },
  { month: 'Dec', revenue: 1450000 },
]

const orderStatusData = [
  { name: 'Delivered', value: 65, color: '#16A34A' },
  { name: 'Shipped', value: 20, color: '#2563EB' },
  { name: 'Processing', value: 10, color: '#D97706' },
  { name: 'Cancelled', value: 5, color: '#DC2626' },
]

const recentOrders = [
  { id: 'SF-7841', customer: 'Priya Venkatesh', product: 'Chandanam Sandalwood', amount: 349, status: 'Delivered', date: '12 Mar 2025', avatar: 'PV' },
  { id: 'SF-7840', customer: 'Rajesh Krishnamurthy', product: 'Nag Champa Classic', amount: 897, status: 'Shipped', date: '12 Mar 2025', avatar: 'RK' },
  { id: 'SF-7839', customer: 'Lakshmi Raman', product: 'Malligai Jasmine', amount: 249, status: 'Processing', date: '11 Mar 2025', avatar: 'LR' },
  { id: 'SF-7838', customer: 'Suresh Iyengar', product: 'Sambrani Herbal', amount: 1197, status: 'Delivered', date: '11 Mar 2025', avatar: 'SI' },
  { id: 'SF-7837', customer: 'Meenakshi Subramanian', product: 'Roja Camphor Blend', amount: 558, status: 'Delivered', date: '10 Mar 2025', avatar: 'MS' },
  { id: 'SF-7836', customer: 'Karthik Narayanan', product: 'Khus Vetiver Classic', amount: 269, status: 'Cancelled', date: '10 Mar 2025', avatar: 'KN' },
  { id: 'SF-7835', customer: 'Anantha Padmanabhan', product: 'Chandanam Sandalwood', amount: 1047, status: 'Shipped', date: '09 Mar 2025', avatar: 'AP' },
  { id: 'SF-7834', customer: 'Deepa Ramachandran', product: 'Nag Champa Classic', amount: 598, status: 'Processing', date: '09 Mar 2025', avatar: 'DR' },
]

const topProducts = [
  { name: 'Chandanam Sandalwood', unitsSold: 2847, revenue: 993603, maxRevenue: 1200000 },
  { name: 'Nag Champa Classic', unitsSold: 3541, revenue: 1058759, maxRevenue: 1200000 },
  { name: 'Malligai Jasmine', unitsSold: 1923, revenue: 479427, maxRevenue: 1200000 },
  { name: 'Roja Camphor Blend', unitsSold: 1562, revenue: 435838, maxRevenue: 1200000 },
  { name: 'Sambrani Herbal', unitsSold: 1205, revenue: 480795, maxRevenue: 1200000 },
]

const sparklineData = [
  [20, 35, 28, 45, 38, 52, 48, 60, 55, 68],
  [15, 25, 30, 22, 35, 28, 40, 38, 45, 42],
  [10, 18, 25, 22, 30, 35, 28, 42, 48, 55],
  [40, 42, 44, 45, 46, 47, 47, 48, 48, 48],
]

// ====== ANIMATION VARIANTS ======

const sidebarItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 },
  }),
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// ====== ANIMATED COUNTER ======

function AnimatedCounter({ target, prefix = '', suffix = '', decimals = 0 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(decimals > 0 ? parseFloat(start.toFixed(decimals)) : Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target, decimals])

  const formatted = decimals > 0 ? count.toFixed(decimals) : count.toLocaleString('en-IN')
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>
}

// ====== SPARKLINE MINI CHART ======

function Sparkline({ data, color = '#C5972E', width = 80, height = 32 }: {
  data: number[]; color?: string; width?: number; height?: number
}) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const padding = 2
  const stepX = (width - padding * 2) / (data.length - 1)

  const points = data.map((v, i) => ({
    x: padding + i * stepX,
    y: height - padding - ((v - min) / range) * (height - padding * 2),
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#spark-grad-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ====== REVENUE AREA CHART (Pure SVG) ======

function RevenueAreaChart({ data, height = 300 }: { data: typeof monthlyRevenue; height?: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const padding = { top: 10, right: 10, bottom: 30, left: 50 }
  const chartW = 600
  const chartH = height
  const innerW = chartW - padding.left - padding.right
  const innerH = chartH - padding.top - padding.bottom

  const maxRev = Math.max(...data.map(d => d.revenue))
  const minRev = 0
  const range = maxRev - minRev || 1

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * innerW,
    y: padding.top + innerH - ((d.revenue - minRev) / range) * innerH,
    ...d,
  }))

  // Build smooth path using monotone cubic interpolation
  const linePath = points.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = points[i - 1]
    const cpx1 = prev.x + (p.x - prev.x) / 3
    const cpx2 = p.x - (p.x - prev.x) / 3
    return `C ${cpx1} ${prev.y} ${cpx2} ${p.y} ${p.x} ${p.y}`
  }).join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`

  // Grid lines (5 horizontal)
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = padding.top + (i / 4) * innerH
    const val = maxRev - (i / 4) * range
    return { y, label: `₹${(val / 100000).toFixed(0)}L` }
  })

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C5972E" stopOpacity={0.4} />
          <stop offset="50%" stopColor="#D4722A" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#D4722A" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={padding.left} y1={g.y} x2={padding.left + innerW} y2={g.y} stroke="#E0C98A" strokeOpacity={0.3} strokeDasharray="3 3" />
          <text x={padding.left - 6} y={g.y + 4} textAnchor="end" fontSize="11" fill="#8B6914">{g.label}</text>
        </g>
      ))}
      {/* Area fill */}
      <path d={areaPath} fill="url(#revenueAreaGrad)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#C5972E" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Data points and X labels */}
      {points.map((p, i) => (
        <g key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ cursor: 'pointer' }}
        >
          {/* Invisible hit area */}
          <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
          {/* Visible dot */}
          <circle cx={p.x} cy={p.y} r={hoveredIndex === i ? 5 : 3} fill="#C5972E" stroke="#fff" strokeWidth={2} style={{ transition: 'r 0.2s' }} />
          {/* X axis label */}
          <text x={p.x} y={padding.top + innerH + 18} textAnchor="middle" fontSize="12" fill="#8B6914">{p.month}</text>
          {/* Tooltip */}
          {hoveredIndex === i && (
            <g>
              <rect x={p.x - 52} y={p.y - 42} width={104} height={34} rx={6} fill="#5C1A1A" stroke="rgba(197,151,46,0.3)" strokeWidth={1} />
              <text x={p.x} y={p.y - 26} textAnchor="middle" fontSize="10" fill="#C5972E" fontWeight="600">{p.month}</text>
              <text x={p.x} y={p.y - 14} textAnchor="middle" fontSize="12" fill="#FFF8E7" fontWeight="bold">₹{p.revenue.toLocaleString('en-IN')}</text>
            </g>
          )}
        </g>
      ))}
    </svg>
  )
}

// ====== ORDER STATUS DONUT (Pure SVG) ======

function OrderStatusDonut({ data }: { data: typeof orderStatusData }) {
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const outerR = 85
  const innerR = 55
  const gap = 3 // degrees between segments
  const total = data.reduce((s, d) => s + d.value, 0)

  // Pre-compute cumulative angles without mutation during render
  const cumulativeAngles = data.reduce<number[]>((acc, d, i) => {
    const prev = i === 0 ? -90 : acc[i - 1]
    acc.push(prev + (d.value / total) * 360)
    return acc
  }, [])

  const segments = data.map((d, i) => {
    const prevAngle = i === 0 ? -90 : cumulativeAngles[i - 1]
    const angle = (d.value / total) * 360 - gap
    const startAngle = prevAngle + gap / 2
    const endAngle = startAngle + angle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1Outer = cx + outerR * Math.cos(startRad)
    const y1Outer = cy + outerR * Math.sin(startRad)
    const x2Outer = cx + outerR * Math.cos(endRad)
    const y2Outer = cy + outerR * Math.sin(endRad)
    const x1Inner = cx + innerR * Math.cos(endRad)
    const y1Inner = cy + innerR * Math.sin(endRad)
    const x2Inner = cx + innerR * Math.cos(startRad)
    const y2Inner = cy + innerR * Math.sin(startRad)

    const largeArc = angle > 180 ? 1 : 0

    const pathD = [
      `M ${x1Outer} ${y1Outer}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
      `L ${x1Inner} ${y1Inner}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2Inner} ${y2Inner}`,
      'Z',
    ].join(' ')

    return { ...d, pathD }
  })

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {segments.map((seg, i) => (
        <path key={i} d={seg.pathD} fill={seg.color} style={{ transition: 'opacity 0.2s' }} opacity={0.9} />
      ))}
    </svg>
  )
}

// ====== SIMPLE PRODUCT BAR CHART (Pure CSS) ======

function SimpleProductBarChart({ data }: { data: typeof topProducts }) {
  const maxUnits = Math.max(...data.map(d => d.unitsSold))
  const shortNames = ['Chandanam', 'Nag Champa', 'Malligai', 'Roja', 'Sambrani']
  return (
    <div className="flex items-end gap-3 sm:gap-5 h-[200px] sm:h-[220px] w-full px-2 pt-6 pb-2">
      {data.map((item, i) => {
        const heightPct = maxUnits > 0 ? (item.unitsSold / maxUnits) * 100 : 0
        return (
          <div key={item.name} className="flex-1 flex flex-col items-center justify-end h-full group relative">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-temple-maroon text-temple-cream px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg border border-temple-gold/30">
              {item.unitsSold.toLocaleString('en-IN')} units
            </div>
            <div
              className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-temple-saffron/80 to-temple-gold transition-all duration-500 group-hover:from-temple-saffron group-hover:to-temple-amber min-h-[4px]"
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] sm:text-xs mt-2 text-muted-foreground font-medium text-center leading-tight">{shortNames[i] || item.name}</span>
          </div>
        )
      })}
    </div>
  )
}

// ====== TEMPLE DIVIDER ======

function TempleDivider() {
  return (
    <motion.div
      className="flex items-center justify-center gap-4 py-4"
      initial={{ opacity: 0, scaleX: 0.5 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-px flex-1 max-w-40 bg-gradient-to-r from-transparent to-temple-gold/50" />
      <div className="flex gap-1.5">
        {[1.5, 2, 3, 2, 1.5].map((s, i) => (
          <motion.div
            key={i}
            className={`rounded-full ${i === 2 ? 'bg-temple-deep' : i % 2 === 0 ? 'bg-temple-gold' : 'bg-temple-saffron'}`}
            style={{ width: s * 3, height: s * 3 }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring' }}
            viewport={{ once: true }}
          />
        ))}
      </div>
      <div className="h-px flex-1 max-w-40 bg-gradient-to-l from-transparent to-temple-gold/50" />
    </motion.div>
  )
}

// ====== SIDEBAR NAV ITEMS ======

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Orders', icon: ShoppingBag, active: false },
  { label: 'Products', icon: Package, active: false },
  { label: 'Customers', icon: Users, active: false },
  { label: 'Analytics', icon: BarChart3, active: false },
  { label: 'Inventory', icon: Warehouse, active: false },
  { label: 'Settings', icon: Settings, active: false },
]

// ====== STATUS BADGE ======

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700 border-green-200',
    Shipped: 'bg-blue-100 text-blue-700 border-blue-200',
    Processing: 'bg-amber-100 text-amber-700 border-amber-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
  }
  return (
    <Badge variant="outline" className={`text-xs font-medium ${styles[status] || ''}`}>
      <CircleDot className="h-2.5 w-2.5 mr-1" />
      {status}
    </Badge>
  )
}

// ====== MAIN ADMIN DASHBOARD ======

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const statsRef = useRef(null)
  const chartRef = useRef(null)
  const orderChartRef = useRef(null)
  const tableRef = useRef(null)
  const productsRef = useRef(null)
  const actionsRef = useRef(null)

  const statsInView = useInView(statsRef, { once: true, margin: '-50px' })
  const chartInView = useInView(chartRef, { once: true, margin: '-50px' })
  const orderChartInView = useInView(orderChartRef, { once: true, margin: '-50px' })
  const tableInView = useInView(tableRef, { once: true, margin: '-50px' })
  const productsInView = useInView(productsRef, { once: true, margin: '-50px' })
  const actionsInView = useInView(actionsRef, { once: true, margin: '-50px' })

  const statsCards = [
    {
      title: 'Total Revenue',
      value: 1245890,
      prefix: '₹',
      change: 12.5,
      icon: IndianRupee,
      sparkColor: '#16A34A',
      sparkIndex: 0,
      glowColor: 'rgba(22, 163, 74, 0.3)',
    },
    {
      title: 'Total Orders',
      value: 3847,
      change: 8.2,
      icon: ShoppingCart,
      sparkColor: '#C5972E',
      sparkIndex: 1,
      glowColor: 'rgba(197, 151, 46, 0.3)',
    },
    {
      title: 'Active Customers',
      value: 2156,
      change: 15.3,
      icon: UserCheck,
      sparkColor: '#D4722A',
      sparkIndex: 2,
      glowColor: 'rgba(212, 114, 42, 0.3)',
    },
    {
      title: 'Products Listed',
      value: 48,
      change: -2.1,
      icon: Package,
      sparkColor: '#8B1A1A',
      sparkIndex: 3,
      glowColor: 'rgba(139, 26, 26, 0.3)',
      alert: '6 low stock',
    },
  ]

  const quickActions = [
    { title: 'Add New Product', icon: Plus, color: 'from-temple-gold to-temple-brass' },
    { title: 'Process Orders', icon: ShoppingBag, color: 'from-temple-saffron to-temple-gold' },
    { title: 'Send Notifications', icon: Bell, color: 'from-temple-deep to-temple-maroon' },
    { title: 'View Reports', icon: FileText, color: 'from-temple-brass to-temple-saffron' },
  ]

  // Content for each nav section
  const navContent: Record<string, React.ReactNode> = {
    Dashboard: null, // default content rendered below
    Orders: (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-temple-gold/20 bg-white">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-temple-gold" />Order Management</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Manage and track all customer orders</p>
                <Button variant="outline" size="sm" className="text-xs border-temple-gold/30 hover:bg-temple-gold/10">Export Orders</Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Pending', value: 12, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Processing', value: 8, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Shipped', value: 28, color: 'text-indigo-600 bg-indigo-50' },
                  { label: 'Delivered', value: 156, color: 'text-green-600 bg-green-50' },
                ].map((s) => (
                  <div key={s.label} className={`p-3 rounded-lg ${s.color}`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs font-medium uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow className="border-temple-gold/10 hover:bg-transparent">
                      <TableHead className="text-xs font-semibold">Order ID</TableHead>
                      <TableHead className="text-xs font-semibold">Customer</TableHead>
                      <TableHead className="text-xs font-semibold">Product</TableHead>
                      <TableHead className="text-xs font-semibold">Amount</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-xs font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="border-b border-temple-gold/5 hover:bg-temple-gold/5 cursor-default">
                        <TableCell className="p-3 text-sm font-mono font-semibold text-temple-deep">{order.id}</TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7 border border-temple-gold/20">
                              <AvatarFallback className="bg-temple-gold/10 text-temple-gold text-[10px] font-bold">{order.avatar}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{order.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-3 text-sm text-muted-foreground">{order.product}</TableCell>
                        <TableCell className="p-3 text-sm font-semibold">₹{order.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="p-3"><StatusBadge status={order.status} /></TableCell>
                        <TableCell className="p-3 text-xs text-muted-foreground">{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    ),
    Products: (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-temple-gold/20 bg-white">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Package className="h-5 w-5 text-temple-gold" />Product Catalog</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Manage your incense product inventory</p>
                <Button className="bg-temple-gold hover:bg-temple-brass text-white text-xs"><Plus className="h-3 w-3 mr-1" />Add Product</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topProducts.map((product, i) => (
                  <Card key={product.name} className="border-temple-gold/10 hover:border-temple-gold/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-temple-gold/20 to-temple-saffron/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-temple-gold">{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.unitsSold.toLocaleString('en-IN')} units sold</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-temple-deep">₹{(product.revenue / 1000).toFixed(0)}K revenue</span>
                        <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    ),
    Customers: (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-temple-gold/20 bg-white">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-temple-gold" />Customer Management</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Customers', value: '2,156', color: 'text-temple-deep bg-temple-gold/10' },
                  { label: 'Active This Month', value: '847', color: 'text-green-600 bg-green-50' },
                  { label: 'New Signups', value: '124', color: 'text-blue-600 bg-blue-50' },
                  { label: 'Avg. Order Value', value: '₹578', color: 'text-temple-gold bg-temple-gold/10' },
                ].map((s) => (
                  <div key={s.label} className={`p-3 rounded-lg ${s.color}`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs font-medium uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center py-8">Customer details and analytics will appear here</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    ),
    Analytics: (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-temple-gold/20 bg-white">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-temple-gold" />Analytics Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <RevenueAreaChart data={monthlyRevenue} height={400} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    ),
    Inventory: (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-temple-gold/20 bg-white">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Warehouse className="h-5 w-5 text-temple-gold" />Inventory Management</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Track stock levels and manage supplies</p>
                <Button variant="outline" size="sm" className="text-xs border-temple-gold/30 hover:bg-temple-gold/10">Update Stock</Button>
              </div>
              <div className="space-y-3">
                {topProducts.map((product) => {
                  const stockLevel = Math.floor(Math.random() * 80) + 20
                  return (
                    <div key={product.name} className="flex items-center gap-4 p-3 rounded-lg border border-temple-gold/10 hover:bg-temple-gold/5 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-temple-gold/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${stockLevel > 50 ? 'bg-green-500' : stockLevel > 20 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${stockLevel}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{stockLevel}%</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs ${stockLevel > 50 ? 'border-green-200 text-green-700 bg-green-50' : stockLevel > 20 ? 'border-amber-200 text-amber-700 bg-amber-50' : 'border-red-200 text-red-700 bg-red-50'}`}>
                        {stockLevel > 50 ? 'In Stock' : stockLevel > 20 ? 'Low Stock' : 'Critical'}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    ),
    Settings: (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-temple-gold/20 bg-white">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5 text-temple-gold" />Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-temple-deep border-b border-temple-gold/10 pb-2">Store Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-muted-foreground">Store Name</label><input type="text" defaultValue="Shri Fragrance" className="mt-1 w-full px-3 py-2 border border-temple-gold/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-temple-gold/30" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Contact Email</label><input type="email" defaultValue="admin@shrifragrance.com" className="mt-1 w-full px-3 py-2 border border-temple-gold/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-temple-gold/30" /></div>
                </div>
                <h3 className="text-sm font-semibold text-temple-deep border-b border-temple-gold/10 pb-2 pt-2">Notifications</h3>
                <div className="space-y-3">
                  {['Order alerts', 'Low stock warnings', 'Customer messages', 'Weekly reports'].map((setting) => (
                    <label key={setting} className="flex items-center justify-between p-3 rounded-lg border border-temple-gold/10 hover:bg-temple-gold/5 cursor-pointer">
                      <span className="text-sm">{setting}</span>
                      <input type="checkbox" defaultChecked className="accent-temple-gold h-4 w-4" />
                    </label>
                  ))}
                </div>
              </div>
              <Button className="bg-temple-gold hover:bg-temple-brass text-white">Save Settings</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    ),
  }

  return (
    <div className="min-h-screen bg-temple-cream flex">
      {/* ====== SIDEBAR (Desktop) ====== */}
      <motion.aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen z-40 deep-maroon-gradient border-r border-temple-gold/20"
        animate={{ width: sidebarCollapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        initial={false}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center border-b border-temple-gold/15 px-3">
          <motion.div
            className="w-10 h-10 rounded-full bg-temple-gold/20 flex items-center justify-center flex-shrink-0 cursor-pointer"
            animate={{ boxShadow: ['0 0 5px rgba(197,151,46,0.3)', '0 0 20px rgba(197,151,46,0.6)', '0 0 5px rgba(197,151,46,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Flame className="h-5 w-5 text-temple-gold" />
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap ml-3"
              >
                <h2 className="text-sm font-bold gold-text tracking-wider">SHRI FRAGRANCE</h2>
                <p className="text-[10px] text-temple-cream/40 tracking-widest uppercase">Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Collapse Toggle */}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarCollapsed(true)}
                className="ml-auto w-7 h-7 rounded-full bg-temple-gold/20 hover:bg-temple-gold/40 text-temple-gold flex items-center justify-center transition-colors hover:scale-110 flex-shrink-0"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-0.5 px-2">
            {navItems.map((item, i) => {
              const Icon = item.icon
              const isActive = activeNav === item.label
              return (
                <motion.button
                  key={item.label}
                  custom={i}
                  variants={sidebarItemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setActiveNav(item.label)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group relative h-10 ${
                    isActive
                      ? 'bg-temple-gold/20 text-temple-gold shadow-lg shadow-temple-gold/10'
                      : 'text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-temple-gold rounded-r-full"
                      layoutId="activeNavItem"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Expand button when collapsed */}
        {sidebarCollapsed && (
          <div className="px-2 pb-2">
            <motion.button
              onClick={() => setSidebarCollapsed(false)}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-temple-gold/10 hover:bg-temple-gold/20 text-temple-gold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Expand sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        )}

        {/* Back to Store */}
        <div className="p-2 border-t border-temple-gold/15">
          <Link href="/">
            <motion.button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg h-10 text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    Back to Store
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Link>
        </div>
      </motion.aside>

      {/* ====== MOBILE HEADER + DRAWER ====== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-temple-cream border-b border-temple-gold/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-temple-deep h-9 w-9">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h2 className="text-sm font-bold gold-text tracking-wider">SHRI FRAGRANCE</h2>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="text-xs gap-1 border-temple-gold/30">
            <ArrowLeft className="h-3 w-3" />Store
          </Button>
        </Link>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="md:hidden fixed top-0 left-0 h-screen w-72 z-50 deep-maroon-gradient border-r border-temple-gold/20 flex flex-col"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Mobile Sidebar Header */}
              <div className="p-4 flex items-center gap-3 border-b border-temple-gold/15">
                <div className="w-10 h-10 rounded-full bg-temple-gold/20 flex items-center justify-center flex-shrink-0">
                  <Flame className="h-5 w-5 text-temple-gold" />
                </div>
                <div className="overflow-hidden whitespace-nowrap">
                  <h2 className="text-sm font-bold gold-text tracking-wider">SHRI FRAGRANCE</h2>
                  <p className="text-[10px] text-temple-cream/40 tracking-widest uppercase">Admin Panel</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="ml-auto w-7 h-7 rounded-full bg-temple-gold/20 hover:bg-temple-gold/40 text-temple-gold flex items-center justify-center transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <ScrollArea className="flex-1 py-4">
                <nav className="space-y-0.5 px-3">
                  {navItems.map((item, i) => {
                    const Icon = item.icon
                    const isActive = activeNav === item.label
                    return (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => { setActiveNav(item.label); setMobileMenuOpen(false) }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group relative h-10 ${
                          isActive
                            ? 'bg-temple-gold/20 text-temple-gold shadow-lg shadow-temple-gold/10'
                            : 'text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-temple-gold rounded-r-full" />
                        )}
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </motion.button>
                    )
                  })}
                </nav>
              </ScrollArea>

              {/* Mobile Back to Store */}
              <div className="p-3 border-t border-temple-gold/15">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg h-10 text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream transition-colors">
                    <ArrowLeft className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Back to Store</span>
                  </button>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ====== MAIN CONTENT ====== */}
      <motion.main
        className="flex-1 will-change-[margin-left]"
        animate={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        initial={false}
      >
        {/* Header Bar */}
        <motion.header
          className="sticky top-0 z-30 bg-temple-cream/95 backdrop-blur-md border-b border-temple-gold/20 px-4 sm:px-6 lg:px-8 py-4"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center justify-between pt-12 md:pt-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                <span className="gold-text">{activeNav}</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeNav === 'Dashboard'
                  ? "Welcome back, Admin \u2014 Here\u2019s your overview"
                  : `Manage your ${activeNav.toLowerCase()} section`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center justify-center w-9 h-9">
                <Button variant="outline" size="icon" className="border-temple-gold/30 h-9 w-9 relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-temple-deep rounded-full border-2 border-temple-cream" />
                </Button>
              </motion.div>
              <div className="flex items-center justify-center w-9 h-9">
                <Avatar className="h-9 w-9 border-2 border-temple-gold/40">
                  <AvatarFallback className="bg-temple-gold/20 text-temple-gold text-xs font-bold">SF</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* ====== CONDITIONAL NAV CONTENT ====== */}
          {activeNav !== 'Dashboard' && navContent[activeNav] ? (
            navContent[activeNav]
          ) : (
          <>
          {/* ====== STATS CARDS ====== */}
          <motion.div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
          >
            {statsCards.map((stat, i) => (
              <motion.div
                key={stat.title}
                custom={i}
                variants={cardVariants}
                whileHover={{
                  scale: 1.04,
                  boxShadow: `0 20px 50px ${stat.glowColor}`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card className="relative overflow-hidden border-temple-gold/20 bg-white hover:border-temple-gold/50 transition-colors cursor-default min-h-[140px]">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-temple-gold to-temple-saffron" />
                  <CardContent className="p-4 sm:p-5 pl-5 sm:pl-6 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.title}</p>
                        <p className="text-2xl sm:text-3xl font-bold mt-1 text-foreground">
                          <AnimatedCounter target={stat.value} prefix={stat.prefix || ''} />
                        </p>
                      </div>
                      <motion.div
                        className="p-2.5 rounded-xl bg-gradient-to-br from-temple-gold/10 to-temple-saffron/10"
                        animate={{
                          boxShadow: [
                            `0 0 5px ${stat.glowColor}`,
                            `0 0 20px ${stat.glowColor}`,
                            `0 0 5px ${stat.glowColor}`,
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <stat.icon className="h-5 w-5 text-temple-gold" />
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${
                            stat.change > 0
                              ? 'bg-green-50 text-green-600 border-green-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          }`}
                        >
                          {stat.change > 0 ? (
                            <TrendingUp className="h-3 w-3 mr-0.5" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-0.5" />
                          )}
                          {Math.abs(stat.change)}%
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">vs last month</span>
                      </div>
                      <Sparkline data={sparklineData[stat.sparkIndex]} color={stat.sparkColor} />
                    </div>

                    {stat.alert && (
                      <motion.div
                        className="mt-2 flex items-center gap-1.5 text-xs text-amber-600"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        <span>{stat.alert} alert</span>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <TempleDivider />

          {/* ====== CHARTS ROW ====== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Sales Analytics Chart */}
            <motion.div
              ref={chartRef}
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 40 }}
              animate={chartInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card className="border-temple-gold/20 bg-white overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-temple-gold" />
                        Revenue Analytics
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Monthly revenue over the last 12 months</p>
                    </div>
                    <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 text-xs mt-1">
                      <Sparkles className="h-3 w-3 mr-1" />Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px] sm:h-[340px] w-full">
                    <RevenueAreaChart data={monthlyRevenue} height={340} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Status Donut */}
            <motion.div
              ref={orderChartRef}
              initial={{ opacity: 0, y: 40 }}
              animate={orderChartInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card className="border-temple-gold/20 bg-white h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-temple-gold" />
                    Order Status
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Breakdown of current orders</p>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col items-center">
                  <div className="relative h-[200px] w-[200px] sm:h-[220px] sm:w-[220px] mx-auto">
                    <OrderStatusDonut data={orderStatusData} />
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-2xl font-bold text-foreground">3,847</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Orders</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full">
                    {orderStatusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <span className="text-xs font-semibold ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <TempleDivider />

          {/* ====== RECENT ORDERS TABLE ====== */}
          <motion.div
            ref={tableRef}
            initial={{ opacity: 0, y: 40 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="border-temple-gold/20 bg-white overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-temple-gold" />
                      Recent Orders
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Latest customer orders</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-temple-gold/30 hover:bg-temple-gold/10">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow className="border-temple-gold/10 hover:bg-transparent">
                        <TableHead className="text-xs font-semibold text-muted-foreground">Order ID</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Customer</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground hidden sm:table-cell">Product</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground hidden md:table-cell">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order, i) => (
                        <motion.tr
                          key={order.id}
                          className="border-b border-temple-gold/5 hover:bg-temple-gold/5 transition-colors cursor-default group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={tableInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                          whileHover={{ backgroundColor: 'rgba(197, 151, 46, 0.06)' }}
                        >
                          <td className="p-3 text-sm font-mono font-semibold text-temple-deep">
                            {order.id}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-7 w-7 border border-temple-gold/20">
                                <AvatarFallback className="bg-temple-gold/10 text-temple-gold text-[10px] font-bold">
                                  {order.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium hidden sm:inline">{order.customer}</span>
                              <span className="text-sm font-medium sm:hidden">{order.avatar}</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">{order.product}</td>
                          <td className="p-3 text-sm font-semibold">₹{order.amount.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{order.date}</td>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <TempleDivider />

          {/* ====== BOTTOM ROW: TOP PRODUCTS + QUICK ACTIONS ====== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Top Products */}
            <motion.div
              ref={productsRef}
              initial={{ opacity: 0, x: -40 }}
              animate={productsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card className="border-temple-gold/20 bg-white h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-temple-gold" />
                    Top Products
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Best sellers by revenue</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {topProducts.map((product, i) => (
                      <motion.div
                        key={product.name}
                        className="group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={productsInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-temple-gold to-temple-saffron text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium group-hover:text-temple-gold transition-colors">
                              {product.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold">₹{(product.revenue / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="h-2.5 rounded-full bg-temple-gold/10 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-temple-gold via-temple-amber to-temple-saffron"
                                initial={{ width: 0 }}
                                animate={productsInView ? { width: `${(product.revenue / product.maxRevenue) * 100}%` } : { width: 0 }}
                                transition={{ delay: 0.5 + i * 0.15, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                              />
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{product.unitsSold.toLocaleString('en-IN')} units</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              ref={actionsRef}
              initial={{ opacity: 0, x: 40 }}
              animate={actionsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card className="border-temple-gold/20 bg-white h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-temple-gold" />
                    Quick Actions
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Common admin tasks</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action, i) => (
                      <motion.button
                        key={action.title}
                        className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-temple-gold/15 bg-gradient-to-br from-temple-cream to-white hover:border-temple-gold/40 transition-all cursor-pointer overflow-hidden h-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={actionsInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        whileHover={{
                          scale: 1.06,
                          boxShadow: '0 15px 40px rgba(197, 151, 46, 0.25)',
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <motion.div
                          className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-md`}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                          <action.icon className="h-6 w-6" />
                        </motion.div>
                        <span className="text-xs font-semibold text-center leading-tight">{action.title}</span>
                        {/* Shimmer effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                        />
                      </motion.button>
                    ))}
                  </div>

                  <Separator className="my-5 bg-temple-gold/15" />

                  {/* Mini Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Pending', value: 12, color: 'text-amber-600' },
                      { label: 'In Transit', value: 28, color: 'text-blue-600' },
                      { label: 'Returns', value: 3, color: 'text-red-600' },
                    ].map((mini, i) => (
                      <motion.div
                        key={mini.label}
                        className="text-center p-3 rounded-lg bg-temple-cream/50 border border-temple-gold/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={actionsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                      >
                        <p className={`text-lg font-bold ${mini.color}`}>{mini.value}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{mini.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ====== BOTTOM BAR CHART - Top Products by Revenue ====== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="border-temple-gold/20 bg-white overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-temple-gold" />
                      Product Sales Comparison
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Units sold per product</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[260px] w-full">
                  <SimpleProductBarChart data={topProducts} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer spacer */}
          <div className="h-4" />
          </>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-temple-gold/15 px-4 sm:px-6 lg:px-8 py-4 bg-temple-cream">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              &copy; 2025 Shri Fragrance &mdash; Sacred Temple Agarbathi. Admin Dashboard.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flame className="h-3 w-3 text-temple-gold" />
              <span>Handcrafted with devotion</span>
            </div>
          </div>
        </footer>
      </motion.main>
    </div>
  )
}
