import { useState } from 'react'
import { API_URL } from '../config.jsx'

async function parseJsonSafe(response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { error: text }
  }
}

function findAuthToken(value) {
  if (typeof value === 'string' && value.length > 0) {
    if (value.includes('<') || value.includes('</') || value.trim().startsWith('<!')) {
      return null
    }
    return value
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const token = findAuthToken(item)
      if (token) return token
    }
    return null
  }

  if (value && typeof value === 'object') {
    const tokenKeys = [
      'token',
      'access_token',
      'accessToken',
      'authToken',
      'authorization',
      'bearer',
      'jwt',
    ]

    for (const key of tokenKeys) {
      const candidate = value[key]
      if (typeof candidate === 'string' && candidate.length > 0) {
        if (candidate.includes('<') || candidate.includes('</') || candidate.trim().startsWith('<!')) {
          continue
        }
        return candidate
      }
    }

    for (const key of Object.keys(value)) {
      if (key === 'error' || key === 'message' || key === 'status') continue
      const token = findAuthToken(value[key])
      if (token) return token
    }
  }

  return null
}

function extractBearerToken(payload, headers) {
  const token = findAuthToken(payload)
  const tokenType = payload?.token_type || payload?.type || null

  if (token) {
    if (token.includes('<') || token.includes('</') || token.trim().startsWith('<!')) {
      return null
    }
    if (token.startsWith('Bearer ')) return token
    if (typeof tokenType === 'string' && tokenType.length > 0) {
      return `${tokenType} ${token}`
    }
    return `Bearer ${token}`
  }

  const headerAuth = headers.get('authorization') || headers.get('Authorization')
  if (headerAuth) {
    return headerAuth.startsWith('Bearer ') ? headerAuth : `Bearer ${headerAuth}`
  }

  return null
}

export default function LoginPage({ onSwitch, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await parseJsonSafe(response)

      if (!response.ok) {
        throw new Error(data.error || data.message || `Login failed (${response.status})`)
      }

      const token = extractBearerToken(data, response.headers)
      if (!token) {
        throw new Error('Bearer token not found in login response')
      }

      onLoginSuccess(token)
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1>Welcome back</h1>
      <p>Sign in to access your lead dashboard.</p>
      <form onSubmit={handleSubmit}>
        {error ? <div className="error-text">{error}</div> : null}
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="helper-row">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            Remember me
          </label>
          <button type="button" className="link-button" onClick={() => onSwitch('signup')}>
            Create account
          </button>
        </div>

        <div className="auth-actions">
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </div>
      </form>
    </div>
  )
}
