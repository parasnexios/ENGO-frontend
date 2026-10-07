import React from 'react'
import { ActiveTab, User } from '../types'
import { LayoutDashboard, Users, Tags, Gift, Calendar, Printer, HeartHandshake, LogOut, UserCheck } from 'lucide-react'

interface NavbarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  onOpenAddDonor: () => void
  onOpenAddEvent: () => void
  onLogout: () => void
  currentUser?: User | null
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAddDonor, onOpenAddEvent, onLogout, currentUser }) => {
  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout()
    }
  }
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'donors', label: 'Donors Directory', icon: <Users size={18} /> },
    { id: 'categories', label: 'Categories', icon: <Tags size={18} /> },
    { id: 'greetings', label: 'Greetings', icon: <Gift size={18} /> },
    { id: 'events', label: 'Events & Camps', icon: <Calendar size={18} /> },
    { id: 'stickers', label: 'Stickers & Labels', icon: <Printer size={18} /> }
  ]

  return (
    <header className="no-print" style={{ background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ENGO <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Software</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Donor & Event Management System</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="btn"
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.3) 100%)' : 'transparent',
                  color: isActive ? '#818cf8' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  padding: '8px 14px',
                  borderRadius: '10px'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Action Buttons & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onOpenAddEvent}>
            + Event / Camp
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenAddDonor}>
            + Add Donor
          </button>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />

          {/* User Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
            <UserCheck size={14} color="#34d399" />
            <span style={{ fontWeight: 600, color: '#f8fafc' }}>{currentUser?.name || 'Admin'}</span>
            {currentUser?.role && (
              <span style={{ fontSize: '10px', background: 'rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: '4px', padding: '1px 6px', textTransform: 'uppercase' }}>
                {currentUser.role}
              </span>
            )}
          </div>

          {/* Logout Button */}
          <button
            id="navbar-logout-btn"
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            onClick={handleLogoutClick}
            title="Logout Session"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
