"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../services/api";
import { Enrollment } from "../../types/interfaces";
import { enrollmentStatusLabel } from "../../lib/enrollmentStatus";

const canContinue = (status?: string) => {
  const value = (status ?? "").toLowerCase();
  return ["active", "ativo", "completed", "concluido", "concluído"].includes(value);
};

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [fetching, setFetching] = useState(false);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchEnrollments = async () => {
      setFetching(true);
      try {
        const response = await api.get<Enrollment[]>("/CoursesEnrollment");
        setEnrollments(response.data);
      } catch {
        toast.error("Erro ao carregar cursos matriculados");
      } finally {
        setFetching(false);
      }
    };

    fetchEnrollments();
  }, [user, loading, router]);

  if (loading || !user) {
    return <p className="text-gray-600">Carregando...</p>;
  }

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) =>
    ["concluido", "concluído", "completed"].includes((e.status ?? "").toLowerCase())
  ).length;
  const progress = Math.round(
    enrollments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0) / (totalCourses || 1)
  );
  const completedLessons = enrollments.reduce((acc, e) => acc + (e.completedLessons || 0), 0);
  const totalLessons = enrollments.reduce((acc, e) => acc + (e.totalLessons || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#163E72]">Olá, {user.name}</h1>
          <p className="text-gray-600">{today}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#338B97] text-white flex items-center justify-center text-lg font-bold">
          {user.name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="font-semibold text-[#163E72] mb-4">Meu Progresso Geral</h2>
        <div className="flex items-center gap-8">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24">
              <circle className="text-gray-300" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
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
          <div>
            <p className="text-gray-700">Cursos concluídos: {completedCourses}/{totalCourses}</p>
            <p className="text-gray-700">Aulas: {completedLessons}/{totalLessons}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-[#163E72] mb-4">Meus cursos</h2>
      {fetching && <p className="text-gray-500">A carregar cursos...</p>}
      {!fetching && enrollments.length === 0 && (
        <p className="text-gray-600">
          Ainda não tens matrículas.{" "}
          <Link href="/dashboard-student/available-courses" className="text-[#338B97] underline">
            Ver cursos disponíveis
          </Link>
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-[#163E72] mb-2">{course.courseTitle}</h3>
            <p className="text-gray-600 mb-2">Status: {enrollmentStatusLabel(course.status)}</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="h-3 rounded-full bg-green-500" style={{ width: `${course.progressPercentage || 0}%` }} />
            </div>
            <p className="text-sm text-gray-600 mb-4">{course.progressPercentage || 0}% concluído</p>
            {canContinue(course.status) ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={`/dashboard-student/courses/${course.courseId}`}
                  className="inline-block bg-[#338B97] text-white px-4 py-2 rounded-lg hover:bg-[#255690] transition text-center"
                >
                  Continuar
                </Link>
                <Link
                  href={`/dashboard-student/courses/${course.courseId}/forum`}
                  className="inline-block border border-[#338B97] text-[#338B97] px-4 py-2 rounded-lg hover:bg-[#338B97]/10 transition text-center"
                >
                  Fórum
                </Link>
              </div>
            ) : (
              <p className="text-sm text-amber-700">Matrícula pendente. O conteúdo libera depois da confirmação.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
