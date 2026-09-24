"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { dashboardPath, userProfileValue } from "../lib/dashboardPath";

export default function AuthGuard({
  profile,
  children,
}: {
  profile: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const actual = userProfileValue(user);
    if (actual !== profile) {
      router.replace(dashboardPath(user));
    }
  }, [user, loading, profile, router]);

  if (loading || !user || userProfileValue(user) !== profile) {
    return <p className="text-gray-600 p-4">Carregando...</p>;
  }

  return <>{children}</>;
}
