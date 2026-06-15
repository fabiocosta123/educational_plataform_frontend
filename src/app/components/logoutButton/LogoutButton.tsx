"use client";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/home");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center text-white hover:text-[#66BCA1] transition"
      title="Sair"
    >
      <FaSignOutAlt className="text-3xl" />
    </button>
  );
}
