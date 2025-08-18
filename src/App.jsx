// App.jsx
import PrivateRoute from './PrivateRoute.jsx'
import React from 'react'
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BorrowReturn from './pages/BorrowReturn.jsx'
import Reports from './pages/Reports.jsx'
import DonateBook from './pages/DonateBook.jsx'

// 🐝 Petek overlay
function HoneycombOverlay({
  stroke = '#fff9c4',      // daha açık sarı (limon kremi tonunda)
  strokeOpacity = 0.35,
  globalOpacity = 0.22,
  scale = 1,
}) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="honeycomb"
          width={72 * scale}
          height={62 * scale}
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1}>
            <polygon points="24,2 48,15 48,39 24,52 0,39 0,15" />
            <polygon points="60,2 84,15 84,39 60,52 36,39 36,15" />
            <g transform="translate(36,31)">
              <polygon points="24,2 48,15 48,39 24,52 0,39 0,15" />
              <polygon points="-12,2 12,15 12,39 -12,52 -36,39 -36,15" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#honeycomb)" opacity={globalOpacity} />
    </svg>
  )
}

function Shell() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-3xl font-bold 
                       bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-600 
                       bg-clip-text text-transparent"
          >
            🐝 BookHive
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link to="/dashboard" className="hover:underline">Home</Link>
            <Link to="/borrow-return" className="hover:underline">Borrow & Return</Link>
            <Link to="/reports" className="hover:underline">Reports</Link>
            <Link to="/donate" className="hover:underline">Donate</Link>
            <div className="h-5 w-px bg-gray-300" />
            <span className="text-gray-600">{user?.username || user?.email}</span>
            <button
              className="text-gray-600 hover:text-amber-600 transition-colors"
              onClick={logout}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Arka plan: daha koyu bal tonları + açık petek overlay */}
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500">
        <HoneycombOverlay />
        <div className="relative max-w-5xl mx-auto px-4 py-8 flex justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Shell />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="borrow-return" element={<BorrowReturn />} />
        <Route path="reports" element={<Reports />} />
        <Route path="donate" element={<DonateBook />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
