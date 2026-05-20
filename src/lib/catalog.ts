// Shared admin-managed catalog. Single source of truth — the admin page
// reads/writes this, and the storefront (home + /collection) reads it via
// localStorage. The default seed below is what the admin starts with.

export const ADMIN_PRODUCTS_KEY = 'shri:admin:products'

export interface AdminProduct {
  id: number
  name: string
  category: string
  price: string // "₹299"
  stock: number
  status: string
  sales: number
  rating: number
  image?: string
}

export const adminProductsSeed: AdminProduct[] = [
  { id: 1, name: 'Javathu', category: 'Floral', price: '₹299', stock: 200, status: 'Active', sales: 187, rating: 4.8 },
  { id: 2, name: 'Jasmine', category: 'Floral', price: '₹249', stock: 250, status: 'Active', sales: 256, rating: 4.9 },
  { id: 3, name: 'Champa', category: 'Floral', price: '₹279', stock: 180, status: 'Active', sales: 198, rating: 4.7 },
  { id: 4, name: 'Lavender', category: 'Herbal', price: '₹269', stock: 160, status: 'Active', sales: 142, rating: 4.6 },
  { id: 5, name: 'Screw Pine', category: 'Floral', price: '₹319', stock: 120, status: 'Active', sales: 124, rating: 4.5 },
  { id: 6, name: 'Rose', category: 'Floral', price: '₹259', stock: 220, status: 'Active', sales: 213, rating: 4.8 },
  { id: 7, name: 'Sandal', category: 'Premium', price: '₹399', stock: 140, status: 'Active', sales: 287, rating: 4.9 },
  { id: 8, name: 'Sacred Resin', category: 'Premium', price: '₹499', stock: 90, status: 'Active', sales: 156, rating: 4.9 },
]

// Returns the admin catalog from localStorage, falling back to the seed
// the first time the app is opened in this browser.
export function loadAdminCatalog(): AdminProduct[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch { /* ignore */ }
  // Seed on first visit so storefront has products to display.
  try {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(adminProductsSeed))
  } catch { /* ignore */ }
  return adminProductsSeed
}
