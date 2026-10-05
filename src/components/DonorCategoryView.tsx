import React, { useState } from 'react'
import { DonorCategory } from '../types'
import { Tags, Plus, Briefcase, Stethoscope, Building2, UserCheck, FolderHeart } from 'lucide-react'

interface DonorCategoryViewProps {
  categories: DonorCategory[]
  onAddCategory: (cat: Partial<DonorCategory>) => void
}

export const DonorCategoryView: React.FC<DonorCategoryViewProps> = ({ categories, onAddCategory }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAddCategory({ name: name.trim(), description: description.trim() })
    setName('')
    setDescription('')
    setShowAddModal(false)
  }

  const getCategoryIcon = (categoryName: string) => {
    const l = categoryName.toLowerCase()
    if (l.includes('doctor') || l.includes('med')) return <Stethoscope size={22} />
    if (l.includes('business')) return <Briefcase size={22} />
    if (l.includes('company') || l.includes('corp')) return <Building2 size={22} />
    if (l.includes('professional')) return <UserCheck size={22} />
    return <FolderHeart size={22} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Donor Categories & Profession Types</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Categorize donors by profession (Doctor, Business, Company, Professional, Other).
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Custom Category
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {categories.map((cat) => (
          <div key={cat.category_id} className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              {getCategoryIcon(cat.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{cat.name}</h3>
                <span className="badge badge-primary">Active</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {cat.description || 'Custom profession category for donors.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding New Category */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '28px', background: '#1e293b' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Add New Donor Category</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chartered Accountant, Teacher, Realtor"
                  className="input-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  placeholder="Brief description of this category..."
                  className="input-control"
                  style={{ height: '80px', resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
