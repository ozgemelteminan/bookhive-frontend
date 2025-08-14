
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user")
    return u ? JSON.parse(u) : null
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (token) localStorage.setItem("token", token)
    else localStorage.removeItem("token")
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user))
    else localStorage.removeItem("user")
  }, [user])

  const login = (t, u) => { setToken(t); setUser(u); navigate('/dashboard') }
  const logout = () => { setToken(null); setUser(null); navigate('/login') }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
