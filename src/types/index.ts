export interface User {
  user_id: number
  name: string
  email: string
  role: string
}

export interface DonorCategory {
  category_id: number
  uuid?: string
  name: string
  description?: string
  is_active?: boolean
}

export interface Donor {
  donor_id: number
  uuid?: string
  name: string
  mobile: string
  email?: string
  address?: string
  city?: string
  area?: string
  pincode?: string
  dob?: string
  anniversary_date?: string
  category_id?: number
  profession?: string
  notes?: string
  is_active?: boolean
  created_at?: string
  category?: DonorCategory
}

export interface NGOEvent {
  event_id: number
  uuid?: string
  title: string
  description?: string
  event_date: string
  event_time?: string
  venue: string
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  is_active?: boolean
  invitations?: EventInvitation[]
}

export interface EventInvitation {
  invitation_id: number
  event_id: number
  donor_id: number
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL'
  status: 'SENT' | 'ACCEPTED' | 'DECLINED' | 'PENDING'
  sent_at?: string
  donor?: Donor
}

export interface GreetingItem {
  donor: Donor
  type: 'BIRTHDAY' | 'ANNIVERSARY'
  message: string
  whatsapp_link: string
}

export interface DashboardMetrics {
  totalDonors: number
  totalCategories: number
  activeEvents: number
  todaysBirthdays: number
  todaysAnniversaries: number
  recentDonors: Donor[]
  upcomingEvents: NGOEvent[]
}

export type ActiveTab = 'dashboard' | 'donors' | 'categories' | 'greetings' | 'events' | 'stickers'
