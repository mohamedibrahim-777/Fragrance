'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  motion, useScroll, useTransform, useInView, AnimatePresence,
  useSpring, useMotionValue
} from 'framer-motion'
import {
  Flame, ShoppingCart, Heart, Star, Search, Menu, X, Minus, Plus,
  MapPin, Phone, Mail, Clock, ChevronRight, Truck, Shield, Award,
  Sparkles, Lamp, Flower2, Sun, Eye, Share2, Check, ArrowUp,
  Gem, FlameKindling, CircleDot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'

// ====== DATA ======
const products = [
  { id: 1, name: "Chandanam Sandalwood", subtitle: "Premium Hand-Rolled Agarbathi", price: 349, originalPrice: 499, rating: 4.9, reviews: 2847, image: "/images/product1.png", category: "premium", fragrance: "Sandalwood", description: "Hand-rolled with pure Mysore sandalwood powder and natural herbs. Each stick burns for 45 minutes, filling your pooja room with divine fragrance.", badge: "Bestseller" },
  { id: 2, name: "Malligai Jasmine", subtitle: "Temple Fresh Mogra Incense", price: 249, originalPrice: 399, rating: 4.8, reviews: 1923, image: "/images/product2.png", category: "floral", fragrance: "Jasmine", description: "Crafted with fresh Madurai jasmine extracts and traditional South Indian herbs. Perfect for evening pooja and meditation.", badge: "New" },
  { id: 3, name: "Nag Champa Classic", subtitle: "Sacred Temple Incense", price: 299, originalPrice: 449, rating: 4.9, reviews: 3541, image: "/images/product3.png", category: "classic", fragrance: "Nag Champa", description: "The timeless fragrance of South Indian temples. Made with pure champa flower extract and sandalwood base for an authentic divine experience.", badge: "Divine" },
  { id: 4, name: "Roja Camphor Blend", subtitle: "Pooja Rose & Kapur Mix", price: 279, originalPrice: 399, rating: 4.7, reviews: 1562, image: "/images/product4.png", category: "premium", fragrance: "Rose & Camphor", description: "A divine blend of Indian rose petals and pure camphor. Traditionally used in temple archana and special pooja ceremonies.", badge: "Sacred" },
  { id: 5, name: "Sambrani Herbal", subtitle: "Traditional Benzoin Resin", price: 399, originalPrice: 549, rating: 4.8, reviews: 1205, image: "/images/product5.png", category: "herbal", fragrance: "Sambrani", description: "Pure sambrani resin blended with 21 sacred herbs as per traditional Ayurvedic formulations. Ideal for homam and special poojas.", badge: "Herbal" },
  { id: 6, name: "Khus Vetiver Classic", subtitle: "Cooling Temple Incense", price: 269, originalPrice: 399, rating: 4.7, reviews: 987, image: "/images/product6.png", category: "herbal", fragrance: "Vetiver & Patchouli", description: "Cool vetiver root combined with earthy patchouli, traditionally used in South Indian temples during summer months.", badge: "Cooling" },
]

const categories = [
  { id: 'all', name: 'All', icon: Sparkles },
  { id: 'premium', name: 'Premium', icon: Gem },
  { id: 'floral', name: 'Floral', icon: Flower2 },
  { id: 'classic', name: 'Classic', icon: Lamp },
  { id: 'herbal', name: 'Herbal', icon: Sun },
]

const testimonials = [
  { name: "Priya Venkatesh", location: "Chennai, Tamil Nadu", text: "The Chandanam Sandalwood agarbathi reminds me exactly of the Tirupati temple. The fragrance is pure and lingers beautifully during our morning pooja.", rating: 5, avatar: "PV" },
  { name: "Lakshmi Raman", location: "Bangalore, Karnataka", text: "Shri Fragrance's Nag Champa is the most authentic. It transforms my pooja room into a sacred temple space.", rating: 5, avatar: "LR" },
  { name: "Meenakshi Iyer", location: "Madurai, Tamil Nadu", text: "The Malligai Jasmine fragrance is like offering fresh flowers to the deity every day. Truly divine quality that our family trusts.", rating: 5, avatar: "MI" },
]

const marqueeItems = ["🙏 Free Pooja Guide with Every Order", "🪔 Handcrafted by Temple Artisans", "✨ 100% Natural Ingredients", "🔥 Free Delivery Above ₹499", "🙏 Temple Blessed Fragrances", "🪔 75+ Years of Heritage", "✨ 50+ Sacred Scents", "🔥 Premium Quality Guarantee"]

interface CartItem { productId: number; quantity: number }

// ====== MOTION VARIANTS ======
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
}

const staggerItem = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const heroLetterVariant = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { delay: i * 0.05, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

// ====== MANDALA SVG ======
function MandalaDecor({ className = '', size = 200 }: { className?: string; size?: number }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 200 200" className={className}
      animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
      <circle cx="100" cy="100" r="95" fill="none" stroke="#C5972E" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#C5972E" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="#C5972E" strokeWidth="0.5" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
        <line key={a} x1="100" y1="5" x2="100" y2="195" transform={`rotate(${a} 100 100)`} stroke="#C5972E" strokeWidth="0.3" />
      ))}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <g key={`p-${a}`} transform={`rotate(${a} 100 100)`}>
          <ellipse cx="100" cy="40" rx="12" ry="25" fill="none" stroke="#D4722A" strokeWidth="0.5" />
        </g>
      ))}
    </motion.svg>
  )
}

// ====== FLOATING PARTICLES (Motion) ======
function FloatingParticles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i, left: `${5 + Math.random() * 90}%`,
    size: 3 + Math.random() * 5,
    duration: 10 + Math.random() * 15,
    delay: Math.random() * 8,
    color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#C5972E' : '#D4722A',
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id}
          className="absolute rounded-full"
          style={{ left: p.left, width: p.size, height: p.size, backgroundColor: p.color }}
          animate={{ y: [800, -100], opacity: [0, 1, 1, 0], scale: [0.5, 1, 0.8] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  )
}

// ====== INCENSE SMOKE (Motion) ======
function IncenseSmoke({ count = 4 }: { count?: number }) {
  return (
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none flex gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} className="w-3 h-3 rounded-full bg-white/10 blur-sm"
          animate={{ y: [-5, -60], x: [0, (i - count / 2) * 8], opacity: [0.6, 0], scale: [0.8, 2] }}
          transition={{ duration: 2.5 + i * 0.3, delay: i * 0.6, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

// ====== ANIMATED COUNTER ======
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
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

  return <span ref={ref}>{count}{suffix}</span>
}

// ====== DIYA FLICKER ======
function DiyaFlame() {
  return (
    <motion.div className="relative inline-flex items-center justify-center">
      <motion.div className="absolute w-3 h-3 rounded-full bg-temple-amber/40 blur-sm"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="w-2 h-2 rounded-full bg-temple-amber"
        animate={{ scale: [1, 1.2, 0.9, 1.1, 1], opacity: [1, 0.85, 1, 0.9, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

// ====== SCROLL PROGRESS BAR ======
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div className="fixed top-0 left-0 right-0 h-1 bg-temple-gold origin-left z-[60]"
      style={{ scaleX }}
    />
  )
}

// ====== PARALLAX SECTION WRAPPER ======
function ParallaxSection({ children, className = '', speed = 0.3 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -200])

  return (
    <motion.section ref={ref} className={className} style={{ y }}>
      {children}
    </motion.section>
  )
}

// ====== MAIN PAGE ======
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()
  const productsRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Parallax for hero
  const { scrollYProgress: heroScrollProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0])

  // Scroll to top visibility
  const [showScrollTop, setShowScrollTop] = useState(false)
  useEffect(() => {
    const h = () => setShowScrollTop(window.scrollY > 500)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Header scroll state
  const [headerScrolled, setHeaderScrolled] = useState(false)
  useEffect(() => {
    const h = () => setHeaderScrolled(window.scrollY > 80)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const addToCart = useCallback((productId: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === productId)
      if (existing) return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
      return [...prev, { productId, quantity: 1 }]
    })
    toast({ title: "Added to Cart", description: "Sacred fragrance added to your collection" })
  }, [toast])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId))
  }, [])

  const updateCartQuantity = useCallback((productId: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.productId === productId) { const n = item.quantity + delta; return n > 0 ? { ...item, quantity: n } : item }
      return item
    }))
  }, [])

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId])
  }, [])

  const cartTotal = cartItems.reduce((total, item) => { const p = products.find(pr => pr.id === item.productId); return total + (p?.price || 0) * item.quantity }, 0)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const filteredProducts = products.filter(p => {
    const mc = activeCategory === 'all' || p.category === activeCategory
    const ms = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.fragrance.toLowerCase().includes(searchQuery.toLowerCase())
    return mc && ms
  })

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: 'smooth' })

  // Split text for letter animation
  const brandName = "Shri Fragrance"
  const brandLetters = brandName.split('')

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <ScrollProgress />
      <div className="temple-divider-ornate w-full" />

      {/* ====== HEADER ====== */}
      <motion.header
        className={`sticky top-0 z-50 transition-colors duration-300 border-b ${
          headerScrolled ? 'bg-background/98 backdrop-blur-lg shadow-lg shadow-temple-gold/5 border-temple-gold/30' : 'bg-background/95 backdrop-blur-md border-border'
        }`}
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <motion.div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-temple-gold"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(197,151,46,0.6)" }} transition={{ type: "spring", stiffness: 300 }}>
                <Image src="/images/logo.png" alt="Shri Fragrance Logo" fill className="object-cover" />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold gold-text tracking-wider">SHRI FRAGRANCE</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground -mt-1 tracking-[0.25em] uppercase">Sacred Temple Agarbathi</p>
              </div>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              {['Home', 'Collections', 'About', 'Pooja Guide', 'Contact'].map((item, i) => (
                <motion.button key={item}
                  onClick={item === 'Collections' ? scrollToProducts : undefined}
                  className="text-sm font-medium text-foreground/80 hover:text-temple-gold transition-colors relative group"
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <motion.span className="absolute -bottom-1 left-0 h-0.5 bg-temple-gold rounded-full"
                    initial={{ width: 0 }} whileHover={{ width: "100%" }} transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </nav>

            <motion.div className="flex items-center gap-2 sm:gap-4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="hidden sm:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search fragrances..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48 lg:w-64 bg-secondary/50 border-temple-gold/20 focus:border-temple-gold" />
              </div>
              <motion.button className="relative p-2 rounded-full hover:bg-temple-gold/10 transition-colors" onClick={() => setCartOpen(true)}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingCart className="h-5 w-5 text-foreground" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motionBadge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-temple-deep text-white text-xs rounded-full"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
                      {cartCount}
                    </motionBadge>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button className="md:hidden p-2 rounded-full hover:bg-temple-gold/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div className="md:hidden border-t border-border bg-background overflow-hidden"
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="px-4 py-4 space-y-2">
                <div className="flex items-center relative mb-3">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search fragrances..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary/50 border-temple-gold/30" />
                </div>
                {['Home', 'Collections', 'About', 'Pooja Guide', 'Contact'].map((item, i) => (
                  <motion.button key={item} onClick={() => { if (item === 'Collections') scrollToProducts(); setMobileMenuOpen(false) }}
                    className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-temple-gold/10 hover:text-temple-gold transition-colors"
                    initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}>
                    <ChevronRight className="h-4 w-4 inline mr-2" />{item}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1">
        {/* ====== HERO SECTION ====== */}
        <section ref={heroRef} className="relative overflow-hidden min-h-[90vh] flex items-center">
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <Image src="/images/hero-bg.png" alt="South Indian Temple" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-temple-maroon/95 via-temple-deep/85 to-temple-maroon/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-temple-maroon/50 via-transparent to-transparent" />
          </motion.div>

          <FloatingParticles />

          <div className="absolute right-[-5%] top-[10%] opacity-[0.06] pointer-events-none">
            <MandalaDecor size={500} />
          </div>

          <motion.div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 w-full" style={{ opacity: heroOpacity }}>
            <div className="max-w-2xl">
              {/* Ornamental Top */}
              <motion.div className="flex items-center gap-3 mb-6" variants={fadeInDown} initial="hidden" animate="visible">
                <div className="h-px w-8 bg-temple-gold/60" />
                <div className="flex items-center gap-2">
                  <DiyaFlame />
                  <span className="text-temple-gold text-xs sm:text-sm tracking-[0.3em] font-medium uppercase">Sacred Fragrances Since 1948</span>
                  <DiyaFlame />
                </div>
                <div className="h-px w-8 bg-temple-gold/60" />
              </motion.div>

              {/* Animated Title - Letter by Letter */}
              <motion.h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
                <motion.span className="block" variants={fadeInUp} initial="hidden" animate="visible">
                  {brandLetters.map((letter, i) => (
                    <motion.span key={i} custom={i} variants={heroLetterVariant} initial="hidden" animate="visible"
                      className={letter === ' ' ? 'inline-block w-4' : 'inline-block'}
                      style={i < 4 ? {} : { background: 'linear-gradient(135deg, #C5972E, #FFD700, #FFBF00, #FFD700, #C5972E)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                      {letter === ' ' ? '\u00A0' : i < 4 ? letter : letter}
                    </motion.span>
                  ))}
                </motion.span>
                <motion.span className="block text-lg sm:text-xl font-normal text-temple-cream/70 mt-3 tracking-wide"
                  variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
                  From Sacred Temples to Your Home
                </motion.span>
              </motion.h1>

              {/* Subtitle with smoke */}
              <motion.div className="relative mb-8" variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 1 }}>
                <IncenseSmoke />
                <p className="text-base sm:text-lg text-temple-cream/80 max-w-xl leading-relaxed">
                  Handcrafted with pure ingredients and blessed traditions, our agarbathi carries
                  the sacred fragrance of South Indian temples into your home.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 1.2 }}>
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(212,114,42,0.4)" }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" onClick={scrollToProducts}
                    className="saffron-gradient-animated text-white font-semibold text-base px-8 py-6 shadow-lg">
                    <Flame className="mr-2 h-5 w-5" />Explore Collection
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="outline"
                    className="border-temple-gold/50 text-temple-gold hover:bg-temple-gold/10 font-semibold text-base px-8 py-6">
                    <Sparkles className="mr-2 h-5 w-5" />Pooja Essentials
                  </Button>
                </motion.div>
              </motion.div>

              {/* Animated Stats */}
              <motion.div className="flex gap-8 sm:gap-12 mt-12" variants={staggerContainer} initial="hidden" animate="visible">
                {[
                  { label: 'Sacred Fragrances', value: 50, suffix: '+', icon: Flame },
                  { label: 'Years of Tradition', value: 75, suffix: '+', icon: Award },
                  { label: 'Happy Families', value: 10, suffix: 'K+', icon: Heart },
                ].map((stat) => (
                  <motion.div key={stat.label} className="group cursor-default" variants={staggerItem} whileHover={{ scale: 1.1 }}>
                    <stat.icon className="h-4 w-4 text-temple-gold/50 mb-1" />
                    <p className="text-2xl sm:text-3xl font-bold text-temple-gold">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-[10px] sm:text-xs text-temple-cream/50">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" className="w-full h-auto" preserveAspectRatio="none">
              <path d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1380,40 1440,60 L1440,100 L0,100 Z" fill="#FFF8E7" />
            </svg>
          </div>
        </section>

        {/* ====== MARQUEE STRIP ====== */}
        <div className="py-3 bg-temple-deep overflow-hidden">
          <motion.div className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="inline-block mx-8 text-temple-cream/80 text-sm font-medium">{item}</span>
            ))}
          </motion.div>
        </div>

        {/* ====== TRUST BADGES ====== */}
        <motion.section className="py-10 border-b border-border/50"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Truck, title: 'Free Delivery', desc: 'Orders above ₹499' },
                { icon: Shield, title: '100% Natural', desc: 'Pure ingredients only' },
                { icon: Award, title: 'Temple Trusted', desc: 'Used in 500+ temples' },
                { icon: FlameKindling, title: 'Handcrafted', desc: 'Traditional methods' },
              ].map((badge) => (
                <motion.div key={badge.title} variants={staggerItem}
                  whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(197,151,46,0.15)" }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-temple-gold/5 to-temple-saffron/5 border border-temple-gold/10 cursor-default group">
                  <motion.div className="p-2.5 rounded-lg bg-temple-gold/10" whileHover={{ rotate: 5, scale: 1.1 }}>
                    <badge.icon className="h-5 w-5 text-temple-gold" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-sm">{badge.title}</p>
                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ====== PRODUCTS SECTION ====== */}
        <section ref={productsRef} className="py-14 sm:py-20 scroll-mt-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <MandalaDecor size={800} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div className="text-center mb-12" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-temple-gold" />
                <DiyaFlame />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-temple-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Our Sacred <span className="gold-text">Collections</span></h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">Handpicked fragrances crafted with devotion</p>
            </motion.div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-10">
              <TabsList className="w-full sm:w-auto bg-secondary/30 border border-temple-gold/20 p-1 h-auto">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id}
                    className="data-[state=active]:bg-temple-gold data-[state=active]:text-white gap-1.5 text-xs sm:text-sm px-4 py-2 transition-all">
                    <cat.icon className="h-3.5 w-3.5" />{cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} layout variants={staggerItem}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}>
                    <motion.div whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(197,151,46,0.2)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="overflow-hidden rounded-xl border border-border/40 bg-card group">
                      <div className="relative overflow-hidden">
                        <motion.div className="aspect-square relative"
                          whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </motion.div>
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <Badge className="bg-temple-deep/90 text-white text-xs font-medium shadow-md backdrop-blur-sm">
                            <Sparkles className="h-3 w-3 mr-1" />{product.badge}
                          </Badge>
                          {product.originalPrice > product.price && (
                            <Badge className="bg-temple-saffron/90 text-white text-xs shadow-md">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                        <motion.div className="absolute top-3 right-3 flex flex-col gap-2"
                          initial={{ x: 20, opacity: 0 }} whileHover={{ x: 0, opacity: 1 }}
                          style={{ x: 20, opacity: 0 }}>
                          <div className="group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 opacity-0 transition-all duration-300 flex flex-col gap-2">
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                              className="h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-temple-gold hover:text-white transition-colors"
                              onClick={() => toggleWishlist(product.id)}>
                              <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                              className="h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-temple-gold hover:text-white transition-colors"
                              onClick={() => { setSelectedProduct(product); setProductDialogOpen(true) }}>
                              <Eye className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>

                      <CardContent className="p-5">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-temple-gold text-temple-gold' : 'text-muted-foreground/20'}`} />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">{product.rating} ({product.reviews.toLocaleString()})</span>
                        </div>
                        <h3 className="font-bold text-lg group-hover:text-temple-gold transition-colors">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                        <p className="text-xs text-temple-saffron mt-1.5 font-medium flex items-center gap-1">
                          <Flower2 className="h-3 w-3" />{product.fragrance} Fragrance
                        </p>
                      </CardContent>

                      <CardFooter className="p-5 pt-0 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold">₹{product.price}</span>
                          {product.originalPrice > product.price && <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>}
                        </div>
                        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={() => addToCart(product.id)} size="sm"
                            className="bg-temple-gold hover:bg-temple-brass text-white font-medium gap-2">
                            <ShoppingCart className="h-4 w-4" />Add
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Flower2 className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                </motion.div>
                <p className="text-xl text-muted-foreground">No fragrances found</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Divider */}
        <motion.div className="flex items-center justify-center gap-4 py-2"
          initial={{ opacity: 0, scaleX: 0.5 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }}>
          <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-temple-gold/50" />
          <div className="flex gap-1">
            {[1.5, 2, 3, 2, 1.5].map((s, i) => (
              <motion.div key={i}
                className={`rounded-full ${i === 2 ? 'bg-temple-deep' : i % 2 === 0 ? 'bg-temple-gold' : 'bg-temple-saffron'}`}
                style={{ width: s * 4, height: s * 4 }}
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.1, type: "spring" }} />
            ))}
          </div>
          <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-temple-gold/50" />
        </motion.div>

        {/* ====== SPECIAL OFFER ====== */}
        <motion.section className="py-14 sm:py-20 relative overflow-hidden"
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="absolute inset-0 royal-gradient" />
          <div className="absolute inset-0 rangoli-dots opacity-[0.03]" />
          <FloatingParticles />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <motion.div className="flex-1 text-center lg:text-left" variants={fadeInLeft}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring" }}>
                  <Badge className="bg-temple-amber text-temple-maroon font-semibold mb-5 text-sm px-4 py-1.5 inline-flex">
                    <Flame className="h-4 w-4 mr-1.5" />Pooja Special Offer
                  </Badge>
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
                  Complete Pooja Collection
                  <span className="block gold-text text-2xl sm:text-3xl mt-2">Save 40% This Festive Season</span>
                </h2>
                <p className="text-temple-cream/70 mb-8 max-w-lg leading-relaxed">
                  Get our entire collection of 6 sacred fragrances with a traditional brass incense holder.
                </p>
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(212,114,42,0.4)" }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="saffron-gradient-animated text-white font-semibold shadow-lg text-base px-8 py-6">
                    <Flame className="mr-2 h-5 w-5" />Shop Pooja Set - ₹1,499
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div className="relative w-64 h-64 sm:w-80 sm:h-80 flex-shrink-0" variants={fadeInRight}>
                <motion.div className="absolute inset-0 rounded-full border-2 border-temple-gold/20"
                  animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
                <motion.div className="absolute inset-3 rounded-full border border-temple-gold/15"
                  animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
                <motion.div className="absolute inset-6 rounded-full border-2 border-dashed border-temple-amber/20"
                  animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                <motion.div className="absolute inset-0 rounded-full"
                  animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="absolute inset-8 rounded-full bg-temple-gold/10 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl sm:text-7xl font-black gold-text">40%</span>
                      <p className="text-temple-cream/80 font-bold text-sm mt-1 tracking-widest">FESTIVE OFF</p>
                    </div>
                  </div>
                </motion.div>
                {[0, 90, 180, 270].map((deg) => (
                  <motion.div key={deg} className="absolute w-3 h-3 rounded-full bg-temple-amber"
                    style={{ top: `${50 + 48 * Math.sin((deg * Math.PI) / 180)}%`, left: `${50 + 48 * Math.cos((deg * Math.PI) / 180)}%`, transform: 'translate(-50%, -50%)' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, delay: deg / 360, repeat: Infinity }} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ====== ABOUT SECTION ====== */}
        <motion.section className="py-14 sm:py-20 relative"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
              <motion.div className="flex-1 relative" variants={fadeInLeft}>
                <motion.div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden gopuram-shadow"
                  whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
                  <Image src="/images/about-bg.png" alt="Temple Heritage" fill className="object-cover" />
                </motion.div>
                <motion.div className="absolute -bottom-5 -right-5 bg-temple-gold text-white p-5 rounded-xl shadow-xl"
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <p className="text-3xl font-black">75+</p>
                  <p className="text-xs font-semibold tracking-wide">Years of Heritage</p>
                </motion.div>
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-temple-gold/60 rounded-tl-lg" />
                <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-temple-gold/60 rounded-bl-lg" />
              </motion.div>

              <motion.div className="flex-1" variants={fadeInRight}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-10 bg-gradient-to-r from-temple-gold to-transparent" />
                  <span className="text-temple-gold text-sm tracking-[0.2em] uppercase font-semibold">Our Heritage</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-5">Rooted in <span className="gold-text">Temple Traditions</span></h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Shri Fragrance was born in the sacred corridors of South Indian temples, where the art of making
                  agarbathi has been passed down through generations of temple artisans. Our master craftsmen
                  continue the age-old tradition of hand-rolling each incense stick with pure sandalwood,
                  natural herbs, and divine devotion.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Every stick of Shri Fragrance is crafted using ingredients sourced directly from temple gardens
                  and Ayurvedic herb farms across Tamil Nadu, Karnataka, and Kerala.
                </p>
                <motion.div className="grid grid-cols-2 gap-4" variants={staggerContainer}>
                  {[
                    { icon: FlameKindling, title: 'Sacred Ingredients', desc: 'Temple-sourced pure materials' },
                    { icon: Award, title: 'Artisan Crafted', desc: 'Hand-rolled by temple artisans' },
                    { icon: Shield, title: 'No Chemicals', desc: '100% natural & organic' },
                    { icon: Lamp, title: 'Temple Blessed', desc: 'Blessed in consecrated temples' },
                  ].map((item) => (
                    <motion.div key={item.title} variants={staggerItem}
                      whileHover={{ x: 5, boxShadow: "0 5px 20px rgba(197,151,46,0.1)" }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-temple-gold/5 border border-temple-gold/10">
                      <item.icon className="h-4 w-4 text-temple-gold mt-0.5 flex-shrink-0" />
                      <div><p className="font-semibold text-sm">{item.title}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Divider */}
        <div className="temple-divider-ornate w-full max-w-4xl mx-auto" />

        {/* ====== TESTIMONIALS ====== */}
        <motion.section className="py-14 sm:py-20 bg-gradient-to-b from-secondary/10 to-transparent relative"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-temple-gold" />
                <DiyaFlame />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-temple-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Devotees <span className="gold-text">Speak</span></h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {testimonials.map((t, index) => (
                <motion.div key={index} variants={staggerItem}
                  whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(197,151,46,0.15)" }}
                  className="border border-temple-gold/10 bg-card rounded-xl p-7 transition-colors hover:border-temple-gold/30">
                  <div className="text-4xl text-temple-gold/15 font-serif leading-none mb-2">&ldquo;</div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-temple-gold text-temple-gold" />))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-5 italic">{t.text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-temple-gold/10">
                    <motion.div className="h-11 w-11 rounded-full saffron-gradient flex items-center justify-center text-white font-bold text-sm shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}>{t.avatar}</motion.div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ====== POOJA GUIDE CTA ====== */}
        <motion.section className="py-14 sm:py-20"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="temple-gradient rounded-3xl p-8 sm:p-14 text-center border border-temple-gold/20 gopuram-shadow relative overflow-hidden"
              whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}>
              <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none"><MandalaDecor size={250} /></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-5">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent to-temple-gold" />
                  <DiyaFlame />
                  <div className="h-px w-10 bg-gradient-to-l from-transparent to-temple-gold" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-5">The Sacred <span className="gold-text">Pooja Guide</span></h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                  Learn the traditional South Indian way of offering agarbathi during pooja, according to Agama Shastras.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="saffron-gradient-animated text-white font-semibold shadow-lg px-8 py-6 text-base">
                      <Sparkles className="mr-2 h-5 w-5" />Read Pooja Guide
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" variant="outline" className="border-temple-gold text-temple-gold hover:bg-temple-gold/10 px-8 py-6 text-base">
                      <Share2 className="mr-2 h-5 w-5" />Share with Family
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ====== NEWSLETTER ====== */}
        <motion.section className="py-14 sm:py-20 bg-gradient-to-b from-secondary/10 to-transparent"
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Receive Sacred <span className="gold-text">Blessings</span></h3>
              <p className="text-muted-foreground mb-8 text-sm">Join our family for exclusive offers, new fragrance launches, and festive pooja tips.</p>
              <motion.div className="flex gap-3 max-w-md mx-auto" whileHover={{ scale: 1.01 }}>
                <Input placeholder="Enter your email" className="bg-card border-temple-gold/20 focus:border-temple-gold h-12" />
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button className="bg-temple-gold hover:bg-temple-brass text-white font-semibold px-6 whitespace-nowrap h-12">Subscribe</Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ====== FOOTER ====== */}
      <motion.footer className="bg-temple-maroon text-temple-cream/80"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="temple-divider-ornate w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-temple-gold">
                  <Image src="/images/logo.png" alt="Shri Fragrance" fill className="object-cover" />
                </div>
                <div><h3 className="font-bold text-xl text-white tracking-wider">SHRI FRAGRANCE</h3><p className="text-[10px] text-temple-cream/40 tracking-[0.2em]">SACRED TEMPLE AGARBATHI</p></div>
              </div>
              <p className="text-sm text-temple-cream/50 leading-relaxed">Crafting divine fragrances since 1948, blessed by South Indian temple traditions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5">{['Our Collections', 'Pooja Essentials', 'Temple Specials', 'Gift Sets', 'Bulk Orders'].map((l) => (
                <li key={l}><button className="text-sm text-temple-cream/50 hover:text-temple-gold transition-colors flex items-center gap-1.5 group"><ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />{l}</button></li>
              ))}</ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-2.5">{['Shipping Info', 'Returns Policy', 'Track Order', 'FAQs', 'Privacy Policy'].map((l) => (
                <li key={l}><button className="text-sm text-temple-cream/50 hover:text-temple-gold transition-colors flex items-center gap-1.5 group"><ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />{l}</button></li>
              ))}</ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 text-temple-gold mt-0.5" /><span className="text-sm text-temple-cream/50">12 Temple Street, Mylapore, Chennai 600004</span></li>
                <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-temple-gold" /><span className="text-sm text-temple-cream/50">+91 44 2847 1234</span></li>
                <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-temple-gold" /><span className="text-sm text-temple-cream/50">namaste@shrifragrance.com</span></li>
                <li className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-temple-gold" /><span className="text-sm text-temple-cream/50">Mon-Sat: 6AM - 9PM</span></li>
              </ul>
            </div>
          </div>
          <Separator className="bg-temple-cream/8 mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-temple-cream/30">&copy; 2026 Shri Fragrance. All rights reserved.</p>
            <div className="flex items-center gap-3">{['Visa', 'Mastercard', 'UPI', 'GPay'].map((m) => (
              <span key={m} className="text-[10px] text-temple-cream/25 bg-temple-cream/5 px-2.5 py-1 rounded">{m}</span>
            ))}</div>
          </div>
        </div>
      </motion.footer>

      {/* ====== CART SHEET ====== */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-background">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-temple-gold" />Your Sacred Cart
              {cartCount > 0 && <Badge className="bg-temple-deep text-white">{cartCount}</Badge>}
            </SheetTitle>
          </SheetHeader>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Flower2 className="h-20 w-20 text-temple-gold/15" />
              </motion.div>
              <p className="text-muted-foreground font-semibold">Your cart is empty</p>
              <Button onClick={() => setCartOpen(false)} className="bg-temple-gold hover:bg-temple-brass text-white">Browse Collections</Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 h-[calc(100vh-280px)] mt-6">
                <div className="space-y-4 pr-4">
                  <AnimatePresence>
                    {cartItems.map((item) => {
                      const product = products.find(p => p.id === item.productId)
                      if (!product) return null
                      return (
                        <motion.div key={item.productId}
                          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50, height: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="flex gap-4 p-4 rounded-xl bg-secondary/20 border border-temple-gold/10">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                            <p className="text-xs text-muted-foreground">{product.fragrance}</p>
                            <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center gap-2">
                                <motion.button whileTap={{ scale: 0.85 }} className="h-7 w-7 rounded-md border border-temple-gold/20 flex items-center justify-center hover:bg-temple-gold/10" onClick={() => updateCartQuantity(item.productId, -1)}><Minus className="h-3 w-3" /></motion.button>
                                <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                <motion.button whileTap={{ scale: 0.85 }} className="h-7 w-7 rounded-md border border-temple-gold/20 flex items-center justify-center hover:bg-temple-gold/10" onClick={() => updateCartQuantity(item.productId, 1)}><Plus className="h-3 w-3" /></motion.button>
                              </div>
                              <p className="font-bold text-sm">₹{product.price * item.quantity}</p>
                            </div>
                          </div>
                          <motion.button whileTap={{ scale: 0.85 }} className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.productId)}><X className="h-4 w-4" /></motion.button>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </ScrollArea>
              <SheetFooter className="mt-4 border-t border-temple-gold/15 pt-5">
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹{cartTotal}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pooja Blessing Discount</span><span className="text-temple-gold font-medium">-₹{Math.round(cartTotal * 0.1)}</span></div>
                  <Separator className="bg-temple-gold/10" />
                  <div className="flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-xl gold-text">₹{Math.round(cartTotal * 0.9)}</span></div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full saffron-gradient-animated text-white font-semibold py-6 text-base shadow-lg">
                      <Flame className="mr-2 h-5 w-5" />Proceed to Checkout
                    </Button>
                  </motion.div>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ====== PRODUCT DIALOG ====== */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-3xl bg-background border-temple-gold/20">
          {selectedProduct && (
            <>
              <DialogTitle className="sr-only">{selectedProduct.name}</DialogTitle>
              <motion.div className="flex flex-col sm:flex-row gap-6 -mt-4"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                <div className="relative w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
                  <Badge className="absolute top-4 left-4 bg-temple-deep text-white">{selectedProduct.badge}</Badge>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-temple-gold text-temple-gold' : 'text-muted-foreground/20'}`} />))}
                    <span className="text-sm text-muted-foreground ml-1">{selectedProduct.rating} ({selectedProduct.reviews.toLocaleString()})</span>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-muted-foreground">{selectedProduct.subtitle}</p>
                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-3xl font-black">₹{selectedProduct.price}</span>
                    {selectedProduct.originalPrice > selectedProduct.price && (<><span className="text-lg text-muted-foreground line-through">₹{selectedProduct.originalPrice}</span><Badge className="bg-temple-saffron text-white">{Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF</Badge></>)}
                  </div>
                  <Separator className="my-4 bg-temple-gold/10" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
                  <div className="mt-4 space-y-2">
                    {['Hand-rolled with pure natural ingredients', 'Burns for 40-45 minutes per stick', 'Approx 30 sticks per pack', 'No artificial chemicals'].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-temple-gold" /><span className="text-foreground/80">{f}</span></div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto pt-6">
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={() => { addToCart(selectedProduct.id); setProductDialogOpen(false) }}
                        className="w-full bg-temple-gold hover:bg-temple-brass text-white font-semibold gap-2 py-6">
                        <ShoppingCart className="h-5 w-5" />Add to Cart
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button variant="outline" size="lg" className="border-temple-gold hover:bg-temple-gold/10" onClick={() => toggleWishlist(selectedProduct.id)}>
                        <Heart className={`h-5 w-5 ${wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ====== SCROLL TO TOP ====== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-temple-gold text-white shadow-lg shadow-temple-gold/30 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.15, boxShadow: "0 10px 30px rgba(197,151,46,0.5)" }} whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
