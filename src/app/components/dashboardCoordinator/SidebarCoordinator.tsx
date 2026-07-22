"use client";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import LogoutButton from "../logoutButton/LogoutButton";

export default function SidebarCoordinator() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar superior (mobile) */}
      <div className="md:hidden flex items-center justify-between bg-[#163E72] text-white p-4">
        <h2 className="text-lg font-bold">Portal do Coordenador</h2>
        <button onClick={() => setOpen(!open)} className="text-2xl">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-[#163E72] text-white flex flex-col p-6 transform transition-transform duration-300 ease-in-out 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-2xl font-bold mb-8 hidden md:block">Portal do Coordenador</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard-coordinator" className="hover:bg-[#255690] p-2 rounded">Início</Link>
          <Link href="/dashboard-coordinator/courses" className="hover:bg-[#255690] p-2 rounded">Cursos</Link>
          <Link href="/dashboard-coordinator/teachers" className="hover:bg-[#255690] p-2 rounded">Professores</Link>
          <Link href="/dashboard-coordinator/students" className="hover:bg-[#255690] p-2 rounded">Alunos</Link>
          <Link href="/dashboard-coordinator/reports" className="hover:bg-[#255690] p-2 rounded">Relatórios</Link>
          <Link href="/dashboard-coordinator/finance" className="hover:bg-[#255690] p-2 rounded">Financeiro</Link>
          <Link href="/dashboard-coordinator/forum" className="hover:bg-[#255690] p-2 rounded">Fórum</Link>
        </nav>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
