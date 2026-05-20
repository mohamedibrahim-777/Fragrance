// Shared cart persisted in localStorage so the homepage and dashboard
// operate on a single cart. Framework-agnostic (no React).

export const CART_KEY = 'shri:cart'

export interface CartLine {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

export function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (i): i is CartLine =>
        i && typeof i.id === 'number' && typeof i.quantity === 'number',
    )
  } catch {
    return []
  }
}

export function saveCart(items: CartLine[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    /* storage unavailable */
  }
}

// Pure helper: returns a new array with the line added/merged by id.
export function addLine(items: CartLine[], line: CartLine): CartLine[] {
  const existing = items.find(i => i.id === line.id)
  if (existing) {
    return items.map(i =>
      i.id === line.id ? { ...i, quantity: i.quantity + line.quantity } : i,
    )
  }
  return [...items, line]
}

// Add to the persisted cart directly (used from pages without cart state,
// e.g. dashboard reorder / move-to-cart). Returns the updated cart.
export function addToStoredCart(lines: CartLine[]): CartLine[] {
  let cart = loadCart()
  for (const line of lines) cart = addLine(cart, line)
  saveCart(cart)
  return cart
}
