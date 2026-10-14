import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const NAME_ID =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
const ROLE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export function persistSessionToken(token: string) {
  localStorage.setItem("token", token);
  Cookies.set("token", token, {
    expires: 4 / 24,
    path: "/",
    sameSite: "lax",
    secure: window.location.protocol === "https:",
  });
}

export function clearSessionToken() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  Cookies.remove("token", { path: "/" });
}

export function claimsFromToken(token: string) {
  const decoded = jwtDecode<Record<string, unknown>>(token);
  const pick = (...keys: string[]) => {
    for (const key of keys) {
      const value = decoded[key];
      if (value != null && String(value).length > 0) return String(value);
    }
    return "";
  };

  return {
    id: parseInt(pick("nameid", "sub", NAME_ID), 10),
    name: pick("unique_name", NAME),
    role: pick("role", ROLE),
    profile: parseInt(pick("profile"), 10),
  };
}
