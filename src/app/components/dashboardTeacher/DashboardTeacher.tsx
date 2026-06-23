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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teacher/${user.id}/dashboard`, {
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

        {/* Cards visuais com dados reais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl font-bold text-[#163E72]">{activeCourses}</span>
            <span className="text-gray-600">Cursos ativos</span>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl font-bold text-[#163E72]">{studentsCount}</span>
            <span className="text-gray-600">Alunos matriculados</span>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl font-bold text-[#163E72]">{lessonsCount}</span>
            <span className="text-gray-600">Aulas publicadas</span>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl font-bold text-[#163E72]">
              {nextLessonDate ?? "—"}
            </span>
            <span className="text-gray-600">Próxima aula</span>
          </div>
        </div>

        {/* Cursos em andamento */}
        <h2 className="text-xl font-bold text-[#163E72] mb-4">Cursos em andamento</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Nenhum curso atribuído ainda.</p>
        </div>
      </main>
    </div>
  );
}
