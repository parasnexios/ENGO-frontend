import React, { useState, useEffect } from 'react'
import { ActiveTab, Donor, DonorCategory, NGOEvent, DashboardMetrics, GreetingItem } from './types'
import { apiService } from './api'
import { Navbar } from './components/Navbar'
import { DashboardView } from './components/DashboardView'
import { DonorListView } from './components/DonorListView'
import { DonorCategoryView } from './components/DonorCategoryView'
import { GreetingView } from './components/GreetingView'
import { EventView } from './components/EventView'
import { StickerPrintView } from './components/StickerPrintView'
import { AddDonorModal } from './components/AddDonorModal'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [donors, setDonors] = useState<Donor[]>([])
  const [categories, setCategories] = useState<DonorCategory[]>([])
  const [events, setEvents] = useState<NGOEvent[]>([])
  const [todaysBirthdays, setTodaysBirthdays] = useState<GreetingItem[]>([])
  const [todaysAnniversaries, setTodaysAnniversaries] = useState<GreetingItem[]>([])

  const [selectedDonorIds, setSelectedDonorIds] = useState<number[]>([])

  const [showAddDonorModal, setShowAddDonorModal] = useState(false)
  const [showAddEventModal, setShowAddEventModal] = useState(false)

  // Initial Data Fetching
  const loadAllData = async (filters: any = {}) => {
    const [m, d, c, ev, g] = await Promise.all([
      apiService.getDashboardMetrics(),
      apiService.getDonors(filters),
      apiService.getCategories(),
      apiService.getEvents(),
      apiService.getTodaysGreetings()
    ])

    setMetrics(m)
    setDonors(d.donors)
    setCategories(c)
    setEvents(ev)
    setTodaysBirthdays(g.birthdays)
    setTodaysAnniversaries(g.anniversaries)
  }

  useEffect(() => {
    loadAllData()
  }, [])

  // Handlers
  const handleSearchDonors = async (filters: any) => {
    const res = await apiService.getDonors(filters)
    setDonors(res.donors)
  }

  const handleCreateDonor = async (donorData: Partial<Donor>) => {
    await apiService.createDonor(donorData)
    loadAllData()
  }

  const handleDeleteDonor = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this donor record?')) {
      await apiService.deleteDonor(id)
      loadAllData()
    }
  }

  const handleCreateCategory = async (catData: Partial<DonorCategory>) => {
    await apiService.createCategory(catData)
    loadAllData()
  }

  const handleCreateEvent = async (evData: Partial<NGOEvent>) => {
    await apiService.createEvent(evData)
    loadAllData()
  }

  const selectedDonorsList = donors.filter((d) => selectedDonorIds.includes(d.donor_id))

  const handleLogout = () => {
    localStorage.removeItem('engo_token')
    alert('Logged out successfully.')
    loadAllData()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddDonor={() => setShowAddDonorModal(true)}
        onOpenAddEvent={() => setActiveTab('events')}
        onLogout={handleLogout}
      />

      {/* Main Content Body */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px' }}>
        {activeTab === 'dashboard' && (
          <DashboardView
            metrics={metrics}
            setActiveTab={setActiveTab}
            onOpenAddDonor={() => setShowAddDonorModal(true)}
            onOpenAddEvent={() => setActiveTab('events')}
          />
        )}

        {activeTab === 'donors' && (
          <DonorListView
            donors={donors}
            categories={categories}
            selectedDonorIds={selectedDonorIds}
            setSelectedDonorIds={setSelectedDonorIds}
            onSearch={handleSearchDonors}
            onOpenAddDonor={() => setShowAddDonorModal(true)}
            onDeleteDonor={handleDeleteDonor}
            onNavigateToStickers={() => setActiveTab('stickers')}
            onNavigateToEvents={() => setActiveTab('events')}
            onNavigateToGreetings={() => setActiveTab('greetings')}
          />
        )}

        {activeTab === 'categories' && (
          <DonorCategoryView
            categories={categories}
            onAddCategory={handleCreateCategory}
          />
        )}

        {activeTab === 'greetings' && (
          <GreetingView
            birthdays={todaysBirthdays}
            anniversaries={todaysAnniversaries}
          />
        )}

        {activeTab === 'events' && (
          <EventView
            events={events}
            donors={donors}
            onAddEvent={handleCreateEvent}
            selectedDonorIds={selectedDonorIds}
          />
        )}

        {activeTab === 'stickers' && (
          <StickerPrintView
            selectedDonors={selectedDonorsList}
            allDonors={donors}
          />
        )}
      </main>

      {/* Add Donor Modal */}
      {showAddDonorModal && (
        <AddDonorModal
          categories={categories}
          onClose={() => setShowAddDonorModal(false)}
          onSave={handleCreateDonor}
        />
      )}
    </div>
  )
}

export default App
