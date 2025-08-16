import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./auth"

export default function PrivateRoute({ children }) {
  const { token } = useAuth()
  console.log("PrivateRoute token:", token)
  return token ? children : <Navigate to="/login" replace />
}
