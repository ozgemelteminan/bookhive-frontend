import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../api.js"

// 🐝 Ortak Petek Overlay
function HoneycombOverlay({
  stroke = "#fff9c4",
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
          id="honeycomb-register"
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
      <rect width="100%" height="100%" fill="url(#honeycomb-register)" opacity={globalOpacity} />
    </svg>
  )
}

export default function Register() {
  const nav = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await api("/api/Students/register", {
        method: "POST",
        body: { fullName, email, password },
      })
      nav("/login")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500">
      {/* 🐝 Petek overlay */}
      <HoneycombOverlay />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account ✨
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join the library and start your journey
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
