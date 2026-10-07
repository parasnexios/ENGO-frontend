import { Donor, DonorCategory, NGOEvent, DashboardMetrics, GreetingItem, User } from '../types'

const API_BASE = 'http://localhost:4008/engo/api/v1'

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getStoredToken(): string | null {
  return localStorage.getItem('engo_token')
}

export function setStoredToken(token: string, user: User): void {
  localStorage.setItem('engo_token', token)
  localStorage.setItem('engo_user', JSON.stringify(user))
}

export function clearStoredToken(): void {
  localStorage.removeItem('engo_token')
  localStorage.removeItem('engo_user')
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('engo_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
// Backend response shape: { status, message, payload: { ... } }

async function apiFetch(
  path: string,
  options: RequestInit = {},
  onUnauthorized?: () => void
): Promise<any> {
  const token = getStoredToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  })

  if (res.status === 401) {
    clearStoredToken()
    onUnauthorized?.()
    throw new Error('Session expired. Please login again.')
  }

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json?.message || `Request failed: ${res.status}`)
  }

  // Backend wraps data in: { status, message, payload: { data: ... } }
  // Return the payload directly so callers use json.data
  return json.payload ?? json
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const token_ = getStoredToken()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token_) headers['Authorization'] = `Bearer ${token_}`

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password })
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json?.message || 'Invalid credentials')
    }

    // Backend: { status, message, payload: { data: { token, user } } }
    const payload = json.payload ?? json
    const token = payload?.data?.token || payload?.token
    const user: User = payload?.data?.user || payload?.user

    if (!token || !user) throw new Error('Invalid response from server')
    setStoredToken(token, user)
    return { token, user }
  },

  logout: async (onUnauthorized?: () => void): Promise<void> => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' }, onUnauthorized)
    } finally {
      clearStoredToken()
    }
  },

  me: async (onUnauthorized?: () => void): Promise<User> => {
    const payload = await apiFetch('/auth/me', {}, onUnauthorized)
    return payload?.data ?? payload
  }
}

// ─── API Service ──────────────────────────────────────────────────────────────

export const apiService = {
  // Dashboard
  getDashboardMetrics: async (onUnauthorized?: () => void): Promise<DashboardMetrics> => {
    const payload = await apiFetch('/dashboard/metrics', {}, onUnauthorized)
    return payload?.data ?? payload
  },

  // Donors
  getDonors: async (
    filters: Record<string, string> = {},
    onUnauthorized?: () => void
  ): Promise<{ donors: Donor[]; total: number }> => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v != null))
    ).toString()
    const payload = await apiFetch(`/donor${params ? `?${params}` : ''}`, {}, onUnauthorized)
    const data = payload?.data ?? payload
    return { donors: data?.donors ?? data ?? [], total: data?.total ?? 0 }
  },

  createDonor: async (donorData: Partial<Donor>, onUnauthorized?: () => void): Promise<Donor> => {
    const payload = await apiFetch('/donor', { method: 'POST', body: JSON.stringify(donorData) }, onUnauthorized)
    return payload?.data ?? payload
  },

  updateDonor: async (id: number, donorData: Partial<Donor>, onUnauthorized?: () => void): Promise<Donor> => {
    const payload = await apiFetch(`/donor/${id}`, { method: 'PUT', body: JSON.stringify(donorData) }, onUnauthorized)
    return payload?.data ?? payload
  },

  deleteDonor: async (id: number, onUnauthorized?: () => void): Promise<void> => {
    await apiFetch(`/donor/${id}`, { method: 'DELETE' }, onUnauthorized)
  },

  // Donor Categories
  getCategories: async (onUnauthorized?: () => void): Promise<DonorCategory[]> => {
    const payload = await apiFetch('/donor-category', {}, onUnauthorized)
    const data = payload?.data ?? payload
    return data?.categories ?? data ?? []
  },

  createCategory: async (categoryData: Partial<DonorCategory>, onUnauthorized?: () => void): Promise<DonorCategory> => {
    const payload = await apiFetch('/donor-category', { method: 'POST', body: JSON.stringify(categoryData) }, onUnauthorized)
    return payload?.data ?? payload
  },

  // Greetings
  getTodaysGreetings: async (
    onUnauthorized?: () => void
  ): Promise<{ birthdays: GreetingItem[]; anniversaries: GreetingItem[] }> => {
    const payload = await apiFetch('/greeting/today', {}, onUnauthorized)
    const data = payload?.data ?? payload
    return { birthdays: data?.birthdays ?? [], anniversaries: data?.anniversaries ?? [] }
  },

  // Events
  getEvents: async (onUnauthorized?: () => void): Promise<NGOEvent[]> => {
    const payload = await apiFetch('/event', {}, onUnauthorized)
    const data = payload?.data ?? payload
    return data?.events ?? data ?? []
  },

  createEvent: async (eventData: Partial<NGOEvent>, onUnauthorized?: () => void): Promise<NGOEvent> => {
    const payload = await apiFetch('/event', { method: 'POST', body: JSON.stringify(eventData) }, onUnauthorized)
    return payload?.data ?? payload
  },

  sendEventInvitations: async (
    eventId: number,
    donorIds: number[],
    onUnauthorized?: () => void
  ): Promise<{ invitation_links: any[]; sent_count: number }> => {
    const payload = await apiFetch(
      `/event/${eventId}/invite`,
      { method: 'POST', body: JSON.stringify({ donor_ids: donorIds, channel: 'WHATSAPP' }) },
      onUnauthorized
    )
    return payload?.data ?? payload
  }
}
