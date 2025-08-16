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
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">📊 Reports</h1>

        {/* Library Report */}
        <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Library Report</h2>
          <button 
            onClick={loadLibraryReport} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            Search Library Report
          </button>
          <pre className="text-sm bg-gray-50 rounded-xl p-3 mt-3 overflow-auto">
            {JSON.stringify(libraryReport, null, 2) || "—"}
          </pre>
        </div>

        {/* Student Report */}
        <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Student Report</h2>
          <div className="flex gap-2">
            <input 
              className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Student ID" 
              value={studentId} 
              onChange={e=>setStudentId(e.target.value)} 
            />
            <button 
              onClick={loadStudentReport} 
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
              disabled={loading || !studentId}
            >
              Search
            </button>
          </div>
          <pre className="text-sm bg-gray-50 rounded-xl p-3 mt-3 overflow-auto">
            {JSON.stringify(studentReport, null, 2) || "—"}
          </pre>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
