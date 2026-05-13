'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Heart, Award, MapPin, User, Settings,
  ArrowLeft, Package, CheckCircle2, Truck,
  ChevronRight, ChevronLeft, Flame, Sparkles, Gift,
  Crown, Copy, Trash2, Plus, Edit3, IndianRupee,
  CircleDot, TrendingUp, Calendar, MapPinned, Menu, X,
  Bell, Shield, Lock, Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

// ====== TYPES ======

interface Address {
  id: number
  label: string
  name: string
  line1: string
  line2: string
  pincode: string
  phone: string
  isDefault: boolean
}

interface WishlistItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  inStock: boolean
}

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface NotificationSettings {
  orderUpdates: boolean
  promoOffers: boolean
  priceDrop: boolean
  newArrivals: boolean
  loyaltyPoints: boolean
}

// ====== SAMPLE DATA ======

const initialUserData = {
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
    id: 'SF-7841', date: '12 Mar 2025', status: 'Delivered', statusStep: 3,
    items: [
      { name: 'Chandanam Sandalwood', qty: 2, price: 698, image: '/images/product1.png' },
      { name: 'Nag Champa Classic', qty: 1, price: 299, image: '/images/product3.png' },
    ],
    total: 997,
    trackingSteps: [
      { label: 'Order Placed', date: '10 Mar 2025, 10:30 AM', done: true },
      { label: 'Packed & Shipped', date: '11 Mar 2025, 02:15 PM', done: true },
      { label: 'In Transit', date: '11 Mar 2025, 06:00 PM', done: true },
      { label: 'Out for Delivery', date: '12 Mar 2025, 08:00 AM', done: true },
      { label: 'Delivered', date: '12 Mar 2025, 01:45 PM', done: true },
    ],
  },
  {
    id: 'SF-7830', date: '08 Mar 2025', status: 'Shipped', statusStep: 2,
    items: [{ name: 'Malligai Jasmine', qty: 3, price: 747, image: '/images/product2.png' }],
    total: 747,
    trackingSteps: [
      { label: 'Order Placed', date: '07 Mar 2025, 11:00 AM', done: true },
      { label: 'Packed & Shipped', date: '08 Mar 2025, 09:30 AM', done: true },
      { label: 'In Transit', date: '08 Mar 2025, 03:00 PM', done: true },
      { label: 'Out for Delivery', date: 'Expected 09 Mar', done: false },
      { label: 'Delivered', date: 'Expected 09 Mar', done: false },
    ],
  },
  {
    id: 'SF-7815', date: '28 Feb 2025', status: 'Processing', statusStep: 1,
    items: [
      { name: 'Sambrani Herbal', qty: 1, price: 399, image: '/images/product5.png' },
      { name: 'Roja Camphor Blend', qty: 1, price: 279, image: '/images/product4.png' },
    ],
    total: 678,
    trackingSteps: [
      { label: 'Order Placed', date: '28 Feb 2025, 04:20 PM', done: true },
      { label: 'Packed & Shipped', date: 'Processing...', done: false },
      { label: 'In Transit', date: '-', done: false },
      { label: 'Out for Delivery', date: '-', done: false },
      { label: 'Delivered', date: '-', done: false },
    ],
  },
  {
    id: 'SF-7798', date: '15 Feb 2025', status: 'Delivered', statusStep: 3,
    items: [{ name: 'Khus Vetiver Classic', qty: 2, price: 538, image: '/images/product6.png' }],
    total: 538,
    trackingSteps: [
      { label: 'Order Placed', date: '14 Feb 2025, 09:00 AM', done: true },
      { label: 'Packed & Shipped', date: '14 Feb 2025, 04:00 PM', done: true },
      { label: 'In Transit', date: '15 Feb 2025, 07:00 AM', done: true },
      { label: 'Out for Delivery', date: '15 Feb 2025, 09:30 AM', done: true },
      { label: 'Delivered', date: '15 Feb 2025, 02:00 PM', done: true },
    ],
  },
  {
    id: 'SF-7780', date: '02 Feb 2025', status: 'Delivered', statusStep: 3,
    items: [
      { name: 'Chandanam Sandalwood', qty: 1, price: 349, image: '/images/product1.png' },
      { name: 'Malligai Jasmine', qty: 1, price: 249, image: '/images/product2.png' },
      { name: 'Nag Champa Classic', qty: 2, price: 598, image: '/images/product3.png' },
    ],
    total: 1196,
    trackingSteps: [
      { label: 'Order Placed', date: '01 Feb 2025, 10:00 AM', done: true },
      { label: 'Packed & Shipped', date: '01 Feb 2025, 05:00 PM', done: true },
      { label: 'In Transit', date: '02 Feb 2025, 06:00 AM', done: true },
      { label: 'Out for Delivery', date: '02 Feb 2025, 08:30 AM', done: true },
      { label: 'Delivered', date: '02 Feb 2025, 12:15 PM', done: true },
    ],
  },
]

const initialWishlist: WishlistItem[] = [
  { id: 1, name: 'Chandanam Sandalwood', price: 349, originalPrice: 499, image: '/images/product1.png', inStock: true },
  { id: 3, name: 'Nag Champa Classic', price: 299, originalPrice: 449, image: '/images/product3.png', inStock: true },
  { id: 5, name: 'Sambrani Herbal', price: 399, originalPrice: 549, image: '/images/product5.png', inStock: true },
  { id: 6, name: 'Khus Vetiver Classic', price: 269, originalPrice: 399, image: '/images/product6.png', inStock: false },
]

const rewards = [
  { id: 1, title: '\u20B9200 Off Next Order', points: 500, description: 'Get \u20B9200 discount on your next purchase', icon: IndianRupee, color: 'from-temple-gold to-temple-brass' },
  { id: 2, title: 'Free Shipping 30 Days', points: 300, description: 'Enjoy free delivery for the next 30 days', icon: Truck, color: 'from-temple-saffron to-temple-gold' },
  { id: 3, title: 'Exclusive Temple Visit', points: 2000, description: 'A divine temple experience with curated pooja', icon: Crown, color: 'from-temple-deep to-temple-maroon' },
  { id: 4, title: 'Mystery Fragrance Box', points: 800, description: 'A surprise box of 5 premium fragrances', icon: Gift, color: 'from-temple-brass to-temple-saffron' },
]

const initialAddresses: Address[] = [
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

const navItems = [
  { label: 'My Orders', icon: ShoppingBag },
  { label: 'Wishlist', icon: Heart },
  { label: 'Rewards', icon: Award },
  { label: 'Addresses', icon: MapPin },
  { label: 'Profile', icon: User },
  { label: 'Settings', icon: Settings },
]

// ====== ORDER STATUS STEP ======

function OrderStatusStep({ step }: { step: number }) {
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
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                isActive ? 'bg-temple-gold border-temple-gold text-white' : 'bg-temple-cream border-temple-gold/30 text-temple-gold/40'
              } ${isCurrent ? 'ring-2 ring-temple-gold/30 ring-offset-2 ring-offset-temple-cream' : ''}`}>
                <IconComp className="h-3.5 w-3.5" />
              </div>
              <span className={`text-[9px] mt-1 font-medium whitespace-nowrap ${isActive ? 'text-temple-deep' : 'text-muted-foreground/40'}`}>{label}</span>
            </div>
            {i < 2 && (
              <div className="flex-1 mx-1.5 mt-[14px] self-start">
                <div className="h-0.5 rounded-full bg-temple-gold/20 overflow-hidden">
                  <div className={`h-full bg-temple-gold rounded-full transition-all duration-500 ${i < step ? 'w-full' : 'w-0'}`} />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ====== CSS BAR CHART ======

function SimpleBarChart({ data }: { data: typeof monthlySpending }) {
  const maxAmount = Math.max(...data.map(d => d.amount))
  return (
    <div className="flex items-end gap-2 sm:gap-3 h-[200px] sm:h-[220px] w-full px-1 pt-6 pb-2">
      {data.map((item) => {
        const heightPct = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
        return (
          <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
            {/* Tooltip */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-temple-maroon text-temple-cream px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg border border-temple-gold/30">
              {'\u20B9'}{item.amount.toLocaleString('en-IN')}
            </div>
            <div
              className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-temple-saffron/80 to-temple-gold transition-all duration-500 group-hover:from-temple-saffron group-hover:to-temple-amber min-h-[4px]"
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-xs mt-2 text-muted-foreground font-medium">{item.month}</span>
          </div>
        )
      })}
    </div>
  )
}

// ====== MAIN DASHBOARD ======

export default function UserDashboard() {
  const { toast } = useToast()

  // State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('My Orders')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [profileData, setProfileData] = useState({ name: initialUserData.name, email: initialUserData.email, phone: initialUserData.phone })
  const [profileDraft, setProfileDraft] = useState(profileData)
  const [profileSaving, setProfileSaving] = useState(false)

  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist)
  const [cart, setCart] = useState<CartItem[]>([])
  const [userPoints, setUserPoints] = useState(initialUserData.points)
  const [redeemedRewards, setRedeemedRewards] = useState<number[]>([])

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressDraft, setAddressDraft] = useState({ label: '', name: '', line1: '', line2: '', pincode: '', phone: '' })
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null)

  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false)
  const [trackingOrder, setTrackingOrder] = useState<typeof recentOrders[0] | null>(null)

  const [notifSettings, setNotifSettings] = useState<NotificationSettings>({ orderUpdates: true, promoOffers: true, priceDrop: true, newArrivals: true, loyaltyPoints: true })
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' })
  const [twoFADialogOpen, setTwoFADialogOpen] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)

  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Order SF-7830 Shipped', desc: 'Your Malligai Jasmine order is on its way!', time: '2h ago', read: false },
    { id: 2, title: 'Reward: 50 Bonus Points', desc: 'You earned 50 loyalty points for your recent purchase.', time: '1d ago', read: false },
    { id: 3, title: 'New Arrival: Temple Premium', desc: 'Check out our latest Temple Premium collection.', time: '3d ago', read: true },
  ])

  // Handlers
  const addToCart = useCallback((item: WishlistItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 }]
    })
    toast({ title: 'Added to Cart!', description: `${item.name} has been added to your cart.` })
  }, [toast])

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(c => c.id !== id))
    toast({ title: 'Removed from Cart', description: 'Item removed from your cart.' })
  }, [toast])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const removeFromWishlist = useCallback((id: number) => {
    const item = wishlist.find(w => w.id === id)
    setWishlist(prev => prev.filter(w => w.id !== id))
    toast({ title: 'Removed from Wishlist', description: `${item?.name || 'Item'} removed from your wishlist.` })
  }, [wishlist, toast])

  const handleProfileSave = useCallback(() => {
    setProfileSaving(true)
    setTimeout(() => { setProfileData(profileDraft); setProfileSaving(false); toast({ title: 'Profile Updated!', description: 'Your profile changes have been saved successfully.' }) }, 800)
  }, [profileDraft, toast])

  const handleProfileCancel = useCallback(() => {
    setProfileDraft(profileData)
    toast({ title: 'Changes Discarded', description: 'Your profile changes have been reverted.' })
  }, [profileData, toast])

  const handleRedeemReward = useCallback((rewardId: number, rewardTitle: string, points: number) => {
    setUserPoints(prev => prev - points)
    setRedeemedRewards(prev => [...prev, rewardId])
    toast({ title: 'Reward Redeemed!', description: `${rewardTitle} has been redeemed.` })
  }, [toast])

  const handleOpenAddressDialog = useCallback((addr?: Address) => {
    if (addr) { setEditingAddress(addr); setAddressDraft({ label: addr.label, name: addr.name, line1: addr.line1, line2: addr.line2, pincode: addr.pincode, phone: addr.phone }) }
    else { setEditingAddress(null); setAddressDraft({ label: '', name: '', line1: '', line2: '', pincode: '', phone: '' }) }
    setAddressDialogOpen(true)
  }, [])

  const handleSaveAddress = useCallback(() => {
    if (!addressDraft.label || !addressDraft.name || !addressDraft.line1 || !addressDraft.pincode || !addressDraft.phone) {
      toast({ title: 'Missing Fields', description: 'Please fill in all required fields.', variant: 'destructive' }); return
    }
    if (editingAddress) {
      setAddresses(prev => prev.map(a => a.id === editingAddress.id ? { ...a, ...addressDraft } : a))
      toast({ title: 'Address Updated!', description: `${addressDraft.label} address has been updated.` })
    } else {
      setAddresses(prev => [...prev, { id: Date.now(), ...addressDraft, isDefault: prev.length === 0 }])
      toast({ title: 'Address Added!', description: `${addressDraft.label} address has been saved.` })
    }
    setAddressDialogOpen(false)
  }, [addressDraft, editingAddress, toast])

  const handleDeleteAddress = useCallback(() => {
    if (deletingAddressId !== null) {
      const addr = addresses.find(a => a.id === deletingAddressId)
      setAddresses(prev => prev.filter(a => a.id !== deletingAddressId))
      setDeleteConfirmOpen(false); setDeletingAddressId(null)
      toast({ title: 'Address Deleted', description: `${addr?.label || 'Address'} has been removed.` })
    }
  }, [deletingAddressId, addresses, toast])

  const handleSetDefaultAddress = useCallback((id: number) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
    toast({ title: 'Default Updated', description: 'Your default delivery address has been changed.' })
  }, [toast])

  const handleTrackOrder = useCallback((order: typeof recentOrders[0]) => { setTrackingOrder(order); setTrackingDialogOpen(true) }, [])

  const handleReorder = useCallback((order: typeof recentOrders[0]) => {
    order.items.forEach(item => {
      if (!cart.find(c => c.name === item.name))
        setCart(prev => [...prev, { id: Date.now() + Math.random(), name: item.name, price: item.price / item.qty, image: item.image, quantity: item.qty }])
    })
    toast({ title: 'Items Added to Cart!', description: `All items from order ${order.id} have been added to your cart.` })
  }, [cart, toast])

  const handleSettingsSave = useCallback(() => {
    setSettingsSaving(true)
    setTimeout(() => { setSettingsSaving(false); toast({ title: 'Settings Saved!', description: 'Your notification preferences have been updated.' }) }, 800)
  }, [toast])

  const handleToggleNotif = useCallback((key: keyof NotificationSettings) => { setNotifSettings(prev => ({ ...prev, [key]: !prev[key] })) }, [])

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.newPass || !passwordData.confirm) { toast({ title: 'Missing Fields', description: 'Please fill in all password fields.', variant: 'destructive' }); return }
    if (passwordData.newPass !== passwordData.confirm) { toast({ title: 'Passwords Don\'t Match', description: 'New password and confirmation must match.', variant: 'destructive' }); return }
    if (passwordData.newPass.length < 6) { toast({ title: 'Weak Password', description: 'Password must be at least 6 characters long.', variant: 'destructive' }); return }
    setPasswordDialogOpen(false); setPasswordData({ current: '', newPass: '', confirm: '' })
    toast({ title: 'Password Changed!', description: 'Your password has been updated successfully.' })
  }

  const handleToggle2FA = useCallback(() => {
    setTwoFAEnabled(prev => !prev); setTwoFADialogOpen(false)
    toast({ title: twoFAEnabled ? '2FA Disabled' : '2FA Enabled!', description: twoFAEnabled ? 'Two-factor authentication has been turned off.' : 'Two-factor authentication is now active.' })
  }, [twoFAEnabled, toast])

  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast({ title: 'All Read', description: 'All notifications marked as read.' })
  }, [toast])

  const unreadCount = notifications.filter(n => !n.read).length

  // ====== RENDER SECTIONS ======

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><Heart className="h-5 w-5 text-temple-gold" />My <span className="gold-text">Wishlist</span></h2>
        <Badge className="bg-temple-deep/10 text-temple-deep border-temple-deep/20 text-xs">{wishlist.length} items</Badge>
      </div>
      {wishlist.length === 0 ? (
        <Card className="border-temple-gold/20 bg-white">
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-temple-gold/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-temple-deep mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-sm mb-4">Browse our collection and add items you love.</p>
            <Link href="/#products"><Button className="bg-temple-gold hover:bg-temple-brass text-white"><ShoppingBag className="h-4 w-4 mr-2" />Browse Collection</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wishlist.map((item) => (
            <Card key={item.id} className="border-temple-gold/20 bg-white overflow-hidden group flex flex-col hover:shadow-lg hover:shadow-temple-gold/10 transition-shadow duration-300">
              <div className="relative aspect-square overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <Button size="icon" variant="outline" className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 border-0 shadow-md hover:bg-red-50 transition-colors" onClick={() => removeFromWishlist(item.id)}>
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
                {!item.inStock && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Badge className="bg-red-500/90 text-white text-xs">Out of Stock</Badge></div>}
              </div>
              <CardContent className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-sm group-hover:text-temple-gold transition-colors">{item.name}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold">{'\u20B9'}{item.price}</span>
                  <span className="text-xs text-muted-foreground line-through">{'\u20B9'}{item.originalPrice}</span>
                  <Badge className="bg-temple-saffron/10 text-temple-saffron border-0 text-[10px] px-1.5">{Math.round((1 - item.price / item.originalPrice) * 100)}% OFF</Badge>
                </div>
                <div className="flex gap-2 mt-auto pt-3">
                  <Button size="sm" className={`flex-1 text-xs ${item.inStock ? 'bg-temple-gold hover:bg-temple-brass text-white' : 'bg-muted text-muted-foreground cursor-not-allowed'}`} disabled={!item.inStock} onClick={() => item.inStock && addToCart(item)}>
                    <ShoppingBag className="h-3 w-3 mr-1" />{item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => removeFromWishlist(item.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {cart.length > 0 && (
        <Card className="border-temple-gold/30 bg-gradient-to-r from-temple-gold/5 to-temple-saffron/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-temple-gold" /><h3 className="font-semibold text-sm">Your Cart ({cartCount} items)</h3></div>
              <span className="font-bold text-temple-deep">{'\u20B9'}{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm bg-white/60 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2"><span className="font-medium">{item.name}</span><span className="text-muted-foreground">x{item.quantity}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{'\u20B9'}{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500" onClick={() => removeFromCart(item.id)}><X className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full bg-temple-gold hover:bg-temple-brass text-white">Proceed to Checkout</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderRewards = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><Award className="h-5 w-5 text-temple-gold" />Rewards & <span className="gold-text">Loyalty</span></h2>
        <Badge className="bg-temple-amber/20 text-temple-amber border-temple-amber/30 text-xs"><Flame className="h-3 w-3 mr-1" />{userPoints.toLocaleString('en-IN')} pts</Badge>
      </div>
      <Card className="border-temple-gold/20 bg-white mb-6 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Crown className="h-5 w-5 text-temple-gold" /><span className="font-semibold">Temple Gold Member</span></div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-temple-gold">{userPoints.toLocaleString('en-IN')}</span>
              <span className="text-muted-foreground">/ {initialUserData.nextTierPoints.toLocaleString('en-IN')} pts</span>
            </div>
          </div>
          <div className="h-3 rounded-full bg-temple-gold/10 overflow-hidden mb-2">
            <div className="h-full rounded-full bg-gradient-to-r from-temple-gold via-temple-amber to-temple-saffron transition-all duration-1000" style={{ width: `${(userPoints / initialUserData.nextTierPoints) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Current: Temple Gold</span>
            <span>Next: Temple Diamond ({Math.max(0, initialUserData.nextTierPoints - userPoints)} pts away)</span>
          </div>
          <Separator className="my-3 bg-temple-gold/10" />
          <div className="flex flex-wrap gap-3">
            {['Free shipping on all orders', 'Early access to new fragrances', '10% off on festive collections', 'Priority customer support'].map((benefit, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs"><CheckCircle2 className="h-3 w-3 text-temple-gold" /><span className="text-muted-foreground">{benefit}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rewards.map((reward) => {
          const isRedeemed = redeemedRewards.includes(reward.id)
          const canRedeem = userPoints >= reward.points && !isRedeemed
          return (
            <Card key={reward.id} className={`border-temple-gold/20 bg-white overflow-hidden relative flex flex-col hover:shadow-lg transition-shadow duration-300 ${isRedeemed ? 'opacity-60' : ''}`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-temple-gold via-temple-amber to-temple-saffron" />
              <CardContent className="p-4 pt-5 flex flex-col flex-1">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${reward.color} text-white flex items-center justify-center mb-3 shadow-md`}><reward.icon className="h-5 w-5" /></div>
                <h3 className="font-semibold text-sm mb-1">{reward.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{reward.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 text-xs"><Flame className="h-2.5 w-2.5 mr-0.5" />{reward.points} pts</Badge>
                  {isRedeemed ? (
                    <Badge className="bg-green-100 text-green-600 border-green-200 text-[10px]"><CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />Redeemed</Badge>
                  ) : (
                    <Button size="sm" className={`text-[10px] h-7 ${canRedeem ? 'bg-temple-gold hover:bg-temple-brass text-white' : 'bg-muted text-muted-foreground cursor-not-allowed'}`} disabled={!canRedeem} onClick={() => handleRedeemReward(reward.id, reward.title, reward.points)}>
                      {canRedeem ? 'Redeem' : 'Not Enough'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="h-5 w-5 text-temple-gold" />Saved <span className="gold-text">Addresses</span></h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((addr) => (
          <Card key={addr.id} className={`border-temple-gold/20 bg-white overflow-hidden relative hover:shadow-lg transition-shadow duration-300 ${addr.isDefault ? 'ring-1 ring-temple-gold/30' : ''}`}>
            {addr.isDefault && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-temple-gold to-temple-saffron" />}
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-temple-gold" />
                  <span className="font-semibold text-sm">{addr.label}</span>
                  {addr.isDefault && <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 text-[9px] px-1.5">Default</Badge>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-temple-gold" onClick={() => handleOpenAddressDialog(addr)}><Edit3 className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500" onClick={() => { setDeletingAddressId(addr.id); setDeleteConfirmOpen(true) }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="font-medium text-foreground">{addr.name}</p>
                <p>{addr.line1}</p>
                <p>{addr.line2} - {addr.pincode}</p>
                <p className="flex items-center gap-1 mt-1"><Copy className="h-3 w-3" />{addr.phone}</p>
              </div>
              {!addr.isDefault && <Button variant="outline" size="sm" className="w-full mt-3 text-xs border-temple-gold/30 hover:bg-temple-gold/10" onClick={() => handleSetDefaultAddress(addr.id)}>Set as Default</Button>}
            </CardContent>
          </Card>
        ))}
        <Card className="border-2 border-dashed border-temple-gold/30 bg-transparent hover:bg-temple-gold/5 transition-colors cursor-pointer h-full" onClick={() => handleOpenAddressDialog()}>
          <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[180px]">
            <div className="w-12 h-12 rounded-full bg-temple-gold/10 flex items-center justify-center mb-3"><Plus className="h-5 w-5 text-temple-gold" /></div>
            <p className="font-semibold text-sm text-temple-gold">Add New Address</p>
            <p className="text-xs text-muted-foreground mt-1">Save a new delivery location</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <Card className="border-temple-gold/20 bg-white">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5 text-temple-gold" />Profile Settings</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-temple-gold/10">
            <div className="w-16 h-16 rounded-full border-2 border-temple-gold flex items-center justify-center bg-temple-gold/10">
              <span className="text-xl font-bold text-temple-gold">{initialUserData.avatar}</span>
            </div>
            <div>
              <p className="font-semibold">{profileData.name}</p>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              <Badge className="bg-temple-gold/10 text-temple-amber border-temple-gold/20 text-xs mt-1"><Crown className="h-2.5 w-2.5 mr-0.5" />{initialUserData.membership}</Badge>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-temple-deep border-b border-temple-gold/10 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="text-xs font-medium text-muted-foreground">Full Name</Label><Input type="text" value={profileDraft.name} onChange={(e) => setProfileDraft(prev => ({ ...prev, name: e.target.value }))} className="mt-1 border-temple-gold/20 focus:ring-temple-gold/30" /></div>
              <div><Label className="text-xs font-medium text-muted-foreground">Email</Label><Input type="email" value={profileDraft.email} onChange={(e) => setProfileDraft(prev => ({ ...prev, email: e.target.value }))} className="mt-1 border-temple-gold/20 focus:ring-temple-gold/30" /></div>
              <div><Label className="text-xs font-medium text-muted-foreground">Phone</Label><Input type="tel" value={profileDraft.phone} onChange={(e) => setProfileDraft(prev => ({ ...prev, phone: e.target.value }))} className="mt-1 border-temple-gold/20 focus:ring-temple-gold/30" /></div>
              <div><Label className="text-xs font-medium text-muted-foreground">Member Since</Label><Input type="text" value={initialUserData.memberSince} disabled className="mt-1 border-temple-gold/20 bg-muted/50 cursor-not-allowed" /></div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-temple-gold hover:bg-temple-brass text-white" onClick={handleProfileSave} disabled={profileSaving}>
              {profileSaving ? <><span className="animate-spin mr-2">{'\u25CB'}</span>Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
            </Button>
            <Button variant="outline" className="border-temple-gold/30 hover:bg-temple-gold/10" onClick={handleProfileCancel}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <Card className="border-temple-gold/20 bg-white">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5 text-temple-gold" />Settings</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-temple-deep border-b border-temple-gold/10 pb-2">Notifications</h3>
            <div className="space-y-3">
              {([
                { key: 'orderUpdates' as keyof NotificationSettings, label: 'Order updates', desc: 'Get notified about your order status' },
                { key: 'promoOffers' as keyof NotificationSettings, label: 'Promotional offers', desc: 'Receive special deals and discounts' },
                { key: 'priceDrop' as keyof NotificationSettings, label: 'Price drop alerts', desc: 'Know when wishlist items go on sale' },
                { key: 'newArrivals' as keyof NotificationSettings, label: 'New arrivals', desc: 'Be the first to know about new fragrances' },
                { key: 'loyaltyPoints' as keyof NotificationSettings, label: 'Loyalty points updates', desc: 'Track your points and rewards' },
              ] as const).map((setting) => (
                <label key={setting.key} className="flex items-center justify-between p-3 rounded-lg border border-temple-gold/10 hover:bg-temple-gold/5 cursor-pointer transition-colors">
                  <div><span className="text-sm font-medium">{setting.label}</span><p className="text-xs text-muted-foreground">{setting.desc}</p></div>
                  <div className="relative">
                    <input type="checkbox" checked={notifSettings[setting.key]} onChange={() => handleToggleNotif(setting.key)} className="sr-only" />
                    <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${notifSettings[setting.key] ? 'bg-temple-gold' : 'bg-muted'}`} onClick={() => handleToggleNotif(setting.key)}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${notifSettings[setting.key] ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-temple-deep border-b border-temple-gold/10 pt-2">Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-temple-gold/10">
                <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-temple-gold" /><div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">{twoFAEnabled ? 'Enabled - Your account is protected' : 'Add an extra layer of security'}</p></div></div>
                <Button variant={twoFAEnabled ? 'outline' : 'default'} size="sm" className={`text-xs ${twoFAEnabled ? 'border-green-300 text-green-600 hover:bg-green-50' : 'bg-temple-gold hover:bg-temple-brass text-white'}`} onClick={() => setTwoFADialogOpen(true)}>{twoFAEnabled ? 'Disable' : 'Enable'}</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-temple-gold/10">
                <div className="flex items-center gap-3"><Lock className="h-4 w-4 text-temple-gold" /><div><p className="text-sm font-medium">Change Password</p><p className="text-xs text-muted-foreground">Update your account password</p></div></div>
                <Button variant="outline" size="sm" className="text-xs border-temple-gold/30 hover:bg-temple-gold/10" onClick={() => setPasswordDialogOpen(true)}>Update</Button>
              </div>
            </div>
          </div>
          <Button className="bg-temple-gold hover:bg-temple-brass text-white" onClick={handleSettingsSave} disabled={settingsSaving}>
            {settingsSaving ? <><span className="animate-spin mr-2">{'\u25CB'}</span>Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Settings</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const navContent: Record<string, React.ReactNode> = {
    'My Orders': null,
    'Wishlist': renderWishlist(),
    'Rewards': renderRewards(),
    'Addresses': renderAddresses(),
    'Profile': renderProfile(),
    'Settings': renderSettings(),
  }

  return (
    <div className="min-h-screen bg-temple-cream flex">
      {/* ====== SIDEBAR (Desktop) ====== */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen z-40 deep-maroon-gradient border-r border-temple-gold/20 transition-all duration-300" style={{ width: sidebarCollapsed ? 72 : 256 }}>
        {/* Header */}
        <div className="h-16 flex items-center border-b border-temple-gold/15 px-3">
          <div className="w-10 h-10 rounded-full bg-temple-gold/20 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-temple-gold/30 transition-colors" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <Flame className="h-5 w-5 text-temple-gold" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden whitespace-nowrap ml-3">
              <h2 className="text-sm font-bold gold-text tracking-wider">SHRI FRAGRANCE</h2>
              <p className="text-[10px] text-temple-cream/40 tracking-widest uppercase">My Account</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={() => setSidebarCollapsed(true)} className="ml-auto w-7 h-7 rounded-full bg-temple-gold/20 hover:bg-temple-gold/40 text-temple-gold flex items-center justify-center transition-colors hover:scale-110 flex-shrink-0" title="Collapse sidebar">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* User Mini Profile */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-temple-gold/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-temple-gold/40 flex-shrink-0"><AvatarFallback className="bg-temple-gold/20 text-temple-gold text-sm font-bold">{initialUserData.avatar}</AvatarFallback></Avatar>
              <div className="overflow-hidden flex flex-col justify-center">
                <p className="text-sm font-semibold text-temple-cream truncate leading-tight">{profileData.name}</p>
                <Badge className="bg-temple-gold/20 text-temple-amber border-temple-gold/30 text-[9px] px-1.5 py-0 mt-1 w-fit"><Crown className="h-2.5 w-2.5 mr-0.5" />{initialUserData.membership}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeNav === item.label
              return (
                <button key={item.label} onClick={() => setActiveNav(item.label)} title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group relative h-10 ${isActive ? 'bg-temple-gold/20 text-temple-gold shadow-lg shadow-temple-gold/10' : 'text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream'}`}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-temple-gold rounded-r-full transition-all" />}
                  <Icon className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</span>}
                  {!sidebarCollapsed && item.label === 'Wishlist' && <Badge className="ml-auto bg-temple-deep/80 text-white text-[9px] px-1.5 py-0 min-w-[18px] h-[18px]">{wishlist.length}</Badge>}
                  {!sidebarCollapsed && item.label === 'My Orders' && cartCount > 0 && <Badge className="ml-auto bg-temple-saffron text-white text-[9px] px-1.5 py-0 min-w-[18px] h-[18px]">{cartCount}</Badge>}
                </button>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Expand when collapsed */}
        {sidebarCollapsed && (
          <div className="px-2 pb-2">
            <button onClick={() => setSidebarCollapsed(false)} className="w-full flex items-center justify-center p-2 rounded-lg bg-temple-gold/10 hover:bg-temple-gold/20 text-temple-gold transition-colors" title="Expand sidebar">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Back to Store */}
        <div className="p-2 border-t border-temple-gold/15">
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg h-10 text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream transition-colors">
              <ArrowLeft className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
              {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">Back to Store</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* ====== MOBILE HEADER ====== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-temple-cream border-b border-temple-gold/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-temple-deep h-9 w-9">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h2 className="text-sm font-bold gold-text tracking-wider">MY ACCOUNT</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-temple-deep h-9 w-9 relative" onClick={() => setNotifOpen(!notifOpen)}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-temple-saffron text-white text-[8px] font-bold">{unreadCount}</span>}
            </Button>
          </div>
          <Link href="/"><Button variant="outline" size="sm" className="text-xs gap-1 border-temple-gold/30"><ArrowLeft className="h-3 w-3" />Store</Button></Link>
        </div>
      </div>

      {/* Mobile Notification Dropdown */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          <div className="fixed top-14 right-4 w-80 bg-white rounded-xl shadow-2xl border border-temple-gold/20 z-50 overflow-hidden">
            <div className="p-3 border-b border-temple-gold/10 flex items-center justify-between">
              <span className="font-semibold text-sm">Notifications</span>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-temple-gold" onClick={handleMarkAllRead}>Mark all read</Button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-3 border-b border-temple-gold/5 hover:bg-temple-gold/5 cursor-pointer transition-colors ${!notif.read ? 'bg-temple-gold/5' : ''}`}>
                  <div className="flex items-start gap-2">
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-temple-saffron mt-1.5 flex-shrink-0" />}
                    <div className={!notif.read ? '' : 'ml-4'}>
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
          <aside className="md:hidden fixed top-0 left-0 h-screen w-72 z-50 deep-maroon-gradient border-r border-temple-gold/20 flex flex-col">
            <div className="p-4 flex items-center gap-3 border-b border-temple-gold/15">
              <div className="w-10 h-10 rounded-full bg-temple-gold/20 flex items-center justify-center flex-shrink-0"><Flame className="h-5 w-5 text-temple-gold" /></div>
              <div className="overflow-hidden whitespace-nowrap"><h2 className="text-sm font-bold gold-text tracking-wider">SHRI FRAGRANCE</h2><p className="text-[10px] text-temple-cream/40 tracking-widest uppercase">My Account</p></div>
              <button onClick={() => setMobileMenuOpen(false)} className="ml-auto w-7 h-7 rounded-full bg-temple-gold/20 hover:bg-temple-gold/40 text-temple-gold flex items-center justify-center transition-all"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 border-b border-temple-gold/10">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-temple-gold/40 flex-shrink-0"><AvatarFallback className="bg-temple-gold/20 text-temple-gold text-sm font-bold">{initialUserData.avatar}</AvatarFallback></Avatar>
                <div className="overflow-hidden flex flex-col justify-center">
                  <p className="text-sm font-semibold text-temple-cream truncate leading-tight">{profileData.name}</p>
                  <Badge className="bg-temple-gold/20 text-temple-amber border-temple-gold/30 text-[9px] px-1.5 py-0 mt-1 w-fit"><Crown className="h-2.5 w-2.5 mr-0.5" />{initialUserData.membership}</Badge>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 py-4">
              <nav className="space-y-0.5 px-3">
                {navItems.map((item) => (
                  <button key={item.label} onClick={() => { setActiveNav(item.label); setMobileMenuOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group relative h-10 ${activeNav === item.label ? 'bg-temple-gold/20 text-temple-gold shadow-lg shadow-temple-gold/10' : 'text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream'}`}>
                    {activeNav === item.label && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-temple-gold rounded-r-full" />}
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.label === 'Wishlist' && <Badge className="ml-auto bg-temple-deep/80 text-white text-[9px] px-1.5 py-0 min-w-[18px] h-[18px]">{wishlist.length}</Badge>}
                  </button>
                ))}
              </nav>
            </ScrollArea>
            <div className="p-3 border-t border-temple-gold/15">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg h-10 text-temple-cream/60 hover:bg-temple-gold/10 hover:text-temple-cream transition-colors">
                  <ArrowLeft className="h-5 w-5 flex-shrink-0" /><span className="text-sm font-medium">Back to Store</span>
                </button>
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* ====== MAIN CONTENT ====== */}
      <motion.main
        className={`flex-1 transition-[margin] duration-300 ${sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Header */}
        <header className="relative overflow-hidden border-b border-temple-gold/20">
          <div className="absolute inset-0 royal-gradient opacity-90" />
          <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pt-20 md:pt-10">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-temple-gold divine-glow flex items-center justify-center bg-temple-gold/20 flex-shrink-0">
                  <span className="text-2xl sm:text-3xl font-bold text-temple-gold">{initialUserData.avatar}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-temple-amber text-temple-maroon rounded-full px-2 py-0.5 text-[9px] font-bold border-2 border-temple-maroon">GOLD</div>
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">Namaste, {profileData.name.split(' ')[0]}!</h1>
                <p className="text-temple-cream/60 text-sm mt-1">{profileData.email} &middot; Member since {initialUserData.memberSince}</p>
                <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start flex-wrap">
                  <Badge className="bg-temple-gold/20 text-temple-amber border-temple-gold/30 text-xs"><Crown className="h-3 w-3 mr-1" />{initialUserData.membership}</Badge>
                  <Badge className="bg-temple-amber/20 text-temple-amber border-temple-amber/30 text-xs"><Flame className="h-3 w-3 mr-1" />{userPoints.toLocaleString('en-IN')} Points</Badge>
                </div>
              </div>
              <div className="flex sm:flex-col gap-3">
                {[
                  { label: 'Orders', value: initialUserData.totalOrders, icon: ShoppingBag, nav: 'My Orders' },
                  { label: 'Wishlist', value: wishlist.length, icon: Heart, nav: 'Wishlist' },
                  { label: 'Cart', value: cartCount, icon: ShoppingBag, nav: 'Wishlist' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 sm:flex-col sm:items-center bg-temple-gold/10 rounded-lg px-3 py-2 sm:px-5 sm:py-3 min-w-[80px] sm:min-w-[90px] min-h-[60px] sm:min-h-[68px] cursor-pointer hover:bg-temple-gold/20 transition-colors" onClick={() => setActiveNav(stat.nav)}>
                    <stat.icon className="h-4 w-4 text-temple-gold flex-shrink-0" />
                    <div className="text-center"><p className="text-lg font-bold text-white leading-tight">{stat.value}</p><p className="text-[9px] text-temple-cream/50 uppercase tracking-wider">{stat.label}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {activeNav !== 'My Orders' && navContent[activeNav] ? (
            navContent[activeNav]
          ) : (
          <>
            {/* ====== RECENT ORDERS ====== */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 leading-none self-center"><ShoppingBag className="h-5 w-5 text-temple-gold" />My <span className="gold-text">Orders</span></h2>
                <Button variant="outline" size="sm" className="text-xs border-temple-gold/30 hover:bg-temple-gold/10">View All <ChevronRight className="h-3 w-3 ml-1" /></Button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Card key={order.id} className="border-temple-gold/20 bg-white overflow-hidden hover:shadow-lg hover:shadow-temple-gold/10 transition-shadow duration-300">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono font-bold text-temple-deep">{order.id}</span>
                          <Badge variant="outline" className={`text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-200' : order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                            <CircleDot className="h-2.5 w-2.5 mr-1" />{order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{order.date}</div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-temple-gold/15 flex-shrink-0 bg-temple-cream">
                              <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{item.name}</p><p className="text-xs text-muted-foreground">Qty: {item.qty}</p></div>
                            <span className="text-sm font-semibold whitespace-nowrap">{'\u20B9'}{item.price.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mb-3"><OrderStatusStep step={order.statusStep} /></div>
                      <div className="flex items-center justify-between pt-3 border-t border-temple-gold/10">
                        <span className="text-base font-bold">Total: {'\u20B9'}{order.total.toLocaleString('en-IN')}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-xs border-temple-gold/30 hover:bg-temple-gold/10 h-8" onClick={() => handleTrackOrder(order)}><Truck className="h-3 w-3 mr-1" />Track</Button>
                          <Button size="sm" className="text-xs bg-temple-gold hover:bg-temple-brass text-white h-8" onClick={() => handleReorder(order)}><Sparkles className="h-3 w-3 mr-1" />Reorder</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Simple Divider */}
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="h-px flex-1 max-w-40 bg-gradient-to-r from-transparent to-temple-gold/50" />
              <div className="flex gap-1.5">
                {[1.5, 2, 3, 2, 1.5].map((s, i) => (
                  <div key={i} className={`rounded-full ${i === 2 ? 'bg-temple-deep' : i % 2 === 0 ? 'bg-temple-gold' : 'bg-temple-saffron'}`} style={{ width: s * 3, height: s * 3 }} />
                ))}
              </div>
              <div className="h-px flex-1 max-w-40 bg-gradient-to-l from-transparent to-temple-gold/50" />
            </div>

            {/* ====== SPENDING ANALYTICS + ORDER STATUS ====== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2">
                <Card className="border-temple-gold/20 bg-white overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-temple-gold" />Spending Analytics</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Your monthly spending overview</p>
                      </div>
                      <Badge className="bg-temple-gold/10 text-temple-gold border-temple-gold/20 text-xs"><Sparkles className="h-3 w-3 mr-1" />6 Months</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 rounded-lg bg-temple-gold/5">
                        <p className="text-lg font-bold text-temple-deep">{'\u20B9'}{initialUserData.totalSpent.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-muted-foreground">Total Spent</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-temple-saffron/5">
                        <p className="text-lg font-bold text-temple-deep">{'\u20B9'}{initialUserData.avgOrder}</p>
                        <p className="text-[10px] text-muted-foreground">Avg Order</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-temple-deep/5">
                        <p className="text-sm font-bold text-temple-deep leading-tight">{initialUserData.favoriteCategory}</p>
                        <p className="text-[10px] text-muted-foreground">Top Category</p>
                      </div>
                    </div>
                    <SimpleBarChart data={monthlySpending} />
                  </CardContent>
                </Card>
              </div>

              {/* Order Status Overview */}
              <div>
                <Card className="border-temple-gold/20 bg-white h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><Package className="h-5 w-5 text-temple-gold" />Order Status</CardTitle>
                    <p className="text-xs text-muted-foreground">Overview of all your orders</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 mt-2">
                      {orderStatusCounts.map((status) => (
                        <div key={status.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} /><span className="text-sm font-medium">{status.label}</span></div>
                            <span className="text-sm font-bold">{status.count}</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-temple-gold/10 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(status.count / initialUserData.totalOrders) * 100}%`, backgroundColor: status.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4 bg-temple-gold/15" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-temple-deep">{initialUserData.totalOrders}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Orders</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>)}
        </div>
      </motion.main>

      {/* ====== DIALOGS ====== */}

      {/* Address Add/Edit Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-temple-gold" />{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>{editingAddress ? 'Update your delivery address details.' : 'Add a new delivery address to your account.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Label *</Label><Input placeholder="e.g. Home, Office" value={addressDraft.label} onChange={(e) => setAddressDraft(prev => ({ ...prev, label: e.target.value }))} className="border-temple-gold/20" /></div>
              <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="Recipient name" value={addressDraft.name} onChange={(e) => setAddressDraft(prev => ({ ...prev, name: e.target.value }))} className="border-temple-gold/20" /></div>
            </div>
            <div className="space-y-2"><Label>Address Line 1 *</Label><Input placeholder="Street address" value={addressDraft.line1} onChange={(e) => setAddressDraft(prev => ({ ...prev, line1: e.target.value }))} className="border-temple-gold/20" /></div>
            <div className="space-y-2"><Label>Address Line 2</Label><Input placeholder="City, Area" value={addressDraft.line2} onChange={(e) => setAddressDraft(prev => ({ ...prev, line2: e.target.value }))} className="border-temple-gold/20" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Pincode *</Label><Input placeholder="6-digit pincode" value={addressDraft.pincode} onChange={(e) => setAddressDraft(prev => ({ ...prev, pincode: e.target.value }))} className="border-temple-gold/20" /></div>
              <div className="space-y-2"><Label>Phone *</Label><Input placeholder="+91 XXXXX XXXXX" value={addressDraft.phone} onChange={(e) => setAddressDraft(prev => ({ ...prev, phone: e.target.value }))} className="border-temple-gold/20" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressDialogOpen(false)} className="border-temple-gold/30">Cancel</Button>
            <Button onClick={handleSaveAddress} className="bg-temple-gold hover:bg-temple-brass text-white">{editingAddress ? 'Update Address' : 'Save Address'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Address Confirmation */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600"><Trash2 className="h-5 w-5" />Delete Address</DialogTitle>
            <DialogDescription>Are you sure you want to delete this address? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="border-temple-gold/30">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAddress}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Tracking Dialog */}
      <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-temple-gold" />Track Order {trackingOrder?.id}</DialogTitle>
            <DialogDescription>Order placed on {trackingOrder?.date} &middot; {trackingOrder?.status}</DialogDescription>
          </DialogHeader>
          {trackingOrder && (
            <div className="py-4">
              <div className="space-y-2 mb-6">
                {trackingOrder.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-3 p-2 rounded-lg bg-temple-cream/50">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-temple-gold/15 flex-shrink-0 bg-white">
                      <Image src={item.image} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{item.name}</p><p className="text-xs text-muted-foreground">Qty: {item.qty}</p></div>
                    <span className="text-sm font-semibold">{'\u20B9'}{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-temple-gold/10"><span className="font-semibold">Total</span><span className="font-bold text-temple-deep">{'\u20B9'}{trackingOrder.total.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="space-y-0">
                {trackingOrder.trackingSteps.map((step, i) => (
                  <div key={i} className="flex gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.done ? 'bg-temple-gold border-temple-gold text-white' : 'bg-temple-cream border-temple-gold/30 text-temple-gold/40'}`}>
                        {step.done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </div>
                      {i < trackingOrder.trackingSteps.length - 1 && <div className={`w-0.5 flex-1 my-1 ${step.done ? 'bg-temple-gold' : 'bg-temple-gold/20'}`} />}
                    </div>
                    <div className="pb-2">
                      <p className={`text-sm font-medium ${step.done ? 'text-temple-deep' : 'text-muted-foreground'}`}>{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={() => setTrackingDialogOpen(false)} className="bg-temple-gold hover:bg-temple-brass text-white">Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-temple-gold" />Change Password</DialogTitle>
            <DialogDescription>Update your account password. Make sure it is at least 6 characters long.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Current Password</Label><Input type="password" placeholder="Enter current password" value={passwordData.current} onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))} className="border-temple-gold/20" /></div>
            <div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="Enter new password" value={passwordData.newPass} onChange={(e) => setPasswordData(prev => ({ ...prev, newPass: e.target.value }))} className="border-temple-gold/20" /></div>
            <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" placeholder="Confirm new password" value={passwordData.confirm} onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))} className="border-temple-gold/20" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPasswordDialogOpen(false); setPasswordData({ current: '', newPass: '', confirm: '' }) }} className="border-temple-gold/30">Cancel</Button>
            <Button onClick={handleChangePassword} className="bg-temple-gold hover:bg-temple-brass text-white">Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Confirmation Dialog */}
      <Dialog open={twoFADialogOpen} onOpenChange={setTwoFADialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-temple-gold" />{twoFAEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication</DialogTitle>
            <DialogDescription>{twoFAEnabled ? 'Are you sure you want to disable two-factor authentication? This will make your account less secure.' : 'Two-factor authentication adds an extra layer of security by requiring a verification code in addition to your password.'}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setTwoFADialogOpen(false)} className="border-temple-gold/30">Cancel</Button>
            <Button onClick={handleToggle2FA} className={twoFAEnabled ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-temple-gold hover:bg-temple-brass text-white'}>{twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
