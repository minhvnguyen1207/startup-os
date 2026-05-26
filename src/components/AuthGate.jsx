import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AuthGate({ children, session, loading }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (loading) {
    return (
      <div style={styles.screen}>
        <div style={styles.spinner} />
      </div>
    )
  }

  if (session) return children

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
    setBusy(false)
  }

  return (
    <div style={styles.screen}>
      <div style={styles.card}>

        {/* Logo mark */}
        <div style={styles.logo}>
          <div style={styles.logoMark}>Startup OS</div>
          <div style={styles.logoName}>Dak Lak Coffee</div>
        </div>

        <div style={styles.divider} />

        {sent ? (
          <div style={styles.sentState}>
            <div style={styles.sentIcon}>✦</div>
            <p style={styles.sentTitle}>Check your email</p>
            <p style={styles.sentSub}>
              We sent a magic link to <strong style={{ color: '#F0EDE6' }}>{email}</strong>.
              Click it to sign in — works on any device.
            </p>
            <button style={styles.resetBtn} onClick={() => { setSent(false); setEmail('') }}>
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <p style={styles.heading}>Sign in to sync your data</p>
            <p style={styles.sub}>
              Enter your email. We'll send a magic link — no password needed.
              Opens on any device you use.
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                style={styles.input}
              />
              {error && <p style={styles.errorMsg}>{error}</p>}
              <button type="submit" disabled={busy || !email.trim()} style={styles.btn}>
                {busy ? 'Sending…' : 'Send magic link →'}
              </button>
            </form>

            <p style={styles.hint}>
              Your tasks, notes, and journal sync across all devices automatically.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  screen: {
    height: '100vh',
    background: '#0D0C0A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  spinner: {
    width: 24,
    height: 24,
    border: '2px solid rgba(240,237,230,0.1)',
    borderTop: '2px solid rgba(240,237,230,0.5)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: '#141210',
    border: '1px solid rgba(255,245,220,0.08)',
    borderRadius: 12,
    padding: '2.5rem 2rem',
  },
  logo: {
    marginBottom: '1.5rem',
  },
  logoMark: {
    fontFamily: "'Arial Narrow', Arial, sans-serif",
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(196,169,107,0.6)',
    marginBottom: 4,
  },
  logoName: {
    fontFamily: 'Georgia, serif',
    fontSize: 20,
    fontWeight: 400,
    color: '#F0EDE6',
    letterSpacing: '-0.01em',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,245,220,0.06)',
    margin: '1.5rem 0',
  },
  heading: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 500,
    color: '#F0EDE6',
    marginBottom: '0.5rem',
  },
  sub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    lineHeight: 1.7,
    color: 'rgba(240,237,230,0.45)',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    background: 'rgba(255,245,220,0.04)',
    border: '1px solid rgba(255,245,220,0.1)',
    borderRadius: 6,
    padding: '11px 14px',
    fontSize: 14,
    color: '#F0EDE6',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.15s',
  },
  errorMsg: {
    fontSize: 12,
    color: '#E27A5A',
    margin: 0,
  },
  btn: {
    background: 'rgba(240,237,230,0.06)',
    border: '1px solid rgba(255,245,220,0.15)',
    borderRadius: 6,
    padding: '11px 16px',
    fontSize: 13,
    fontFamily: "'Arial Narrow', Arial, sans-serif",
    letterSpacing: '0.08em',
    color: '#F0EDE6',
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s',
    textTransform: 'uppercase',
  },
  hint: {
    fontSize: 11,
    color: 'rgba(240,237,230,0.2)',
    textAlign: 'center',
    marginTop: '1.5rem',
    letterSpacing: '0.04em',
  },
  sentState: {
    textAlign: 'center',
  },
  sentIcon: {
    fontSize: 24,
    color: 'rgba(196,169,107,0.7)',
    marginBottom: '1rem',
  },
  sentTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: 18,
    color: '#F0EDE6',
    marginBottom: '0.75rem',
  },
  sentSub: {
    fontSize: 13,
    lineHeight: 1.7,
    color: 'rgba(240,237,230,0.5)',
    marginBottom: '1.5rem',
  },
  resetBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(196,169,107,0.6)',
    fontSize: 12,
    cursor: 'pointer',
    letterSpacing: '0.06em',
    textDecoration: 'underline',
    textUnderlineOffset: 3,
  },
}
