"use client";

import { useAuth } from "../hooks/useAuth";

export default function DashboardTeacherPage() {
  const { user } = useAuth();

  return (
    <section className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#163E72] mb-4">
          Olá, Prof. {user?.name}
        </h1>

        <p className="text-gray-700 mb-6">Cursos em andamento</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user?.courses?.map((course) => (
            <div
              key={course.id}
              className="bg-[#255690] text-white rounded-md p-4 shadow hover:bg-[#163E72] transition"
            >
              <h2 className="font-semibold">{course.title}</h2>
              <p className="text-sm">{course.studentsCount} alunos inscritos</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
