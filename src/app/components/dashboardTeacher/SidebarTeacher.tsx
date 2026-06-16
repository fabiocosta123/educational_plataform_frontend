"use client";
import Link from "next/link";
import LogoutButton from "../logoutButton/LogoutButton";

export default function DashboardSidebarTeacher() {
  return (
    <aside className="relative w-64 h-screen bg-[#163E72] text-white flex flex-col p-6 overflow-hidden">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-8">Portal do Professor</h2>

        <nav className="flex flex-col gap-4">
          <Link href="/dashboard-teacher" className="hover:bg-[#255690] p-2 rounded">Início</Link>
          <Link href="/dashboard-teacher/my-courses" className="hover:bg-[#255690] p-2 rounded">Cursos em andamento</Link>
          <Link href="/dashboard-teacher/modules" className="hover:bg-[#255690] p-2 rounded">Gerenciar Módulos</Link>
          <Link href="/dashboard-teacher/add-lesson" className="hover:bg-[#255690] p-2 rounded">Adicionar Aula</Link>
          <Link href="/dashboard-teacher/materials" className="hover:bg-[#255690] p-2 rounded">Materiais</Link>

        </nav>
      </div>

      {/* Botão fixo no rodapé */}
      <div className="absolute bottom-6 left-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
