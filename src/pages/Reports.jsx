
import React, { useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'

export default function Reports() {
  const { token } = useAuth()
  const [libraryReport, setLibraryReport] = useState(null)
  const [studentId, setStudentId] = useState('')
  const [studentReport, setStudentReport] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadLibraryReport = async () => {
    setLoading(true); setError('')
    try {
      const res = await api('/api/reports/library', { method: 'GET', token })
      setLibraryReport(res)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  const loadStudentReport = async () => {
    setLoading(true); setError('')
    try {
      const res = await api(`/api/reports/student/${studentId}`, { method: 'GET', token })
      setStudentReport(res)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Library Report</h2>
        <button onClick={loadLibraryReport} className="btn-primary" disabled={loading}>Fetch Library Report</button>
        <pre className="text-sm bg-gray-50 rounded-xl p-3 mt-3 overflow-auto">{JSON.stringify(libraryReport, null, 2) || "—"}</pre>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Student Report</h2>
        <div className="flex gap-2">
          <input className="input" placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} />
          <button onClick={loadStudentReport} className="btn-ghost" disabled={loading || !studentId}>Fetch</button>
        </div>
        <pre className="text-sm bg-gray-50 rounded-xl p-3 mt-3 overflow-auto">{JSON.stringify(studentReport, null, 2) || "—"}</pre>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
