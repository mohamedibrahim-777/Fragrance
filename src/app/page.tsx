'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Flame, ShoppingCart, Heart, Star, Search, Menu, X, Minus, Plus,
  MapPin, Phone, Mail, Clock, ChevronRight, Truck, Shield, Award,
  Sparkles, Lamp, Flower2, Sun, Eye, Share2, Check, ArrowUp,
  Gem, FlameKindling, CircleDot, User, BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogTitle
} from '@/components/ui/dialog'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { useScrollReveal, useScrollProgress } from '@/hooks/useScrollReveal'

// ====== TYPES ======
interface Product {
  id: number
  name: string
  subtitle: string
  fragrance: string
  price: number
  originalPrice: number
  image: string
  category: string
  badge: string
  badgeColor: string
  rating: number
  reviews: number
}

interface CartItem extends Product {
  quantity: number
}

// ====== DATA ======
const products: Product[] = [
  {
    id: 1, name: 'Chandanam Sandalwood', subtitle: 'Premium Temple Grade',
    fragrance: 'Rich Sandalwood & Cedar', price: 349, originalPrice: 499,
    image: '/images/product1.png', category: 'Premium', badge: 'Bestseller',
    badgeColor: 'bg-temple-saffron text-white', rating: 4.8, reviews: 234
  },
  {
    id: 2, name: 'Malligai Jasmine', subtitle: 'Divine Floral Essence',
    fragrance: 'Pure Jasmine & Rose', price: 249, originalPrice: 399,
    image: '/images/product2.png', category: 'Floral', badge: 'New',
    badgeColor: 'bg-emerald-600 text-white', rating: 4.6, reviews: 156
  },
  {
    id: 3, name: 'Nag Champa', subtitle: 'Timeless Sacred Blend',
    fragrance: 'Nag Champa & Sandalwood', price: 299, originalPrice: 449,
    image: '/images/product3.png', category: 'Classic', badge: 'Divine',
    badgeColor: 'bg-temple-deep text-white', rating: 4.9, reviews: 312
  },
  {
    id: 4, name: 'Rose Pushpam', subtitle: 'Sacred Floral Offering',
    fragrance: 'Damask Rose & Palmarosa', price: 279, originalPrice: 399,
    image: '/images/product4.png', category: 'Floral', badge: 'Sacred',
    badgeColor: 'bg-temple-maroon text-white', rating: 4.7, reviews: 189
  },
  {
    id: 5, name: 'Sambrani Heritage', subtitle: 'Traditional Healing',
    fragrance: 'Sambrani & Neem', price: 399, originalPrice: 549,
    image: '/images/product5.png', category: 'Herbal', badge: 'Herbal',
    badgeColor: 'bg-green-700 text-white', rating: 4.5, reviews: 167
  },
  {
    id: 6, name: 'Oudh Divine', subtitle: 'Premium Arabian Oudh',
    fragrance: 'Oudh & Amber Resin', price: 599, originalPrice: 899,
    image: '/images/product6.png', category: 'Premium', badge: 'Luxury',
    badgeColor: 'bg-temple-ruby text-white', rating: 4.9, reviews: 198
  }
]

const testimonials = [
  {
    name: 'Priya Venkatesh', location: 'Chennai, Tamil Nadu',
    rating: 5, text: 'The Chandanam Sandalwood agarbathi reminds me of my visits to Tirupati temple. The fragrance is absolutely divine and fills our entire pooja room with sacred aroma. Truly a blessing!',
    avatar: 'PV'
  },
  {
    name: 'Rajesh Iyer', location: 'Bangalore, Karnataka',
    rating: 5, text: 'We have been using Shri Fragrance products for our daily pooja for over 10 years. The quality has remained consistently excellent. The Nag Champa is our family favorite.',
    avatar: 'RI'
  },
  {
    name: 'Lakshmi Sharma', location: 'Hyderabad, Telangana',
    rating: 5, text: 'The Sambrani Herbal incense has become essential for our evening aarti. The natural fragrance purifies the entire home. My grandmother approves — and that says everything!',
    avatar: 'LS'
  }
]

const trustBadges = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: Shield, title: '100% Natural', desc: 'No chemicals or additives' },
  { icon: Award, title: 'Temple Trusted', desc: 'Used in 500+ temples' },
  { icon: Sparkles, title: 'Handcrafted', desc: 'Traditional methods' }
]

const marqueeMessages = [
  '✦ Free Delivery on Orders Above ₹499 ✦',
  '✦ 100% Natural Ingredients ✦',
  '✦ Trusted by 500+ Temples ✦',
  '✦ Handcrafted with Devotion ✦',
  '✦ 75+ Years of Sacred Tradition ✦',
  '✦ Festive Season Sale - Up to 40% Off ✦'
]

const poojaSteps = [
  { step: 1, title: 'Prepare', desc: 'Clean the pooja room and arrange the altar with flowers and sacred items', icon: Sparkles },
  { step: 2, title: 'Light', desc: 'Light the agarbathi and diya to invite divine presence and purify the space', icon: Flame },
  { step: 3, title: 'Offer', desc: 'Present flowers, naivedyam, and sacred water with devotion and reverence', icon: Flower2 },
  { step: 4, title: 'Chant', desc: 'Recite mantras and stotrams to connect with the divine consciousness', icon: BookOpen },
  { step: 5, title: 'Meditate', desc: 'Sit in silence, absorb the sacred fragrance, and experience inner peace', icon: Sun }
]

// ====== SUB-COMPONENTS ======
function FloatingParticles({ count = 8 }: { count?: number }) {
  // Reduced particle count for smooth scrolling
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: ((i * 13.7) % 100), // Deterministic positions (no Math.random on render)
    delay: (i * 1.3) % 10,
    duration: 10 + (i * 2.5) % 10,
    size: 2 + (i % 3),
    color: ['#C5972E', '#D4722A', '#FFD700', '#FFBF00'][i % 4]
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ contain: 'strict' }}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: `${p.left}%`, width: p.size, height: p.size,
          backgroundColor: p.color,
          animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`
        }} />
      ))}
    </div>
  )
}

function IncenseSmoke({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {[0, 1, 2].map(i => (
        <div key={i} className="animate-smoke" style={{
          position: 'absolute', bottom: 0, left: `${30 + i * 20}%`,
          width: 16 + i * 4, height: 30 + i * 10,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.12), transparent)',
          filter: 'blur(6px)', animationDelay: `${i * 0.8}s`
        }} />
      ))}
    </div>
  )
}

function DiyaFlame({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-diya" style={{
        width: 14, height: 20, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        background: 'radial-gradient(ellipse at center, #FFD700, #FF8C00, #FF4500)',
        boxShadow: '0 0 12px rgba(255,165,0,0.6), 0 0 24px rgba(255,140,0,0.3)'
      }} />
    </div>
  )
}

function MandalaDecor({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" stroke="#C5972E" strokeWidth="0.5" opacity="0.3" />
      <circle cx="100" cy="100" r="75" stroke="#C5972E" strokeWidth="0.5" opacity="0.25" />
      <circle cx="100" cy="100" r="60" stroke="#D4722A" strokeWidth="0.5" opacity="0.2" />
      <circle cx="100" cy="100" r="45" stroke="#C5972E" strokeWidth="0.5" opacity="0.15" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="100" y1="10" x2="100" y2="190"
          stroke="#C5972E" strokeWidth="0.3" opacity="0.15"
          transform={`rotate(${i * 30} 100 100)`} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={`d${i}`} cx={100 + 70 * Math.cos(i * Math.PI / 4)} cy={100 + 70 * Math.sin(i * Math.PI / 4)}
          r="3" fill="#C5972E" opacity="0.2" />
      ))}
    </svg>
  )
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        let start = 0
        const duration = 2000
        const step = (timestamp: number) => {
          if (!start) start = timestamp
          const progress = Math.min((timestamp - start) / duration, 1)
          setCount(Math.floor(progress * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <div ref={ref}>{count}{suffix}</div>
}

function GopuramSVG({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="20" y="160" width="80" height="40" fill="#8B1A1A" opacity="0.15" />
      {/* Tower tiers */}
      <rect x="30" y="120" width="60" height="40" fill="#8B1A1A" opacity="0.12" />
      <rect x="38" y="85" width="44" height="35" fill="#8B1A1A" opacity="0.10" />
      <rect x="44" y="55" width="32" height="30" fill="#8B1A1A" opacity="0.08" />
      <rect x="50" y="30" width="20" height="25" fill="#8B1A1A" opacity="0.06" />
      {/* Kalasam (top pinnacle) */}
      <circle cx="60" cy="22" r="8" fill="#C5972E" opacity="0.2" />
      <line x1="60" y1="14" x2="60" y2="6" stroke="#C5972E" strokeWidth="2" opacity="0.2" />
      {/* Decorative dots */}
      {[0, 1, 2, 3, 4].map(i => (
        <circle key={i} cx={40 + i * 10} cy="150" r="2" fill="#C5972E" opacity="0.15" />
      ))}
    </svg>
  )
}

// ====== MAIN COMPONENT ======
export default function Home() {
  const { toast } = useToast()
  useScrollReveal()
  useScrollProgress()

  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [email, setEmail] = useState('')

  // Scroll to top detection
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cart functions
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast({
      title: 'Added to Cart!',
      description: `${product.name} has been added to your cart.`,
    })
  }, [toast])

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }, [])

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }, [])

  const toggleWishlist = useCallback((id: number) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  // Derived state
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fragrance.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast({
        title: '🙏 Subscribed!',
        description: 'You will receive sacred fragrance updates and offers.',
      })
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-temple-cream">
      {/* Scroll progress bar - CSS only, no Framer Motion */}
      <div className="scroll-progress-bar" />

      {/* ====== HEADER ====== */}
      <header className="sticky top-0 z-50 bg-temple-cream/95 backdrop-blur-md border-b border-temple-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-2 text-xs text-temple-gold border-b border-temple-gold/10">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +91 98765 43210</span>
              <span className="hidden sm:flex items-center gap-1"><Mail className="w-3 h-3" /> info@shrifragrance.com</span>
            </div>
            <div className="flex items-center gap-1"><Flame className="w-3 h-3" /> Free Delivery on Orders Above ₹499</div>
          </div>

          {/* Main nav */}
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img src="/images/logo.png" alt="Shri Fragrance Logo" width={48} height={48} className="rounded-full" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-wider gold-text-static">SHRI FRAGRANCE</h1>
                <p className="text-[10px] tracking-widest text-temple-saffron uppercase">Sacred Temple Agarbathi</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-5">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Collections', href: '#products' },
                { label: 'About', href: '#heritage' },
                { label: 'Pooja Guide', href: '#pooja-guide' },
                { label: 'Contact', href: '#contact' }
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="text-sm font-medium text-temple-deep hover:text-temple-saffron transition-colors h-9 flex items-center">
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {showSearch && (
                <Input
                  placeholder="Search fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-48 text-sm bg-white/80 border-temple-gold/30 transition-all duration-300"
                  autoFocus
                />
              )}
              <Button variant="ghost" size="icon" onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery('') }}
                className="text-temple-deep hover:text-temple-saffron h-9 w-9">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)}
                className="relative text-temple-deep hover:text-temple-saffron h-9 w-9">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-temple-saffron text-white text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="lg:hidden text-temple-deep"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden overflow-hidden border-t border-temple-gold/10 animate-fade-in">
              <nav className="flex flex-col py-4 gap-1">
                {[
                  { label: 'Home', href: '#home' },
                  { label: 'Collections', href: '#products' },
                  { label: 'About', href: '#heritage' },
                  { label: 'Pooja Guide', href: '#pooja-guide' },
                  { label: 'Contact', href: '#contact' }
                ].map(item => (
                  <Link key={item.label} href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-temple-deep hover:bg-temple-gold/10 rounded-md transition-colors">
                    {item.label}
                    <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* ====== HERO SECTION ====== */}
        <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/images/hero-bg.png" alt="Temple background" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-r from-temple-maroon/90 via-temple-deep/80 to-temple-maroon/70" />
          </div>
          <FloatingParticles count={8} />

          {/* Mandala decoration - only one for performance */}
          <MandalaDecor className="absolute top-10 right-10 w-48 h-48 opacity-20 animate-spin-slow hidden lg:block" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
            <div className="max-w-3xl">
              {/* Brand name with gold shimmer */}
              <div className="mb-6">
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-wider gold-text animate-shimmer">
                  SHRI FRAGRANCE
                </h2>
              </div>

              <p className="text-xl sm:text-2xl md:text-3xl text-temple-amber font-light mb-4 tracking-wide scroll-reveal">
                From Sacred Temples to Your Home
              </p>

              <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl leading-relaxed scroll-reveal">
                Experience the divine fragrances handcrafted with devotion, using sacred ingredients
                sourced from ancient temple traditions across South India.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12 scroll-reveal">
                <Button asChild size="lg"
                  className="saffron-gradient text-white hover:opacity-90 px-8 py-6 text-base font-semibold shadow-lg">
                  <a href="#products">
                    <Flame className="w-5 h-5 mr-2" />
                    Explore Collection
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg"
                  className="border-temple-gold text-temple-gold hover:bg-temple-gold/10 px-8 py-6 text-base">
                  <a href="#pooja-guide">
                    <Lamp className="w-5 h-5 mr-2" />
                    Pooja Essentials
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-12">
                {[
                  { value: 50, suffix: '+', label: 'Sacred Fragrances' },
                  { value: 75, suffix: '+', label: 'Years of Tradition' },
                  { value: 500, suffix: 'K+', label: 'Happy Families' }
                ].map((stat, i) => (
                  <div key={i} className="text-center flex-1 min-w-[80px]">
                    <div className="text-2xl sm:text-3xl font-bold gold-text">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm text-white/60 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Diya decoration */}
            <div className="absolute bottom-8 right-8 sm:right-16 hidden sm:block animate-float-slow">
              <DiyaFlame />
              <div className="w-8 h-3 bg-temple-brass rounded-full mt-1 mx-auto" />
            </div>
          </div>
        </section>

        {/* ====== MARQUEE STRIP ====== */}
        <div className="deep-maroon-gradient py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeMessages, ...marqueeMessages].map((msg, i) => (
              <span key={i} className="text-temple-amber text-sm font-medium mx-8">
                {msg}
              </span>
            ))}
          </div>
        </div>

        {/* ====== TRUST BADGES / FEATURES ====== */}
        <section className="py-12 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustBadges.map((badge, i) => (
                <div key={i}
                  className="scroll-reveal flex flex-col items-center text-center p-6 rounded-xl bg-temple-cream/50 border border-temple-gold/10 hover:shadow-lg hover:shadow-temple-gold/10 transition-all"
                  style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="w-14 h-14 rounded-full saffron-gradient flex items-center justify-center mb-3">
                    <badge.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-temple-deep text-sm">{badge.title}</h3>
                  <p className="text-xs text-temple-gold mt-1">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="temple-divider-ornate max-w-7xl mx-auto" />

        {/* ====== PRODUCTS SECTION ====== */}
        <section id="products" className="py-16 bg-temple-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 scroll-reveal">
              <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 mb-4">
                <Sparkles className="w-3 h-3 mr-1" /> Sacred Collection
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-temple-deep mb-3">
                Our <span className="gold-text-static">Divine</span> Fragrances
              </h2>
              <p className="text-temple-gold max-w-2xl mx-auto">
                Each agarbathi is handcrafted with sacred ingredients, blessed in temple traditions,
                and made with devotion to bring divine fragrance to your home.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="mb-8 scroll-reveal">
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="mx-auto flex-wrap h-auto gap-1 bg-white/50 border border-temple-gold/10 p-1">
                  {['All', 'Premium', 'Floral', 'Classic', 'Herbal'].map(cat => (
                    <TabsTrigger key={cat} value={cat}
                      className="data-[state=active]:saffron-gradient data-[state=active]:text-white text-sm px-4 py-2">
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => {
                const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                const isWished = wishlist.includes(product.id)
                return (
                  <div key={product.id}
                    className="scroll-reveal"
                    style={{ transitionDelay: `${idx * 0.08}s` }}>
                    <Card className="card-artistic group bg-white border-temple-gold/10 overflow-hidden">
                      <div className="relative overflow-hidden">
                        <div className="relative aspect-square bg-temple-cream/50 p-6">
                          <img src={product.image} alt={product.name} loading="lazy" className="object-contain p-4 w-full h-full group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        {/* Badge */}
                        <Badge className={`absolute top-3 left-3 ${product.badgeColor} text-xs font-semibold`}>
                          {product.badge}
                        </Badge>
                        {/* Discount */}
                        <Badge className="absolute top-3 right-3 bg-temple-deep text-white text-xs">
                          -{discount}%
                        </Badge>
                        {/* Action buttons */}
                        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <Button size="icon" variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/90 shadow-md"
                            onClick={() => toggleWishlist(product.id)}>
                            <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button size="icon" variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/90 shadow-md"
                            onClick={() => setQuickViewProduct(product)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/90 shadow-md">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-temple-amber text-temple-amber' : 'text-temple-gold/30'}`} />
                          ))}
                          <span className="text-xs text-temple-gold/70 ml-1">({product.reviews})</span>
                        </div>
                        <h3 className="font-bold text-temple-deep text-base mb-0.5">{product.name}</h3>
                        <p className="text-xs text-temple-gold/70 mb-1">{product.subtitle}</p>
                        <p className="text-xs text-temple-saffron/80 flex items-center gap-1">
                          <FlameKindling className="w-3 h-3" /> {product.fragrance}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xl font-bold text-temple-deep">₹{product.price}</span>
                          <span className="text-sm text-temple-gold/50 line-through">₹{product.originalPrice}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button onClick={() => addToCart(product)}
                          className="w-full saffron-gradient text-white hover:opacity-90 font-semibold"
                          size="sm">
                          <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 scroll-reveal">
                <CircleDot className="w-12 h-12 text-temple-gold/30 mx-auto mb-4" />
                <p className="text-temple-gold/60 text-lg">No products found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* ====== SPECIAL OFFER BANNER ====== */}
        <section className="relative py-16 sm:py-20 overflow-hidden royal-gradient">
          {/* Minimal decorative elements for smooth scrolling */}
          <div className="absolute -top-10 -left-10 w-72 h-72 border-2 border-dashed border-temple-amber/20 rounded-full animate-spin-slow" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left scroll-reveal-left">
              <Badge className="bg-temple-amber/20 text-temple-amber border-temple-amber/30 mb-4">
                <Gem className="w-3 h-3 mr-1" /> Festive Special
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Complete Pooja Collection
              </h2>
              <p className="text-lg text-temple-amber/80 mb-6">
                Save <span className="text-temple-amber font-bold">40%</span> This Festive Season —
                Includes Chandanam, Nag Champa, Rose Pushpam & Sambrani
              </p>
              <Button size="lg"
                className="saffron-gradient text-white hover:opacity-90 px-8 py-6 text-lg font-bold shadow-xl">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Pooja Set — ₹1,499
              </Button>
            </div>

            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shrink-0 scroll-reveal-right">
              {/* Rotating circles */}
              <div className="absolute inset-0 border-2 border-dashed border-temple-amber/30 rounded-full animate-spin-slow" />
              <div className="absolute inset-4 border border-dotted border-temple-gold/20 rounded-full animate-spin-reverse" />
              <div className="absolute inset-8 border border-temple-amber/20 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
              <div className="relative z-10 text-center">
                <div className="text-5xl sm:text-6xl font-black text-temple-amber animate-breathe">40%</div>
                <div className="text-lg font-bold text-white tracking-wider">OFF</div>
              </div>
            </div>
          </div>
        </section>

        <div className="temple-divider-ornate max-w-7xl mx-auto" />

        {/* ====== HERITAGE STORY SECTION ====== */}
        <section id="heritage" className="py-16 sm:py-20 bg-temple-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative scroll-reveal-left">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl gopuram-shadow">
                  <img src="/images/about-bg.png" alt="Temple heritage" width={600} height={400}
                    className="w-full h-auto object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-temple-maroon/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3">
                      <DiyaFlame />
                      <span className="text-temple-amber font-semibold text-sm">Since 1948</span>
                    </div>
                  </div>
                </div>
                {/* Floating stats */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-temple-gold/20 hidden sm:block">
                  <div className="text-center">
                    <div className="text-2xl font-bold gold-text-static">75+</div>
                    <div className="text-xs text-temple-gold">Years Legacy</div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-xl p-4 border border-temple-gold/20 hidden sm:block">
                  <div className="text-center">
                    <div className="text-2xl font-bold gold-text-static">500+</div>
                    <div className="text-xs text-temple-gold">Temples Trust Us</div>
                  </div>
                </div>
              </div>

              <div className="scroll-reveal-right">
                <Badge className="bg-temple-deep/10 text-temple-deep border-temple-deep/20 mb-4">
                  <Award className="w-3 h-3 mr-1" /> Our Heritage
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-temple-deep mb-6">
                  A Legacy of <span className="gold-text-static">Sacred</span> Fragrance
                </h2>
                <div className="space-y-4 text-temple-deep/80 leading-relaxed">
                  <p>
                    For over 75 years, Shri Fragrance has been the custodian of South India&apos;s most
                    sacred incense traditions. Our journey began in the ancient temples of Tamil Nadu,
                    where our founder learned the art of blending divine fragrances from temple priests.
                  </p>
                  <p>
                    Each agarbathi is handcrafted using traditional methods passed down through three
                    generations. We source the finest sandalwood from Mysore, jasmine from Madurai,
                    and sacred herbs from the foothills of the Western Ghats.
                  </p>
                  <p>
                    Today, our incense fills over 500 temples across South India, and we bring that
                    same divine fragrance to your home pooja room.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { icon: FlameKindling, label: 'Sacred Blends' },
                    { icon: Flower2, label: 'Natural Herbs' },
                    { icon: Sun, label: 'Sun-Dried' }
                  ].map((item, i) => (
                    <div key={i} className="text-center p-3 rounded-lg bg-white border border-temple-gold/10">
                      <item.icon className="w-6 h-6 text-temple-saffron mx-auto mb-2" />
                      <span className="text-xs font-medium text-temple-deep">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== POOJA GUIDE SECTION ====== */}
        <section id="pooja-guide" className="py-16 sm:py-20 bg-white/50 rangoli-dots">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 scroll-reveal">
              <Badge className="bg-temple-saffron/10 text-temple-saffron border-temple-saffron/20 mb-4">
                <Lamp className="w-3 h-3 mr-1" /> Sacred Guide
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-temple-deep mb-3">
                The <span className="gold-text-static">Divine</span> Pooja Path
              </h2>
              <p className="text-temple-gold max-w-2xl mx-auto">
                Follow these sacred steps to create a blessed atmosphere in your home pooja room,
                guided by ancient temple traditions.
              </p>
            </div>

            {/* Steps */}
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-temple-gold/20 via-temple-saffron/30 to-temple-gold/20" />

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {poojaSteps.map((step, i) => (
                  <div key={step.step}
                    className="scroll-reveal relative"
                    style={{ transitionDelay: `${i * 0.12}s` }}>
                    <div className="text-center p-6 rounded-xl bg-white border border-temple-gold/15 hover:shadow-xl hover:shadow-temple-gold/10 transition-all group">
                      {/* Step number with diya */}
                      <div className="relative mx-auto mb-4">
                        <div className="w-16 h-16 rounded-full saffron-gradient flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <step.icon className="w-7 h-7 text-white" />
                        </div>
                        {/* Diya flame on top */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <DiyaFlame className="animate-diya" />
                        </div>
                      </div>
                      <div className="text-xs font-bold text-temple-saffron mb-1">Step {step.step}</div>
                      <h3 className="font-bold text-temple-deep text-lg mb-2">{step.title}</h3>
                      <p className="text-xs text-temple-deep/60 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="temple-divider-ornate max-w-7xl mx-auto" />

        {/* ====== TESTIMONIALS ====== */}
        <section className="py-16 bg-temple-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 scroll-reveal">
              <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 mb-4">
                <Sparkles className="w-3 h-3 mr-1" /> Devotee Reviews
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-temple-deep">
                Blessed by <span className="gold-text-static">Devotees</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i}
                  className="scroll-reveal"
                  style={{ transitionDelay: `${i * 0.12}s` }}>
                  <Card className="h-full bg-white border-temple-gold/10 hover:shadow-xl hover:shadow-temple-gold/10 transition-all">
                    <CardContent className="p-6">
                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mb-4">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-temple-amber text-temple-amber" />
                        ))}
                      </div>
                      <p className="text-temple-deep/70 text-sm leading-relaxed mb-4 italic">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <Separator className="mb-4 bg-temple-gold/10" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full saffron-gradient flex items-center justify-center text-white text-sm font-bold">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-temple-deep text-sm">{t.name}</p>
                          <p className="text-xs text-temple-gold flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {t.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== NEWSLETTER / CTA ====== */}
        <section className="relative py-16 sm:py-20 overflow-hidden deep-maroon-gradient">
          <FloatingParticles />
          <MandalaDecor className="absolute -top-20 -right-20 w-80 h-80 opacity-10 animate-spin-slow" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center scroll-reveal">
            {/* Diya decoration */}
            <div className="flex justify-center mb-6 animate-float-slow">
              <DiyaFlame />
              <div className="w-8 h-3 bg-temple-brass rounded-full mt-1 mx-auto" />
            </div>

            <Badge className="bg-temple-amber/20 text-temple-amber border-temple-amber/30 mb-4">
              <Flame className="w-3 h-3 mr-1" /> Stay Blessed
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Receive <span className="gold-text">Sacred Updates</span>
            </h2>
            <p className="text-temple-amber/80 mb-8 max-w-lg mx-auto">
              Subscribe to receive exclusive offers, new fragrance launches, and seasonal
              pooja tips delivered with devotion to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 bg-white/10 border-temple-gold/30 text-white placeholder:text-white/40 focus:border-temple-amber"
              />
              <Button type="submit" size="lg"
                className="saffron-gradient text-white hover:opacity-90 px-6 h-12 font-semibold">
                <Flame className="w-4 h-4 mr-2" /> Subscribe
              </Button>
            </form>

            <p className="text-xs text-white/40 mt-4">
              🙏 We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </section>

        {/* ====== FOOTER ====== */}
        <footer id="contact" className="bg-temple-deep text-temple-cream pt-16 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Column 1 - Logo & About */}
              <div className="scroll-reveal">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/images/logo.png" alt="Shri Fragrance" width={40} height={40} className="rounded-full" />
                  <div>
                    <h3 className="text-lg font-bold gold-text-static">SHRI FRAGRANCE</h3>
                    <p className="text-[10px] tracking-widest text-temple-saffron uppercase">Sacred Temple Agarbathi</p>
                  </div>
                </div>
                <p className="text-sm text-temple-cream/60 leading-relaxed mb-4">
                  Bringing divine fragrances from sacred temples to your home since 1948.
                  Handcrafted with devotion, blessed by tradition.
                </p>
                <div className="flex items-center gap-2">
                  <DiyaFlame />
                  <span className="text-xs text-temple-amber">Illuminating Homes Since 1948</span>
                </div>
              </div>

              {/* Column 2 - Quick Links */}
              <div className="scroll-reveal" style={{ transitionDelay: '0.1s' }}>
                <h4 className="font-bold text-temple-amber mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
                <ul className="space-y-2">
                  {[
                    { label: 'Home', href: '#home' },
                    { label: 'Our Collection', href: '#products' },
                    { label: 'Heritage Story', href: '#heritage' },
                    { label: 'Pooja Guide', href: '#pooja-guide' },
                    { label: 'Contact Us', href: '#contact' }
                  ].map(link => (
                    <li key={link.label}>
                      <Link href={link.href}
                        className="text-sm text-temple-cream/60 hover:text-temple-amber transition-colors flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3" /> {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 - Contact */}
              <div className="scroll-reveal" style={{ transitionDelay: '0.2s' }}>
                <h4 className="font-bold text-temple-amber mb-4 text-sm tracking-wider uppercase">Contact Us</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-temple-cream/60">
                    <MapPin className="w-4 h-4 text-temple-saffron shrink-0 mt-0.5" />
                    <span>123 Temple Road, Mylapore, Chennai, Tamil Nadu 600004</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-temple-cream/60">
                    <Phone className="w-4 h-4 text-temple-saffron shrink-0" />
                    <span>+91 98765 43210</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-temple-cream/60">
                    <Mail className="w-4 h-4 text-temple-saffron shrink-0" />
                    <span>info@shrifragrance.com</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-temple-cream/60">
                    <Clock className="w-4 h-4 text-temple-saffron shrink-0" />
                    <span>Mon - Sat: 9AM - 8PM IST</span>
                  </li>
                </ul>
              </div>

              {/* Column 4 - Social & Payment */}
              <div className="scroll-reveal" style={{ transitionDelay: '0.3s' }}>
                <h4 className="font-bold text-temple-amber mb-4 text-sm tracking-wider uppercase">Follow Us</h4>
                <div className="flex gap-3 mb-6">
                  {['Facebook', 'Instagram', 'YouTube', 'Twitter'].map(social => (
                    <Button key={social} variant="outline" size="icon"
                      className="h-9 w-9 rounded-full border-temple-gold/30 text-temple-gold hover:bg-temple-gold/10 hover:text-temple-amber">
                      <span className="text-xs font-bold">{social[0]}</span>
                    </Button>
                  ))}
                </div>

                <h4 className="font-bold text-temple-amber mb-3 text-sm tracking-wider uppercase">We Accept</h4>
                <div className="flex flex-wrap gap-2">
                  {['UPI', 'Visa', 'MC', 'RuPay', 'COD'].map(method => (
                    <span key={method}
                      className="px-2 py-1 text-[10px] font-medium bg-temple-cream/10 border border-temple-gold/20 rounded text-temple-cream/60">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="temple-divider mb-6" />

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-temple-cream/40">
              <p>&copy; {new Date().getFullYear()} Shri Fragrance. All rights reserved. Made with 🙏 in Chennai.</p>
              <div className="flex items-center gap-4">
                <span className="hover:text-temple-amber cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-temple-amber cursor-pointer transition-colors">Terms of Service</span>
                <span className="hover:text-temple-amber cursor-pointer transition-colors">Refund Policy</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ====== CART SIDEBAR ====== */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-temple-cream border-l border-temple-gold/20">
          <SheetHeader>
            <SheetTitle className="text-temple-deep flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-temple-saffron" />
              Your Sacred Cart ({cartCount})
            </SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <Flame className="w-16 h-16 text-temple-gold/20 mb-4" />
              <p className="text-temple-deep/60 font-medium mb-1">Your cart is empty</p>
              <p className="text-xs text-temple-gold/60">Add sacred fragrances to begin your journey</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 p-3 bg-white rounded-lg border border-temple-gold/10">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-temple-cream/50 shrink-0">
                        <img src={item.image} alt={item.name} className="object-contain p-1 w-full h-full" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-temple-deep text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-temple-gold/70">{item.fragrance}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-6 w-6 border-temple-gold/30"
                              onClick={() => updateQuantity(item.id, -1)}>
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-6 w-6 border-temple-gold/30"
                              onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <span className="font-bold text-temple-deep text-sm">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-temple-gold/40 hover:text-red-500 shrink-0"
                        onClick={() => removeFromCart(item.id)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t border-temple-gold/20 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-temple-deep/60">Subtotal</span>
                  <span className="font-bold text-temple-deep text-lg">₹{cartTotal}</span>
                </div>
                <p className="text-xs text-temple-saffron flex items-center gap-1">
                  <Truck className="w-3 h-3" /> {cartTotal >= 499 ? 'Free delivery included!' : `₹${499 - cartTotal} more for free delivery`}
                </p>
                <Button className="w-full saffron-gradient text-white hover:opacity-90 py-6 font-bold text-base">
                  <Flame className="w-5 h-5 mr-2" /> Proceed to Checkout
                </Button>
              </div>
            </>
          )}
          <SheetFooter />
        </SheetContent>
      </Sheet>

      {/* ====== QUICK VIEW DIALOG ====== */}
      <Dialog open={!!quickViewProduct} onOpenChange={(open) => { if (!open) setQuickViewProduct(null) }}>
        <DialogContent className="sm:max-w-lg bg-temple-cream border-temple-gold/20">
          {quickViewProduct && (
            <>
              <DialogTitle className="sr-only">{quickViewProduct.name}</DialogTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="object-contain p-6 w-full h-full" />
                </div>
                <div>
                  <Badge className={`${quickViewProduct.badgeColor} text-xs mb-2`}>
                    {quickViewProduct.badge}
                  </Badge>
                  <h3 className="text-xl font-bold text-temple-deep mb-1">{quickViewProduct.name}</h3>
                  <p className="text-sm text-temple-gold/70 mb-2">{quickViewProduct.subtitle}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-temple-amber text-temple-amber' : 'text-temple-gold/30'}`} />
                    ))}
                    <span className="text-xs text-temple-gold/70 ml-1">({quickViewProduct.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-temple-saffron flex items-center gap-1 mb-4">
                    <FlameKindling className="w-4 h-4" /> {quickViewProduct.fragrance}
                  </p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-temple-deep">₹{quickViewProduct.price}</span>
                    <span className="text-base text-temple-gold/50 line-through">₹{quickViewProduct.originalPrice}</span>
                    <Badge className="bg-temple-deep text-white text-xs">
                      -{Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)}%
                    </Badge>
                  </div>
                  <Button onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null) }}
                    className="w-full saffron-gradient text-white hover:opacity-90 font-semibold py-5">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ====== SCROLL TO TOP ====== */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full saffron-gradient text-white border-0 shadow-xl hover:opacity-90 animate-fade-in"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
