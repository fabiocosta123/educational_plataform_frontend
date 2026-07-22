"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Cookies from "js-cookie";
import SidebarTeacher from "./SidebarTeacher";

const fetcher = (url: string) => {
  const token = Cookies.get("token");
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());
};

export default function DashboardTeacher() {
  const { user } = useAuth();
  const router = useRouter();

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 🔑 SWR busca e mantém cache atualizado
  const { data, error, isLoading } = useSWR(
    user ? `/teachers/${user.id}/dashboard` : null,
    fetcher
  );

  if (!user) {
    router.push("/login");
    return null;
  }

  if (isLoading) return <p className="text-center mt-10">Carregando...</p>;
  if (error) return <p className="text-center mt-10">Erro ao carregar dados.</p>;

  const activeCourses = data?.coursesCount ?? 0;
  const lessonsCount = data?.lessonsCount ?? 0;
  const studentsCount = data?.studentsCount ?? 0;
  const nextLessonDate = data?.nextLessonDate
    ? new Date(data.nextLessonDate).toLocaleDateString("pt-BR")
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 md:flex-row">
      <SidebarTeacher />

      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-2 mb-6 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163E72]">
              Olá, Prof. {user.name}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">{today}</p>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#338B97] text-white flex items-center justify-center text-base md:text-lg font-bold">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <DashboardCard title="Cursos ativos" value={activeCourses} />
          <DashboardCard title="Alunos matriculados" value={studentsCount} />
          <DashboardCard title="Aulas publicadas" value={lessonsCount} />
          <DashboardCard title="Próxima aula" value={nextLessonDate ?? "—"} />
        </div>

        {/* Cursos em andamento */}
        <h2 className="text-lg md:text-xl font-bold text-[#163E72] mb-3 md:mb-4">
          Cursos em andamento
        </h2>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm md:text-base">
            Nenhum curso atribuído ainda.
          </p>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
      <span className="text-xl md:text-2xl font-bold text-[#163E72]">{value}</span>
      <span className="text-gray-600 text-xs md:text-sm">{title}</span>
    </div>
  );
}
