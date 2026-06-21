"use client";
import Link from "next/link";
import LogoutButton from "../logoutButton/LogoutButton";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function DashboardSidebarTeacher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar superior com botão hamburger (mobile) */}
      <div className="md:hidden flex items-center justify-between bg-[#163E72] text-white p-4">
        <h2 className="text-lg font-bold">Portal do Professor</h2>
        <button onClick={() => setOpen(!open)} className="text-2xl">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar responsivo */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-[#163E72] text-white flex flex-col p-6 transform transition-transform duration-300 ease-in-out 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-8 hidden md:block">Portal do Professor</h2>

          <nav className="flex flex-col gap-4">
            <Link href="/dashboard-teacher" className="hover:bg-[#255690] p-2 rounded">Início</Link>
            <Link href="/dashboard-teacher/my-courses" className="hover:bg-[#255690] p-2 rounded">Cursos em andamento</Link>
            <Link href="/dashboard-teacher/modules" className="hover:bg-[#255690] p-2 rounded">Gerenciar Módulos</Link>
            <Link href="/dashboard-teacher/add-lesson" className="hover:bg-[#255690] p-2 rounded">Adicionar Aula</Link>
            <Link href="/dashboard-teacher/materials" className="hover:bg-[#255690] p-2 rounded">Materiais</Link>
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
