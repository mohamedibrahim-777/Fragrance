'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Flame, ShoppingCart, Heart, Star, Search, Menu, X, Minus, Plus,
  MapPin, Phone, Mail, Clock, ChevronRight, Truck, Shield, Award,
  Sparkles, Lamp, Flower2, Sun, Eye, Share2, Check, ArrowUp, Play,
  Package, Gem, Lotus, FlameKindling, CircleDot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'

// ====== DATA ======
const products = [
  {
    id: 1, name: "Chandanam Sandalwood", subtitle: "Premium Hand-Rolled Agarbathi",
    price: 349, originalPrice: 499, rating: 4.9, reviews: 2847,
    image: "/images/product1.png", category: "premium", fragrance: "Sandalwood",
    description: "Hand-rolled with pure Mysore sandalwood powder and natural herbs. Each stick burns for 45 minutes, filling your pooja room with divine fragrance.",
    badge: "Bestseller", inStock: true,
  },
  {
    id: 2, name: "Malligai Jasmine", subtitle: "Temple Fresh Mogra Incense",
    price: 249, originalPrice: 399, rating: 4.8, reviews: 1923,
    image: "/images/product2.png", category: "floral", fragrance: "Jasmine",
    description: "Crafted with fresh Madurai jasmine extracts and traditional South Indian herbs. Perfect for evening pooja and meditation.",
    badge: "New", inStock: true,
  },
  {
    id: 3, name: "Nag Champa Classic", subtitle: "Sacred Temple Incense",
    price: 299, originalPrice: 449, rating: 4.9, reviews: 3541,
    image: "/images/product3.png", category: "classic", fragrance: "Nag Champa",
    description: "The timeless fragrance of South Indian temples. Made with pure champa flower extract and sandalwood base for an authentic divine experience.",
    badge: "Divine", inStock: true,
  },
  {
    id: 4, name: "Roja Camphor Blend", subtitle: "Pooja Rose & Kapur Mix",
    price: 279, originalPrice: 399, rating: 4.7, reviews: 1562,
    image: "/images/product4.png", category: "premium", fragrance: "Rose & Camphor",
    description: "A divine blend of Indian rose petals and pure camphor. Traditionally used in temple archana and special pooja ceremonies.",
    badge: "Sacred", inStock: true,
  },
  {
    id: 5, name: "Sambrani Herbal", subtitle: "Traditional Benzoin Resin",
    price: 399, originalPrice: 549, rating: 4.8, reviews: 1205,
    image: "/images/product5.png", category: "herbal", fragrance: "Sambrani",
    description: "Pure sambrani resin blended with 21 sacred herbs as per traditional Ayurvedic formulations. Ideal for homam and special poojas.",
    badge: "Herbal", inStock: true,
  },
  {
    id: 6, name: "Khus Vetiver Classic", subtitle: "Cooling Temple Incense",
    price: 269, originalPrice: 399, rating: 4.7, reviews: 987,
    image: "/images/product6.png", category: "herbal", fragrance: "Vetiver & Patchouli",
    description: "Cool vetiver root combined with earthy patchouli, traditionally used in South Indian temples during summer months for its calming properties.",
    badge: "Cooling", inStock: true,
  },
]

const categories = [
  { id: 'all', name: 'All', icon: Sparkles },
  { id: 'premium', name: 'Premium', icon: Gem },
  { id: 'floral', name: 'Floral', icon: Flower2 },
  { id: 'classic', name: 'Classic', icon: Lamp },
  { id: 'herbal', name: 'Herbal', icon: Sun },
]

const testimonials = [
  {
    name: "Priya Venkatesh", location: "Chennai, Tamil Nadu",
    text: "The Chandanam Sandalwood agarbathi reminds me exactly of the Tirupati temple. The fragrance is pure and lingers beautifully during our morning pooja.",
    rating: 5, avatar: "PV",
  },
  {
    name: "Lakshmi Raman", location: "Bangalore, Karnataka",
    text: "I have tried many brands but Shri Fragrance's Nag Champa is the most authentic. It transforms my pooja room into a sacred temple space.",
    rating: 5, avatar: "LR",
  },
  {
    name: "Meenakshi Iyer", location: "Madurai, Tamil Nadu",
    text: "The Malligai Jasmine fragrance is like offering fresh flowers to the deity every day. Truly divine quality that our family trusts for all rituals.",
    rating: 5, avatar: "MI",
  },
]

const marqueeItems = [
  "🙏 Free Pooja Guide with Every Order",
  "🪔 Handcrafted by Temple Artisans",
  "✨ 100% Natural Ingredients",
  "🔥 Free Delivery Above ₹499",
  "🙏 Temple Blessed Fragrances",
  "🪔 75+ Years of Heritage",
  "✨ 50+ Sacred Scents",
  "🔥 Premium Quality Guarantee",
]

interface CartItem { productId: number; quantity: number }

// ====== SCROLL REVEAL COMPONENT ======
function RevealSection({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={`${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`} {...props}>
      {children}
    </section>
  )
}

function RevealDiv({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`} {...props}>
      {children}
    </div>
  )
}

// ====== MANDALA SVG COMPONENT ======
function MandalaDecor({ className = '', size = 200 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={`animate-spin-slow opacity-10 ${className}`}>
      <circle cx="100" cy="100" r="95" fill="none" stroke="#C5972E" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#C5972E" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="#C5972E" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="#C5972E" strokeWidth="0.5" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line key={angle} x1="100" y1="5" x2="100" y2="195"
          transform={`rotate(${angle} 100 100)`} stroke="#C5972E" strokeWidth="0.3" />
      ))}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <g key={`petal-${angle}`} transform={`rotate(${angle} 100 100)`}>
          <ellipse cx="100" cy="40" rx="12" ry="25" fill="none" stroke="#D4722A" strokeWidth="0.5" />
        </g>
      ))}
    </svg>
  )
}

// ====== FLOATING PARTICLES ======
function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 3 + Math.random() * 5,
    duration: 12 + Math.random() * 18,
    delay: Math.random() * 10,
    color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#C5972E' : '#D4722A',
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

// ====== SMOKE EFFECT COMPONENT ======
function IncenseSmoke({ count = 3 }: { count?: number }) {
  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 w-4 h-8"
          style={{
            animation: `incense-smoke ${2.5 + i * 0.5}s ease-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-t from-white/15 to-transparent blur-sm" />
        </div>
      ))}
    </div>
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
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const { toast } = useToast()
  const productsRef = useRef<HTMLDivElement>(null)

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
      setHeaderScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])



  const addToCart = useCallback((productId: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === productId)
      if (existing) {
        return prev.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
    toast({ title: "Added to Cart", description: "Sacred fragrance added to your collection" })
  }, [toast])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId))
  }, [])

  const updateCartQuantity = useCallback((productId: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : item
        }
        return item
      })
    )
  }, [])

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }, [])

  const cartTotal = cartItems.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId)
    return total + (product?.price || 0) * item.quantity
  }, 0)

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fragrance.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Top Ornate Temple Border */}
      <div className="temple-divider-ornate w-full" />

      {/* ====== HEADER ====== */}
      <header className={`sticky top-0 z-50 transition-all duration-500 border-b ${
        headerScrolled
          ? 'bg-background/98 backdrop-blur-lg shadow-lg shadow-temple-gold/5 border-temple-gold/30'
          : 'bg-background/95 backdrop-blur-md border-border'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-temple-gold animate-glow">
                <Image src="/images/logo.png" alt="Shri Fragrance Logo" fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold gold-text tracking-wider">SHRI FRAGRANCE</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground -mt-1 tracking-[0.25em] uppercase">Sacred Temple Agarbathi</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Home', 'Collections', 'About', 'Pooja Guide', 'Contact'].map((item, i) => (
                <button
                  key={item}
                  onClick={item === 'Collections' ? scrollToProducts : undefined}
                  className="text-sm font-medium text-foreground/80 hover:text-temple-gold transition-all duration-300 relative group"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-temple-gold to-transparent transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48 lg:w-64 bg-secondary/50 border-temple-gold/20 focus:border-temple-gold transition-all duration-300 focus:shadow-md focus:shadow-temple-gold/10"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative hover:bg-temple-gold/10 transition-all duration-300" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-temple-deep text-white text-xs animate-bounce">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-temple-gold/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-slide-up">
            <div className="px-4 py-4 space-y-2">
              <div className="flex items-center relative mb-3">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search fragrances..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary/50 border-temple-gold/30" />
              </div>
              {['Home', 'Collections', 'About', 'Pooja Guide', 'Contact'].map((item, i) => (
                <button key={item} onClick={() => { if (item === 'Collections') scrollToProducts(); setMobileMenuOpen(false) }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-temple-gold/10 hover:text-temple-gold transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  <ChevronRight className="h-4 w-4 inline mr-2" />{item}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ====== HERO SECTION ====== */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center">
          {/* Background */}
          <div className="absolute inset-0">
            <Image src="/images/hero-bg.png" alt="South Indian Temple" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-temple-maroon/95 via-temple-deep/85 to-temple-maroon/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-temple-maroon/50 via-transparent to-transparent" />
          </div>

          {/* Floating Particles */}
          <FloatingParticles />

          {/* Mandala Decorations */}
          <div className="absolute right-[-5%] top-[10%] opacity-[0.06]">
            <MandalaDecor size={500} />
          </div>
          <div className="absolute left-[-8%] bottom-[5%] opacity-[0.04]">
            <MandalaDecor size={350} />
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 w-full">
            <div className="max-w-2xl">
              {/* Ornamental Top */}
              <div className="flex items-center gap-3 mb-6 animate-slide-up">
                <div className="h-px w-8 bg-temple-gold/60" />
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-temple-gold animate-diya" />
                  <div className="w-2 h-2 rounded-full bg-temple-amber animate-diya" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-temple-gold animate-diya" style={{ animationDelay: '0.6s' }} />
                </div>
                <span className="text-temple-gold text-xs sm:text-sm tracking-[0.3em] font-medium uppercase animate-text-reveal">
                  Sacred Fragrances Since 1948
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-temple-gold animate-diya" style={{ animationDelay: '0.6s' }} />
                  <div className="w-2 h-2 rounded-full bg-temple-amber animate-diya" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-temple-gold animate-diya" />
                </div>
                <div className="h-px w-8 bg-temple-gold/60" />
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-slide-up"
                style={{ animationDelay: '0.2s' }}>
                <span className="block">Shri</span>
                <span className="block gold-text animate-shimmer text-5xl sm:text-7xl lg:text-8xl mt-1">Fragrance</span>
                <span className="block text-lg sm:text-xl font-normal text-temple-cream/70 mt-3 tracking-wide">
                  From Sacred Temples to Your Home
                </span>
              </h1>

              {/* Subtitle with smoke effect */}
              <div className="relative mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <IncenseSmoke count={4} />
                <p className="text-base sm:text-lg text-temple-cream/80 max-w-xl leading-relaxed">
                  Handcrafted with pure ingredients and blessed traditions, our agarbathi carries
                  the sacred fragrance of South Indian temples into your home. Elevate every pooja
                  with divine aroma.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <Button size="lg" onClick={scrollToProducts}
                  className="saffron-gradient-animated text-white font-semibold text-base px-8 py-6 shadow-lg shadow-temple-saffron/30 hover:shadow-xl hover:shadow-temple-saffron/40 transition-all duration-300 hover:scale-105 group">
                  <Flame className="mr-2 h-5 w-5 group-hover:animate-diya" />
                  Explore Collection
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline"
                  className="border-temple-gold/50 text-temple-gold hover:bg-temple-gold/10 hover:border-temple-gold font-semibold text-base px-8 py-6 transition-all duration-300 group">
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Pooja Essentials
                </Button>
              </div>

              {/* Animated Stats */}
              <div className="flex gap-8 sm:gap-12 mt-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
                {[
                  { label: 'Sacred Fragrances', value: '50+', icon: Flame },
                  { label: 'Years of Tradition', value: '75+', icon: Award },
                  { label: 'Happy Families', value: '10K+', icon: Heart },
                ].map((stat) => (
                  <div key={stat.label} className="group cursor-default">
                    <stat.icon className="h-4 w-4 text-temple-gold/50 mb-1 group-hover:text-temple-amber transition-colors" />
                    <p className="text-2xl sm:text-3xl font-bold text-temple-gold group-hover:scale-110 transition-transform origin-left">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-xs text-temple-cream/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" className="w-full h-auto" preserveAspectRatio="none">
              <path d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1380,40 1440,60 L1440,100 L0,100 Z" fill="#FFF8E7" />
            </svg>
          </div>
        </section>

        {/* ====== MARQUEE STRIP ====== */}
        <div className="py-3 bg-temple-deep overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="inline-block mx-8 text-temple-cream/80 text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ====== TRUST BADGES ====== */}
        <RevealSection className="py-10 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Truck, title: 'Free Delivery', desc: 'Orders above ₹499', color: 'from-temple-gold/10 to-temple-saffron/5' },
                { icon: Shield, title: '100% Natural', desc: 'Pure ingredients only', color: 'from-temple-saffron/10 to-temple-gold/5' },
                { icon: Award, title: 'Temple Trusted', desc: 'Used in 500+ temples', color: 'from-temple-gold/10 to-temple-deep/5' },
                { icon: FlameKindling, title: 'Handcrafted', desc: 'Traditional methods', color: 'from-temple-deep/10 to-temple-gold/5' },
              ].map((badge, i) => (
                <div key={badge.title}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${badge.color} border border-temple-gold/10 hover:border-temple-gold/30 transition-all duration-300 hover:-translate-y-1 cursor-default group`}
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="p-2.5 rounded-lg bg-temple-gold/15 group-hover:bg-temple-gold/25 transition-colors duration-300">
                    <badge.icon className="h-5 w-5 text-temple-gold group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{badge.title}</p>
                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ====== PRODUCTS SECTION ====== */}
        <section ref={productsRef} className="py-14 sm:py-20 scroll-mt-20 relative">
          {/* Background mandala */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <MandalaDecor size={800} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-temple-gold" />
                <div className="relative">
                  <Lamp className="h-6 w-6 text-temple-gold animate-diya" />
                  <div className="absolute -inset-2 rounded-full bg-temple-gold/10 animate-ripple" />
                </div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-temple-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Our Sacred <span className="gold-text">Collections</span>
              </h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                Handpicked fragrances crafted with devotion, perfect for your daily pooja and special ceremonies
              </p>
            </div>

            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-10">
              <TabsList className="w-full sm:w-auto bg-secondary/30 border border-temple-gold/20 p-1 h-auto">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id}
                    className="data-[state=active]:bg-temple-gold data-[state=active]:text-white gap-1.5 text-xs sm:text-sm px-4 py-2 transition-all duration-300 data-[state=active]:shadow-md data-[state=active]:shadow-temple-gold/30">
                    <cat.icon className="h-3.5 w-3.5" />
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Product Grid */}
            <RevealDiv className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProducts.map((product, index) => (
                <Card key={product.id}
                  className="card-artistic overflow-hidden border-border/40 bg-card group"
                  style={{ animationDelay: `${index * 120}ms` }}>
                  <div className="relative overflow-hidden">
                    <div className="aspect-square relative">
                      <Image src={product.image} alt={product.name} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      {/* Shimmer overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge className="bg-temple-deep/90 text-white text-xs font-medium shadow-md backdrop-blur-sm">
                        <Sparkles className="h-3 w-3 mr-1" />{product.badge}
                      </Badge>
                      {product.originalPrice > product.price && (
                        <Badge className="bg-temple-saffron/90 text-white text-xs shadow-md backdrop-blur-sm">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    {/* Hover Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <Button size="icon" variant="secondary"
                        className="h-9 w-9 rounded-full bg-white/90 shadow-md hover:bg-temple-gold hover:text-white transition-all duration-200 hover:scale-110"
                        onClick={() => toggleWishlist(product.id)}>
                        <Heart className={`h-4 w-4 transition-all ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
                      </Button>
                      <Button size="icon" variant="secondary"
                        className="h-9 w-9 rounded-full bg-white/90 shadow-md hover:bg-temple-gold hover:text-white transition-all duration-200 hover:scale-110"
                        onClick={() => { setSelectedProduct(product); setProductDialogOpen(true) }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-temple-gold text-temple-gold' : 'text-muted-foreground/20'}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{product.rating} ({product.reviews.toLocaleString()})</span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-temple-gold transition-colors duration-300">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                    <p className="text-xs text-temple-saffron mt-1.5 font-medium flex items-center gap-1">
                      <Flower2 className="h-3 w-3" />{product.fragrance} Fragrance
                    </p>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-foreground">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <Button onClick={() => addToCart(product.id)}
                      className="bg-temple-gold hover:bg-temple-brass text-white font-medium gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-temple-gold/30"
                      size="sm">
                      <ShoppingCart className="h-4 w-4" />Add
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </RevealDiv>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Flower2 className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4 animate-float" />
                <p className="text-xl text-muted-foreground">No fragrances found</p>
                <p className="text-sm text-muted-foreground/60 mt-2">Try a different search or category</p>
              </div>
            )}
          </div>
        </section>

        {/* ====== ORNATE DIVIDER ====== */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-temple-gold/50" />
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-temple-gold" />
            <div className="w-2 h-2 rounded-full bg-temple-saffron" />
            <div className="w-3 h-3 rounded-full bg-temple-deep" />
            <div className="w-2 h-2 rounded-full bg-temple-saffron" />
            <div className="w-1.5 h-1.5 rounded-full bg-temple-gold" />
          </div>
          <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-temple-gold/50" />
        </div>

        {/* ====== SPECIAL OFFER ====== */}
        <RevealSection className="py-14 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 royal-gradient" />
          <div className="absolute inset-0 rangoli-dots opacity-[0.03]" />
          <FloatingParticles />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <Badge className="bg-temple-amber text-temple-maroon font-semibold mb-5 text-sm px-4 py-1.5 animate-breathe">
                  <Flame className="h-4 w-4 mr-1.5" />Pooja Special Offer
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
                  Complete Pooja Collection
                  <span className="block gold-text text-2xl sm:text-3xl mt-2">Save 40% This Festive Season</span>
                </h2>
                <p className="text-temple-cream/70 mb-8 max-w-lg leading-relaxed">
                  Get our entire collection of 6 sacred fragrances along with a traditional brass incense holder.
                  Perfect for your home temple and makes an ideal gift for loved ones.
                </p>
                <Button size="lg"
                  className="saffron-gradient-animated text-white font-semibold shadow-lg shadow-temple-saffron/30 hover:shadow-xl transition-all hover:scale-105 text-base px-8 py-6">
                  <Flame className="mr-2 h-5 w-5" />Shop Pooja Set - ₹1,499
                </Button>
                <p className="text-xs text-temple-cream/30 mt-4 flex items-center gap-1 justify-center lg:justify-start">
                  <Lamp className="h-3 w-3" />Free brass diya & kumkum with every set
                </p>
              </div>

              {/* Animated Offer Circle */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-temple-gold/20 animate-spin-slow" />
                <div className="absolute inset-3 rounded-full border border-temple-gold/15 animate-spin-reverse" />
                <div className="absolute inset-6 rounded-full border-2 border-dashed border-temple-amber/20 animate-spin-slow" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-0 rounded-full animate-breathe">
                  <div className="absolute inset-8 rounded-full bg-temple-gold/10 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl sm:text-7xl font-black gold-text">40%</span>
                      <p className="text-temple-cream/80 font-bold text-sm mt-1 tracking-widest">FESTIVE OFF</p>
                      <p className="text-temple-cream/40 text-xs mt-0.5">Limited Time</p>
                    </div>
                  </div>
                </div>
                {/* Orbiting dots */}
                {[0, 90, 180, 270].map((deg) => (
                  <div key={deg} className="absolute w-3 h-3 rounded-full bg-temple-amber"
                    style={{
                      top: `${50 + 48 * Math.sin((deg * Math.PI) / 180)}%`,
                      left: `${50 + 48 * Math.cos((deg * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)',
                      animation: `diya-flicker ${1.5 + deg / 360}s ease-in-out infinite`,
                    }} />
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ====== ABOUT SECTION ====== */}
        <RevealSection className="py-14 sm:py-20 relative">
          <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none">
            <MandalaDecor size={400} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
              <div className="flex-1 relative">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden gopuram-shadow">
                  <Image src="/images/about-bg.png" alt="South Indian Temple Heritage" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-temple-maroon/30 to-transparent" />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-temple-gold text-white p-5 rounded-xl shadow-xl animate-float-slow">
                  <p className="text-3xl font-black">75+</p>
                  <p className="text-xs font-semibold tracking-wide">Years of Heritage</p>
                </div>
                {/* Corner ornaments */}
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-temple-gold/60 rounded-tl-lg" />
                <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-temple-gold/60 rounded-bl-lg" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-10 bg-gradient-to-r from-temple-gold to-transparent" />
                  <span className="text-temple-gold text-sm tracking-[0.2em] uppercase font-semibold">Our Heritage</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
                  Rooted in <span className="gold-text">Temple Traditions</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Shri Fragrance was born in the sacred corridors of South Indian temples, where the art of making
                  agarbathi has been passed down through generations of temple artisans. Our master craftsmen
                  continue the age-old tradition of hand-rolling each incense stick with pure sandalwood,
                  natural herbs, and divine devotion.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Every stick of Shri Fragrance is crafted using ingredients sourced directly from temple gardens
                  and Ayurvedic herb farms across Tamil Nadu, Karnataka, and Kerala. We believe that the
                  fragrance used in pooja should be as pure as the prayers themselves.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: FlameKindling, title: 'Sacred Ingredients', desc: 'Temple-sourced pure materials' },
                    { icon: Award, title: 'Artisan Crafted', desc: 'Hand-rolled by temple artisans' },
                    { icon: Shield, title: 'No Chemicals', desc: '100% natural & organic' },
                    { icon: Lamp, title: 'Temple Blessed', desc: 'Blessed in consecrated temples' },
                  ].map((item, i) => (
                    <div key={item.title}
                      className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-temple-gold/5 to-transparent border border-temple-gold/10 hover:border-temple-gold/30 transition-all duration-300 hover:-translate-y-0.5 group"
                      style={{ transitionDelay: `${i * 80}ms` }}>
                      <div className="p-2 rounded-lg bg-temple-gold/10 group-hover:bg-temple-gold/20 transition-colors">
                        <item.icon className="h-4 w-4 text-temple-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ====== ORNATE DIVIDER ====== */}
        <div className="temple-divider-ornate w-full max-w-4xl mx-auto" />

        {/* ====== TESTIMONIALS ====== */}
        <RevealSection className="py-14 sm:py-20 bg-gradient-to-b from-secondary/10 to-transparent relative">
          <div className="absolute left-5 bottom-5 opacity-[0.03] pointer-events-none">
            <MandalaDecor size={300} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-temple-gold" />
                <Flower2 className="h-5 w-5 text-temple-gold animate-diya" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-temple-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Devotees <span className="gold-text">Speak</span>
              </h2>
              <p className="text-muted-foreground mt-3">Hear from families who trust our sacred fragrances</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {testimonials.map((testimonial, index) => (
                <Card key={index}
                  className="border-temple-gold/10 hover:border-temple-gold/30 transition-all duration-500 bg-card hover:-translate-y-2 hover:shadow-xl hover:shadow-temple-gold/10 group">
                  <CardContent className="p-7">
                    {/* Decorative quote */}
                    <div className="text-5xl text-temple-gold/15 font-serif leading-none mb-2">&ldquo;</div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-temple-gold text-temple-gold" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-5 italic">
                      {testimonial.text}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-temple-gold/10">
                      <div className="h-11 w-11 rounded-full saffron-gradient flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ====== POOJA GUIDE CTA ====== */}
        <RevealSection className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="temple-gradient rounded-3xl p-8 sm:p-14 text-center border border-temple-gold/20 gopuram-shadow relative overflow-hidden">
              {/* Corner mandalas */}
              <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none">
                <MandalaDecor size={250} />
              </div>
              <div className="absolute bottom-0 left-0 opacity-[0.04] pointer-events-none scale-x-[-1] scale-y-[-1]">
                <MandalaDecor size={200} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-5">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent to-temple-gold" />
                  <div className="relative">
                    <Lamp className="h-6 w-6 text-temple-gold animate-diya" />
                  </div>
                  <div className="h-px w-10 bg-gradient-to-l from-transparent to-temple-gold" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-5">
                  The Sacred <span className="gold-text">Pooja Guide</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                  Learn the traditional South Indian way of offering agarbathi during pooja.
                  Our guide covers the significance of each fragrance for different deities,
                  occasions, and times of day according to Agama Shastras.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg"
                    className="saffron-gradient-animated text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8 py-6 text-base">
                    <Sparkles className="mr-2 h-5 w-5" />Read Pooja Guide
                  </Button>
                  <Button size="lg" variant="outline"
                    className="border-temple-gold text-temple-gold hover:bg-temple-gold/10 px-8 py-6 text-base transition-all hover:scale-105">
                    <Share2 className="mr-2 h-5 w-5" />Share with Family
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ====== NEWSLETTER ====== */}
        <RevealSection className="py-14 sm:py-20 bg-gradient-to-b from-secondary/10 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-temple-gold" />
                <CircleDot className="h-4 w-4 text-temple-gold" />
                <div className="h-px w-8 bg-temple-gold" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                Receive Sacred <span className="gold-text">Blessings</span>
              </h3>
              <p className="text-muted-foreground mb-8 text-sm">
                Join our family for exclusive offers, new fragrance launches, and festive pooja tips delivered to your inbox.
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <Input placeholder="Enter your email"
                  className="bg-card border-temple-gold/20 focus:border-temple-gold transition-all duration-300 focus:shadow-md focus:shadow-temple-gold/10 h-12" />
                <Button className="bg-temple-gold hover:bg-temple-brass text-white font-semibold px-6 whitespace-nowrap h-12 transition-all hover:scale-105 hover:shadow-md hover:shadow-temple-gold/30">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/50 mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </RevealSection>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="bg-temple-maroon text-temple-cream/80 relative overflow-hidden">
        <div className="temple-divider-ornate w-full" />
        <div className="absolute inset-0 rangoli-dots opacity-[0.02]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-temple-gold animate-glow">
                  <Image src="/images/logo.png" alt="Shri Fragrance" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white tracking-wider">SHRI FRAGRANCE</h3>
                  <p className="text-[10px] text-temple-cream/40 tracking-[0.2em]">SACRED TEMPLE AGARBATHI</p>
                </div>
              </div>
              <p className="text-sm text-temple-cream/50 leading-relaxed">
                Crafting divine fragrances since 1948, blessed by South Indian temple traditions.
                Every stick is a prayer, every scent is sacred.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5">
                {['Our Collections', 'Pooja Essentials', 'Temple Specials', 'Gift Sets', 'Bulk Orders'].map((link) => (
                  <li key={link}>
                    <button className="text-sm text-temple-cream/50 hover:text-temple-gold transition-all duration-300 flex items-center gap-1.5 group">
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />{link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-2.5">
                {['Shipping Info', 'Returns Policy', 'Track Order', 'FAQs', 'Privacy Policy'].map((link) => (
                  <li key={link}>
                    <button className="text-sm text-temple-cream/50 hover:text-temple-gold transition-all duration-300 flex items-center gap-1.5 group">
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />{link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 text-temple-gold flex-shrink-0 mt-0.5" /><span className="text-sm text-temple-cream/50">12 Temple Street, Mylapore, Chennai 600004</span></li>
                <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-temple-gold flex-shrink-0" /><span className="text-sm text-temple-cream/50">+91 44 2847 1234</span></li>
                <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-temple-gold flex-shrink-0" /><span className="text-sm text-temple-cream/50">namaste@shrifragrance.com</span></li>
                <li className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-temple-gold flex-shrink-0" /><span className="text-sm text-temple-cream/50">Mon-Sat: 6AM - 9PM</span></li>
              </ul>
            </div>
          </div>

          <Separator className="bg-temple-cream/8 mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-temple-cream/30">
              &copy; 2026 Shri Fragrance. All rights reserved. Crafted with devotion.
            </p>
            <div className="flex items-center gap-3">
              {['Visa', 'Mastercard', 'UPI', 'GPay'].map((method) => (
                <span key={method} className="text-[10px] text-temple-cream/25 bg-temple-cream/5 px-2.5 py-1 rounded">{method}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ====== CART SHEET ====== */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-background">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-temple-gold" />
              Your Sacred Cart
              {cartCount > 0 && <Badge className="bg-temple-deep text-white">{cartCount}</Badge>}
            </SheetTitle>
          </SheetHeader>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <div className="relative w-24 h-24 animate-float-slow">
                <Flower2 className="h-24 w-24 text-temple-gold/15" />
              </div>
              <p className="text-muted-foreground font-semibold">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/60 text-center">Add sacred fragrances to begin your pooja journey</p>
              <Button onClick={() => setCartOpen(false)} className="bg-temple-gold hover:bg-temple-brass text-white mt-2">
                Browse Collections
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 h-[calc(100vh-280px)] mt-6">
                <div className="space-y-4 pr-4">
                  {cartItems.map((item) => {
                    const product = products.find(p => p.id === item.productId)
                    if (!product) return null
                    return (
                      <div key={item.productId} className="flex gap-4 p-4 rounded-xl bg-secondary/20 border border-temple-gold/10 hover:border-temple-gold/25 transition-all duration-300">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">{product.fragrance}</p>
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="outline" className="h-7 w-7 border-temple-gold/20 hover:bg-temple-gold/10"
                                onClick={() => updateCartQuantity(item.productId, -1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                              <Button size="icon" variant="outline" className="h-7 w-7 border-temple-gold/20 hover:bg-temple-gold/10"
                                onClick={() => updateCartQuantity(item.productId, 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-bold text-sm">₹{product.price * item.quantity}</p>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                          onClick={() => removeFromCart(item.productId)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              <SheetFooter className="mt-4 border-t border-temple-gold/15 pt-5">
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹{cartTotal}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pooja Blessing Discount</span><span className="text-temple-gold font-medium">-₹{Math.round(cartTotal * 0.1)}</span></div>
                  <Separator className="bg-temple-gold/10" />
                  <div className="flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-xl gold-text">₹{Math.round(cartTotal * 0.9)}</span></div>
                  <Button className="w-full saffron-gradient-animated text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                    <Flame className="mr-2 h-5 w-5" />Proceed to Checkout
                  </Button>
                  <p className="text-xs text-center text-muted-foreground/50">Free brass diya on orders above ₹999</p>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ====== PRODUCT QUICK VIEW ====== */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-3xl bg-background border-temple-gold/20">
          {selectedProduct && (
            <>
              <DialogHeader><DialogTitle className="sr-only">{selectedProduct.name}</DialogTitle></DialogHeader>
              <div className="flex flex-col sm:flex-row gap-6 -mt-4">
                <div className="relative w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
                  <Badge className="absolute top-4 left-4 bg-temple-deep text-white">{selectedProduct.badge}</Badge>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-temple-gold text-temple-gold' : 'text-muted-foreground/20'}`} />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">{selectedProduct.rating} ({selectedProduct.reviews.toLocaleString()})</span>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-muted-foreground">{selectedProduct.subtitle}</p>
                  <p className="text-sm text-temple-saffron mt-1 font-medium flex items-center gap-1">
                    <Flower2 className="h-4 w-4" />{selectedProduct.fragrance} Fragrance
                  </p>

                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-3xl font-black">₹{selectedProduct.price}</span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">₹{selectedProduct.originalPrice}</span>
                        <Badge className="bg-temple-saffron text-white">
                          {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>

                  <Separator className="my-4 bg-temple-gold/10" />

                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedProduct.description}</p>

                  <div className="mt-4 space-y-2">
                    {['Hand-rolled with pure natural ingredients', 'Burns for 40-45 minutes per stick', 'Approx 30 sticks per pack', 'No artificial chemicals or colors'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-temple-gold flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto pt-6">
                    <Button onClick={() => { addToCart(selectedProduct.id); setProductDialogOpen(false) }}
                      className="flex-1 bg-temple-gold hover:bg-temple-brass text-white font-semibold gap-2 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-temple-gold/20"
                      size="lg">
                      <ShoppingCart className="h-5 w-5" />Add to Cart
                    </Button>
                    <Button variant="outline" size="lg" className="border-temple-gold hover:bg-temple-gold/10"
                      onClick={() => toggleWishlist(selectedProduct.id)}>
                      <Heart className={`h-5 w-5 ${wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ====== SCROLL TO TOP ====== */}
      <button onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-temple-gold text-white shadow-lg shadow-temple-gold/30 hover:bg-temple-brass transition-all duration-300 hover:scale-110 flex items-center justify-center ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  )
}
