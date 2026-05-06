
import { useMemo } from 'react'
import { useLeads } from '../hooks/useLeads'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Card, StatusBadge } from '../components/ui'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { LEAD_STATUSES } from '../lib/constants'
import {
  Users, TrendingUp, Trophy, XCircle, DollarSign, Target,
  ArrowUpRight, Clock, BarChart2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const fmt = (n) =>
  n >= 1000000
    ? `$${(n / 1000000).toFixed(1)}M`
    : n >= 1000
    ? `$${(n / 1000).toFixed(0)}K`
    : `$${n}`

function StatCard({ icon: Icon, label, value, sub, accent, loading }) {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${accent}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={accent} />
        </div>
        <ArrowUpRight size={14} color="var(--text-muted)" />
      </div>
      <div>
        {loading ? (
          <div className="skeleton" style={{ height: 28, width: '60%', marginBottom: 6 }} />
        ) : (
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {value}
          </div>
        )}
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: accent, marginTop: 3, fontWeight: 500 }}>{sub}</div>}
      </div>
    </Card>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name === 'value' ? fmt(p.value) : p.value} {p.name !== 'value' ? 'leads' : ''}
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { leads, loading } = useLeads()
  const navigate = useNavigate()
  const { user } = useAuth()

  const stats = useMemo(() => {
    const total = leads.length
    const byStatus = Object.fromEntries(LEAD_STATUSES.map(s => [s.value, 0]))
    let totalValue = 0, wonValue = 0
    leads.forEach(l => {
      byStatus[l.status] = (byStatus[l.status] || 0) + 1
      totalValue += Number(l.dealValue) || 0
      if (l.status === 'Won') wonValue += Number(l.dealValue) || 0
    })
    return { total, byStatus, totalValue, wonValue }
  }, [leads])

  const chartData = LEAD_STATUSES.map(s => ({
    name: s.value.split(' ')[0],
    count: stats.byStatus[s.value] || 0,
    color: s.color,
  }))

  const pieData = LEAD_STATUSES
    .map(s => ({ name: s.value, value: stats.byStatus[s.value] || 0, color: s.color }))
    .filter(d => d.value > 0)

  const recentLeads = leads.slice(0, 5)

  const displayName = user?.email?.split('@')[0] || 'there'

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 26, letterSpacing: '-0.04em', marginBottom: 4,
          textTransform: 'capitalize',
        }}>
          Good morning, {displayName} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Here's what's happening with your pipeline today.
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16, marginBottom: 28,
      }}>
        <StatCard icon={Users} label="Total Leads" value={stats.total} accent="var(--accent)" loading={loading} />
        <StatCard icon={Target} label="New Leads" value={stats.byStatus['New'] || 0} accent="#38bdf8" loading={loading} />
        <StatCard icon={BarChart2} label="Qualified" value={stats.byStatus['Qualified'] || 0} accent="var(--green)" loading={loading} />
        <StatCard icon={Trophy} label="Won Deals" value={stats.byStatus['Won'] || 0} accent="#fbbf24" loading={loading}
          sub={stats.wonValue ? `${fmt(stats.wonValue)} in value` : null}
        />
        <StatCard icon={XCircle} label="Lost Deals" value={stats.byStatus['Lost'] || 0} accent="var(--red)" loading={loading} />
        <StatCard icon={DollarSign} label="Pipeline Value" value={loading ? '—' : fmt(stats.totalValue)} accent="var(--purple)" loading={loading}
          sub={stats.wonValue ? `${fmt(stats.wonValue)} won` : null}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 28 }}>
        {/* Bar chart */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Leads by Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart */}
        <Card>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
            Pipeline Split
          </h3>
          {leads.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(v) => <span style={{ color: 'var(--text-secondary)' }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent leads */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Recent Leads</h3>
          <button
            onClick={() => navigate('/leads')}
            style={{
              fontSize: 12, color: 'var(--accent)', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
            }}
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 44 }} />
            ))}
          </div>
        ) : recentLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            No leads yet. <button onClick={() => navigate('/leads')} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Add your first lead →</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => navigate(`/leads/${lead.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  cursor: 'pointer', transition: 'background var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent-dim) 0%, rgba(167,139,250,0.15) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'var(--accent)',
                  border: '1px solid rgba(56,189,248,0.15)',
                }}>
                  {lead.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {lead.company} • {lead.assignedTo}
                  </div>
                </div>
                <StatusBadge status={lead.status} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 80, textAlign: 'right' }}>
                  {lead.createdAt?.seconds
                    ? formatDistanceToNow(new Date(lead.createdAt.seconds * 1000), { addSuffix: true })
                    : 'just now'}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
