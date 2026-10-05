import React, { useState } from 'react'
import { GreetingItem } from '../types'
import { Cake, Heart, Send, MessageSquare, Mail, Phone, CheckCircle2 } from 'lucide-react'

interface GreetingViewProps {
  birthdays: GreetingItem[]
  anniversaries: GreetingItem[]
}

export const GreetingView: React.FC<GreetingViewProps> = ({ birthdays, anniversaries }) => {
  const [activeTab, setActiveTab] = useState<'birthdays' | 'anniversaries'>('birthdays')
  const [sentLog, setSentLog] = useState<string[]>([])

  const currentList = activeTab === 'birthdays' ? birthdays : anniversaries

  const handleMarkSent = (donorId: number, type: string) => {
    const key = `${type}-${donorId}`
    if (!sentLog.includes(key)) {
      setSentLog([...sentLog, key])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Birthday & Anniversary Greetings Hub</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Automatically detect celebrations and dispatch personalized WhatsApp, SMS, or Email greetings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn ${activeTab === 'birthdays' ? 'btn-pink' : 'btn-secondary'}`}
              onClick={() => setActiveTab('birthdays')}
            >
              <Cake size={18} /> Today's Birthdays ({birthdays.length})
            </button>
            <button
              className={`btn ${activeTab === 'anniversaries' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('anniversaries')}
            >
              <Heart size={18} /> Today's Anniversaries ({anniversaries.length})
            </button>
          </div>
        </div>
      </div>

      {/* Greeting Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {currentList.length > 0 ? (
          currentList.map((item) => {
            const logKey = `${item.type}-${item.donor.donor_id}`
            const isSent = sentLog.includes(logKey)

            return (
              <div key={item.donor.donor_id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.type === 'BIRTHDAY' ? (
                        <span className="badge badge-pink">
                          <Cake size={14} /> Birthday
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          <Heart size={14} /> Anniversary
                        </span>
                      )}
                      <span className="badge badge-primary">{item.donor.category?.name || item.donor.profession || 'Donor'}</span>
                    </div>

                    {isSent ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> Greeting Sent
                      </span>
                    ) : (
                      <span className="badge badge-primary">Pending Dispatch</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>{item.donor.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    📱 {item.donor.mobile} | 📍 {item.donor.city || 'City'}
                  </p>

                  {/* Personalized Message Preview Box */}
                  <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed var(--border-color)', fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '16px' }}>
                    "{item.message}"
                  </div>
                </div>

                {/* Dispatch Options Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={item.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success"
                    style={{ flex: 1, textDecoration: 'none' }}
                    onClick={() => handleMarkSent(item.donor.donor_id, item.type)}
                  >
                    <MessageSquare size={16} /> Send via WhatsApp
                  </a>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      alert(`SMS Triggered to ${item.donor.mobile}:\n"${item.message}"`)
                      handleMarkSent(item.donor.donor_id, item.type)
                    }}
                  >
                    <Phone size={14} /> SMS
                  </button>

                  {item.donor.email && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        alert(`Email Sent to ${item.donor.email}:\n"${item.message}"`)
                        handleMarkSent(item.donor.donor_id, item.type)
                      }}
                    >
                      <Mail size={14} /> Email
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No {activeTab} scheduled for today!</p>
            <p style={{ fontSize: '0.85rem' }}>The system automatically monitors donor DOB and Anniversary dates every day.</p>
          </div>
        )}
      </div>
    </div>
  )
}
