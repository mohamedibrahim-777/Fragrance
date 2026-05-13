'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Flame, ShoppingCart, Heart, Star, Search, Menu, X, Minus, Plus,
  MapPin, Phone, Mail, Clock, ChevronRight, Truck, Shield, Award,
  Sparkles, Lamp, Flower2, Sun, Eye, Share2, Check, ArrowUp,
  Gem, FlameKindling, CircleDot, User
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
    id: 3, name: 'Nag Champa Classic', subtitle: 'Timeless Sacred Blend',
    fragrance: 'Nag Champa & Sandalwood', price: 299, originalPrice: 449,
    image: '/images/product3.png', category: 'Classic', badge: 'Divine',
    badgeColor: 'bg-temple-deep text-white', rating: 4.9, reviews: 312
  },
  {
    id: 4, name: 'Roja Camphor Blend', subtitle: 'Sacred Pooja Special',
    fragrance: 'Camphor & Rose Petals', price: 279, originalPrice: 399,
    image: '/images/product4.png', category: 'Premium', badge: 'Sacred',
    badgeColor: 'bg-temple-maroon text-white', rating: 4.7, reviews: 189
  },
  {
    id: 5, name: 'Sambrani Herbal', subtitle: 'Traditional Healing',
    fragrance: 'Sambrani & Neem', price: 399, originalPrice: 549,
    image: '/images/product5.png', category: 'Herbal', badge: 'Herbal',
    badgeColor: 'bg-green-700 text-white', rating: 4.5, reviews: 167
  },
  {
    id: 6, name: 'Khus Vetiver Classic', subtitle: 'Cooling Temple Breeze',
    fragrance: 'Vetiver & Mint', price: 269, originalPrice: 399,
    image: '/images/product6.png', category: 'Herbal', badge: 'Cooling',
    badgeColor: 'bg-teal-700 text-white', rating: 4.4, reviews: 143
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

// ====== ANIMATION VARIANTS ======
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
}
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

// ====== SUB-COMPONENTS ======
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 12,
    size: 2 + Math.random() * 4,
    color: ['#C5972E', '#D4722A', '#FFD700', '#FFBF00'][Math.floor(Math.random() * 4)]
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

function ParallaxSection({ children, className = '', speed = 0.3, id }: {
  children: React.ReactNode; className?: string; speed?: number; id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref, offset: ['start end', 'end start']
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100])

  return (
    <section ref={ref} id={id} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full">{children}</motion.div>
    </section>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left saffron-gradient-animated"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

// ====== MAIN COMPONENT ======
export default function Home() {
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Scroll to top detection
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
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

  return (
    <div className="min-h-screen bg-temple-cream">
      <ScrollProgress />

      {/* ====== HEADER ====== */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 bg-temple-cream/95 backdrop-blur-md border-b border-temple-gold/20"
      >
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
              <Image src="/images/logo.png" alt="Shri Fragrance Logo" width={48} height={48} className="rounded-full" />
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
                { label: 'Contact', href: '#contact' },
                { label: 'My Account', href: '/dashboard', icon: User },
                { label: 'Admin', href: '/admin', icon: Shield }
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="flex items-center gap-1.5 text-sm font-medium text-temple-deep hover:text-temple-saffron transition-colors h-9"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <Input
                      placeholder="Search fragrances..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 text-sm bg-white/80 border-temple-gold/30"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}
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
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden overflow-hidden border-t border-temple-gold/10"
              >
                <nav className="flex flex-col py-4 gap-1">
                  {[
                    { label: 'Home', href: '#home' },
                    { label: 'Collections', href: '#products' },
                    { label: 'About', href: '#heritage' },
                    { label: 'Pooja Guide', href: '#pooja-guide' },
                    { label: 'Contact', href: '#contact' },
                    { label: 'My Account', href: '/dashboard', icon: User },
                    { label: 'Admin', href: '/admin', icon: Shield }
                  ].map(item => (
                    <Link key={item.label} href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-temple-deep hover:bg-temple-gold/10 rounded-md transition-colors"
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.label}
                      <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <main>
        {/* ====== HERO SECTION ====== */}
        <ParallaxSection id="home" className="relative min-h-[90vh] flex items-center" speed={0.15}>
          <div className="absolute inset-0">
            <Image src="/images/hero-bg.png" alt="Temple background" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-temple-maroon/90 via-temple-deep/80 to-temple-maroon/70" />
          </div>
          <FloatingParticles />
          <IncenseSmoke className="bottom-0 left-1/4 w-24" />

          {/* Mandala decorations */}
          <MandalaDecor className="absolute top-10 right-10 w-48 h-48 opacity-20 animate-spin-slow hidden lg:block" />
          <MandalaDecor className="absolute bottom-10 left-10 w-64 h-64 opacity-15 animate-spin-reverse hidden lg:block" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="max-w-3xl">
              {/* Letter-by-letter brand name */}
              <motion.div className="mb-6" initial="hidden" animate="visible"
                variants={staggerContainer}>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-wider">
                  {'SHRI FRAGRANCE'.split('').map((letter, i) => (
                    <motion.span key={i} variants={staggerItem}
                      className={letter === ' ' ? 'inline-block w-4' : 'inline-block gold-text'}>
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </h2>
              </motion.div>

              <motion.p variants={fadeInUp} initial="hidden" animate="visible"
                className="text-xl sm:text-2xl md:text-3xl text-temple-amber font-light mb-4 tracking-wide">
                From Sacred Temples to Your Home
              </motion.p>

              <motion.p variants={fadeInUp} initial="hidden" animate="visible"
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
                Experience the divine fragrances handcrafted with devotion, using sacred ingredients
                sourced from ancient temple traditions across South India.
              </motion.p>

              <motion.div variants={fadeInUp} initial="hidden" animate="visible"
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-4 mb-12">
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
              </motion.div>

              {/* Stats */}
              <motion.div variants={staggerContainer} initial="hidden" animate="visible"
                className="flex flex-wrap gap-12">
                {[
                  { value: 50, suffix: '+', label: 'Sacred Fragrances' },
                  { value: 75, suffix: '+', label: 'Years of Tradition' },
                  { value: 10, suffix: 'K+', label: 'Happy Families' }
                ].map((stat, i) => (
                  <motion.div key={i} variants={staggerItem} className="text-center flex-1 min-w-[80px]">
                    <div className="text-2xl sm:text-3xl font-bold gold-text">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm text-white/60 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Diya decoration */}
            <div className="absolute bottom-8 right-8 sm:right-16 hidden sm:block">
              <DiyaFlame className="animate-float-slow" />
              <div className="w-8 h-3 bg-temple-brass rounded-full mt-1 mx-auto" />
            </div>
          </div>
        </ParallaxSection>

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

        {/* ====== TRUST BADGES ====== */}
        <section className="py-12 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustBadges.map((badge, i) => (
                <motion.div key={i} variants={staggerItem}
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-temple-cream/50 border border-temple-gold/10 hover:shadow-lg hover:shadow-temple-gold/10 transition-all">
                  <div className="w-14 h-14 rounded-full saffron-gradient flex items-center justify-center mb-3">
                    <badge.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-temple-deep text-sm">{badge.title}</h3>
                  <p className="text-xs text-temple-gold mt-1">{badge.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <div className="temple-divider-ornate max-w-7xl mx-auto" />

        {/* ====== PRODUCTS SECTION ====== */}
        <section id="products" className="py-16 bg-temple-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} className="text-center mb-12">
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
            </motion.div>

            {/* Category Tabs */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} className="mb-8">
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
            </motion.div>

            {/* Product Grid */}
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => {
                  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  const isWished = wishlist.includes(product.id)
                  return (
                    <motion.div key={product.id} variants={staggerItem} layout
                      exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                      <Card className="card-artistic group bg-white border-temple-gold/10 overflow-hidden">
                        <div className="relative overflow-hidden">
                          <div className="relative aspect-square bg-temple-cream/50 p-6">
                            <Image src={product.image} alt={product.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
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
                          <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
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
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16">
                <CircleDot className="w-12 h-12 text-temple-gold/30 mx-auto mb-4" />
                <p className="text-temple-gold/60 text-lg">No products found matching your search.</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* ====== SPECIAL OFFER BANNER ====== */}
        <section className="relative py-16 sm:py-20 overflow-hidden royal-gradient">
          <FloatingParticles />
          <MandalaDecor className="absolute -top-10 -left-10 w-72 h-72 opacity-10 animate-spin-slow" />
          <MandalaDecor className="absolute -bottom-10 -right-10 w-72 h-72 opacity-10 animate-spin-reverse" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible"
              viewport={{ once: true }} className="flex-1 text-center lg:text-left">
              <Badge className="bg-temple-amber/20 text-temple-amber border-temple-amber/30 mb-4">
                <Gem className="w-3 h-3 mr-1" /> Festive Special
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Complete Pooja Collection
              </h2>
              <p className="text-lg text-temple-amber/80 mb-6">
                Save <span className="text-temple-amber font-bold">40%</span> This Festive Season —
                Includes Chandanam, Nag Champa, Roja & Sambrani
              </p>
              <Button size="lg"
                className="saffron-gradient text-white hover:opacity-90 px-8 py-6 text-lg font-bold shadow-xl">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Pooja Set — ₹1,499
              </Button>
            </motion.div>

            <motion.div variants={fadeInRight} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shrink-0">
              {/* Rotating circles */}
              <div className="absolute inset-0 border-2 border-dashed border-temple-amber/30 rounded-full animate-spin-slow" />
              <div className="absolute inset-4 border border-dotted border-temple-gold/20 rounded-full animate-spin-reverse" />
              <div className="absolute inset-8 border border-temple-amber/20 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
              <div className="relative z-10 text-center">
                <div className="text-5xl sm:text-6xl font-black text-temple-amber animate-breathe">40%</div>
                <div className="text-lg font-bold text-white tracking-wider">OFF</div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="temple-divider-ornate max-w-7xl mx-auto" />

        {/* ====== HERITAGE STORY SECTION ====== */}
        <section id="heritage" className="py-16 sm:py-20 bg-temple-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible"
                viewport={{ once: true }} className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl gopuram-shadow">
                  <Image src="/images/about-bg.png" alt="Temple heritage" width={600} height={400}
                    className="w-full h-auto object-cover" />
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
              </motion.div>

              <motion.div variants={fadeInRight} initial="hidden" whileInView="visible"
                viewport={{ once: true }}>
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* ====== TESTIMONIALS ====== */}
        <section className="py-16 bg-white/50 rangoli-dots">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} className="text-center mb-12">
              <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 mb-4">
                <Sparkles className="w-3 h-3 mr-1" /> Devotee Reviews
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-temple-deep">
                Blessed by <span className="gold-text-static">Devotees</span>
              </h2>
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <Card className="h-full bg-white border-temple-gold/10 hover:shadow-xl hover:shadow-temple-gold/10 transition-all card-artistic">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-temple-amber text-temple-amber" />
                        ))}
                      </div>
                      <p className="text-temple-deep/80 text-sm leading-relaxed mb-6 italic">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <Separator className="mb-4 bg-temple-gold/10" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full saffron-gradient flex items-center justify-center text-white text-sm font-bold">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-temple-deep text-sm">{t.name}</p>
                          <p className="text-xs text-temple-gold/70 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {t.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ====== POOJA GUIDE CTA ====== */}
        <section id="pooja-guide" className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 saffron-gradient-animated opacity-95" />
          <FloatingParticles />
          <MandalaDecor className="absolute top-0 right-0 w-96 h-96 opacity-10 animate-spin-slow" />

          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <Lamp className="w-12 h-12 text-white mx-auto mb-6 animate-float" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Complete Pooja Guide
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Learn the sacred rituals, mantras, and the correct way to perform daily pooja
              with our comprehensive guide curated by temple scholars.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary"
                className="bg-white text-temple-saffron hover:bg-white/90 px-8 py-6 font-semibold">
                <Flame className="w-5 h-5 mr-2" /> Read Pooja Guide
              </Button>
              <Button size="lg" variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6">
                <Clock className="w-5 h-5 mr-2" /> Aarti Timings
              </Button>
            </div>
          </motion.div>
        </section>

        {/* ====== NEWSLETTER ====== */}
        <section className="py-16 bg-temple-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="text-center ornate-border rounded-2xl p-8 sm:p-12 bg-white shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-2">
                  <DiyaFlame />
                  <Flame className="w-5 h-5 text-temple-saffron" />
                  <DiyaFlame />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-temple-deep mb-3">
                Receive <span className="gold-text-static">Blessings</span> & Offers
              </h2>
              <p className="text-temple-gold mb-8 max-w-md mx-auto">
                Subscribe to receive exclusive festive offers, new fragrance launches,
                and sacred pooja tips directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <Input
                  placeholder="Enter your email address"
                  className="flex-1 h-12 border-temple-gold/30 focus:border-temple-saffron bg-temple-cream/50"
                  type="email"
                />
                <Button className="h-12 px-8 saffron-gradient text-white hover:opacity-90 font-semibold">
                  <Mail className="w-4 h-4 mr-2" /> Subscribe
                </Button>
              </div>
              <p className="text-xs text-temple-gold/50 mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ====== FOOTER ====== */}
      <footer id="contact" className="bg-temple-deep text-white">
        <div className="temple-divider-ornate" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/logo.png" alt="Shri Fragrance" width={40} height={40} className="rounded-full" />
                <div>
                  <h3 className="font-bold text-lg gold-text-static">SHRI FRAGRANCE</h3>
                  <p className="text-[10px] text-temple-amber/60 tracking-widest uppercase">Sacred Temple Agarbathi</p>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                Bringing the divine fragrance of South Indian temples to homes across the world since 1948.
                Handcrafted with devotion, blessed by tradition.
              </p>
              <div className="flex gap-3">
                {['FB', 'TW', 'IG', 'YT'].map(social => (
                  <div key={social}
                    className="w-9 h-9 rounded-full border border-temple-gold/30 flex items-center justify-center text-xs text-temple-gold/60 hover:bg-temple-gold/10 hover:text-temple-amber cursor-pointer transition-colors">
                    {social}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-temple-amber mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Home', href: '#home' },
                  { label: 'Collections', href: '#products' },
                  { label: 'About Us', href: '#heritage' },
                  { label: 'Pooja Guide', href: '#pooja-guide' },
                  { label: 'Contact', href: '#contact' },
                  { label: 'My Account', href: '/dashboard' },
                  { label: 'Admin', href: '/admin' }
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-sm text-white/60 hover:text-temple-amber transition-colors flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-temple-amber mb-4">Categories</h4>
              <ul className="space-y-2">
                {['Premium Incense', 'Floral Collection', 'Classic Range', 'Herbal Blends', 'Pooja Sets', 'Gift Boxes'].map(cat => (
                  <li key={cat}>
                    <span className="text-sm text-white/60 hover:text-temple-amber cursor-pointer transition-colors flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" /> {cat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-temple-amber mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-white/60">
                  <MapPin className="w-4 h-4 text-temple-amber shrink-0 mt-0.5" />
                  42 Temple Road, Mylapore, Chennai, Tamil Nadu 600004
                </li>
                <li className="flex items-center gap-2 text-sm text-white/60">
                  <Phone className="w-4 h-4 text-temple-amber shrink-0" />
                  +91 98765 43210
                </li>
                <li className="flex items-center gap-2 text-sm text-white/60">
                  <Mail className="w-4 h-4 text-temple-amber shrink-0" />
                  info@shrifragrance.com
                </li>
                <li className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="w-4 h-4 text-temple-amber shrink-0" />
                  Mon-Sat: 9AM - 8PM
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-temple-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-white/40">
              © 2024 Shri Fragrance. All rights reserved. Crafted with devotion.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xs text-white/40 hover:text-temple-amber transition-colors flex items-center gap-1">
                <User className="w-3 h-3" /> My Account
              </Link>
              <Link href="/admin" className="text-xs text-white/40 hover:text-temple-amber transition-colors flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ====== CART SHEET ====== */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-temple-cream">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-temple-deep">
              <ShoppingCart className="w-5 h-5 text-temple-saffron" />
              Your Sacred Cart ({cartCount})
            </SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-temple-gold/10 flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-temple-gold/40" />
              </div>
              <p className="text-temple-gold/60 font-medium">Your cart is empty</p>
              <p className="text-xs text-temple-gold/40 mt-1">Add sacred fragrances to begin</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 p-3 bg-white rounded-xl border border-temple-gold/10">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-temple-cream/50 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-temple-deep truncate">{item.name}</h4>
                        <p className="text-xs text-temple-gold/70">{item.fragrance}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon"
                              className="h-7 w-7 border-temple-gold/30"
                              onClick={() => updateQuantity(item.id, -1)}>
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium text-temple-deep">{item.quantity}</span>
                            <Button variant="outline" size="icon"
                              className="h-7 w-7 border-temple-gold/30"
                              onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-temple-deep">₹{item.price * item.quantity}</span>
                            <Button variant="ghost" size="icon"
                              className="h-7 w-7 text-red-400 hover:text-red-500"
                              onClick={() => removeFromCart(item.id)}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <SheetFooter className="border-t border-temple-gold/10 pt-4">
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-temple-gold/70">Subtotal</span>
                    <span className="text-lg font-bold text-temple-deep">₹{cartTotal}</span>
                  </div>
                  {cartTotal < 499 && (
                    <p className="text-xs text-temple-saffron text-center">
                      Add ₹{499 - cartTotal} more for free delivery!
                    </p>
                  )}
                  {cartTotal >= 499 && (
                    <p className="text-xs text-emerald-600 flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" /> You qualify for free delivery!
                    </p>
                  )}
                  <Button className="w-full saffron-gradient text-white hover:opacity-90 py-6 text-base font-bold">
                    <Flame className="w-5 h-5 mr-2" /> Proceed to Checkout
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ====== QUICK VIEW DIALOG ====== */}
      <Dialog open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
        <DialogContent className="max-w-2xl bg-temple-cream border-temple-gold/20">
          <DialogTitle className="sr-only">{quickViewProduct?.name} Details</DialogTitle>
          {quickViewProduct && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
              <div className="relative aspect-square bg-white rounded-xl overflow-hidden">
                <Image src={quickViewProduct.image} alt={quickViewProduct.name} fill className="object-contain p-6" />
                <Badge className={`absolute top-3 left-3 ${quickViewProduct.badgeColor} text-xs`}>
                  {quickViewProduct.badge}
                </Badge>
              </div>
              <div className="flex flex-col">
                <Badge className="w-fit bg-temple-gold/10 text-temple-gold border-temple-gold/20 mb-3 text-xs">
                  {quickViewProduct.category}
                </Badge>
                <h3 className="text-2xl font-bold text-temple-deep mb-1">{quickViewProduct.name}</h3>
                <p className="text-sm text-temple-gold/70 mb-2">{quickViewProduct.subtitle}</p>
                <p className="text-sm text-temple-saffron flex items-center gap-1 mb-4">
                  <FlameKindling className="w-4 h-4" /> {quickViewProduct.fragrance}
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-temple-amber text-temple-amber' : 'text-temple-gold/30'}`} />
                  ))}
                  <span className="text-sm text-temple-gold/70 ml-2">
                    {quickViewProduct.rating} ({quickViewProduct.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-temple-deep">₹{quickViewProduct.price}</span>
                  <span className="text-lg text-temple-gold/40 line-through">₹{quickViewProduct.originalPrice}</span>
                  <Badge className="bg-temple-deep text-white text-xs">
                    {Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
                <p className="text-sm text-temple-deep/70 leading-relaxed mb-6">
                  Handcrafted with the finest natural ingredients using traditional temple methods.
                  Each stick burns for 45-60 minutes, filling your space with divine fragrance
                  perfect for daily pooja and meditation.
                </p>
                <div className="flex gap-3 mt-auto">
                  <Button onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null) }}
                    className="flex-1 saffron-gradient text-white hover:opacity-90 font-semibold py-5">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                  <Button variant="outline"
                    className="border-temple-gold text-temple-gold hover:bg-temple-gold/10 px-4"
                    onClick={() => toggleWishlist(quickViewProduct.id)}>
                    <Heart className={`w-4 h-4 ${wishlist.includes(quickViewProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ====== SCROLL TO TOP ====== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="h-12 w-12 rounded-full saffron-gradient text-white shadow-xl hover:opacity-90"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
