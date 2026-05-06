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

export default function SignupPage({ onSwitch }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      })

      const data = await parseJsonSafe(response)

      if (!response.ok) {
        throw new Error(data.error || data.message || `Signup failed (${response.status})`)
      }

      alert('Account created successfully. Please log in.')
      onSwitch('login')
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1>Create account</h1>
      <p>Start tracking your leads with a new account.</p>
      <form onSubmit={handleSubmit}>
        {error ? <div className="error-text">{error}</div> : null}
        <div className="form-group">
          <label htmlFor="signup-name">Name</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-confirm-password">Confirm password</label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your password"
            required
          />
        </div>

        <div className="helper-row">
          <button type="button" className="link-button" onClick={() => onSwitch('login')}>
            Already have an account?
          </button>
        </div>

        <div className="auth-actions">
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </div>
      </form>
    </div>
  )
}
