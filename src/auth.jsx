// src/auth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // ✅ Doğru login
  const login = async (email, password) => {
    const res = await api("/api/students/login", {
      method: "POST",
      body: { email, password }, // ✅ username yerine email
    });

    // Backend'ten şu şekilde data geliyor:
    // { id, fullName, email, token }
    setToken(res.token); // ✅ Artık gerçek JWT token saklıyoruz
    setUser({
      id: res.id,
      email: res.email,
      fullName: res.fullName,
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
