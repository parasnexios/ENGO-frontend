import React, { useState } from 'react'
import { authService } from '../api'

interface LoginPageProps {
  onLoginSuccess: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    try {
      await authService.login(email, password)
      onLoginSuccess()
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.brand}>
          <div style={styles.logoCircle}>
            <span style={styles.logoText}>E</span>
          </div>
          <h1 style={styles.title}>ENGO</h1>
          <p style={styles.subtitle}>NGO Management Platform</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={styles.errorBanner}>
            <span style={{ marginRight: 8 }}>⚠️</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="admin@engo.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? (
              <span>
                <span style={styles.spinner} /> Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p style={styles.footer}>© {new Date().getFullYear()} ENGO. All rights reserved.</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
    padding: '24px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
  },
  brand: {
    textAlign: 'center',
    marginBottom: '36px'
  },
  logoCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  },
  logoText: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 700
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 700,
    margin: '0 0 6px',
    letterSpacing: '2px'
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    margin: 0
  },
  errorBanner: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '10px',
    color: '#fca5a5',
    fontSize: '14px',
    padding: '12px 16px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.3px'
  },
  input: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    padding: '12px 16px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    padding: '14px',
    marginTop: '8px',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 4px 15px rgba(99,102,241,0.4)'
  },
  spinner: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '8px',
    verticalAlign: 'middle'
  },
  footer: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '32px',
    marginBottom: 0
  }
}
