// Lightweight client-side auth backed by localStorage. The app is a static
// export with no backend, so this is demo-grade: passwords are obfuscated
// (not hashed) and everything lives in the browser. Two roles supported:
// 'admin' (full admin panel) and 'customer' (regular shopper).

export type Role = 'admin' | 'customer'

export interface StoredUser {
  email: string
  name: string
  pwd: string // obfuscated, NOT a real hash
  role: Role
  phone?: string
  createdAt: string
}

export interface Session {
  email: string
  name: string
  role: Role
}

export const USERS_KEY = 'shri:users'
export const SESSION_KEY = 'shri:session'

const ADMIN_EMAIL = 'admin@shrifragrance.com'
const ADMIN_PWD = 'admin123'
const CUSTOMER_EMAIL = 'customer@shrifragrance.com'
const CUSTOMER_PWD = 'customer123'

function obfuscate(s: string): string {
  if (typeof window === 'undefined') return s
  try { return btoa(unescape(encodeURIComponent(s))) } catch { return s }
}

function readUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

function writeUsers(users: StoredUser[]): void {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch {}
}

export function ensureAdminSeed(): void {
  if (typeof window === 'undefined') return
  const users = readUsers()
  let changed = false
  if (!users.some(u => u.email.toLowerCase() === ADMIN_EMAIL)) {
    users.push({
      email: ADMIN_EMAIL,
      name: 'Store Admin',
      pwd: obfuscate(ADMIN_PWD),
      role: 'admin',
      createdAt: new Date().toISOString(),
    })
    changed = true
  }
  if (!users.some(u => u.email.toLowerCase() === CUSTOMER_EMAIL)) {
    users.push({
      email: CUSTOMER_EMAIL,
      name: 'Demo Customer',
      pwd: obfuscate(CUSTOMER_PWD),
      role: 'customer',
      createdAt: new Date().toISOString(),
    })
    changed = true
  }
  if (changed) writeUsers(users)
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.email) return null
    return parsed as Session
  } catch { return null }
}

function setSession(s: Session | null): void {
  if (typeof window === 'undefined') return
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s))
    else localStorage.removeItem(SESSION_KEY)
    window.dispatchEvent(new Event('shri:auth-change'))
  } catch {}
}

export interface AuthResult { ok: boolean; error?: string; session?: Session }

export function signup(input: {
  email: string
  name: string
  password: string
  phone?: string
  role?: Role
}): AuthResult {
  const email = input.email.trim().toLowerCase()
  const name = input.name.trim()
  if (!email || !name || !input.password) return { ok: false, error: 'All fields are required.' }
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: 'Enter a valid email.' }
  if (input.password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }

  ensureAdminSeed()
  const users = readUsers()
  if (users.some(u => u.email.toLowerCase() === email)) {
    return { ok: false, error: 'An account with this email already exists.' }
  }

  const user: StoredUser = {
    email,
    name,
    pwd: obfuscate(input.password),
    role: input.role === 'admin' ? 'admin' : 'customer',
    phone: input.phone?.trim() || undefined,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  writeUsers(users)

  const session: Session = { email: user.email, name: user.name, role: user.role }
  setSession(session)
  return { ok: true, session }
}

export function login(email: string, password: string): AuthResult {
  const e = email.trim().toLowerCase()
  if (!e || !password) return { ok: false, error: 'Enter email and password.' }

  ensureAdminSeed()
  const user = readUsers().find(u => u.email.toLowerCase() === e)
  if (!user) return { ok: false, error: 'No account found for this email.' }
  if (user.pwd !== obfuscate(password)) return { ok: false, error: 'Incorrect password.' }

  const session: Session = { email: user.email, name: user.name, role: user.role }
  setSession(session)
  return { ok: true, session }
}

export function logout(): void {
  setSession(null)
}

// React-friendly hook (avoids importing react at module top to keep this file
// usable from non-react helpers if needed).
export function subscribeAuth(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = () => listener()
  window.addEventListener('shri:auth-change', handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('shri:auth-change', handler)
    window.removeEventListener('storage', handler)
  }
}
