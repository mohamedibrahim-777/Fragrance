'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Flame, ShoppingCart, Heart, Star, Search, Menu, X, Minus, Plus,
  MapPin, Phone, Mail, ChevronRight, Truck, Shield, Award,
  Sparkles, Lamp, Flower2, Sun, Eye, Share2, Check, ArrowUp,
  Gem, FlameKindling, CircleDot, User, BookOpen, ChevronDown
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
    rating: 5, text: 'The Chandanam Sandalwood agarbathi reminds me of my visits to Tirupati temple. The fragrance is absolutely divine and fills our entire pooja room with sacred aroma.',
    avatar: 'PV'
  },
  {
    name: 'Rajesh Iyer', location: 'Bangalore, Karnataka',
    rating: 5, text: 'We have been using Shri Fragrance products for our daily pooja for over 10 years. The quality has remained consistently excellent. The Nag Champa is our family favorite.',
    avatar: 'RI'
  },
  {
    name: 'Lakshmi Sharma', location: 'Hyderabad, Telangana',
    rating: 5, text: 'The Sambrani Herbal incense has become essential for our evening aarti. The natural fragrance purifies the entire home. My grandmother approves!',
    avatar: 'LS'
  }
]

const trustBadges = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: Shield, title: '100% Natural', desc: 'No chemicals or additives' },
  { icon: Award, title: 'Temple Trusted', desc: 'Used in 500+ temples' },
  { icon: Sparkles, title: 'Handcrafted', desc: 'Traditional methods' }
]

const poojaSteps = [
  { step: 1, title: 'Prepare', desc: 'Clean the pooja room and arrange the altar with flowers and sacred items', icon: Sparkles },
  { step: 2, title: 'Light', desc: 'Light the agarbathi and diya to invite divine presence and purify the space', icon: Flame },
  { step: 3, title: 'Offer', desc: 'Present flowers, naivedyam, and sacred water with devotion and reverence', icon: Flower2 },
  { step: 4, title: 'Chant', desc: 'Recite mantras and stotrams to connect with the divine consciousness', icon: BookOpen },
  { step: 5, title: 'Meditate', desc: 'Sit in silence, absorb the sacred fragrance, and experience inner peace', icon: Sun }
]

// ====== SIMPLE COUNTER (no IntersectionObserver, just starts on mount) ======
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        let start = 0
        const duration = 1500
        const step = (timestamp: number) => {
          if (!start) start = timestamp
          const progress = Math.min((timestamp - start) / duration, 1)
          setCount(Math.floor(progress * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <div ref={ref}>{count}{suffix}</div>
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
  const [email, setEmail] = useState('')
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set())

  // Lightweight scroll detection with throttling
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 500)
          // Update scroll progress
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          const progress = docHeight > 0 ? scrollTop / docHeight : 0
          document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`)
          ticking = false
        })
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // IntersectionObserver for section reveals - one observer, lightweight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id) {
              setRevealedSections(prev => new Set(prev).add(id))
              observer.unobserve(entry.target)
            }
            entry.target.classList.add('revealed')
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    // Observe all sections and reveal elements
    const selectors = ['section[id]', '.reveal-up', '.reveal-left', '.reveal-right']
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => observer.observe(el))
    })

    return () => observer.disconnect()
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
    toast({ title: 'Added to Cart!', description: `${product.name} has been added to your cart.` })
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
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }, [])

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
      toast({ title: 'Subscribed!', description: 'You will receive sacred fragrance updates and offers.' })
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-temple-cream">
      {/* Scroll progress bar */}
      <div className="scroll-progress-bar" />

      {/* ====== HEADER ====== */}
      <header className="sticky top-0 z-50 bg-temple-cream/98 border-b border-temple-gold/15" style={{ backdropFilter: 'blur(8px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-1.5 text-[11px] text-temple-gold/80 border-b border-temple-gold/8">
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
              <img src="/images/logo.png" alt="Shri Fragrance Logo" width={44} height={44} className="rounded-full" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-wider gold-text-static">SHRI FRAGRANCE</h1>
                <p className="text-[9px] tracking-[0.2em] text-temple-saffron/80 uppercase">Sacred Temple Agarbathi</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Collections', href: '#products' },
                { label: 'About', href: '#heritage' },
                { label: 'Pooja Guide', href: '#pooja-guide' },
                { label: 'Contact', href: '#contact' }
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="px-3 py-2 text-sm font-medium text-temple-deep/80 hover:text-temple-saffron rounded-md hover:bg-temple-gold/5 transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {showSearch && (
                <Input
                  placeholder="Search fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-48 text-sm bg-white/90 border-temple-gold/25"
                  autoFocus
                />
              )}
              <Button variant="ghost" size="icon" onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery('') }}
                className="text-temple-deep/70 hover:text-temple-saffron h-9 w-9">
                <Search className="w-[18px] h-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)}
                className="relative text-temple-deep/70 hover:text-temple-saffron h-9 w-9">
                <ShoppingCart className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 bg-temple-saffron text-white text-[9px]">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="lg:hidden text-temple-deep/70"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-temple-gold/10 pb-3">
              <nav className="flex flex-col gap-0.5">
                {[
                  { label: 'Home', href: '#home' },
                  { label: 'Collections', href: '#products' },
                  { label: 'About', href: '#heritage' },
                  { label: 'Pooja Guide', href: '#pooja-guide' },
                  { label: 'Contact', href: '#contact' }
                ].map(item => (
                  <Link key={item.label} href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-temple-deep/80 hover:bg-temple-gold/8 rounded-md">
                    {item.label}
                    <ChevronRight className="w-4 h-4 opacity-30" />
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* ====== HERO SECTION ====== */}
        <section id="home" className="relative min-h-[88vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/images/hero-bg.png" alt="Temple background" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-br from-temple-maroon/92 via-temple-deep/85 to-temple-maroon/75" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-temple-amber" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                <span className="text-xs text-white/80 font-medium tracking-wide">Sacred Temple Traditions Since 1948</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-5 leading-[1.1]">
                From Sacred<br />
                <span className="gold-text">Temples</span> to<br />
                Your Home
              </h2>

              <p className="text-base sm:text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
                Experience divine fragrances handcrafted with devotion, using sacred ingredients
                sourced from ancient temple traditions across South India.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-14">
                <Button asChild size="lg"
                  className="saffron-gradient text-white hover:brightness-110 px-7 py-5 text-sm font-semibold shadow-lg shadow-temple-saffron/25 transition-all">
                  <a href="#products">
                    <Flame className="w-4 h-4 mr-2" />
                    Explore Collection
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg"
                  className="border-white/25 text-white/90 hover:bg-white/10 hover:border-white/40 px-7 py-5 text-sm bg-transparent">
                  <a href="#pooja-guide">
                    <Lamp className="w-4 h-4 mr-2" />
                    Pooja Guide
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 sm:gap-14">
                {[
                  { value: 50, suffix: '+', label: 'Sacred Fragrances' },
                  { value: 75, suffix: '+', label: 'Years of Tradition' },
                  { value: 500, suffix: 'K+', label: 'Happy Families' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl sm:text-3xl font-bold gold-text">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-[11px] text-white/50 mt-0.5 tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
            <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-4 h-4" style={{ animation: 'float-y 2s ease-in-out infinite' }} />
          </div>
        </section>

        {/* ====== MARQUEE STRIP ====== */}
        <div className="deep-maroon-gradient py-2.5 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {['Free Delivery on Orders Above ₹499', '100% Natural Ingredients', 'Trusted by 500+ Temples', 'Handcrafted with Devotion', '75+ Years of Sacred Tradition', 'Festive Season Sale - Up to 40% Off',
              'Free Delivery on Orders Above ₹499', '100% Natural Ingredients', 'Trusted by 500+ Temples', 'Handcrafted with Devotion', '75+ Years of Sacred Tradition', 'Festive Season Sale - Up to 40% Off'
            ].map((msg, i) => (
              <span key={i} className="text-temple-amber/90 text-xs font-medium mx-6 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-temple-amber/50" />
                {msg}
              </span>
            ))}
          </div>
        </div>

        {/* ====== TRUST BADGES ====== */}
        <section className="py-10 bg-white/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustBadges.map((badge, i) => (
                <div key={i}
                  className="reveal-up flex flex-col items-center text-center p-5 rounded-xl bg-white border border-temple-gold/8 hover:border-temple-gold/20 hover:shadow-md transition-all duration-300"
                  style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-12 h-12 rounded-full saffron-gradient flex items-center justify-center mb-3">
                    <badge.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-temple-deep text-sm">{badge.title}</h3>
                  <p className="text-[11px] text-temple-gold/70 mt-0.5">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== PRODUCTS SECTION ====== */}
        <section id="products" className="py-14 sm:py-16 bg-temple-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 reveal-up">
              <Badge className="bg-temple-gold/8 text-temple-gold border-temple-gold/15 mb-3">
                <Sparkles className="w-3 h-3 mr-1" /> Sacred Collection
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-temple-deep mb-2">
                Our <span className="gold-text-static">Divine</span> Fragrances
              </h2>
              <p className="text-sm text-temple-gold/80 max-w-lg mx-auto">
                Each agarbathi is handcrafted with sacred ingredients and blessed in temple traditions.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="mb-8 reveal-up">
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="mx-auto flex-wrap h-auto gap-1 bg-white/60 border border-temple-gold/10 p-1">
                  {['All', 'Premium', 'Floral', 'Classic', 'Herbal'].map(cat => (
                    <TabsTrigger key={cat} value={cat}
                      className="data-[state=active]:saffron-gradient data-[state=active]:text-white text-xs px-4 py-1.5 rounded-md">
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product, idx) => {
                const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                const isWished = wishlist.includes(product.id)
                return (
                  <div key={product.id} className="reveal-up" style={{ transitionDelay: `${idx * 60}ms` }}>
                    <Card className="group bg-white border-temple-gold/8 overflow-hidden hover:shadow-xl hover:shadow-temple-gold/8 transition-all duration-300 hover:-translate-y-1">
                      <div className="relative overflow-hidden">
                        <div className="relative aspect-square bg-gradient-to-b from-temple-cream/60 to-white p-6">
                          <img src={product.image} alt={product.name} loading="lazy"
                            className="object-contain p-4 w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <Badge className={`absolute top-3 left-3 ${product.badgeColor} text-[10px] font-semibold px-2 py-0.5`}>
                          {product.badge}
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-temple-deep text-white text-[10px] px-2 py-0.5">
                          -{discount}%
                        </Badge>
                        {/* Quick actions */}
                        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <Button size="icon" variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/95 shadow-sm"
                            onClick={() => toggleWishlist(product.id)}>
                            <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button size="icon" variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/95 shadow-sm"
                            onClick={() => setQuickViewProduct(product)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-temple-amber text-temple-amber' : 'text-temple-gold/20'}`} />
                          ))}
                          <span className="text-[10px] text-temple-gold/50 ml-1">({product.reviews})</span>
                        </div>
                        <h3 className="font-semibold text-temple-deep text-sm mb-0.5">{product.name}</h3>
                        <p className="text-[11px] text-temple-gold/60 mb-0.5">{product.subtitle}</p>
                        <p className="text-[11px] text-temple-saffron/70 flex items-center gap-1">
                          <FlameKindling className="w-3 h-3" /> {product.fragrance}
                        </p>
                        <div className="flex items-center gap-2 mt-2.5">
                          <span className="text-lg font-bold text-temple-deep">₹{product.price}</span>
                          <span className="text-xs text-temple-gold/40 line-through">₹{product.originalPrice}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button onClick={() => addToCart(product)}
                          className="w-full saffron-gradient text-white hover:brightness-110 font-semibold text-sm h-9 transition-all"
                          size="sm">
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <CircleDot className="w-10 h-10 text-temple-gold/20 mx-auto mb-3" />
                <p className="text-temple-gold/50">No products found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* ====== SPECIAL OFFER BANNER ====== */}
        <section className="relative py-14 sm:py-16 overflow-hidden royal-gradient">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left reveal-left">
              <Badge className="bg-temple-amber/15 text-temple-amber border-temple-amber/25 mb-3">
                <Gem className="w-3 h-3 mr-1" /> Festive Special
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Complete Pooja Collection
              </h2>
              <p className="text-base text-white/70 mb-5 max-w-md">
                Save <span className="text-temple-amber font-bold text-lg">40%</span> This Festive Season
                — Includes Chandanam, Nag Champa, Rose Pushpam & Sambrani
              </p>
              <Button size="lg"
                className="saffron-gradient text-white hover:brightness-110 px-7 py-5 text-sm font-bold shadow-xl transition-all">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop Pooja Set — ₹1,499
              </Button>
            </div>

            <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center shrink-0 reveal-right">
              <div className="absolute inset-0 border-2 border-temple-amber/20 rounded-full" />
              <div className="absolute inset-4 border border-temple-amber/15 rounded-full" />
              <div className="absolute inset-8 border border-temple-amber/10 rounded-full" />
              <div className="relative z-10 text-center">
                <div className="text-5xl sm:text-6xl font-black text-temple-amber">40%</div>
                <div className="text-sm font-bold text-white/80 tracking-wider">OFF</div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== HERITAGE STORY SECTION ====== */}
        <section id="heritage" className="py-14 sm:py-16 bg-temple-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="relative reveal-left">
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img src="/images/about-bg.png" alt="Temple heritage" width={600} height={400}
                    className="w-full h-auto object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-temple-maroon/50 to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-temple-amber" />
                      <span className="text-white/90 font-medium text-xs">Since 1948</span>
                    </div>
                  </div>
                </div>
                {/* Floating stats */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3.5 border border-temple-gold/15 hidden sm:block">
                  <div className="text-center">
                    <div className="text-xl font-bold gold-text-static">75+</div>
                    <div className="text-[10px] text-temple-gold/70">Years Legacy</div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3.5 border border-temple-gold/15 hidden sm:block">
                  <div className="text-center">
                    <div className="text-xl font-bold gold-text-static">500+</div>
                    <div className="text-[10px] text-temple-gold/70">Temples Trust Us</div>
                  </div>
                </div>
              </div>

              <div className="reveal-right">
                <Badge className="bg-temple-deep/8 text-temple-deep border-temple-deep/15 mb-3">
                  <Award className="w-3 h-3 mr-1" /> Our Heritage
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-temple-deep mb-5">
                  A Legacy of <span className="gold-text-static">Sacred</span> Fragrance
                </h2>
                <div className="space-y-3.5 text-temple-deep/75 text-sm leading-relaxed">
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
                <div className="grid grid-cols-3 gap-3 mt-7">
                  {[
                    { icon: FlameKindling, label: 'Sacred Blends' },
                    { icon: Flower2, label: 'Natural Herbs' },
                    { icon: Sun, label: 'Sun-Dried' }
                  ].map((item, i) => (
                    <div key={i} className="text-center p-3 rounded-lg bg-white border border-temple-gold/8">
                      <item.icon className="w-5 h-5 text-temple-saffron mx-auto mb-1.5" />
                      <span className="text-[11px] font-medium text-temple-deep">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== POOJA GUIDE SECTION ====== */}
        <section id="pooja-guide" className="py-14 sm:py-16 bg-white/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 reveal-up">
              <Badge className="bg-temple-saffron/8 text-temple-saffron border-temple-saffron/15 mb-3">
                <Lamp className="w-3 h-3 mr-1" /> Sacred Guide
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-temple-deep mb-2">
                The <span className="gold-text-static">Divine</span> Pooja Path
              </h2>
              <p className="text-sm text-temple-gold/80 max-w-lg mx-auto">
                Follow these sacred steps to create a blessed atmosphere in your home pooja room.
              </p>
            </div>

            {/* Steps with connecting line */}
            <div className="relative">
              <div className="hidden lg:block absolute top-1/2 left-[8%] right-[8%] h-px bg-gradient-to-r from-temple-gold/10 via-temple-saffron/25 to-temple-gold/10" />

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                {poojaSteps.map((step, i) => (
                  <div key={step.step} className="reveal-up" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="text-center p-5 rounded-xl bg-white border border-temple-gold/10 hover:shadow-lg hover:border-temple-gold/20 transition-all duration-300 group">
                      <div className="relative mx-auto mb-3">
                        <div className="w-14 h-14 rounded-full saffron-gradient flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300">
                          <step.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-temple-deep text-white text-[9px] font-bold flex items-center justify-center">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="font-bold text-temple-deep text-sm mb-1">{step.title}</h3>
                      <p className="text-[11px] text-temple-deep/50 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====== TESTIMONIALS ====== */}
        <section className="py-14 sm:py-16 bg-temple-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 reveal-up">
              <Badge className="bg-temple-gold/8 text-temple-gold border-temple-gold/15 mb-3">
                <Sparkles className="w-3 h-3 mr-1" /> Devotee Reviews
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-temple-deep">
                Blessed by <span className="gold-text-static">Devotees</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <div key={i} className="reveal-up" style={{ transitionDelay: `${i * 100}ms` }}>
                  <Card className="h-full bg-white border-temple-gold/8 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-0.5 mb-3">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-temple-amber text-temple-amber" />
                        ))}
                      </div>
                      <p className="text-sm text-temple-deep/70 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                      <div className="flex items-center gap-3 pt-3 border-t border-temple-gold/8">
                        <div className="w-9 h-9 rounded-full saffron-gradient flex items-center justify-center text-white text-xs font-bold">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-temple-deep">{t.name}</p>
                          <p className="text-[11px] text-temple-gold/60">{t.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== NEWSLETTER ====== */}
        <section id="contact" className="py-14 sm:py-16 deep-maroon-gradient">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <div className="reveal-up">
              <Flame className="w-8 h-8 text-temple-amber mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Stay Blessed with Sacred Updates
              </h2>
              <p className="text-sm text-white/60 mb-6">
                Subscribe to receive exclusive offers, new fragrance launches, and sacred festival reminders.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 bg-white/10 border-white/15 text-white placeholder:text-white/40"
                  type="email"
                />
                <Button type="submit"
                  className="saffron-gradient text-white hover:brightness-110 px-5 h-10 font-semibold text-sm transition-all">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* ====== FOOTER ====== */}
        <footer className="bg-temple-maroon pt-12 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <img src="/images/logo.png" alt="Logo" width={36} height={36} className="rounded-full" />
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-wider">SHRI FRAGRANCE</h3>
                    <p className="text-[9px] text-temple-amber/60 tracking-wider">SACRED TEMPLE AGARBATHI</p>
                  </div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed max-w-[200px]">
                  Handcrafted with devotion, blessed in sacred temples, delivered to your home.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-white text-xs tracking-wider mb-3">QUICK LINKS</h4>
                <div className="space-y-2">
                  {['Home', 'Collections', 'About Us', 'Pooja Guide'].map(link => (
                    <a key={link} href="#" className="block text-xs text-white/40 hover:text-temple-amber transition-colors">{link}</a>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold text-white text-xs tracking-wider mb-3">SUPPORT</h4>
                <div className="space-y-2">
                  {['Track Order', 'Shipping Policy', 'Returns', 'FAQs'].map(link => (
                    <a key={link} href="#" className="block text-xs text-white/40 hover:text-temple-amber transition-colors">{link}</a>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold text-white text-xs tracking-wider mb-3">CONTACT</h4>
                <div className="space-y-2 text-xs text-white/40">
                  <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +91 98765 43210</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> info@shrifragrance.com</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Chennai, Tamil Nadu</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-[11px] text-white/30">&copy; 2024 Shri Fragrance. All rights reserved.</p>
              <p className="text-[11px] text-white/30">Handcrafted with devotion in South India</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full saffron-gradient text-white shadow-lg flex items-center justify-center hover:brightness-110 transition-all"
          style={{ animation: 'fade-in 0.2s ease-out' }}>
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* ====== CART SHEET ====== */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-temple-cream">
          <SheetHeader>
            <SheetTitle className="text-temple-deep flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Your Cart ({cartCount})
            </SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-temple-gold/50">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Your cart is empty</p>
              <p className="text-xs mt-1">Add sacred fragrances to get started</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 bg-white rounded-lg border border-temple-gold/8">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded bg-temple-cream/50 p-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-temple-deep truncate">{item.name}</h4>
                      <p className="text-xs text-temple-gold/60">{item.fragrance}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="icon" className="h-6 w-6 border-temple-gold/20"
                                            onClick={() => updateQuantity(item.id, -1)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-xs font-medium w-5 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6 border-temple-gold/20"
                            onClick={() => updateQuantity(item.id, 1)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-temple-deep">₹{item.price * item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-temple-gold/40 hover:text-red-500"
                            onClick={() => removeFromCart(item.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-temple-gold/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-temple-gold/70">Subtotal</span>
                  <span className="font-bold text-temple-deep">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-temple-gold/50">Shipping</span>
                  <span className="text-temple-saffron font-medium">{cartTotal >= 499 ? 'FREE' : '₹49'}</span>
                </div>
                <Separator className="bg-temple-gold/10" />
                <div className="flex justify-between">
                  <span className="font-semibold text-temple-deep">Total</span>
                  <span className="font-bold text-lg text-temple-deep">₹{cartTotal + (cartTotal >= 499 ? 0 : 49)}</span>
                </div>
                <Button className="w-full saffron-gradient text-white hover:brightness-110 font-semibold mt-2"
                  onClick={() => { toast({ title: 'Order Placed!', description: 'Your sacred order has been placed successfully.' }); setCart([]); setCartOpen(false); }}>
                  <Check className="w-4 h-4 mr-2" /> Checkout
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ====== QUICK VIEW DIALOG ====== */}
      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent className="sm:max-w-lg bg-temple-cream border-temple-gold/15">
          {quickViewProduct && (
            <>
              <DialogTitle className="sr-only">{quickViewProduct.name}</DialogTitle>
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="sm:w-48 aspect-square bg-white rounded-lg p-4 border border-temple-gold/8">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name}
                    className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <Badge className={`${quickViewProduct.badgeColor} text-[10px] mb-2`}>
                    {quickViewProduct.badge}
                  </Badge>
                  <h3 className="text-xl font-bold text-temple-deep mb-1">{quickViewProduct.name}</h3>
                  <p className="text-sm text-temple-gold/60 mb-2">{quickViewProduct.subtitle}</p>

                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-temple-amber text-temple-amber' : 'text-temple-gold/20'}`} />
                    ))}
                    <span className="text-xs text-temple-gold/50 ml-1">({quickViewProduct.reviews} reviews)</span>
                  </div>

                  <p className="text-xs text-temple-saffron/70 flex items-center gap-1 mb-3">
                    <FlameKindling className="w-3 h-3" /> {quickViewProduct.fragrance}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-temple-deep">₹{quickViewProduct.price}</span>
                    <span className="text-sm text-temple-gold/40 line-through">₹{quickViewProduct.originalPrice}</span>
                    <Badge className="bg-green-100 text-green-700 text-[10px]">
                      {Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null) }}
                      className="flex-1 saffron-gradient text-white hover:brightness-110 font-semibold">
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                    <Button variant="outline" className="border-temple-gold/25"
                      onClick={() => toggleWishlist(quickViewProduct.id)}>
                      <Heart className={`w-4 h-4 ${wishlist.includes(quickViewProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
