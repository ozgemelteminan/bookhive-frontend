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
      const res = await api('/api/library/borrow', { 
        method: 'POST', 
        body: { studentId, bookId }, 
        token 
      })
      setResult(JSON.stringify(res, null, 2))
    } catch (e) { 
      setError(e.message) 
    } finally { 
      setLoading(false) 
    }
  }

  const doReturn = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      const res = await api('/api/library/return', { 
        method: 'POST', 
        body: { studentId, bookId }, 
        token 
      })
      setResult(JSON.stringify(res, null, 2))
    } catch (e) { 
      setError(e.message) 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* Borrow / Return */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📖 Borrow / Return</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input 
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={studentId} 
              onChange={e=>setStudentId(e.target.value)} 
              placeholder="e.g. 123" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Book ID</label>
            <input 
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={bookId} 
              onChange={e=>setBookId(e.target.value)} 
              placeholder="e.g. 42" 
            />
          </div>
          <div className="flex items-end gap-2">
            <button 
              onClick={doBorrow} 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50" 
              disabled={loading}
            >
              Borrow
            </button>
            <button 
              onClick={doReturn} 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50" 
              disabled={loading}
            >
              Return
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {/* Result */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Result</h2>
        <pre className="text-sm bg-gray-50 rounded-xl p-3 overflow-auto">
          {result || "No data yet."}
        </pre>
      </div>
    </div>
  )
}
