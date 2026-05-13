'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  motion, useInView, AnimatePresence,
} from 'framer-motion'
import {
  ShoppingBag, Heart, Award, MapPin, User, Settings,
  ArrowLeft, Package, Clock, CheckCircle2, Truck,
  Star, ChevronRight, Flame, Sparkles, Gift,
  Crown, Copy, Trash2, Plus, Edit3, IndianRupee,
  CircleDot, TrendingUp, Calendar, MapPinned
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

// ====== SAMPLE DATA ======

const userData = {
  name: 'Priya Venkatesh',
  email: 'priya.venkatesh@email.com',
  phone: '+91 98765 43210',
  avatar: 'PV',
  membership: 'Temple Gold Member',
  points: 2450,
  nextTierPoints: 5000,
  totalOrders: 24,
  wishlistCount: 8,
  rewardsValue: 1200,
  totalSpent: 8450,
  avgOrder: 352,
  favoriteCategory: 'Premium Sandalwood',
  memberSince: 'Jan 2023',
}

const recentOrders = [
  {
    id: 'SF-7841',
    date: '12 Mar 2025',
    status: 'Delivered',
    statusStep: 3,
    items: [
      { name: 'Chandanam Sandalwood', qty: 2, price: 698, image: '/images/product1.png' },
      { name: 'Nag Champa Classic', qty: 1, price: 299, image: '/images/product3.png' },
    ],
    total: 997,
  },
  {
    id: 'SF-7830',
    date: '08 Mar 2025',
    status: 'Shipped',
    statusStep: 2,
    items: [
      { name: 'Malligai Jasmine', qty: 3, price: 747, image: '/images/product2.png' },
    ],
    total: 747,
  },
  {
    id: 'SF-7815',
    date: '28 Feb 2025',
    status: 'Processing',
    statusStep: 1,
    items: [
      { name: 'Sambrani Herbal', qty: 1, price: 399, image: '/images/product5.png' },
      { name: 'Roja Camphor Blend', qty: 1, price: 279, image: '/images/product4.png' },
    ],
    total: 678,
  },
  {
    id: 'SF-7798',
    date: '15 Feb 2025',
    status: 'Delivered',
    statusStep: 3,
    items: [
      { name: 'Khus Vetiver Classic', qty: 2, price: 538, image: '/images/product6.png' },
    ],
    total: 538,
  },
  {
    id: 'SF-7780',
    date: '02 Feb 2025',
    status: 'Delivered',
    statusStep: 3,
    items: [
      { name: 'Chandanam Sandalwood', qty: 1, price: 349, image: '/images/product1.png' },
      { name: 'Malligai Jasmine', qty: 1, price: 249, image: '/images/product2.png' },
      { name: 'Nag Champa Classic', qty: 2, price: 598, image: '/images/product3.png' },
    ],
    total: 1196,
  },
]

const wishlistItems = [
  { id: 1, name: 'Chandanam Sandalwood', price: 349, originalPrice: 499, image: '/images/product1.png', inStock: true },
  { id: 3, name: 'Nag Champa Classic', price: 299, originalPrice: 449, image: '/images/product3.png', inStock: true },
  { id: 5, name: 'Sambrani Herbal', price: 399, originalPrice: 549, image: '/images/product5.png', inStock: true },
  { id: 6, name: 'Khus Vetiver Classic', price: 269, originalPrice: 399, image: '/images/product6.png', inStock: false },
]

const rewards = [
  { id: 1, title: '₹200 Off Next Order', points: 500, description: 'Get ₹200 discount on your next purchase', icon: IndianRupee, color: 'from-temple-gold to-temple-brass' },
  { id: 2, title: 'Free Shipping 30 Days', points: 300, description: 'Enjoy free delivery for the next 30 days', icon: Truck, color: 'from-temple-saffron to-temple-gold' },
  { id: 3, title: 'Exclusive Temple Visit', points: 2000, description: 'A divine temple experience with curated pooja', icon: Crown, color: 'from-temple-deep to-temple-maroon' },
  { id: 4, title: 'Mystery Fragrance Box', points: 800, description: 'A surprise box of 5 premium fragrances', icon: Gift, color: 'from-temple-brass to-temple-saffron' },
]

const addresses = [
  { id: 1, label: 'Home', name: 'Priya Venkatesh', line1: '42, Sri Venkateswara Street', line2: 'T. Nagar, Chennai', pincode: '600017', phone: '+91 98765 43210', isDefault: true },
  { id: 2, label: 'Temple Town', name: 'Priya Venkatesh', line1: '15, Raja Veethi', line2: 'Madurai', pincode: '625001', phone: '+91 98765 43210', isDefault: false },
]

const monthlySpending = [
  { month: 'Oct', amount: 1240 },
  { month: 'Nov', amount: 1850 },
  { month: 'Dec', amount: 2400 },
  { month: 'Jan', amount: 960 },
  { month: 'Feb', amount: 1734 },
  { month: 'Mar', amount: 266 },
]

const orderStatusCounts = [
  { label: 'Delivered', count: 18, color: '#16A34A' },
  { label: 'In Transit', count: 3, color: '#2563EB' },
  { label: 'Processing', count: 2, color: '#D97706' },
  { label: 'Returned', count: 1, color: '#DC2626' },
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

const cardHover = {
  scale: 1.03,
  boxShadow: '0 20px 50px rgba(197, 151, 46, 0.2)',
  transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
}

// ====== ANIMATED COUNTER ======

function AnimatedCounter({ target, prefix = '', suffix = '' }: {
  target: number; prefix?: string; suffix?: string
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
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>
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

// ====== ORDER STATUS STEP ======

function OrderStatusStep({ step, total = 3 }: { step: number; total?: number }) {
  const steps = ['Ordered', 'Shipped', 'Delivered']
  const icons = [Package, Truck, CheckCircle2]
  return (
    <div className="flex items-start w-full">
      {steps.map((label, i) => {
        const IconComp = icons[i]
        const isActive = i <= step
        const isCurrent = i === step
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center flex-shrink-0">
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                  isActive
                    ? 'bg-temple-gold border-temple-gold text-white'
                    : 'bg-temple-cream border-temple-gold/30 text-temple-gold/40'
                } ${isCurrent ? 'ring-2 ring-temple-gold/30 ring-offset-2 ring-offset-temple-cream' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.15, type: 'spring' }}
              >
                <IconComp className="h-3.5 w-3.5" />
              </motion.div>
              <span className={`text-[9px] mt-1 font-medium whitespace-nowrap ${isActive ? 'text-temple-deep' : 'text-muted-foreground/40'}`}>
                {label}
              </span>
            </div>
            {i < total - 1 && (
              <div className="flex-1 mx-1.5 mt-[14px] self-start">
                <div className="h-0.5 rounded-full bg-temple-gold/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-temple-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: i < step ? '100%' : '0%' }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ====== CUSTOM CHART TOOLTIP ======

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-temple-maroon text-temple-cream px-4 py-3 rounded-lg shadow-xl border border-temple-gold/30">
      <p className="text-xs text-temple-gold font-medium mb-1">{label}</p>
      <p className="text-sm font-bold">₹{payload[0].value.toLocaleString('en-IN')}</p>
    </div>
  )
}

// ====== SIDEBAR NAV ITEMS ======

const navItems = [
  { label: 'My Orders', icon: ShoppingBag },
  { label: 'Wishlist', icon: Heart },
  { label: 'Rewards', icon: Award },
  { label: 'Addresses', icon: MapPin },
  { label: 'Profile', icon: User },
  { label: 'Settings', icon: Settings },
]

// ====== MAIN USER DASHBOARD ======

export default function UserDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('My Orders')

  const profileRef = useRef(null)
  const ordersRef = useRef(null)
  const analyticsRef = useRef(null)
  const wishlistRef = useRef(null)
  const rewardsRef = useRef(null)
  const addressesRef = useRef(null)

  const profileInView = useInView(profileRef, { once: true, margin: '-50px' })
  const ordersInView = useInView(ordersRef, { once: true, margin: '-50px' })
  const analyticsInView = useInView(analyticsRef, { once: true, margin: '-50px' })
  const wishlistInView = useInView(wishlistRef, { once: true, margin: '-50px' })
  const rewardsInView = useInView(rewardsRef, { once: true, margin: '-50px' })
  const addressesInView = useInView(addressesRef, { once: true, margin: '-50px' })

  return (
    <div className="min-h-screen bg-temple-cream flex">
      {/* ====== SIDEBAR ====== */}
      <motion.aside
        className={`hidden md:flex flex-col fixed top-0 left-0 h-screen z-40 deep-maroon-gradient border-r border-temple-gold/20 transition-all duration-300 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-64'
        }`}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center gap-3 border-b border-temple-gold/15">
          <motion.div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-temple-gold flex-shrink-0"
            animate={{ boxShadow: ['0 0 5px rgba(197,151,46,0.3)', '0 0 20px rgba(197,151,46,0.6)', '0 0 5px rgba(197,151,46,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src="/images/logo.png" alt="Shri Fragrance" width={40} height={40} className="object-cover" />
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h2 className="text-sm font-bold gold-text tracking-wider">SHRI FRAGRANCE</h2>
                <p className="text-[10px] text-temple-cream/40 tracking-widest uppercase">My Account</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Mini Profile */}
        {!sidebarCollapsed && (
          <motion.div
            className="p-4 border-b border-temple-gold/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-temple-gold/40 flex-shrink-0">
                <AvatarFallback className="bg-temple-gold/20 text-temple-gold text-sm font-bold">{userData.avatar}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex flex-col justify-center">
                <p className="text-sm font-semibold text-temple-cream truncate leading-tight">{userData.name}</p>
                <Badge className="bg-temple-gold/20 text-temple-amber border-temple-gold/30 text-[9px] px-1.5 py-0 mt-1 w-fit">
                  <Crown className="h-2.5 w-2.5 mr-0.5" />{userData.membership}
                </Badge>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-0.5 px-3">
            {navItems.map((item, i) => (
              <motion.button
                key={item.label}
                custom={i}
                variants={sidebarItemVariants}
                initial="hidden"
                animate="visible"
                onClick={() => setActiveNav(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative h-10 ${
                  activeNav === item.label
                    ? 'bg-temple-gold/20 text-temple-gold shadow-lg shadow-temple-gold/10'
                    : 'text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream'
                }`}
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeNav === item.label && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-temple-gold rounded-r-full"
                    layoutId="userActiveNav"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="h-5 w-5 flex-shrink-0 translate-y-[0.5px]" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!sidebarCollapsed && item.label === 'Wishlist' && (
                  <Badge className="ml-auto bg-temple-deep/80 text-white text-[9px] px-1.5 py-0 min-w-[18px] h-[18px]">
                    {userData.wishlistCount}
                  </Badge>
                )}
              </motion.button>
            ))}
          </nav>
        </ScrollArea>

        {/* Back to Store */}
        <div className="p-3 border-t border-temple-gold/15">
          <motion.div custom={6} variants={sidebarItemVariants} initial="hidden" animate="visible">
            <Link href="/">
              <motion.button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg h-10 text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream transition-all"
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      Back to Store
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-temple-gold text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-temple-cream z-50"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ArrowLeft className="h-3 w-3" />}
        </button>
      </motion.aside>

      {/* ====== MOBILE HEADER ====== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-temple-cream/100 border-b border-temple-gold/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-temple-gold">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="object-cover" />
          </div>
          <h2 className="text-sm font-bold gold-text tracking-wider">MY ACCOUNT</h2>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="text-xs gap-1 border-temple-gold/30">
            <ArrowLeft className="h-3 w-3" />Store
          </Button>
        </Link>
      </div>

      {/* ====== MAIN CONTENT ====== */}
      <main className={`flex-1 transition-all duration-300 will-change-[margin-left] ${sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}>
        {/* Profile Header */}
        <motion.header
          ref={profileRef}
          className="relative overflow-hidden border-b border-temple-gold/20"
          initial={{ opacity: 0, y: -30 }}
          animate={profileInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="absolute inset-0 royal-gradient opacity-90" />
          <div className="absolute inset-0 rangoli-dots opacity-[0.04]" />
          <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pt-20 md:pt-10">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <motion.div
                className="relative"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={profileInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-temple-gold divine-glow flex items-center justify-center bg-temple-gold/20 flex-shrink-0">
                  <span className="text-2xl sm:text-3xl font-bold text-temple-gold">{userData.avatar}</span>
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 bg-temple-amber text-temple-maroon rounded-full px-2 py-0.5 text-[9px] font-bold border-2 border-temple-maroon"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  GOLD
                </motion.div>
              </motion.div>

              {/* Greeting & Info */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <motion.h1
                  className="text-2xl sm:text-3xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={profileInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  Namaste, {userData.name.split(' ')[0]}! <span className="inline-block animate-bounce">🙏</span>
                </motion.h1>
                <motion.p
                  className="text-temple-cream/60 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={profileInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  {userData.email} · Member since {userData.memberSince}
                </motion.p>
                <motion.div
                  className="flex items-center gap-3 mt-3 justify-center sm:justify-start flex-wrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={profileInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <Badge className="bg-temple-gold/20 text-temple-amber border-temple-gold/30 text-xs">
                    <Crown className="h-3 w-3 mr-1" />{userData.membership}
                  </Badge>
                  <Badge className="bg-temple-amber/20 text-temple-amber border-temple-amber/30 text-xs">
                    <Flame className="h-3 w-3 mr-1" />{userData.points.toLocaleString('en-IN')} Points
                  </Badge>
                </motion.div>
              </div>

              {/* Quick Stats */}
              <motion.div
                className="flex sm:flex-col gap-3"
                variants={staggerContainer}
                initial="hidden"
                animate={profileInView ? 'visible' : 'hidden'}
              >
                {[
                  { label: 'Orders', value: userData.totalOrders, icon: ShoppingBag },
                  { label: 'Wishlist', value: userData.wishlistCount, icon: Heart },
                  { label: 'Rewards', value: `₹${userData.rewardsValue}`, icon: Gift },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={staggerItem}
                    className="flex items-center gap-2 sm:flex-col sm:items-center bg-temple-gold/10 rounded-lg px-3 py-2 sm:px-5 sm:py-3 min-w-[80px] sm:min-w-[90px] min-h-[60px] sm:min-h-[68px]"
                    whileHover={{ scale: 1.08, backgroundColor: 'rgba(197,151,46,0.2)' }}
                  >
                    <stat.icon className="h-4 w-4 text-temple-gold flex-shrink-0" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-white leading-tight">{stat.value}</p>
                      <p className="text-[9px] text-temple-cream/50 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* ====== RECENT ORDERS ====== */}
          <motion.div ref={ordersRef}>
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={ordersInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold flex items-center gap-2 leading-none self-center">
                <ShoppingBag className="h-5 w-5 text-temple-gold" />
                My <span className="gold-text">Orders</span>
              </h2>
              <Button variant="outline" size="sm" className="text-xs border-temple-gold/30 hover:bg-temple-gold/10">
                View All <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </motion.div>

            <div className="space-y-4">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={ordersInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -3, boxShadow: '0 15px 40px rgba(197,151,46,0.15)' }}
                >
                  <Card className="border-temple-gold/20 bg-white overflow-hidden cursor-default">
                    <CardContent className="p-4 sm:p-5">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono font-bold text-temple-deep">{order.id}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium ${
                              order.status === 'Delivered'
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : order.status === 'Shipped'
                                ? 'bg-blue-50 text-blue-600 border-blue-200'
                                : 'bg-amber-50 text-amber-600 border-amber-200'
                            }`}
                          >
                            <CircleDot className="h-2.5 w-2.5 mr-1" />
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />{order.date}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-temple-gold/15 flex-shrink-0 bg-temple-cream">
                              <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                            </div>
                            <span className="text-sm font-semibold whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status Timeline */}
                      <div className="mb-3">
                        <OrderStatusStep step={order.statusStep} />
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-temple-gold/10">
                        <span className="text-base font-bold">Total: ₹{order.total.toLocaleString('en-IN')}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-xs border-temple-gold/30 hover:bg-temple-gold/10 h-8">
                            <Truck className="h-3 w-3 mr-1" />Track
                          </Button>
                          <Button size="sm" className="text-xs bg-temple-gold hover:bg-temple-brass text-white h-8">
                            <Sparkles className="h-3 w-3 mr-1" />Reorder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <TempleDivider />

          {/* ====== SPENDING ANALYTICS + ORDER STATUS ====== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              ref={analyticsRef}
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 40 }}
              animate={analyticsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card className="border-temple-gold/20 bg-white overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-temple-gold" />
                        Spending Analytics
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Your monthly spending overview</p>
                    </div>
                    <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />6 Months
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 rounded-lg bg-temple-gold/5">
                      <p className="text-lg font-bold text-temple-deep">
                        <AnimatedCounter target={userData.totalSpent} prefix="₹" />
                      </p>
                      <p className="text-[10px] text-muted-foreground">Total Spent</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-temple-saffron/5">
                      <p className="text-lg font-bold text-temple-deep">₹{userData.avgOrder}</p>
                      <p className="text-[10px] text-muted-foreground">Avg Order</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-temple-deep/5">
                      <p className="text-sm font-bold text-temple-deep leading-tight">{userData.favoriteCategory}</p>
                      <p className="text-[10px] text-muted-foreground">Top Category</p>
                    </div>
                  </div>
                  <div className="h-[200px] sm:h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlySpending} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C5972E" stopOpacity={0.4} />
                            <stop offset="50%" stopColor="#D4722A" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#D4722A" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E0C98A" strokeOpacity={0.3} />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8B6914' }} axisLine={{ stroke: '#E0C98A' }} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#8B6914' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="amount" stroke="#C5972E" strokeWidth={2.5} fill="url(#spendGradient)" animationDuration={1500} animationEasing="ease-out" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Status Overview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={analyticsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card className="border-temple-gold/20 bg-white h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-temple-gold" />
                    Order Status
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Overview of all your orders</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 mt-2">
                    {orderStatusCounts.map((status, i) => (
                      <motion.div
                        key={status.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={analyticsInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
                            <span className="text-sm font-medium">{status.label}</span>
                          </div>
                          <span className="text-sm font-bold">{status.count}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-temple-gold/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: status.color }}
                            initial={{ width: 0 }}
                            animate={analyticsInView ? { width: `${(status.count / userData.totalOrders) * 100}%` } : { width: 0 }}
                            transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Separator className="my-4 bg-temple-gold/15" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-temple-deep">{userData.totalOrders}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Orders</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <TempleDivider />

          {/* ====== WISHLIST ====== */}
          <motion.div ref={wishlistRef}>
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={wishlistInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Heart className="h-5 w-5 text-temple-gold" />
                My <span className="gold-text">Wishlist</span>
              </h2>
              <Badge className="bg-temple-deep/10 text-temple-deep border-temple-deep/20 text-xs">
                {userData.wishlistCount} items
              </Badge>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlistItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  animate={wishlistInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(197,151,46,0.2)' }}
                >
                  <Card className="border-temple-gold/20 bg-white overflow-hidden group flex flex-col">
                    <div className="relative aspect-square overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      <motion.div
                        className="absolute top-3 right-3"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white/90 border-0 shadow-md hover:bg-red-50">
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </motion.div>
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Badge className="bg-red-500/90 text-white text-xs">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-sm group-hover:text-temple-gold transition-colors">{item.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-bold">₹{item.price}</span>
                        <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</span>
                        <Badge className="bg-temple-saffron/10 text-temple-saffron border-0 text-[10px] px-1.5">
                          {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        className={`w-full mt-auto pt-3 text-xs ${
                          item.inStock
                            ? 'bg-temple-gold hover:bg-temple-brass text-white'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        disabled={!item.inStock}
                      >
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <TempleDivider />

          {/* ====== REWARDS & LOYALTY ====== */}
          <motion.div ref={rewardsRef}>
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={rewardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-temple-gold" />
                Rewards & <span className="gold-text">Loyalty</span>
              </h2>
              <Badge className="bg-temple-amber/20 text-temple-amber border-temple-amber/30 text-xs">
                <Flame className="h-3 w-3 mr-1" />{userData.points.toLocaleString('en-IN')} pts
              </Badge>
            </motion.div>

            {/* Points Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={rewardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="border-temple-gold/20 bg-white mb-6 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-temple-gold" />
                      <span className="font-semibold">Temple Gold Member</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-temple-gold">{userData.points.toLocaleString('en-IN')}</span>
                      <span className="text-muted-foreground">/ {userData.nextTierPoints.toLocaleString('en-IN')} pts</span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full bg-temple-gold/10 overflow-hidden mb-2">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-temple-gold via-temple-amber to-temple-saffron"
                      initial={{ width: 0 }}
                      animate={rewardsInView ? { width: `${(userData.points / userData.nextTierPoints) * 100}%` } : { width: 0 }}
                      transition={{ delay: 0.3, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Current: Temple Gold</span>
                    <span>Next: Temple Diamond ({userData.nextTierPoints - userData.points} pts away)</span>
                  </div>
                  <Separator className="my-3 bg-temple-gold/10" />
                  <div className="flex flex-wrap gap-3">
                    {['Free shipping on all orders', 'Early access to new fragrances', '10% off on festive collections', 'Priority customer support'].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="h-3 w-3 text-temple-gold" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Available Rewards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rewards.map((reward, i) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={rewardsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(197,151,46,0.2)' }}
                >
                  <Card className="border-temple-gold/20 bg-white overflow-hidden relative flex flex-col">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-temple-gold via-temple-amber to-temple-saffron" />
                    <CardContent className="p-4 pt-5 flex flex-col flex-1">
                      <motion.div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${reward.color} text-white flex items-center justify-center mb-3 shadow-md`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <reward.icon className="h-5 w-5" />
                      </motion.div>
                      <h3 className="font-semibold text-sm mb-1">{reward.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{reward.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 text-xs">
                          <Flame className="h-2.5 w-2.5 mr-0.5" />{reward.points} pts
                        </Badge>
                        <Button
                          size="sm"
                          className={`text-[10px] h-7 ${
                            userData.points >= reward.points
                              ? 'bg-temple-gold hover:bg-temple-brass text-white'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                          disabled={userData.points < reward.points}
                        >
                          {userData.points >= reward.points ? 'Redeem' : 'Not Enough'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <TempleDivider />

          {/* ====== SAVED ADDRESSES ====== */}
          <motion.div ref={addressesRef}>
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={addressesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-temple-gold" />
                Saved <span className="gold-text">Addresses</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addresses.map((addr, i) => (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={addressesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(197,151,46,0.15)' }}
                >
                  <Card className={`border-temple-gold/20 bg-white overflow-hidden relative ${addr.isDefault ? 'ring-1 ring-temple-gold/30' : ''}`}>
                    {addr.isDefault && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-temple-gold to-temple-saffron" />
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPinned className="h-4 w-4 text-temple-gold" />
                          <span className="font-semibold text-sm">{addr.label}</span>
                          {addr.isDefault && (
                            <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 text-[9px] px-1.5">Default</Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-temple-gold">
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <p className="font-medium text-foreground">{addr.name}</p>
                        <p>{addr.line1}</p>
                        <p>{addr.line2} - {addr.pincode}</p>
                        <p className="flex items-center gap-1 mt-1"><Copy className="h-3 w-3" />{addr.phone}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Add New Address Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={addressesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(197,151,46,0.1)' }}
              >
                <Card className="border-2 border-dashed border-temple-gold/30 bg-transparent hover:bg-temple-gold/5 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[180px]">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-temple-gold/10 flex items-center justify-center mb-3"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      transition={{ type: 'spring' }}
                    >
                      <Plus className="h-5 w-5 text-temple-gold" />
                    </motion.div>
                    <p className="font-semibold text-sm text-temple-gold">Add New Address</p>
                    <p className="text-xs text-muted-foreground mt-1">Save a new delivery location</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom spacer */}
          <div className="h-8" />
        </div>
      </main>
    </div>
  )
}
