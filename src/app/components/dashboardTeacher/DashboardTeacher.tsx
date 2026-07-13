"use client";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarTeacher from "../dashboardTeacher/SidebarTeacher";
import Cookies from "js-cookie";

export default function DashboardTeacher() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading] = useState(false);

  const [activeCourses, setActiveCourses] = useState<number>(0);
  const [lessonsCount, setLessonsCount] = useState<number>(0);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [nextLessonDate, setNextLessonDate] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }

    if (user) {
      const token = Cookies.get("token");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teachers/${user.id}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setActiveCourses(data.coursesCount);
          setLessonsCount(data.lessonsCount);
          setStudentsCount(data.studentsCount);
          if (data.nextLessonDate) {
            setNextLessonDate(new Date(data.nextLessonDate).toLocaleDateString("pt-BR"));
          }
        });
    }
  }, [user, loading, router]);

  if (!user && !loading) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 md:flex-row">
      {/* Sidebar - em mobile vira topo */}
      <SidebarTeacher />

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header com nome e avatar */}
        <div className="flex flex-col items-start gap-2 mb-6 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163E72]">
              Olá, Prof. {user!.name}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">{today}</p>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#338B97] text-white flex items-center justify-center text-base md:text-lg font-bold">
              {user!.name.split(" ").map(n => n[0]).join("")}
            </div>
          </div>
        </div>

        {/* Cards visuais com dados reais */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-[#163E72]">{activeCourses}</span>
            <span className="text-gray-600 text-xs md:text-sm">Cursos ativos</span>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-[#163E72]">{studentsCount}</span>
            <span className="text-gray-600 text-xs md:text-sm">Alunos matriculados</span>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-[#163E72]">{lessonsCount}</span>
            <span className="text-gray-600 text-xs md:text-sm">Aulas publicadas</span>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-lg md:text-xl font-bold text-[#163E72]">
              {nextLessonDate ?? "—"}
            </span>
            <span className="text-gray-600 text-xs md:text-sm">Próxima aula</span>
          </div>
        </div>

        {/* Cursos em andamento */}
        <h2 className="text-lg md:text-xl font-bold text-[#163E72] mb-3 md:mb-4">
          Cursos em andamento
        </h2>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm md:text-base">Nenhum curso atribuído ainda.</p>
        </div>
      </main>
    </div>
  );
}
