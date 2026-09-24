"use client";

import { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import { User, AuthContextType } from "../../types/interfaces";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        setUser({
          id: data.id,
          name: data.name ?? data.userName,
          email: data.email ?? data.userEmail,
          role: data.role,
          profile: Number(data.profile),
          courses: data.courses,
        });
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
    window.location.assign("/");
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
