"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { persistSessionToken } from "@/lib/authSession";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard-student";
  }
  return value;
}

function AuthContinueInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token =
      sessionStorage.getItem("anexa-continue-token") ||
      localStorage.getItem("token");
    const next = safeNext(searchParams.get("next"));
    if (token) {
      persistSessionToken(token);
    }
    window.location.replace(token ? next : "/login");
  }, [searchParams]);

  return <p className="p-6 text-gray-600">Entrando...</p>;
}

export default function AuthContinuePage() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-600">Entrando...</p>}>
      <AuthContinueInner />
    </Suspense>
  );
}
