import React, { useState } from 'react'
import { Donor, DonorCategory } from '../types'
import { Search, Plus, Trash2, Edit2, CheckSquare, Square, Printer, Calendar, Gift } from 'lucide-react'
import { EditDonorModal } from './EditDonorModal'

interface DonorListViewProps {
  donors: Donor[]
  categories: DonorCategory[]
  selectedDonorIds: number[]
  setSelectedDonorIds: React.Dispatch<React.SetStateAction<number[]>>
  onSearch: (filters: any) => void
  onOpenAddDonor: () => void
  onDeleteDonor: (id: number) => void
  onEditDonor: (id: number, data: Partial<Donor>) => Promise<void>
  onNavigateToStickers: () => void
  onNavigateToEvents: () => void
  onNavigateToGreetings: () => void
}

export const DonorListView: React.FC<DonorListViewProps> = ({
  donors,
  categories,
  selectedDonorIds,
  setSelectedDonorIds,
  onSearch,
  onOpenAddDonor,
  onDeleteDonor,
  onEditDonor,
  onNavigateToStickers,
  onNavigateToEvents,
  onNavigateToGreetings
}) => {
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [birthdayFilter, setBirthdayFilter] = useState('')
  const [anniversaryFilter, setAnniversaryFilter] = useState('')

  const handleFilterChange = (key: string, value: string) => {
    let newSearch = searchTerm
    let newCat = selectedCategory
    let newCity = selectedCity
    let newBday = birthdayFilter
    let newAnni = anniversaryFilter

    if (key === 'search') { setSearchTerm(value); newSearch = value; }
    if (key === 'category') { setSelectedCategory(value); newCat = value; }
    if (key === 'city') { setSelectedCity(value); newCity = value; }
    if (key === 'birthday') { setBirthdayFilter(value); newBday = value; }
    if (key === 'anniversary') { setAnniversaryFilter(value); newAnni = value; }

    onSearch({
      search: newSearch,
      category_id: newCat,
      city: newCity,
      birthday_filter: newBday,
      anniversary_filter: newAnni
    })
  }

  const toggleSelectAll = () => {
    if (selectedDonorIds.length === donors.length && donors.length > 0) {
      setSelectedDonorIds([])
    } else {
      setSelectedDonorIds(donors.map((d) => d.donor_id))
    }
  }

  const toggleSelectOne = (id: number) => {
    if (selectedDonorIds.includes(id)) {
      setSelectedDonorIds(selectedDonorIds.filter((item) => item !== id))
    } else {
      setSelectedDonorIds([...selectedDonorIds, id])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Search/Filter Toolbar */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Donor Directory & Database</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Manage, search, filter and multi-select donor records.
            </p>
          </div>
          <button className="btn btn-primary" onClick={onOpenAddDonor}>
            <Plus size={18} /> Add Donor Record
          </button>
        </div>

        {/* Filter Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '14px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search donor name or mobile number..."
              className="input-control"
              style={{ paddingLeft: '38px' }}
              value={searchTerm}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="input-control"
            value={selectedCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* City / Area Filter */}
          <input
            type="text"
            placeholder="Filter by Area / City"
            className="input-control"
            value={selectedCity}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />

          {/* Birthday Filter */}
          <select
            className="input-control"
            value={birthdayFilter}
            onChange={(e) => handleFilterChange('birthday', e.target.value)}
          >
            <option value="">Birthday Filter</option>
            <option value="today">Today's Birthdays</option>
            <option value="this_month">This Month Birthdays</option>
          </select>

          {/* Anniversary Filter */}
          <select
            className="input-control"
            value={anniversaryFilter}
            onChange={(e) => handleFilterChange('anniversary', e.target.value)}
          >
            <option value="">Anniversary Filter</option>
            <option value="today">Today's Anniversaries</option>
            <option value="this_month">This Month Anniversaries</option>
          </select>
        </div>
      </div>

      {/* Donors Table Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-secondary btn-sm" onClick={toggleSelectAll}>
              {selectedDonorIds.length === donors.length && donors.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
              Select All ({donors.length})
            </button>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Showing {donors.length} donor records
            </span>
          </div>

          {selectedDonorIds.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-primary">{selectedDonorIds.length} Donors Selected</span>
            </div>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Select</th>
                <th>Donor Name</th>
                <th>Mobile Number</th>
                <th>Business / Category</th>
                <th>City / Area</th>
                <th>Date of Birth</th>
                <th>Anniversary</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donors.length > 0 ? (
                donors.map((donor) => {
                  const isSelected = selectedDonorIds.includes(donor.donor_id)
                  return (
                    <tr key={donor.donor_id} style={{ background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'transparent' }}>
                      <td>
                        <button
                          style={{ background: 'none', border: 'none', color: isSelected ? '#818cf8' : 'var(--text-muted)', cursor: 'pointer' }}
                          onClick={() => toggleSelectOne(donor.donor_id)}
                        >
                          {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      </td>
                      <td style={{ fontWeight: 600 }}>{donor.name}</td>
                      <td>{donor.mobile}</td>
                      <td>
                        <span className="badge badge-primary">{donor.category?.name || donor.profession || 'Donor'}</span>
                      </td>
                      <td>
                        {donor.area ? `${donor.area}, ` : ''}{donor.city || '-'}
                      </td>
                      <td>{donor.dob || '-'}</td>
                      <td>{donor.anniversary_date || '-'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Edit donor"
                            onClick={() => setEditingDonor(donor)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#ef4444' }}
                            title="Delete donor"
                            onClick={() => onDeleteDonor(donor.donor_id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
                    No donor records match the selected search & filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Selection Action Bar for Selected Donors */}
      {selectedDonorIds.length > 0 && (
        <div className="sticky-selection-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={20} color="#818cf8" />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {selectedDonorIds.length} Donors Selected
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary btn-sm" onClick={onNavigateToStickers}>
              <Printer size={16} /> Print Donor Labels ({selectedDonorIds.length})
            </button>
            <button className="btn btn-success btn-sm" onClick={onNavigateToGreetings}>
              <Gift size={16} /> Send Birthday/Anniversary Greetings
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onNavigateToEvents}>
              <Calendar size={16} /> Invite to Event / Camp
            </button>
          </div>
        </div>
      )}

      {/* Edit Donor Modal */}
      {editingDonor && (
        <EditDonorModal
          donor={editingDonor}
          categories={categories}
          onClose={() => setEditingDonor(null)}
          onSave={async (id, data) => {
            await onEditDonor(id, data)
            setEditingDonor(null)
          }}
        />
      )}
    </div>
  )
}
