// src/components/leads/LeadForm.jsx
import { useState } from 'react'
import { Button, Input, Select, Textarea } from '../ui'
import { LEAD_STATUSES, LEAD_SOURCES, SALESPEOPLE } from '../../lib/constants'
import { createLead, updateLead } from '../../lib/firestore'
import { useAuth } from '../../hooks/useAuth'

const EMPTY = {
  name: '', company: '', email: '', phone: '',
  source: '', assignedTo: '', status: 'New', dealValue: '', notes: '',
}

export default function LeadForm({ lead, onDone }) {
  const { user } = useAuth()
  const [form, setForm] = useState(lead ? {
    name: lead.name || '',
    company: lead.company || '',
    email: lead.email || '',
    phone: lead.phone || '',
    source: lead.source || '',
    assignedTo: lead.assignedTo || '',
    status: lead.status || 'New',
    dealValue: lead.dealValue || '',
  } : { ...EMPTY })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.company.trim()) errs.company = 'Company is required'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (form.dealValue && isNaN(Number(form.dealValue))) errs.dealValue = 'Must be a number'
    return errs
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        dealValue: form.dealValue ? Number(form.dealValue) : 0,
        createdBy: user?.email || 'Unknown',
      }
      if (lead) {
        await updateLead(lead.id, payload)
      } else {
        await createLead(payload)
      }
      onDone?.()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Input label="Lead Name *" value={form.name} onChange={set('name')} placeholder="Jane Smith" error={errors.name} />
        <Input label="Company *" value={form.company} onChange={set('company')} placeholder="Acme Corp" error={errors.company} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jane@acme.com" error={errors.email} />
        <Input label="Phone" value={form.phone} onChange={set('phone')} placeholder="+1 555 0100" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Select
          label="Lead Source"
          value={form.source}
          onChange={set('source')}
          placeholder="Select source…"
          options={LEAD_SOURCES}
        />
        <Select
          label="Assigned Salesperson"
          value={form.assignedTo}
          onChange={set('assignedTo')}
          placeholder="Select person…"
          options={SALESPEOPLE}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Select
          label="Status"
          value={form.status}
          onChange={set('status')}
          options={LEAD_STATUSES.map(s => ({ value: s.value, label: s.label }))}
        />
        <Input
          label="Deal Value ($)"
          type="number"
          value={form.dealValue}
          onChange={set('dealValue')}
          placeholder="10000"
          error={errors.dealValue}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <Button type="button" variant="secondary" onClick={() => onDone?.()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {lead ? 'Save changes' : 'Create lead'}
        </Button>
      </div>
    </form>
  )
}
