"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import type { CourseReadDto } from "../../types/interfaces";

interface TeacherDashboard {
  coursesCount: number;
  lessonsCount: number;
  studentsCount: number;
}

export default function DashboardTeacherPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TeacherDashboard | null>(null);
  const [courses, setCourses] = useState<CourseReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const [coursesRes, dashRes] = await Promise.all([
          api.get<CourseReadDto[]>("/Courses/my-courses"),
          api.get<TeacherDashboard>(`/Teachers/${user.id}/dashboard`).catch(() => null),
        ]);
        setCourses(coursesRes.data ?? []);
        if (dashRes?.data) setStats(dashRes.data);
      } catch {
        toast.error("Não foi possível carregar seus cursos.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user]);

  if (!user) return null;

  const coursesCount = stats?.coursesCount ?? courses.length;
  const lessonsCount =
    stats?.lessonsCount ??
    courses.reduce(
      (total, course) =>
        total + (course.modules?.reduce((sum, module) => sum + (module.lessons?.length ?? 0), 0) ?? course.lessonsCount ?? 0),
      0
    );
  const studentsCount =
    stats?.studentsCount ??
    courses.reduce((total, course) => total + (course.enrolledUsers?.length ?? 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#163E72]">Olá, Prof. {user.name}</h1>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          ["Cursos", coursesCount],
          ["Aulas", lessonsCount],
          ["Alunos", studentsCount],
        ].map(([label, value]) => (
          <div key={String(label)} className="bg-white rounded-lg shadow-md p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-[#163E72]">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-[#163E72] mb-4">Meus cursos</h2>
      {loading && <p className="text-gray-500">Carregando cursos...</p>}
      {!loading && courses.length === 0 && (
        <p className="text-gray-600">Nenhum curso atribuído ainda.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-[#163E72] mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">
              {course.enrolledUsers?.length ?? 0} alunos inscritos
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href={`/dashboard-teacher/my-courses?courseId=${course.id}`}
                className="bg-[#338B97] text-white px-4 py-2 rounded-lg hover:bg-[#255690] transition text-center"
              >
                Acompanhar turma
              </Link>
              <Link
                href="/dashboard-teacher/modules"
                className="border border-[#338B97] text-[#338B97] px-4 py-2 rounded-lg hover:bg-[#338B97]/10 transition text-center"
              >
                Gerenciar conteúdo
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
