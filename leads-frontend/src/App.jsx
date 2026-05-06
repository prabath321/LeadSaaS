import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'

const getStoredToken = () => {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem('authToken')
}

function App() {
  const [authToken, setAuthToken] = useState(getStoredToken)
  const [activePage, setActivePage] = useState(
    authToken ? 'dashboard' : 'login',
  )
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLoginSuccess = (token) => {
    setAuthToken(token)
    setActivePage('dashboard')
    window.sessionStorage.setItem('authToken', token)
  }

  const handleLogout = () => {
    setAuthToken(null)
    setActivePage('login')
    window.sessionStorage.removeItem('authToken')
    setMenuOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Leads SaaS</div>
        {activePage !== 'dashboard' ? (
          <div className="app-tabs">
            <button
              type="button"
              className={activePage === 'login' ? 'app-tab active' : 'app-tab'}
              onClick={() => setActivePage('login')}
            >
              Log in
            </button>
            <button
              type="button"
              className={activePage === 'signup' ? 'app-tab active' : 'app-tab'}
              onClick={() => setActivePage('signup')}
            >
              Sign up
            </button>
          </div>
        ) : (
          <div className="context-menu-wrapper">
            <button
              type="button"
              className="menu-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="context-menu">
                <button type="button" className="menu-item" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {activePage === 'dashboard' ? (
        <DashboardPage token={authToken} />
      ) : activePage === 'login' ? (
        <LoginPage onSwitch={setActivePage} onLoginSuccess={handleLoginSuccess} />
      ) : (
        <SignupPage onSwitch={setActivePage} />
      )}
    </div>
  )
}

export default App
