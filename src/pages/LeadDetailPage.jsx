
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLead, updateLead, subscribeNotes, addNote } from '../lib/firestore'
import { useAuth } from '../hooks/useAuth'
import { LEAD_STATUSES, SALESPEOPLE, getStatusConfig } from '../lib/constants'
import { Button, Select, Textarea, StatusBadge, Card, Modal } from '../components/ui'
import LeadForm from '../components/leads/LeadForm'
import {
  ArrowLeft, Edit2, Mail, Phone, Building2, User,
  Calendar, Clock, DollarSign, MapPin, Send, MessageSquare,
  TrendingUp, Globe,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

export default function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [lead, setLead] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

  useEffect(() => {
    getLead(id).then(data => { setLead(data); setLoading(false) })
    const unsub = subscribeNotes(id, setNotes)
    return unsub
  }, [id])

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    setStatusUpdating(true)
    await updateLead(id, { status: newStatus })
    setLead(l => ({ ...l, status: newStatus }))
    setStatusUpdating(false)
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!noteText.trim()) return
    setAddingNote(true)
    await addNote(id, noteText.trim(), user?.email || 'Unknown')
    setNoteText('')
    setAddingNote(false)
  }

  const ts = (sec) => {
    if (!sec) return 'just now'
    return formatDistanceToNow(new Date(sec * 1000), { addSuffix: true })
  }

  const fmtDate = (sec) => {
    if (!sec) return '—'
    return format(new Date(sec * 1000), 'MMM d, yyyy')
  }

  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`

  if (loading) {
    return (
      <div style={{ padding: '32px 36px' }}>
        <div className="skeleton" style={{ height: 28, width: 200, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          <div className="skeleton" style={{ height: 300 }} />
          <div className="skeleton" style={{ height: 300 }} />
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div style={{ padding: '32px 36px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Lead not found.</p>
        <Button variant="secondary" onClick={() => navigate('/leads')} style={{ marginTop: 16 }}>
          Back to Leads
        </Button>
      </div>
    )
  }

  const cfg = getStatusConfig(lead.status)

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button
          onClick={() => navigate('/leads')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-body)',
            padding: '6px 10px', borderRadius: 8,
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              background: `linear-gradient(135deg, ${cfg.color}22 0%, ${cfg.color}10 100%)`,
              border: `1px solid ${cfg.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, fontWeight: 700, color: cfg.color,
            }}>
              {lead.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {lead.name}
              </h1>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
                {lead.company} {lead.source && `· ${lead.source}`}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Select
            value={lead.status}
            onChange={handleStatusChange}
            options={LEAD_STATUSES.map(s => ({ value: s.value, label: s.label }))}
            style={{
              height: 36, fontSize: 12, fontWeight: 600,
              color: cfg.color, background: cfg.bg,
              border: `1px solid ${cfg.color}40`,
            }}
          />
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Edit2 size={13} /> Edit
          </Button>
        </div>
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Left: info + notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Contact info */}
          <Card>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 16, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Contact Info
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: Mail, label: 'Email', val: lead.email },
                { icon: Phone, label: 'Phone', val: lead.phone },
                { icon: Building2, label: 'Company', val: lead.company },
                { icon: Globe, label: 'Source', val: lead.source },
                { icon: User, label: 'Assigned To', val: lead.assignedTo },
                { icon: DollarSign, label: 'Deal Value', val: lead.dealValue ? fmt(lead.dealValue) : null },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={13} color="var(--text-muted)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 13, color: val ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: val ? 500 : 400 }}>
                      {val || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Notes ({notes.length})
              </h3>
              <MessageSquare size={14} color="var(--text-muted)" />
            </div>

            {/* Add note form */}
            <form onSubmit={handleAddNote} style={{ marginBottom: 20 }}>
              <Textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note… (call summary, email update, meeting notes)"
                style={{ marginBottom: 10 }}
              />
              <Button type="submit" variant="primary" size="sm" loading={addingNote} disabled={!noteText.trim()}>
                <Send size={12} /> Add Note
              </Button>
            </form>

            {/* Notes list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notes.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
                  No notes yet. Add one above.
                </p>
              ) : notes.map(note => (
                <div
                  key={note.id}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 10,
                    borderLeft: '2px solid var(--accent)',
                    animation: 'slideIn 0.2s ease',
                  }}
                >
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 8 }}>
                    {note.content}
                  </p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={10} /> {note.createdBy}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} /> {ts(note.createdAt?.seconds)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status card */}
          <Card style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
            <div style={{ fontSize: 10, color: cfg.color, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Current Status
            </div>
            <StatusBadge status={lead.status} size="lg" />
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
              Last updated {ts(lead.updatedAt?.seconds)}
            </div>
          </Card>

          {/* Deal value */}
          {lead.dealValue > 0 && (
            <Card style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                Deal Value
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)', letterSpacing: '-0.04em' }}>
                {fmt(lead.dealValue)}
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 14 }}>
              Timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={12} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>Created</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(lead.createdAt?.seconds)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={12} color="var(--purple)" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>Last updated</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(lead.updatedAt?.seconds)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(251,191,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageSquare size={12} color="var(--amber)" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>Notes added</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{notes.length} note{notes.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick status change */}
          <Card>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
              Move to Stage
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {LEAD_STATUSES.map(s => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange({ target: { value: s.value } })}
                  disabled={lead.status === s.value || statusUpdating}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', borderRadius: 8,
                    background: lead.status === s.value ? s.bg : 'transparent',
                    border: `1px solid ${lead.status === s.value ? s.color + '40' : 'transparent'}`,
                    cursor: lead.status === s.value ? 'default' : 'pointer',
                    color: lead.status === s.value ? s.color : 'var(--text-secondary)',
                    fontSize: 12, fontWeight: lead.status === s.value ? 600 : 400,
                    fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition)',
                    opacity: statusUpdating && lead.status !== s.value ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (lead.status !== s.value) e.currentTarget.style.background = s.bg }}
                  onMouseLeave={e => { if (lead.status !== s.value) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  {s.value}
                  {lead.status === s.value && <span style={{ marginLeft: 'auto', fontSize: 10 }}>Current</span>}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Lead" width={580}>
        <LeadForm
          lead={lead}
          onDone={async () => {
            const updated = await getLead(id)
            setLead(updated)
            setEditOpen(false)
          }}
        />
      </Modal>
    </div>
  )
}
