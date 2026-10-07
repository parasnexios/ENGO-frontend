import React, { useState } from 'react'
import { NGOEvent, Donor } from '../types'
import { Calendar, MapPin, Clock, Plus, Send, CheckCircle2, ExternalLink, X } from 'lucide-react'
import { apiService } from '../api'

interface EventViewProps {
  events: NGOEvent[]
  donors: Donor[]
  onAddEvent: (ev: Partial<NGOEvent>) => void
  selectedDonorIds: number[]
  onUnauthorized?: () => void
}

interface InvitationLink {
  donor_id: number
  name: string
  mobile: string
  whatsapp_link: string
  message: string
}

export const EventView: React.FC<EventViewProps> = ({ events, donors, onAddEvent, selectedDonorIds, onUnauthorized }) => {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [venue, setVenue] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [description, setDescription] = useState('')

  const [sendingEventId, setSendingEventId] = useState<number | null>(null)
  const [invitedEvents, setInvitedEvents] = useState<number[]>([])
  const [invitationLinks, setInvitationLinks] = useState<InvitationLink[]>([])
  const [showLinksModal, setShowLinksModal] = useState(false)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !venue.trim() || !eventDate) return
    onAddEvent({
      title: title.trim(),
      venue: venue.trim(),
      event_date: eventDate,
      event_time: eventTime.trim(),
      description: description.trim(),
      status: 'UPCOMING'
    })
    setTitle('')
    setVenue('')
    setEventDate('')
    setEventTime('')
    setDescription('')
    setShowModal(false)
  }

  const handleSendInvitations = async (eventId: number) => {
    const targetIds = selectedDonorIds.length > 0 ? selectedDonorIds : donors.map((d) => d.donor_id)

    if (targetIds.length === 0) {
      alert('No donors available to invite.')
      return
    }

    if (!window.confirm(`Send WhatsApp invitations to ${targetIds.length} donor${targetIds.length > 1 ? 's' : ''}?`)) return

    setSendingEventId(eventId)
    try {
      const result = await apiService.sendEventInvitations(eventId, targetIds, onUnauthorized)
      const links: InvitationLink[] = result?.invitation_links ?? []

      setInvitedEvents((prev) => [...new Set([...prev, eventId])])
      setInvitationLinks(links)

      if (links.length > 0) {
        setShowLinksModal(true)
      } else {
        alert(`✅ Invitations recorded for ${targetIds.length} donors.`)
      }
    } catch (err: any) {
      alert(`Failed to send invitations: ${err.message}`)
    } finally {
      setSendingEventId(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>NGO Events &amp; Camps Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Schedule NGO health camps, blood donation drives, and send WhatsApp invitations to donors.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Schedule New Event
        </button>
      </div>

      {/* Events List Cards */}
      {events.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Calendar size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p>No events scheduled yet. Create your first NGO event.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {events.map((ev) => {
            const isInvited = invitedEvents.includes(ev.event_id)
            const isSending = sendingEventId === ev.event_id
            const targetCount = selectedDonorIds.length > 0 ? selectedDonorIds.length : donors.length

            return (
              <div key={ev.event_id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className={`badge ${ev.status === 'UPCOMING' ? 'badge-success' : ev.status === 'COMPLETED' ? 'badge-primary' : 'badge-secondary'}`}>
                      {ev.status}
                    </span>
                    {isInvited && (
                      <span className="badge badge-primary">
                        <CheckCircle2 size={12} /> Invitations Sent
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>{ev.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    {ev.description || 'NGO Camp Drive'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="#818cf8" />
                      <span>{ev.venue}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="#34d399" />
                      <span>{ev.event_date}</span>
                    </div>
                    {ev.event_time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} color="#fbbf24" />
                        <span>{ev.event_time}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Target: {selectedDonorIds.length > 0 ? `${selectedDonorIds.length} Selected` : `All ${donors.length} Donors`}
                  </span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSendInvitations(ev.event_id)}
                    disabled={isSending || targetCount === 0}
                    style={{ opacity: isSending ? 0.7 : 1 }}
                  >
                    <Send size={14} />
                    {isSending ? 'Sending...' : 'Send WhatsApp Invites'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* WhatsApp Links Modal */}
      {showLinksModal && invitationLinks.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '28px', background: '#1e293b', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#25d366' }}>
                📲 WhatsApp Invitation Links
              </h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShowLinksModal(false)}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Click each link to open WhatsApp and send the invitation to the donor.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {invitationLinks.map((link) => (
                <div key={link.donor_id} style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{link.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{link.mobile}</p>
                  </div>
                  <a
                    href={link.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                    style={{ textDecoration: 'none', background: '#25d366', color: '#fff', border: 'none' }}
                  >
                    <ExternalLink size={14} /> Open WhatsApp
                  </a>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowLinksModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '540px', padding: '28px', background: '#1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Schedule NGO Event / Camp</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Event Title *</label>
                <input type="text" required placeholder="e.g. Voluntary Blood Donation Drive 2026" className="input-control" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Venue Address *</label>
                <input type="text" required placeholder="e.g. Navrangpura Community Hall, Ahmedabad" className="input-control" value={venue} onChange={(e) => setVenue(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Event Date *</label>
                  <input type="date" required className="input-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Event Time</label>
                  <input type="text" placeholder="e.g. 09:00 AM - 04:00 PM" className="input-control" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Event Details / Description</label>
                <textarea placeholder="Detailed information for donor invitations..." className="input-control" style={{ height: '80px', resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
