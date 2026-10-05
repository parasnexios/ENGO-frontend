import React, { useState } from 'react'
import { Donor } from '../types'
import { Printer, LayoutGrid, CheckCircle, Sliders } from 'lucide-react'

interface StickerPrintViewProps {
  selectedDonors: Donor[]
  allDonors: Donor[]
}

export const StickerPrintView: React.FC<StickerPrintViewProps> = ({ selectedDonors, allDonors }) => {
  const [gridLayout, setGridLayout] = useState<'grid_2' | 'grid_4' | 'grid_8' | 'grid_12' | 'grid_21'>('grid_8')

  const targetDonors = selectedDonors.length > 0 ? selectedDonors : allDonors

  const getColumnsCount = () => {
    if (gridLayout === 'grid_2') return 1
    if (gridLayout === 'grid_4') return 2
    if (gridLayout === 'grid_8') return 2
    if (gridLayout === 'grid_12') return 3
    return 3 // grid_21
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Print Control Bar (Hidden when printing) */}
      <div className="glass-card no-print" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Printable Donor Stickers & Labels</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Showing {targetDonors.length} donor sticker labels. Select your page layout grid and print.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Grid Layout Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Stickers Per Page:</span>
            <select
              className="input-control"
              style={{ width: '130px' }}
              value={gridLayout}
              onChange={(e: any) => setGridLayout(e.target.value)}
            >
              <option value="grid_2">2 / Page (Large)</option>
              <option value="grid_4">4 / Page (Medium)</option>
              <option value="grid_8">8 / Page (Standard)</option>
              <option value="grid_12">12 / Page (Compact)</option>
              <option value="grid_21">21 / Page (Small)</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={18} /> Print {targetDonors.length} Stickers
          </button>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div
        className="sticker-page glass-card"
        style={{ padding: '32px', background: 'rgba(15, 23, 42, 0.5)' }}
      >
        <div
          className="sticker-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${getColumnsCount()}, 1fr)`,
            gap: '16px'
          }}
        >
          {targetDonors.map((donor) => (
            <div
              key={donor.donor_id}
              className="sticker-card"
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px dashed rgba(99, 102, 241, 0.4)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              {/* Sticker Content */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ENGO DONOR LABEL
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>#{donor.donor_id}</span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {donor.name}
              </h4>

              {donor.profession || donor.category ? (
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#34d399' }}>
                  {donor.profession || donor.category?.name}
                </p>
              ) : null}

              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px', lineHeight: 1.4 }}>
                {donor.address ? `${donor.address}, ` : ''}
                {donor.area ? `${donor.area}, ` : ''}
                {donor.city ? `${donor.city} ` : ''}
                {donor.pincode || ''}
              </p>

              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>📱 {donor.mobile}</span>
                {donor.dob && <span>DOB: {donor.dob}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
