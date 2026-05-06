
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLeads, useFilteredLeads } from '../hooks/useLeads'
import { deleteLead } from '../lib/firestore'
import { LEAD_STATUSES, LEAD_SOURCES, SALESPEOPLE } from '../lib/constants'
import { Button, Input, Select, Modal, StatusBadge, Card } from '../components/ui'
import LeadForm from '../components/leads/LeadForm'
import { Search, Plus, Trash2, Edit2, Eye, Filter, X, DollarSign } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

export default function LeadsPage() {
  const navigate = useNavigate()
  const { leads, loading } = useLeads()
  const [filters, setFilters] = useState({ search: '', status: '', source: '', assignedTo: '' })
  const [showCreate, setShowCreate] = useState(false)
  const [editLead, setEditLead] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useFilteredLeads(leads, filters)

  const setFilter = (k) => (e) => setFilters(f => ({ ...f, [k]: e.target.value }))
  const clearFilters = () => setFilters({ search: '', status: '', source: '', assignedTo: '' })
  const hasFilters = filters.search || filters.status || filters.source || filters.assignedTo

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead and all its notes?')) return
    setDeletingId(id)
    await deleteLead(id)
    setDeletingId(null)
  }

  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.04em', marginBottom: 4 }}>
            Leads
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {loading ? '…' : `${filtered.length} of ${leads.length} leads`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(v => !v)}
            style={{ gap: 6 }}
          >
            <Filter size={14} />
            Filters
            {hasFilters && (
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--accent)', color: '#050e1c',
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {[filters.status, filters.source, filters.assignedTo].filter(Boolean).length || ''}
              </span>
            )}
          </Button>
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <Plus size={15} />
            New Lead
          </Button>
        </div>
      </div>

      {/* Search + filters */}
      <Card style={{ marginBottom: 20, padding: '16px 20px' }}>
        <Input
          value={filters.search}
          onChange={setFilter('search')}
          placeholder="Search by name, company, or email…"
          icon={<Search size={14} />}
          style={{ height: 40, fontSize: 13 }}
        />

        {showFilters && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
            marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)',
            animation: 'fadeIn 0.2s ease',
          }}>
            <Select
              label="Status"
              value={filters.status}
              onChange={setFilter('status')}
              placeholder="All statuses"
              options={LEAD_STATUSES.map(s => ({ value: s.value, label: s.label }))}
            />
            <Select
              label="Lead Source"
              value={filters.source}
              onChange={setFilter('source')}
              placeholder="All sources"
              options={LEAD_SOURCES}
            />
            <Select
              label="Assigned To"
              value={filters.assignedTo}
              onChange={setFilter('assignedTo')}
              placeholder="All salespeople"
              options={SALESPEOPLE}
            />
          </div>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              marginTop: 10, fontSize: 11, color: 'var(--text-muted)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', padding: 0,
              transition: 'color var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={11} /> Clear filters
          </button>
        )}
      </Card>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 100px',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          fontSize: 11, color: 'var(--text-muted)',
          fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Lead / Company</span>
          <span>Assigned To</span>
          <span>Status</span>
          <span>Source</span>
          <span>Deal Value</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 50 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            padding: '60px 20px', textAlign: 'center',
            color: 'var(--text-muted)', fontSize: 13,
          }}>
            {hasFilters ? (
              <>No leads match your filters. <button onClick={clearFilters} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Clear filters</button></>
            ) : (
              <>No leads yet. <button onClick={() => setShowCreate(true)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Add your first lead →</button></>
            )}
          </div>
        ) : (
          filtered.map((lead, i) => (
            <div
              key={lead.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 100px',
                padding: '14px 20px',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center',
                transition: 'background var(--transition)',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/leads/${lead.id}`)}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Name + company */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(167,139,250,0.15) 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'var(--accent)',
                  border: '1px solid rgba(56,189,248,0.12)',
                }}>
                  {lead.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 1 }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lead.company}</div>
                </div>
              </div>

              {/* Assigned */}
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {lead.assignedTo || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}
              </div>

              {/* Status */}
              <div><StatusBadge status={lead.status} /></div>

              {/* Source */}
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {lead.source || '—'}
              </div>

              {/* Deal value */}
              <div style={{ fontSize: 13, fontWeight: 600, color: lead.dealValue ? 'var(--green)' : 'var(--text-muted)' }}>
                {lead.dealValue ? fmt(lead.dealValue) : '—'}
              </div>

              {/* Actions */}
              <div
                style={{ display: 'flex', gap: 4 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  title="View"
                  style={actionBtnStyle}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => setEditLead(lead)}
                  title="Edit"
                  style={actionBtnStyle}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(lead.id)}
                  title="Delete"
                  style={{ ...actionBtnStyle, color: deletingId === lead.id ? 'var(--red)' : undefined }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Lead" width={580}>
        <LeadForm onDone={() => setShowCreate(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead" width={580}>
        {editLead && <LeadForm lead={editLead} onDone={() => setEditLead(null)} />}
      </Modal>
    </div>
  )
}

const actionBtnStyle = {
  width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-muted)', borderRadius: 6,
  transition: 'all var(--transition)',
}
