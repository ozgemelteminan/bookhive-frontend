
import React, { useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'

export default function BorrowReturn() {
  const { token } = useAuth()
  const [studentId, setStudentId] = useState('')
  const [bookId, setBookId] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const doBorrow = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      const res = await api('/api/library/borrow', { method: 'POST', body: { studentId, bookId }, token })
      setResult(JSON.stringify(res, null, 2))
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  const doReturn = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      const res = await api('/api/library/return', { method: 'POST', body: { studentId, bookId }, token })
      setResult(JSON.stringify(res, null, 2))
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Borrow / Return</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label">Student ID</label>
            <input className="input" value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="e.g. 123" />
          </div>
          <div>
            <label className="label">Book ID</label>
            <input className="input" value={bookId} onChange={e=>setBookId(e.target.value)} placeholder="e.g. 42" />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={doBorrow} className="btn-primary" disabled={loading}>Borrow</button>
            <button onClick={doReturn} className="btn-ghost" disabled={loading}>Return</button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Result</h2>
        <pre className="text-sm bg-gray-50 rounded-xl p-3 overflow-auto">{result || "No data yet."}</pre>
      </div>
    </div>
  )
}
