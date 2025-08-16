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

function Shell() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"
          >
            📚 BookHive  
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link to="/dashboard" className="hover:underline">Home</Link>
            <Link to="/borrow-return" className="hover:underline">Borrow & Return</Link>
            <Link to="/reports" className="hover:underline">Reports</Link>
            <div className="h-5 w-px bg-gray-300" />
            <span className="text-gray-600">{user?.username || user?.email}</span>
            <button className="btn-ghost" onClick={logout}>Logout</button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Shell /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="borrow-return" element={<BorrowReturn />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
