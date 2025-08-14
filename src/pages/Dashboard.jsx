
import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Borrow & Return</h2>
        <p className="text-sm text-gray-600 mb-4">Manage book borrows and returns for students.</p>
        <Link to="/borrow-return" className="btn-primary inline-block">Open</Link>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Reports</h2>
        <p className="text-sm text-gray-600 mb-4">View library and student activity reports.</p>
        <Link to="/reports" className="btn-primary inline-block">Open</Link>
      </div>
      <div className="card md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Quick Tips</h2>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li>Set your API URL in <code>.env</code> as <code>VITE_API_BASE_URL</code>.</li>
          <li>Update endpoint paths in the pages if your backend routes differ.</li>
          <li>Use a real token from your API for protected actions.</li>
        </ul>
      </div>
    </div>
  )
}
