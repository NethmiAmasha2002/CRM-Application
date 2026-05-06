// src/lib/constants.js

export const LEAD_STATUSES = [
  { value: 'New', label: 'New', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  { value: 'Contacted', label: 'Contacted', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { value: 'Qualified', label: 'Qualified', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  { value: 'Proposal Sent', label: 'Proposal Sent', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { value: 'Won', label: 'Won', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
  { value: 'Lost', label: 'Lost', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
]

export const LEAD_SOURCES = [
  'Website',
  'LinkedIn',
  'Referral',
  'Cold Email',
  'Event',
  'Social Media',
  'Phone Call',
  'Other',
]

export const SALESPEOPLE = [
  'Alex Rivera',
  'Jordan Lee',
  'Sam Chen',
  'Morgan Davis',
  'Casey Kim',
]

export const STATUS_ORDER = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']

export const getStatusConfig = (status) =>
  LEAD_STATUSES.find((s) => s.value === status) || LEAD_STATUSES[0]
