import React from "react"
import { Link } from "react-router-dom"

export default function Dashboard() {
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Borrow & Return */}
        <div className="border rounded-xl p-6 hover:shadow-md transition bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            📖 Borrow & Return
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Manage book borrows and returns for students.
          </p>
          <Link
            to="/borrow-return"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Open
          </Link>
        </div>

        {/* Reports */}
        <div className="border rounded-xl p-6 hover:shadow-md transition bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">📊 Reports</h2>
          <p className="text-sm text-gray-600 mb-4">
            View library and student activity reports.
          </p>
          <Link
            to="/reports"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Open
          </Link>
        </div>
      </div>

      {/* Reading Tips */}
      <div className="border rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">💡 Reading Tips</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
          <li>Read at least 20 minutes every day.</li>
          <li>Take notes to remember key ideas.</li>
          <li>Explore different genres to broaden your view.</li>
        </ul>
      </div>
    </div>
  )
}
