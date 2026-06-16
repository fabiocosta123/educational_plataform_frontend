"use client";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarTeacher from "../dashboardTeacher/SidebarTeacher";

export default function DashboardTeacher() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading] = useState(false);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (!user && !loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarTeacher />

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">
        {/* Header com nome e avatar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#163E72]">Olá, Prof. {user!.name}</h1>
            <p className="text-gray-600">{today}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#338B97] text-white flex items-center justify-center text-lg font-bold">
              {user!.name.split(" ").map(n => n[0]).join("")}
            </div>
          </div>
        </div>

        {/* Aqui você pode inserir os cards de cursos, módulos e aulas */}
        <h2 className="text-xl font-bold text-[#163E72] mb-4">Cursos em andamento</h2>
        {/* Exemplo de placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Nenhum curso atribuído ainda.</p>
        </div>
      </main>
    </div>
  );
}
