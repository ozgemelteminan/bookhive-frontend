import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api.js' // API çağrısı için

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user")
    return u ? JSON.parse(u) : null
  })

  // Token değişince localStorage güncelle
  useEffect(() => {
    if (token) localStorage.setItem("token", token)
    else localStorage.removeItem("token")
  }, [token])

  // User değişince localStorage güncelle
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user))
    else localStorage.removeItem("user")
  }, [user])

  // Login olduğunda token + temel user bilgisini kaydet
  const login = (t, u) => {
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  // Kullanıcı login olduysa backend'den fullName getir
  useEffect(() => {
    const fetchFullName = async () => {
      if (user?.id && token && !user.fullName) {
        try {
          const data = await api(`/api/Students/${user.id}`, { method: 'GET', token })
          setUser(prev => ({ ...prev, fullName: data.fullName }))
        } catch (e) {
          console.error("FullName fetch error:", e)
        }
      }
    }
    fetchFullName()
  }, [user?.id, token])

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
