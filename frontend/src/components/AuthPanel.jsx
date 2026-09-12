import { useState } from 'react'
import { request } from '../lib/api'

export default function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const updateField = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true); setError(''); setMessage('')
    try {
      const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const data = await request(path, { method: 'POST', body: JSON.stringify(form) })
      if (mode === 'login') {
        localStorage.setItem('iedc_token', data.token)
        localStorage.setItem('iedc_user', JSON.stringify(data.user))
        onAuthenticated(data.token, data.user)
      } else {
        setMode('login')
        setMessage('Account created. Sign in to continue.')
      }
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  return <main className="auth-shell">
    <section className="auth-intro"><p className="eyebrow">IEDC / venture desk</p><div><h1>Make the next useful thing.</h1><p className="intro-copy">A focused home for student-built ideas, from the first sketch to seed funding.</p></div><div className="signal-row"><span>01</span><span>Project management</span><span className="signal-line" /></div></section>
    <section className="auth-panel"><p className="eyebrow">{mode === 'login' ? 'Member access' : 'New member'}</p><h2>{mode === 'login' ? 'Welcome back.' : 'Join the desk.'}</h2><p className="muted">{mode === 'login' ? 'Sign in to manage your projects.' : 'Create an account to register projects.'}</p>
      <form onSubmit={handleSubmit} className="stack-form">
        {mode === 'register' && <label>Name<input required value={form.name} onChange={(event) => updateField('name', event.target.value)} /></label>}
        <label>Email<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} /></label>
        <label>Password<input required type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} /></label>
        <button className="primary-button" disabled={loading}>{loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Register'} <span>+</span></button>
      </form>
      <button className="text-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Need an account? Register' : 'Already a member? Sign in'}</button>
      {error && <p className="notice error">{error}</p>}{message && <p className="notice success">{message}</p>}
    </section>
  </main>
}
