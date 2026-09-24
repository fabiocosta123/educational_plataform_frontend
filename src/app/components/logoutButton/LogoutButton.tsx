"use client";
import { useAuth } from "../../hooks/useAuth";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={logout}
      className="flex items-center justify-center text-white hover:text-[#66BCA1] transition"
      title="Sair"
    >
      <FaSignOutAlt className="text-3xl" />
    </button>
  );
}
