import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./auth"

// A wrapper component to protect private routes
export default function PrivateRoute({ children }) {
  const { token } = useAuth()                  // Get authentication token from context
  console.log("PrivateRoute token:", token)    // debug: log token for checking
  
  // If token exists → render protected content
  // If not → redirect to login page
  return token ? children : <Navigate to="/login" replace />
}
