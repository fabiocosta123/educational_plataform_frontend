"use client";

import { useEffect, useState, createContext, useContext } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { User, AuthContextType } from "../../types/interfaces";
import axios from "axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => {
        try {
          // fallback: decodifica o token
          const decoded: any = jwtDecode(token);
          setUser({
            id: decoded.nameid ?? decoded.id,
            email: decoded.email,
            name: decoded.unique_name ?? decoded.name,
            role: decoded.role
          });
        } catch {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
