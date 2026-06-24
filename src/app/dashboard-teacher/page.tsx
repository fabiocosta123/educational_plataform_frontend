"use client";

import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function DashboardTeacherPage() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-8">
        {/* Header com nome e avatar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#163E72]">
              Olá, Prof. {user.name}
            </h1>
            <p className="text-gray-600">{today}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#338B97] text-white flex items-center justify-center text-lg font-bold">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
          </div>
        </div>

        {/* Cursos criados */}
        <h2 className="text-xl font-bold text-[#163E72] mb-4">
          Meus Cursos Criados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {user.courses?.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-[#163E72] mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-2">
                {course.studentsCount} alunos inscritos
              </p>
              <button
                className="bg-[#338B97] text-white px-4 py-2 rounded-lg hover:bg-[#255690] transition"
                onClick={() =>
                  toast.info(`Gerenciando curso: ${course.title}`)
                }
              >
                Gerenciar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
