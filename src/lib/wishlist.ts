// Wishlist backend.
//
// Same model as orders.ts: Firestore is the source of truth for a signed-in
// user (one doc per user at `wishlists/{uid}` holding the full item list),
// with localStorage as an instant, offline-friendly cache. Guests get a
// local-only wishlist that is migrated up to the cloud the first time they
// sign in.

import { auth, db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const WISHLIST_KEY = 'shri:wishlist'
const WISHLIST_COLLECTION = 'wishlists'

export interface WishEntry {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  inStock?: boolean
}

// ---- localStorage cache (instant + offline / guest fallback) ----

export function loadWishlist(): WishEntry[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((i): i is WishEntry => i && typeof i.id === 'number') : []
  } catch {
    return []
  }
}

export function saveWishlist(items: WishEntry[]): void {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  } catch {
    /* storage unavailable */
  }
}

// Strip `undefined` — Firestore rejects it.
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// ---- Firestore (cloud) ----

async function persistToCloud(items: WishEntry[]): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user) return
    await setDoc(doc(db, WISHLIST_COLLECTION, user.uid), { items: clean(items) })
  } catch {
    /* offline / rules — cache still holds it */
  }
}

/**
 * Load the signed-in user's wishlist from Firestore and refresh the cache.
 * For a brand-new cloud doc, any local (guest) wishlist is migrated up.
 * Falls back to the cache if there is no user or the request fails.
 */
export async function fetchWishlist(): Promise<WishEntry[]> {
  const user = auth.currentUser
  if (!user) return loadWishlist()
  try {
    const ref = doc(db, WISHLIST_COLLECTION, user.uid)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      const items = (snap.data().items ?? []) as WishEntry[]
      saveWishlist(items)
      return items
    }
    // First sign-in: seed the cloud from whatever the guest had locally.
    const local = loadWishlist()
    if (local.length) await setDoc(ref, { items: clean(local) })
    return local
  } catch {
    return loadWishlist()
  }
}

// ---- mutations (cache now, cloud in background) ----

/** Toggle an item by id. Returns the new full list. */
export function toggleWishlist(entry: WishEntry): WishEntry[] {
  const current = loadWishlist()
  const exists = current.some(i => i.id === entry.id)
  const next = exists ? current.filter(i => i.id !== entry.id) : [...current, entry]
  saveWishlist(next)
  void persistToCloud(next)
  return next
}

/** Remove an item by id. Returns the new full list. */
export function removeFromWishlist(id: number): WishEntry[] {
  const next = loadWishlist().filter(i => i.id !== id)
  saveWishlist(next)
  void persistToCloud(next)
  return next
}

export function isWished(id: number): boolean {
  return loadWishlist().some(i => i.id === id)
}
