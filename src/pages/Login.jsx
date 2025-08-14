
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      // Adjust path if your backend differs:
      const res = await api('/api/Students/login', { method: 'POST', body: { Email: email, Password: password } })
      login(res?.token, res?.user || { email })
    } catch (err) { setError(err.message) } 
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-6">Sign in to continue</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/register" className="link">Don’t have an account? Create one</Link>
        </div>
      </div>
    </div>
  )
}
