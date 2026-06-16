
"use client";
import { useAuth } from "../../hooks/useAuth";
import Header from "../home/Header";
import Footer from "../home/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-[#163E72] font-semibold">Carregando...</span>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated && <Header />}
      <div className="flex-1">{children}</div>
      {!isAuthenticated && <Footer />}
    </>
  );
}
