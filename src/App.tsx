import React, { useState, useEffect, useCallback } from 'react'
import { ActiveTab, Donor, DonorCategory, NGOEvent, DashboardMetrics, GreetingItem, User } from './types'
import { apiService, authService, getStoredToken, getStoredUser } from './api'
import { LoginPage } from './components/LoginPage'
import { Navbar } from './components/Navbar'
import { DashboardView } from './components/DashboardView'
import { DonorListView } from './components/DonorListView'
import { DonorCategoryView } from './components/DonorCategoryView'
import { GreetingView } from './components/GreetingView'
import { EventView } from './components/EventView'
import { StickerPrintView } from './components/StickerPrintView'
import { AddDonorModal } from './components/AddDonorModal'

export const App: React.FC = () => {
  // ─── Auth State ────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getStoredToken())
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser())

  // ─── App State ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [donors, setDonors] = useState<Donor[]>([])
  const [categories, setCategories] = useState<DonorCategory[]>([])
  const [events, setEvents] = useState<NGOEvent[]>([])
  const [todaysBirthdays, setTodaysBirthdays] = useState<GreetingItem[]>([])
  const [todaysAnniversaries, setTodaysAnniversaries] = useState<GreetingItem[]>([])
  const [selectedDonorIds, setSelectedDonorIds] = useState<number[]>([])
  const [showAddDonorModal, setShowAddDonorModal] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [dataError, setDataError] = useState<string | null>(null)

  // ─── Unauthorized handler — fires on 401 ──────────────────────────────────
  const handleUnauthorized = useCallback(() => {
    setIsAuthenticated(false)
    setCurrentUser(null)
  }, [])

  // ─── Load all data from real backend ──────────────────────────────────────
  const loadAllData = useCallback(
    async (filters: Record<string, string> = {}) => {
      setLoadingData(true)
      setDataError(null)
      try {
        const [m, d, c, ev, g] = await Promise.all([
          apiService.getDashboardMetrics(handleUnauthorized),
          apiService.getDonors(filters, handleUnauthorized),
          apiService.getCategories(handleUnauthorized),
          apiService.getEvents(handleUnauthorized),
          apiService.getTodaysGreetings(handleUnauthorized)
        ])
        setMetrics(m)
        setDonors(d.donors)
        setCategories(c)
        setEvents(ev)
        setTodaysBirthdays(g.birthdays)
        setTodaysAnniversaries(g.anniversaries)
      } catch (err: any) {
        setDataError(err.message || 'Failed to load data from server.')
      } finally {
        setLoadingData(false)
      }
    },
    [handleUnauthorized]
  )

  // Load data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData()
    }
  }, [isAuthenticated, loadAllData])

  // ─── Auth Handlers ────────────────────────────────────────────────────────
  const handleLoginSuccess = () => {
    setCurrentUser(getStoredUser())
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await authService.logout(handleUnauthorized)
    } catch {
      // logout clears token regardless
    }
    setIsAuthenticated(false)
    setCurrentUser(null)
    // Reset all app state
    setMetrics(null)
    setDonors([])
    setCategories([])
    setEvents([])
    setTodaysBirthdays([])
    setTodaysAnniversaries([])
    setSelectedDonorIds([])
    setActiveTab('dashboard')
  }

  // ─── Data Handlers ────────────────────────────────────────────────────────
  const handleSearchDonors = async (filters: Record<string, string>) => {
    try {
      const res = await apiService.getDonors(filters, handleUnauthorized)
      setDonors(res.donors)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleCreateDonor = async (donorData: Partial<Donor>) => {
    try {
      await apiService.createDonor(donorData, handleUnauthorized)
      setShowAddDonorModal(false)
      loadAllData()
    } catch (err: any) {
      alert(`Failed to create donor: ${err.message}`)
    }
  }

  const handleDeleteDonor = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this donor record?')) return
    try {
      await apiService.deleteDonor(id, handleUnauthorized)
      loadAllData()
    } catch (err: any) {
      alert(`Failed to delete donor: ${err.message}`)
    }
  }

  const handleUpdateDonor = async (id: number, donorData: Partial<Donor>) => {
    try {
      await apiService.updateDonor(id, donorData, handleUnauthorized)
      loadAllData()
    } catch (err: any) {
      alert(`Failed to update donor: ${err.message}`)
    }
  }

  const handleCreateCategory = async (catData: Partial<DonorCategory>) => {
    try {
      await apiService.createCategory(catData, handleUnauthorized)
      loadAllData()
    } catch (err: any) {
      alert(`Failed to create category: ${err.message}`)
    }
  }

  const handleCreateEvent = async (evData: Partial<NGOEvent>) => {
    try {
      await apiService.createEvent(evData, handleUnauthorized)
      loadAllData()
    } catch (err: any) {
      alert(`Failed to create event: ${err.message}`)
    }
  }

  const selectedDonorsList = donors.filter((d) => selectedDonorIds.includes(d.donor_id))

  // ─── Render ───────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddDonor={() => setShowAddDonorModal(true)}
        onOpenAddEvent={() => setActiveTab('events')}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px' }}>
        {/* Global data error banner */}
        {dataError && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              color: '#ef4444',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>⚠️</span>
            <span>{dataError}</span>
            <button
              onClick={() => loadAllData()}
              style={{
                marginLeft: 'auto',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                padding: '4px 12px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading overlay */}
        {loadingData && !metrics && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8', fontSize: '16px' }}>
            <div style={{ marginBottom: '16px', fontSize: '32px' }}>⏳</div>
            Loading data from server...
          </div>
        )}

        {!loadingData || metrics ? (
          <>
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
                onEditDonor={handleUpdateDonor}
                onNavigateToStickers={() => setActiveTab('stickers')}
                onNavigateToEvents={() => setActiveTab('events')}
                onNavigateToGreetings={() => setActiveTab('greetings')}
              />
            )}

            {activeTab === 'categories' && (
              <DonorCategoryView categories={categories} onAddCategory={handleCreateCategory} />
            )}

            {activeTab === 'greetings' && (
              <GreetingView birthdays={todaysBirthdays} anniversaries={todaysAnniversaries} />
            )}

            {activeTab === 'events' && (
              <EventView
                events={events}
                donors={donors}
                onAddEvent={handleCreateEvent}
                selectedDonorIds={selectedDonorIds}
                onUnauthorized={handleUnauthorized}
              />
            )}

            {activeTab === 'stickers' && (
              <StickerPrintView selectedDonors={selectedDonorsList} allDonors={donors} />
            )}
          </>
        ) : null}
      </main>

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
