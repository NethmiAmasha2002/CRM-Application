// src/components/ui/index.jsx
import { forwardRef } from 'react'
import { getStatusConfig } from '../../lib/constants'

// ── Button ───────────────────────────────────────────────
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', children, disabled, loading, style, ...props },
  ref
) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 7, fontFamily: 'var(--font-body)', fontWeight: 500,
    border: 'none', cursor: disabled || loading ? 'not-allowed' : 'pointer',
    borderRadius: 'var(--radius-md)', transition: 'all var(--transition)',
    whiteSpace: 'nowrap', position: 'relative', letterSpacing: '-0.01em',
    opacity: disabled || loading ? 0.55 : 1,
  }
  const sizes = {
    sm: { fontSize: 12, padding: '6px 12px', height: 30 },
    md: { fontSize: 13, padding: '8px 16px', height: 36 },
    lg: { fontSize: 14, padding: '10px 20px', height: 42 },
  }
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: '#050e1c',
    },
    secondary: {
      background: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: 'rgba(248,113,113,0.12)',
      color: 'var(--red)',
      border: '1px solid rgba(248,113,113,0.2)',
    },
  }
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      {...props}
    >
      {loading && (
        <span style={{
          width: 13, height: 13, border: '2px solid currentColor',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite', flexShrink: 0,
        }} />
      )}
      {children}
    </button>
  )
})

// ── Input ────────────────────────────────────────────────
export const Input = forwardRef(function Input(
  { label, error, icon, style, containerStyle, ...props },
  ref
) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...containerStyle }}>
      {label && (
        <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.02em' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
          }}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          style={{
            width: '100%', height: 38,
            background: 'var(--bg-input)',
            border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            padding: icon ? '0 12px 0 34px' : '0 12px',
            outline: 'none',
            transition: 'border-color var(--transition)',
            ...style,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
          onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: 11, color: 'var(--red)' }}>{error}</span>}
    </div>
  )
})

// ── Select ───────────────────────────────────────────────
export const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, style, containerStyle, ...props },
  ref
) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...containerStyle }}>
      {label && (
        <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.02em' }}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        style={{
          height: 38, background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          color: props.value ? 'var(--text-primary)' : 'var(--text-muted)',
          fontFamily: 'var(--font-body)', fontSize: 13,
          padding: '0 12px', outline: 'none', cursor: 'pointer',
          transition: 'border-color var(--transition)',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight: 32,
          ...style,
        }}
        onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: 11, color: 'var(--red)' }}>{error}</span>}
    </div>
  )
})

// ── Textarea ─────────────────────────────────────────────
export const Textarea = forwardRef(function Textarea(
  { label, error, style, containerStyle, ...props },
  ref
) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...containerStyle }}>
      {label && (
        <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)', fontSize: 13,
          padding: '10px 12px', outline: 'none', resize: 'vertical',
          minHeight: 90, lineHeight: 1.6,
          transition: 'border-color var(--transition)',
          ...style,
        }}
        onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
        {...props}
      />
      {error && <span style={{ fontSize: 11, color: 'var(--red)' }}>{error}</span>}
    </div>
  )
})

// ── StatusBadge ──────────────────────────────────────────
export function StatusBadge({ status, size = 'sm' }) {
  const cfg = getStatusConfig(status)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '3px 9px' : '5px 12px',
      borderRadius: 99,
      background: cfg.bg,
      color: cfg.color,
      fontSize: size === 'sm' ? 11 : 12,
      fontWeight: 600, letterSpacing: '0.02em',
      border: `1px solid ${cfg.color}30`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {status}
    </span>
  )
}

// ── Card ─────────────────────────────────────────────────
export function Card({ children, style, hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        transition: hover ? 'all var(--transition)' : undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? e => {
        e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      } : undefined}
      onMouseLeave={hover ? e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
      } : undefined}
    >
      {children}
    </div>
  )
}

// ── Modal ────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(5,10,20,0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: width,
          maxHeight: '90vh', overflowY: 'auto',
          animation: 'scaleIn 0.2s ease',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 20, lineHeight: 1,
              display: 'flex', padding: 4, borderRadius: 6,
              transition: 'color var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Tooltip ──────────────────────────────────────────────
export function Tooltip({ children, text }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={e => {
        const tip = e.currentTarget.querySelector('[data-tip]')
        if (tip) tip.style.opacity = 1
      }}
      onMouseLeave={e => {
        const tip = e.currentTarget.querySelector('[data-tip]')
        if (tip) tip.style.opacity = 0
      }}
    >
      {children}
      <span data-tip style={{
        position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
        transform: 'translateX(-50%)',
        background: '#1e293b', color: 'var(--text-primary)',
        fontSize: 11, padding: '4px 8px', borderRadius: 6,
        whiteSpace: 'nowrap', pointerEvents: 'none',
        opacity: 0, transition: 'opacity 0.15s',
        zIndex: 100, border: '1px solid var(--border)',
      }}>
        {text}
      </span>
    </span>
  )
}
