import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../auth.jsx"

// This component draws a honeycomb (bee hive style) background pattern
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
          id="honeycomb-login"
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
      <rect width="100%" height="100%" fill="url(#honeycomb-login)" opacity={globalOpacity} />
    </svg>
  )
}

// State variables to store form data
export default function Login() {
  const [email, setEmail] = useState("")       // user email input
  const [password, setPassword] = useState("") // user password input
  const [err, setErr] = useState("")           // error message if login fails
  const { login } = useAuth()                  // get login function from auth context
  const navigate = useNavigate()               // to redirect user after login


  // When the user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault() // prevent page refresh
    setErr("")         // reset error message
    try {
      await login(email, password)    // try to login with provided credentials
      navigate("/dashboard")          // if successful, go to dashboard
    } catch (e) {
      setErr(e.message || "Login failed")  // if error, show error message
    }
  }

  // What the component renders (UI)
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500">
      {/* 🐝 Honeycomb overlay */}
      <HoneycombOverlay />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to continue to your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-amber-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
