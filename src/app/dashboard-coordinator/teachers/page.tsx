"use client";

import useSWR from "swr";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { TeacherReadDto } from "../../../types/interfaces";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function TeachersPage() {
  const router = useRouter();

  
  const { data: teachers, error, isLoading, mutate } = useSWR<TeacherReadDto[]>(
    "/teachers",
    fetcher
  );

  if (isLoading) return <p className="text-center mt-10">Carregando...</p>;
  if (error) {
    toast.error("Erro ao carregar professores");
    return null;
  }

  const totalProfessores = teachers?.length ?? 0;
  const totalCursos = teachers?.reduce((acc, t) => acc + t.courses.length, 0) ?? 0;
  const totalAulas = teachers?.reduce(
    (acc, t) => acc + t.courses.reduce((cAcc, c) => cAcc + c.lessonsCount, 0),
    0
  ) ?? 0;
  const totalAlunos = teachers?.reduce(
    (acc, t) =>
      acc +
      t.courses.reduce((cAcc, c) => cAcc + (c.enrolledUsers?.length ?? 0), 0),
    0
  ) ?? 0;

  return (
    <div className="p-4 sm:p-6">
      {/* Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Professores" value={totalProfessores} />
        <DashboardCard title="Cursos" value={totalCursos} />
        <DashboardCard title="Aulas" value={totalAulas} />
        <DashboardCard title="Alunos Matriculados" value={totalAlunos} />
      </div>

      {/* Header com botão */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#163E72]">
          Professores
        </h1>
        <button
          onClick={() => router.push("/dashboard-coordinator/teachers/create")}
          className="bg-[#163E72] text-white px-4 py-2 rounded hover:bg-[#255690] transition"
        >
          Criar Professor
        </button>
      </div>

      <div className="space-y-4">
        {teachers?.map((teacher) => {
          const aulas = teacher.courses.reduce(
            (acc, c) => acc + c.lessonsCount,
            0
          );
          const alunos = teacher.courses.reduce(
            (acc, c) => acc + (c.enrolledUsers?.length ?? 0),
            0
          );

          return (
            <div
              key={teacher.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
            >
              <h2 className="text-lg font-bold text-[#163E72]">
                {teacher.userName}
              </h2>

              <p><strong>Cursos:</strong> {teacher.courses.length}</p>
              <p><strong>Total de aulas:</strong> {aulas}</p>
              <p><strong>Total de alunos:</strong> {alunos}</p>

              <div>
                <strong>Lista de cursos:</strong>
                <ul className="list-disc pl-5 text-sm sm:text-base">
                  {teacher.courses.map((course) => (
                    <li key={course.id}>
                      {course.title} ({course.lessonsCount} aulas,{" "}
                      {course.enrolledUsers?.length ?? 0} alunos)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-3 rounded shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg sm:text-xl font-bold text-[#163E72]">{value}</p>
    </div>
  );
}
