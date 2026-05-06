// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button, Input } from '../components/ui'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password. Try admin@example.com / password123')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => setForm({ email: 'admin@example.com', password: 'password123' })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
        top: '20%', right: '20%',
        pointerEvents: 'none',
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        animation: 'fadeIn 0.5s ease',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(56,189,248,0.3)',
          }}>
            <Zap size={24} color="#050e1c" fill="#050e1c" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800, fontSize: 28,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #f1f5f9 30%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}>
            SalesFlow CRM
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Sign in to manage your pipeline
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
              placeholder="admin@example.com"
              icon={<Mail size={14} />}
              required
            />

            <div>
              <Input
                label="Password"
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={handle}
                placeholder="••••••••"
                icon={<Lock size={14} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute',
                  right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'none', // handled inside Input instead
                }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: 'var(--red)', fontSize: 12, lineHeight: 1.5,
                animation: 'fadeIn 0.2s ease',
              }}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ width: '100%', marginTop: 4, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div style={{
            marginTop: 20,
            padding: '12px 14px',
            background: 'var(--accent-dim)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(56,189,248,0.15)',
          }}>
            <p style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Demo credentials
            </p>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace', lineHeight: 1.8 }}>
              <div>admin@example.com</div>
              <div>password123</div>
            </div>
            <button
              onClick={fillDemo}
              style={{
                marginTop: 10, fontSize: 11, color: 'var(--accent)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 500,
                textDecoration: 'underline', padding: 0,
              }}
            >
              Fill automatically →
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, marginTop: 24 }}>
          SalesFlow CRM • Built for modern sales teams
        </p>
      </div>
    </div>
  )
}
