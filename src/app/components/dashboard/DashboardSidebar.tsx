"use client";
import Link from "next/link";
import LogoutButton from "../logoutButton/LogoutButton";

export default function DashboardSidebar() {
  return (
    <aside className="relative w-64 h-screen bg-[#163E72] text-white flex flex-col p-6 overflow-hidden">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-8">Portal do Aluno</h2>

        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="hover:text-[#66BCA1]">Início</Link>
          <Link href="/dashboard/my-courses" className="hover:text-[#66BCA1]">Meu Aprendizado</Link>
          <Link href="/dashboard/courses" className="hover:text-[#66BCA1]">Cursos disponíveis</Link>
          <Link href="/dashboard/activities" className="hover:text-[#66BCA1]">Atividades</Link>
          <Link href="/dashboard/calendar" className="hover:text-[#66BCA1]">Calendário</Link>
          <Link href="/dashboard/report" className="hover:text-[#66BCA1]">Boletim</Link>
          <Link href="/dashboard/finance" className="hover:text-[#66BCA1]">Financeiro</Link>
          <Link href="/dashboard/certificates" className="hover:text-[#66BCA1]">Certificados</Link>
          <Link href="/dashboard/forum" className="hover:text-[#66BCA1]">Fórum</Link>
        </nav>
      </div>

      {/* Botão fixo no rodapé */}
      <div className="absolute bottom-6 left-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
