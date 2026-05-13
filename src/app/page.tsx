'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Flame, ShoppingCart, Heart, Star, Search, Menu, X, Minus, Plus,
  MapPin, Phone, Mail, Clock, ChevronRight, Truck, Shield, Award,
  Sparkles, Lamp, Flower2, Sun, Eye, Share2, Check, ArrowUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'

// Product data
const products = [
  {
    id: 1,
    name: "Chandanam Sandalwood",
    subtitle: "Premium Hand-Rolled Agarbathi",
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviews: 2847,
    image: "/images/product1.png",
    category: "premium",
    fragrance: "Sandalwood",
    description: "Hand-rolled with pure Mysore sandalwood powder and natural herbs. Each stick burns for 45 minutes, filling your pooja room with divine fragrance.",
    badge: "Bestseller",
    inStock: true,
  },
  {
    id: 2,
    name: "Malligai Jasmine",
    subtitle: "Temple Fresh Mogra Incense",
    price: 249,
    originalPrice: 399,
    rating: 4.8,
    reviews: 1923,
    image: "/images/product2.png",
    category: "floral",
    fragrance: "Jasmine",
    description: "Crafted with fresh Madurai jasmine extracts and traditional South Indian herbs. Perfect for evening pooja and meditation.",
    badge: "New",
    inStock: true,
  },
  {
    id: 3,
    name: "Nag Champa Classic",
    subtitle: "Sacred Temple Incense",
    price: 299,
    originalPrice: 449,
    rating: 4.9,
    reviews: 3541,
    image: "/images/product3.png",
    category: "classic",
    fragrance: "Nag Champa",
    description: "The timeless fragrance of South Indian temples. Made with pure champa flower extract and sandalwood base for an authentic divine experience.",
    badge: "Divine",
    inStock: true,
  },
  {
    id: 4,
    name: "Roja Camphor Blend",
    subtitle: "Pooja Rose & Kapur Mix",
    price: 279,
    originalPrice: 399,
    rating: 4.7,
    reviews: 1562,
    image: "/images/product4.png",
    category: "premium",
    fragrance: "Rose & Camphor",
    description: "A divine blend of Indian rose petals and pure camphor. Traditionally used in temple archana and special pooja ceremonies.",
    badge: "Sacred",
    inStock: true,
  },
  {
    id: 5,
    name: "Sambrani Herbal",
    subtitle: "Traditional Benzoin Resin",
    price: 399,
    originalPrice: 549,
    rating: 4.8,
    reviews: 1205,
    image: "/images/product5.png",
    category: "herbal",
    fragrance: "Sambrani",
    description: "Pure sambrani resin blended with 21 sacred herbs as per traditional Ayurvedic formulations. Ideal for homam and special poojas.",
    badge: "Herbal",
    inStock: true,
  },
  {
    id: 6,
    name: "Khus Vetiver Classic",
    subtitle: "Cooling Temple Incense",
    price: 269,
    originalPrice: 399,
    rating: 4.7,
    reviews: 987,
    image: "/images/product6.png",
    category: "herbal",
    fragrance: "Vetiver & Patchouli",
    description: "Cool vetiver root combined with earthy patchouli, traditionally used in South Indian temples during summer months for its calming properties.",
    badge: "Cooling",
    inStock: true,
  },
]

const categories = [
  { id: 'all', name: 'All Collections', icon: Sparkles },
  { id: 'premium', name: 'Premium', icon: Award },
  { id: 'floral', name: 'Floral', icon: Flower2 },
  { id: 'classic', name: 'Classic', icon: Lamp },
  { id: 'herbal', name: 'Herbal', icon: Sun },
]

const testimonials = [
  {
    name: "Priya Venkatesh",
    location: "Chennai, Tamil Nadu",
    text: "The Chandanam Sandalwood agarbathi reminds me exactly of the Tirupati temple. The fragrance is pure and lingers beautifully during our morning pooja.",
    rating: 5,
    avatar: "PV",
  },
  {
    name: "Lakshmi Raman",
    location: "Bangalore, Karnataka",
    text: "I have tried many brands but Divya Dhoop's Nag Champa is the most authentic. It transforms my pooja room into a sacred temple space.",
    rating: 5,
    avatar: "LR",
  },
  {
    name: "Meenakshi Iyer",
    location: "Madurai, Tamil Nadu",
    text: "The Malligai Jasmine fragrance is like offering fresh flowers to the deity every day. Truly divine quality that our family trusts for all rituals.",
    rating: 5,
    avatar: "MI",
  },
]

interface CartItem {
  productId: number
  quantity: number
}

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
  const { toast } = useToast()
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const addToCart = (productId: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === productId)
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
    toast({
      title: "Added to Cart",
      description: "Item added to your sacred collection",
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId))
  }

  const updateCartQuantity = (productId: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : item
        }
        return item
      })
    )
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

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

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Temple Top Border Ornament */}
      <div className="temple-divider w-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-temple-gold animate-glow">
                <Image
                  src="/images/logo.png"
                  alt="Divya Dhoop Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gold-text tracking-wide">DIVYA DHOOP</h1>
                <p className="text-xs text-muted-foreground -mt-1 tracking-widest">SACRED AGARBATHI</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold gold-text">DIVYA DHOOP</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {['Home', 'Collections', 'About', 'Pooja Guide', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={item === 'Collections' ? scrollToProducts : undefined}
                  className="text-sm font-medium text-foreground/80 hover:text-temple-gold transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-temple-gold transition-all group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Search + Cart + Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48 lg:w-64 bg-secondary/50 border-temple-gold/30 focus:border-temple-gold"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-temple-gold/10"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-temple-deep text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-temple-gold/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-slide-up">
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center relative mb-3">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary/50 border-temple-gold/30"
                />
              </div>
              {['Home', 'Collections', 'About', 'Pooja Guide', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Collections') scrollToProducts()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-temple-gold/10 hover:text-temple-gold transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg.png"
              alt="South Indian Temple"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-temple-maroon/90 via-temple-deep/80 to-temple-maroon/70" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="max-w-2xl">
              {/* Temple Ornament */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-temple-gold" />
                <span className="text-temple-gold text-sm tracking-[0.3em] font-medium uppercase">Sacred Fragrances</span>
                <div className="h-px w-8 bg-temple-gold" />
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Divine Agarbathi
                <span className="block text-temple-gold mt-1">From Sacred Temples</span>
              </h1>

              <p className="text-base sm:text-lg text-temple-cream/80 mb-8 max-w-xl leading-relaxed">
                Handcrafted with pure ingredients and blessed traditions, our agarbathi carries the sacred fragrance of South Indian temples into your home. Elevate every pooja with divine aroma.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={scrollToProducts}
                  className="saffron-gradient text-white font-semibold text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Flame className="mr-2 h-5 w-5" />
                  Explore Collection
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-temple-gold text-temple-gold hover:bg-temple-gold/10 font-semibold text-base px-8 py-6"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Pooja Essentials
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[
                  { label: 'Sacred Fragrances', value: '50+' },
                  { label: 'Years of Tradition', value: '75+' },
                  { label: 'Happy Families', value: '10K+' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl sm:text-3xl font-bold text-temple-gold">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-temple-cream/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" className="w-full h-auto fill-background">
              <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,60 L0,60 Z" />
            </svg>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {[
                { icon: Truck, title: 'Free Delivery', desc: 'Orders above ₹499' },
                { icon: Shield, title: '100% Natural', desc: 'Pure ingredients only' },
                { icon: Award, title: 'Temple Trusted', desc: 'Used in 500+ temples' },
                { icon: Flame, title: 'Handcrafted', desc: 'Traditional methods' },
              ].map((badge) => (
                <div key={badge.title} className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="p-2 rounded-lg bg-temple-gold/10">
                    <badge.icon className="h-5 w-5 text-temple-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{badge.title}</p>
                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section ref={productsRef} className="py-12 sm:py-16 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12 bg-temple-gold" />
                <Lamp className="h-5 w-5 text-temple-gold" />
                <div className="h-px w-12 bg-temple-gold" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Our Sacred <span className="gold-text">Collections</span>
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Handpicked fragrances crafted with devotion, perfect for your daily pooja and special ceremonies
              </p>
            </div>

            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
              <TabsList className="w-full sm:w-auto bg-secondary/50 border border-border">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="data-[state=active]:bg-temple-gold data-[state=active]:text-white gap-1.5 text-xs sm:text-sm"
                  >
                    <cat.icon className="h-3.5 w-3.5 hidden sm:block" />
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border/60 hover:border-temple-gold/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    {/* Overlay Actions */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge className="bg-temple-deep text-white text-xs font-medium shadow-md">
                        {product.badge}
                      </Badge>
                      {product.originalPrice > product.price && (
                        <Badge className="bg-temple-saffron text-white text-xs shadow-md">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-full bg-white/90 shadow-md hover:bg-temple-gold hover:text-white"
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-full bg-white/90 shadow-md hover:bg-temple-gold hover:text-white"
                        onClick={() => {
                          setSelectedProduct(product)
                          setProductDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Bottom Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-temple-gold text-temple-gold' : 'text-muted-foreground/30'}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {product.rating} ({product.reviews.toLocaleString()})
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                    <p className="text-xs text-temple-gold mt-1 font-medium">
                      🪷 {product.fragrance} Fragrance
                    </p>
                  </CardContent>

                  <CardFooter className="p-4 sm:p-5 pt-0 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-foreground">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <Button
                      onClick={() => addToCart(product.id)}
                      className="bg-temple-gold hover:bg-temple-brass text-white font-medium gap-2 transition-all hover:scale-105"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Flower2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No fragrances found matching your search</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Try a different search term or category</p>
              </div>
            )}
          </div>
        </section>

        {/* Temple Divider */}
        <div className="temple-divider w-full max-w-5xl mx-auto" />

        {/* Special Offer Banner */}
        <section className="py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute inset-0 deep-maroon-gradient" />
          <div className="absolute inset-0 kolam-pattern opacity-5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex-1 text-center lg:text-left">
                <Badge className="bg-temple-gold text-temple-maroon font-semibold mb-4">
                  🙏 Pooja Special Offer
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Complete Pooja Collection
                  <span className="block text-temple-gold">Save 40% This Festive Season</span>
                </h2>
                <p className="text-temple-cream/70 mb-6 max-w-lg">
                  Get our entire collection of 6 sacred fragrances along with a traditional brass incense holder.
                  Perfect for your home temple and makes an ideal gift for loved ones.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="saffron-gradient text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Flame className="mr-2 h-5 w-5" />
                    Shop Pooja Set - ₹1,499
                  </Button>
                </div>
                <p className="text-xs text-temple-cream/40 mt-3">
                  🪔 Includes free brass diya and kumkum with every set
                </p>
              </div>
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-temple-gold/20 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-temple-gold/10 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-5xl sm:text-6xl font-bold text-temple-gold">40%</span>
                    <p className="text-temple-cream/80 font-semibold text-sm mt-1">FESTIVE OFF</p>
                    <p className="text-temple-cream/50 text-xs">Limited Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="flex-1 relative">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden gopuram-shadow">
                  <Image
                    src="/images/about-bg.png"
                    alt="South Indian Temple Heritage"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-temple-gold text-white p-4 rounded-lg shadow-lg">
                  <p className="text-3xl font-bold">75+</p>
                  <p className="text-xs font-medium">Years of Heritage</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-temple-gold" />
                  <span className="text-temple-gold text-sm tracking-widest uppercase font-medium">Our Heritage</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Rooted in <span className="gold-text">Temple Traditions</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Divya Dhoop was born in the sacred corridors of South Indian temples, where the art of making
                  agarbathi has been passed down through generations of temple artisans. Our master craftsmen
                  continue the age-old tradition of hand-rolling each incense stick with pure sandalwood,
                  natural herbs, and divine devotion.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Every stick of Divya Dhoop is crafted using ingredients sourced directly from temple gardens
                  and Ayurvedic herb farms across Tamil Nadu, Karnataka, and Kerala. We believe that the
                  fragrance used in pooja should be as pure as the prayers themselves.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Flame, title: 'Sacred Ingredients', desc: 'Temple-sourced pure materials' },
                    { icon: Award, title: 'Artisan Crafted', desc: 'Hand-rolled by temple artisans' },
                    { icon: Shield, title: 'No Chemicals', desc: '100% natural & organic' },
                    { icon: Lamp, title: 'Temple Blessed', desc: 'Blessed in consecrated temples' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <item.icon className="h-5 w-5 text-temple-gold flex-shrink-0 mt-0.5" />
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
        </section>

        {/* Temple Divider */}
        <div className="temple-divider w-full max-w-5xl mx-auto" />

        {/* Testimonials */}
        <section className="py-12 sm:py-16 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12 bg-temple-gold" />
                <Flower2 className="h-5 w-5 text-temple-gold" />
                <div className="h-px w-12 bg-temple-gold" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Devotees <span className="gold-text">Speak</span>
              </h2>
              <p className="text-muted-foreground mt-2">Hear from families who trust our sacred fragrances</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-border/40 hover:border-temple-gold/30 transition-all duration-300 bg-card"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-temple-gold text-temple-gold" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full saffron-gradient flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pooja Guide CTA */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="temple-gradient rounded-2xl p-8 sm:p-12 text-center border border-border gopuram-shadow">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-temple-gold" />
                <Lamp className="h-5 w-5 text-temple-gold" />
                <div className="h-px w-8 bg-temple-gold" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                The Sacred <span className="gold-text">Pooja Guide</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                Learn the traditional South Indian way of offering agarbathi during pooja.
                Our guide covers the significance of each fragrance for different deities,
                occasions, and times of day according to Agama Shastras.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="saffron-gradient text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Read Pooja Guide
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-temple-gold text-temple-gold hover:bg-temple-gold/10"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share with Family
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 sm:py-16 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Receive Sacred <span className="gold-text">Blessings</span>
              </h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Join our family for exclusive offers, new fragrance launches, and festive pooja tips delivered to your inbox.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-card border-border focus:border-temple-gold"
                />
                <Button className="bg-temple-gold hover:bg-temple-brass text-white font-semibold px-6 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/60 mt-3">
                🙏 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-temple-maroon text-temple-cream/80">
        <div className="temple-divider w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-temple-gold">
                  <Image
                    src="/images/logo.png"
                    alt="Divya Dhoop"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">DIVYA DHOOP</h3>
                  <p className="text-xs text-temple-cream/50 tracking-widest">SACRED AGARBATHI</p>
                </div>
              </div>
              <p className="text-sm text-temple-cream/60 leading-relaxed">
                Crafting divine fragrances since 1948, blessed by South Indian temple traditions.
                Every stick is a prayer, every scent is sacred.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                {['Our Collections', 'Pooja Essentials', 'Temple Specials', 'Gift Sets', 'Bulk Orders'].map((link) => (
                  <li key={link}>
                    <button className="text-sm text-temple-cream/60 hover:text-temple-gold transition-colors flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-2">
                {['Shipping Info', 'Returns Policy', 'Track Order', 'FAQs', 'Privacy Policy'].map((link) => (
                  <li key={link}>
                    <button className="text-sm text-temple-cream/60 hover:text-temple-gold transition-colors flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-temple-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-temple-cream/60">12 Temple Street, Mylapore, Chennai 600004</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-temple-gold flex-shrink-0" />
                  <span className="text-sm text-temple-cream/60">+91 44 2847 1234</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-temple-gold flex-shrink-0" />
                  <span className="text-sm text-temple-cream/60">namaste@divyadhoop.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-temple-gold flex-shrink-0" />
                  <span className="text-sm text-temple-cream/60">Mon-Sat: 6AM - 9PM</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-temple-cream/10 mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-temple-cream/40">
              © 2026 Divya Dhoop. All rights reserved. Crafted with 🙏 devotion.
            </p>
            <div className="flex items-center gap-4">
              {['Visa', 'Mastercard', 'UPI', 'GPay'].map((method) => (
                <span key={method} className="text-xs text-temple-cream/40 bg-temple-cream/5 px-2 py-1 rounded">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-background">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-temple-gold" />
              Your Sacred Cart
              {cartCount > 0 && (
                <Badge className="bg-temple-deep text-white">{cartCount}</Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <div className="relative w-24 h-24">
                <Flower2 className="h-24 w-24 text-temple-gold/20" />
              </div>
              <p className="text-muted-foreground font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/60 text-center">
                Add sacred fragrances to begin your pooja journey
              </p>
              <Button
                onClick={() => setCartOpen(false)}
                className="bg-temple-gold hover:bg-temple-brass text-white mt-2"
              >
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
                      <div key={item.productId} className="flex gap-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">{product.fragrance}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7 border-temple-gold/30"
                                onClick={() => updateCartQuantity(item.productId, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7 border-temple-gold/30"
                                onClick={() => updateCartQuantity(item.productId, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-bold text-sm">₹{product.price * item.quantity}</p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              <SheetFooter className="mt-4 border-t border-border pt-4">
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pooja Blessing Discount</span>
                    <span className="text-temple-gold font-medium">-₹{Math.round(cartTotal * 0.1)}</span>
                  </div>
                  <Separator className="bg-border" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg gold-text">₹{Math.round(cartTotal * 0.9)}</span>
                  </div>
                  <Button className="w-full saffron-gradient text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                    <Flame className="mr-2 h-5 w-5" />
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-center text-muted-foreground/60">
                    🪔 Free brass diya on orders above ₹999
                  </p>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Product Quick View Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-3xl bg-background border-border">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col sm:flex-row gap-6 -mt-4">
                <div className="relative w-full sm:w-1/2 aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-temple-deep text-white">
                    {selectedProduct.badge}
                  </Badge>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-temple-gold text-temple-gold' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">
                      {selectedProduct.rating} ({selectedProduct.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-muted-foreground">{selectedProduct.subtitle}</p>
                  <p className="text-sm text-temple-gold mt-1 font-medium flex items-center gap-1">
                    <Flower2 className="h-4 w-4" />
                    {selectedProduct.fragrance} Fragrance
                  </p>

                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-3xl font-bold">₹{selectedProduct.price}</span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">₹{selectedProduct.originalPrice}</span>
                        <Badge className="bg-temple-saffron text-white">
                          {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>

                  <Separator className="my-4 bg-border" />

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    {[
                      'Hand-rolled with pure natural ingredients',
                      'Burns for 40-45 minutes per stick',
                      'Approx 30 sticks per pack',
                      'No artificial chemicals or colors',
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-temple-gold flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto pt-6">
                    <Button
                      onClick={() => {
                        addToCart(selectedProduct.id)
                        setProductDialogOpen(false)
                      }}
                      className="flex-1 bg-temple-gold hover:bg-temple-brass text-white font-semibold gap-2"
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-temple-gold hover:bg-temple-gold/10"
                      onClick={() => toggleWishlist(selectedProduct.id)}
                    >
                      <Heart className={`h-5 w-5 ${wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-temple-gold text-white shadow-lg hover:bg-temple-brass transition-all hover:scale-110 flex items-center justify-center animate-slide-up"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
