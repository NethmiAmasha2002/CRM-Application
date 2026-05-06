export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '20px',
    }}>
      <div style={{
        width: 44, height: 44,
        border: '2px solid var(--border)',
        borderTop: '2px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.1em' }}>
        SALESFLOW
      </p>
    </div>
  )
}