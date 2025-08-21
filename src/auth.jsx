// src/auth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api.js";

// Create an AuthContext to manage authentication state
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Store JWT token (initialized from localStorage if available)
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Store user info (initialized from localStorage if available)
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  // Keep token synced with localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Keep token synced with localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Login function
  const login = async (email, password) => {
    // Login function
    const res = await api("/api/students/login", {
      method: "POST",
      body: { email, password },  // Send email + password
    });

    // Backend response example:
    // { id, fullName, email, token }
    setToken(res.token); // Save real JWT token
    setUser({
      id: res.id,
      email: res.email,
      fullName: res.fullName,
    });
  };

  // Logout: clear token and user info
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Provide token, user, and auth functions to the app
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
  
}
