import React, { useState, useEffect } from 'react'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'

export default function BorrowReturn() {
  const { token, user } = useAuth()
  const [studentId, setStudentId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [bookId, setBookId] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState([])

  // Login olan öğrencinin bilgilerini doldur
  useEffect(() => {
    if (user) {
      if (user.id) setStudentId(user.id.toString())
      if (user.fullName) setStudentName(user.fullName)
    }
  }, [user])

  // Kitapları getir
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api('/api/Books', { method: 'GET', token })
        setBooks(res)
      } catch (e) {
        console.error(e)
      }
    }
    fetchBooks()
  }, [token])

  // Ödünç alma
  const doBorrow = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      const res = await api('/api/StudentBooks', { 
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

  // İade
  const doReturn = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      await api(`/api/StudentBooks/${bookId}`, { 
        method: 'DELETE',
        token 
      })
      setResult("Book returned successfully.")
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
          {/* Öğrenci Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name</label>
            <input 
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700" 
              value={studentName || "Fetching name..."} 
              placeholder="Student Name"
              readOnly 
            />
          </div>
          {/* Kitap ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Book ID</label>
            <input 
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={bookId} 
              onChange={e=>setBookId(e.target.value)} 
              placeholder="e.g. 42" 
            />
          </div>
          {/* Butonlar */}
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

      {/* Books */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Books</h2>
        {books.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left font-semibold">ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Title</th>
                  <th className="px-4 py-2 text-left font-semibold">Author</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, i) => (
                  <tr
                    key={book.id}
                    onClick={() => setBookId(book.id)}
                    className={`cursor-pointer hover:bg-blue-50 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2 border-b">{book.id}</td>
                    <td className="px-4 py-2 border-b font-medium text-gray-800">{book.title}</td>
                    <td className="px-4 py-2 border-b text-gray-600">{book.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No books available.</p>
        )}
      </div>
    </div>
  )
}
