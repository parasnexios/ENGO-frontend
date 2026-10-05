import React, { useState } from 'react'
import { NGOEvent, Donor } from '../types'
import { Calendar, MapPin, Clock, Plus, Users, Send, CheckCircle2 } from 'lucide-react'

interface EventViewProps {
  events: NGOEvent[]
  donors: Donor[]
  onAddEvent: (ev: Partial<NGOEvent>) => void
  selectedDonorIds: number[]
}

export const EventView: React.FC<EventViewProps> = ({ events, donors, onAddEvent, selectedDonorIds }) => {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [venue, setVenue] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [description, setDescription] = useState('')

  const [activeInviteEventId, setActiveInviteEventId] = useState<number | null>(null)
  const [invitedEvents, setInvitedEvents] = useState<number[]>([])

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

  const handleSendInvitations = (eventId: number) => {
    if (!invitedEvents.includes(eventId)) {
      setInvitedEvents([...invitedEvents, eventId])
    }
    setActiveInviteEventId(null)
    alert(`Invitations sent to ${selectedDonorIds.length > 0 ? selectedDonorIds.length : donors.length} donors via WhatsApp & SMS!`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>NGO Events & Camps Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Schedule NGO health camps, blood donation drives, and send invitations to donors.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Schedule New Event
        </button>
      </div>

      {/* Events List Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {events.map((ev) => {
          const isInvited = invitedEvents.includes(ev.event_id)

          return (
            <div key={ev.event_id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-success">{ev.status}</span>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '20px' }}>
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
                  Target: {selectedDonorIds.length > 0 ? `${selectedDonorIds.length} Selected Donors` : 'All Donors'}
                </span>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSendInvitations(ev.event_id)}
                >
                  <Send size={14} /> Send Invitations
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal to Create Event */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '540px', padding: '28px', background: '#1e293b' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Schedule NGO Event / Camp</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Voluntary Blood Donation Drive 2026"
                  className="input-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Venue Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navrangpura Community Hall, Ahmedabad"
                  className="input-control"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Event Date *</label>
                  <input
                    type="date"
                    required
                    className="input-control"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Event Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM - 04:00 PM"
                    className="input-control"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Event Details / Description</label>
                <textarea
                  placeholder="Detailed information for donor invitations..."
                  className="input-control"
                  style={{ height: '80px', resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
