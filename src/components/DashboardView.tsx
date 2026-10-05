import React from 'react'
import { DashboardMetrics, ActiveTab } from '../types'
import { Users, Cake, Heart, Calendar, ArrowRight, MessageSquare, Plus, Printer, Tags } from 'lucide-react'

interface DashboardViewProps {
  metrics: DashboardMetrics | null
  setActiveTab: (tab: ActiveTab) => void
  onOpenAddDonor: () => void
  onOpenAddEvent: () => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({ metrics, setActiveTab, onOpenAddDonor, onOpenAddEvent }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(99, 102, 241, 0.15) 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>NGO SOFTWARE SUITE</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '6px' }}>Welcome to ENGO Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Seamlessly manage donor records, business categories, automated greetings, events, and sticker label printing.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={onOpenAddDonor}>
            <Plus size={18} /> Add New Donor
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('stickers')}>
            <Printer size={18} /> Print Stickers
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Total Donors */}
        <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveTab('donors')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Total Donors</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <Users size={22} />
            </div>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>{metrics ? metrics.totalDonors : 0}</h3>
          <p style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Categorized & Managed
          </p>
        </div>

        {/* Today Birthdays */}
        <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveTab('greetings')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Today's Birthdays</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}>
              <Cake size={22} />
            </div>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>{metrics ? metrics.todaysBirthdays : 0}</h3>
          <p style={{ fontSize: '0.8rem', color: '#f472b6' }}>
            Auto Greeting Ready
          </p>
        </div>

        {/* Today Anniversaries */}
        <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveTab('greetings')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Today's Anniversaries</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
              <Heart size={22} />
            </div>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>{metrics ? metrics.todaysAnniversaries : 0}</h3>
          <p style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
            Personalized Messages
          </p>
        </div>

        {/* Active Events */}
        <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveTab('events')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Active Events / Camps</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8' }}>
              <Calendar size={22} />
            </div>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>{metrics ? metrics.activeEvents : 0}</h3>
          <p style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
            Send Invitations
          </p>
        </div>
      </div>

      {/* Two Column Layout: Recent Donors & Upcoming Events */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Donors Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Donors</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest registered donors</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('donors')}>
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Donor Name</th>
                  <th>Category</th>
                  <th>Mobile</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {metrics && metrics.recentDonors.length > 0 ? (
                  metrics.recentDonors.map((donor) => (
                    <tr key={donor.donor_id}>
                      <td style={{ fontWeight: 600 }}>{donor.name}</td>
                      <td>
                        <span className="badge badge-primary">{donor.category?.name || donor.profession || 'Donor'}</span>
                      </td>
                      <td>{donor.mobile}</td>
                      <td>{donor.city || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                      No donors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Events Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Upcoming Events / Camps</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scheduled NGO drives</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('events')}>
              Manage Events <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {metrics && metrics.upcomingEvents.length > 0 ? (
              metrics.upcomingEvents.map((ev) => (
                <div key={ev.event_id} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-success">UPCOMING</span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{ev.title}</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      📍 {ev.venue} | 📅 {ev.event_date} {ev.event_time ? `(${ev.event_time})` : ''}
                    </p>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('events')}>
                    Invite
                  </button>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No upcoming events scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
