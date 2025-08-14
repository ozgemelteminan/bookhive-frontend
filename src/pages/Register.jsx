import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function Register() {
  const nav = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await api('/api/Students/register', { 
        method: 'POST', 
        body: { fullName, email, password } 
      })
      nav('/login')
    } catch (err) { 
      setError(err.message) 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2">Create account</h1>
        <p className="text-sm text-gray-600 mb-6">Join the library</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input 
              className="input" 
              value={fullName} 
              onChange={e=>setFullName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input 
              className="input" 
              type="email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input 
              className="input" 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="link">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  )
}
