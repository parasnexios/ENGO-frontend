import React, { useState } from 'react'
import { Donor, DonorCategory } from '../types'
import { X } from 'lucide-react'

interface AddDonorModalProps {
  categories: DonorCategory[]
  onClose: () => void
  onSave: (donor: Partial<Donor>) => void
}

export const AddDonorModal: React.FC<AddDonorModalProps> = ({ categories, onClose, onSave }) => {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [profession, setProfession] = useState('')
  const [address, setAddress] = useState('')
  const [area, setArea] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [dob, setDob] = useState('')
  const [anniversaryDate, setAnniversaryDate] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !mobile.trim()) return

    onSave({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
      profession: profession.trim() || undefined,
      address: address.trim() || undefined,
      area: area.trim() || undefined,
      city: city.trim() || undefined,
      pincode: pincode.trim() || undefined,
      dob: dob || undefined,
      anniversary_date: anniversaryDate || undefined,
      notes: notes.trim() || undefined
    })

    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '640px', padding: '28px', background: '#1e293b', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Add New Donor Record</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Row 1: Name & Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Donor Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rajesh Patel"
                className="input-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Mobile Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. +91 98250 12345"
                className="input-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Category & Profession */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Business / Category</label>
              <select className="input-control" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Profession Detail</label>
              <input
                type="text"
                placeholder="e.g. Cardiologist, IT Business"
                className="input-control"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: Email & Address */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
              <input
                type="email"
                placeholder="e.g. donor@email.com"
                className="input-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Street Address</label>
              <input
                type="text"
                placeholder="e.g. 102 Sunrise Plaza"
                className="input-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Area, City, Pincode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Area</label>
              <input
                type="text"
                placeholder="e.g. Navrangpura"
                className="input-control"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>City</label>
              <input
                type="text"
                placeholder="e.g. Ahmedabad"
                className="input-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Pincode</label>
              <input
                type="text"
                placeholder="e.g. 380009"
                className="input-control"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
          </div>

          {/* Row 5: DOB & Anniversary Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Date of Birth (DOB)</label>
              <input
                type="date"
                className="input-control"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Anniversary Date</label>
              <input
                type="date"
                className="input-control"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Notes / Remarks</label>
            <textarea
              placeholder="e.g. Regular donor for health camps..."
              className="input-control"
              style={{ height: '70px', resize: 'vertical' }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Donor Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
