import { User } from "../../types/interfaces";

export function userProfileValue(user: Pick<User, "profile" | "role"> | null | undefined): number {
  if (!user) return 0;
  const fromProfile = Number(user.profile);
  if (fromProfile === 1 || fromProfile === 2 || fromProfile === 3) return fromProfile;

  const role = String(user.role ?? "").toLowerCase();
  if (role === "coordinator") return 3;
  if (role === "teacher") return 2;
  if (role === "student") return 1;
  return 0;
}

export function dashboardPath(user: Pick<User, "profile" | "role"> | null | undefined): string {
  const profile = userProfileValue(user);
  if (profile === 3) return "/dashboard-coordinator";
  if (profile === 2) return "/dashboard-teacher";
  if (profile === 1) return "/dashboard-student";
  return "/login";
}
