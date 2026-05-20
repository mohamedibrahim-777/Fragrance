// Orders persisted in localStorage. Written by homepage checkout,
// read by the dashboard order history.

import type { CartLine } from './cart'

export const ORDERS_KEY = 'shri:orders'

export interface StoredOrder {
  id: string
  date: string
  items: CartLine[]
  total: number
  status: string
}

export function loadOrders(): StoredOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveOrders(orders: StoredOrder[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  } catch {
    /* storage unavailable */
  }
}

export function addOrder(items: CartLine[], total: number): StoredOrder {
  const order: StoredOrder = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    items,
    total,
    status: 'Processing',
  }
  saveOrders([order, ...loadOrders()])
  return order
}
