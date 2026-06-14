"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { User, Enrollment } from "../../types/interfaces";
import { toast } from "react-toastify";

export default function StudentDashboard() {
  const [progress, setProgress] = useState(72);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const user: User = { id: 5, name: "Fabio Costa", role: "Aluno"};

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get<Enrollment[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/CoursesEnrollment?userId=${user.id}`
        );
        setEnrollments(response.data);

        setTotalCourses(response.data.length);
        setCompletedCourses(response.data.filter(e => e.status === "Concluido").length);
        setProgress(
          Math.round(
            response.data.reduce((acc, e) => acc + (e.progressPercentage || 0), 0) /
           (response.data.length || 1)
          )
        );
        toast.success("Cursos carregados com sucesso!")
      } catch {
        toast.error("Erro ao carregar cursos matriculados")
      }
    };
    fetchEnrollments();
  }, [user.id])

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#163E72] text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Portal do Aluno</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="hover:text-[#66BCA1]">Início</Link>
          <Link href="/dashboard/courses" className="hover:text-[#66BCA1]">Meus Cursos</Link>
          <Link href="/dashboard/activities" className="hover:text-[#66BCA1]">Atividades</Link>
          <Link href="/dashboard/calendar" className="hover:text-[#66BCA1]">Calendário</Link>
          <Link href="/dashboard/report" className="hover:text-[#66BCA1]">Boletim</Link>
          <Link href="/dashboard/finance" className="hover:text-[#66BCA1]">Financeiro</Link>
          <Link href="/dashboard/certificates" className="hover:text-[#66BCA1]">Certificados</Link>
          <Link href="/dashboard/forum" className="hover:text-[#66BCA1]">Fórum</Link>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">
        {/* Header com nome e avatar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#163E72]">Olá, {user.name}</h1>
            <p className="text-gray-600">{today}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#338B97] text-white flex items-center justify-center text-lg font-bold">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
          </div>
        </div>

        {/* Progresso geral */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="font-semibold text-[#163E72] mb-4">Meu Progresso Geral</h2>
          <div className="flex items-center gap-8">
            {/* Gráfico circular */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24">
                <circle
                  className="text-gray-300"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                />
                <circle
                  className="text-[#338B97]"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#163E72]">
                {progress}%
              </span>
            </div>

            {/* Dados de progresso */}
            <div>
              <p className="text-gray-700">Cursos Concluídos: {completedCourses}/{totalCourses}</p>
              <p className="text-gray-700">Total de Aulas: {completedLessons}/{totalLessons}</p>
            </div>
          </div>
        </div>

        {/* Cursos matriculados */}
        <h2 className="text-xl font-bold text-[#163E72] mb-4">Meus Cursos Matriculados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {enrollments.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-[#163E72] mb-2">{course.courseTitle}</h3>
              <p className="text-gray-600 mb-2">Status: {course.status}</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{ width: `${course.progressPercentage || 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{course.progressPercentage || 0}% concluído</p>
              <button className="bg-[#338B97] text-white px-4 py-2 rounded-lg hover:bg-[#255690] transition"
              onClick={() => toast.info(`Continuando curso: ${course.courseTitle}`)}>
                Continuar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
