"use client";
import Link from "next/link";
import LogoutButton from "../logoutButton/LogoutButton";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão de menu visível apenas em telas pequenas */}
      <div className="md:hidden flex items-center justify-between bg-[#163E72] text-white p-4">
        <h2 className="text-lg font-bold">Portal do Aluno</h2>
        <button onClick={() => setOpen(!open)} className="text-2xl">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar fixa em telas médias+ ou drawer em mobile */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-[#163E72] text-white flex flex-col p-6 transform transition-transform duration-300 ease-in-out 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-8 hidden md:block">Portal do Aluno</h2>

          <nav className="flex flex-col gap-4">
            <Link href="/dashboard" className="hover:bg-[#255690] p-2 rounded">Início</Link>
            <Link href="/dashboard/my-courses" className="hover:bg-[#255690] p-2 rounded">Meu Aprendizado</Link>
            <Link href="/dashboard/courses" className="hover:bg-[#255690] p-2 rounded">Cursos disponíveis</Link>
            <Link href="/dashboard/activities" className="hover:bg-[#255690] p-2 rounded">Atividades</Link>
            <Link href="/dashboard/calendar" className="hover:bg-[#255690] p-2 rounded">Calendário</Link>
            <Link href="/dashboard/report" className="hover:bg-[#255690] p-2 rounded">Boletim</Link>
            <Link href="/dashboard/finance" className="hover:bg-[#255690] p-2 rounded">Financeiro</Link>
            <Link href="/dashboard/certificates" className="hover:bg-[#255690] p-2 rounded">Certificados</Link>
            <Link href="/dashboard/forum" className="hover:bg-[#255690] p-2 rounded">Fórum</Link>
          </nav>
        </div>

        {/* Botão fixo no rodapé */}
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
