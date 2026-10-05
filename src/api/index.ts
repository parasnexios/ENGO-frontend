import { Donor, DonorCategory, NGOEvent, DashboardMetrics, GreetingItem } from '../types'

const API_BASE = 'http://localhost:4008/engo/api/v1'

let authToken: string | null = localStorage.getItem('engo_token')

/**
 * Ensures authenticated session with backend API.
 * Automatically logs in using test user credentials if no token exists.
 */
export async function getAuthToken(): Promise<string | null> {
  if (authToken) return authToken

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@engo.org', password: 'Password@123' })
    })

    if (res.ok) {
      const json = await res.json()
      const token = json.data?.data?.token || json.data?.token || json.token
      if (token) {
        authToken = token
        localStorage.setItem('engo_token', token)
        return token
      }
    }
  } catch (e) {
    console.warn('Auto login error:', e)
  }
  return null
}

async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  let res = await fetch(url, { ...options, headers, credentials: 'include' })

  if (res.status === 401) {
    localStorage.removeItem('engo_token')
    authToken = null
    const newToken = await getAuthToken()
    if (newToken) {
      const newHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
        Authorization: `Bearer ${newToken}`
      }
      res = await fetch(url, { ...options, headers: newHeaders, credentials: 'include' })
    }
  }

  return res
}

// Fallback initial data in case of offline environment
const initialCategories: DonorCategory[] = [
  { category_id: 1, name: 'Doctor', description: 'Medical practitioners and specialists' },
  { category_id: 2, name: 'Business', description: 'Business owners and entrepreneurs' },
  { category_id: 3, name: 'Company', description: 'Corporate partners and sponsors' },
  { category_id: 4, name: 'Professional', description: 'Engineers, CA, Lawyers, Consultants' },
  { category_id: 5, name: 'Other', description: 'General donors and well-wishers' }
]

const initialDonors: Donor[] = [
  {
    donor_id: 1,
    name: 'Dr. Rajesh Patel',
    mobile: '+91 98250 12345',
    email: 'dr.rajesh@gmail.com',
    profession: 'Cardiologist',
    category_id: 1,
    city: 'Ahmedabad',
    area: 'Navrangpura',
    address: '102, Sunrise Towers, Near CG Road',
    pincode: '380009',
    dob: new Date().toISOString().split('T')[0],
    anniversary_date: '2005-12-15',
    notes: 'Regular donor for medical camps',
    category: initialCategories[0]
  },
  {
    donor_id: 2,
    name: 'Anil Shah',
    mobile: '+91 98980 54321',
    email: 'anil.shah@techcorp.com',
    profession: 'IT Businessman',
    category_id: 2,
    city: 'Surat',
    area: 'Ring Road',
    address: '405, Textile Market Plaza',
    pincode: '395002',
    dob: '1975-06-18',
    anniversary_date: new Date().toISOString().split('T')[0],
    notes: 'Sponsors annual education kit distribution',
    category: initialCategories[1]
  }
]

const initialEvents: NGOEvent[] = [
  {
    event_id: 1,
    title: 'Mega Blood Donation Camp 2026',
    description: 'Annual voluntary blood donation drive organized with Red Cross Society.',
    event_date: '2026-10-15',
    event_time: '09:00 AM - 05:00 PM',
    venue: 'Community Hall, Navrangpura, Ahmedabad',
    status: 'UPCOMING',
    invitations: []
  }
]

export const apiService = {
  // Authentication
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      const json = await res.json()
      const token = json.data?.data?.token || json.data?.token || json.token
      if (token) {
        authToken = token
        localStorage.setItem('engo_token', token)
      }
      return json
    }
    throw new Error('Invalid credentials')
  },

  // Dashboard Metrics
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const res = await authenticatedFetch(`${API_BASE}/dashboard/metrics`)
      if (res.ok) {
        const json = await res.json()
        return json.data
      }
    } catch (e) {
      console.warn('API error, using local fallback:', e)
    }

    return {
      totalDonors: initialDonors.length,
      totalCategories: initialCategories.length,
      activeEvents: initialEvents.filter((e) => e.status === 'UPCOMING').length,
      todaysBirthdays: 1,
      todaysAnniversaries: 1,
      recentDonors: initialDonors,
      upcomingEvents: initialEvents
    }
  },

  // Donors
  getDonors: async (filters: any = {}): Promise<{ donors: Donor[]; total: number }> => {
    try {
      const params = new URLSearchParams(filters).toString()
      const res = await authenticatedFetch(`${API_BASE}/donor?${params}`)
      if (res.ok) {
        const json = await res.json()
        return { donors: json.data.donors, total: json.data.total }
      }
    } catch (e) {}

    let filtered = [...initialDonors]
    if (filters.search) {
      const s = filters.search.toLowerCase()
      filtered = filtered.filter(
        (d) => d.name.toLowerCase().includes(s) || d.mobile.includes(s) || (d.email && d.email.toLowerCase().includes(s))
      )
    }
    if (filters.category_id) {
      filtered = filtered.filter((d) => d.category_id === Number(filters.category_id))
    }
    return { donors: filtered, total: filtered.length }
  },

  createDonor: async (donorData: Partial<Donor>): Promise<Donor> => {
    try {
      const res = await authenticatedFetch(`${API_BASE}/donor`, {
        method: 'POST',
        body: JSON.stringify(donorData)
      })
      if (res.ok) {
        const json = await res.json()
        return json.data
      }
    } catch (e) {}

    const newDonor: Donor = {
      donor_id: Date.now(),
      name: donorData.name || '',
      mobile: donorData.mobile || '',
      email: donorData.email,
      profession: donorData.profession,
      category_id: donorData.category_id ? Number(donorData.category_id) : undefined,
      city: donorData.city,
      area: donorData.area,
      address: donorData.address,
      pincode: donorData.pincode,
      dob: donorData.dob,
      anniversary_date: donorData.anniversary_date,
      notes: donorData.notes,
      category: initialCategories.find((c) => c.category_id === Number(donorData.category_id))
    }
    initialDonors.unshift(newDonor)
    return newDonor
  },

  deleteDonor: async (id: number): Promise<boolean> => {
    try {
      const res = await authenticatedFetch(`${API_BASE}/donor/${id}`, { method: 'DELETE' })
      if (res.ok) return true
    } catch (e) {}
    const idx = initialDonors.findIndex((d) => d.donor_id === id)
    if (idx !== -1) initialDonors.splice(idx, 1)
    return true
  },

  // Donor Categories
  getCategories: async (): Promise<DonorCategory[]> => {
    try {
      const res = await authenticatedFetch(`${API_BASE}/donor-category`)
      if (res.ok) {
        const json = await res.json()
        return json.data
      }
    } catch (e) {}
    return initialCategories
  },

  createCategory: async (categoryData: Partial<DonorCategory>): Promise<DonorCategory> => {
    try {
      const res = await authenticatedFetch(`${API_BASE}/donor-category`, {
        method: 'POST',
        body: JSON.stringify(categoryData)
      })
      if (res.ok) {
        const json = await res.json()
        return json.data
      }
    } catch (e) {}

    const newCat: DonorCategory = {
      category_id: Date.now(),
      name: categoryData.name || '',
      description: categoryData.description
    }
    initialCategories.push(newCat)
    return newCat
  },

  // Greetings
  getTodaysGreetings: async (): Promise<{ birthdays: GreetingItem[]; anniversaries: GreetingItem[] }> => {
    try {
      const res = await authenticatedFetch(`${API_BASE}/greeting/today`)
      if (res.ok) {
        const json = await res.json()
        return json.data
      }
    } catch (e) {}

    const todayBirthdays = initialDonors.map((donor) => {
      const msg = `Dear ${donor.name}, Wishing you a very Happy Birthday! May your day be filled with joy and blessings. Thank you for your continued support to our NGO family.`
      return {
        donor,
        type: 'BIRTHDAY' as const,
        message: msg,
        whatsapp_link: `https://api.whatsapp.com/send?phone=${donor.mobile.replace(/\D/g, '')}&text=${encodeURIComponent(msg)}`
      }
    })

    return { birthdays: todayBirthdays, anniversaries: [] }
  },

  // Events
  getEvents: async (): Promise<NGOEvent[]> => {
    try {
      const res = await authenticatedFetch(`${API_BASE}/event`)
      if (res.ok) {
        const json = await res.json()
        return json.data.events
      }
    } catch (e) {}
    return initialEvents
  },

  createEvent: async (eventData: Partial<NGOEvent>): Promise<NGOEvent> => {
    try {
      const res = await authenticatedFetch(`${API_BASE}/event`, {
        method: 'POST',
        body: JSON.stringify(eventData)
      })
      if (res.ok) {
        const json = await res.json()
        return json.data
      }
    } catch (e) {}

    const newEv: NGOEvent = {
      event_id: Date.now(),
      title: eventData.title || '',
      description: eventData.description,
      event_date: eventData.event_date || new Date().toISOString().split('T')[0],
      event_time: eventData.event_time,
      venue: eventData.venue || '',
      status: 'UPCOMING',
      invitations: []
    }
    initialEvents.unshift(newEv)
    return newEv
  }
}
