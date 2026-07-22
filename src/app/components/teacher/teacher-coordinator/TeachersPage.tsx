"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { TeacherReadDto } from "../../../../types/interfaces";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get<TeacherReadDto[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/teachers`
        );
        setTeachers(res.data);
      } catch {
        toast.error("Erro ao carregar professores");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  // Cálculos para o dashboard
  const totalProfessores = teachers.length;
  const totalCursos = teachers.reduce((acc, t) => acc + t.courses.length, 0);
  const totalAulas = teachers.reduce(
    (acc, t) => acc + t.courses.reduce((cAcc, c) => cAcc + c.lessonsCount, 0),
    0
  );
  const totalAlunos = teachers.reduce(
    (acc, t) =>
      acc +
      t.courses.reduce((cAcc, c) => cAcc + (c.enrolledUsers?.length ?? 0), 0),
    0
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Dashboard resumido */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 rounded shadow text-center">
          <p className="text-sm text-gray-500">Professores</p>
          <p className="text-lg sm:text-xl font-bold text-[#163E72]">
            {totalProfessores}
          </p>
        </div>
        <div className="bg-white p-3 rounded shadow text-center">
          <p className="text-sm text-gray-500">Cursos</p>
          <p className="text-lg sm:text-xl font-bold text-[#163E72]">
            {totalCursos}
          </p>
        </div>
        <div className="bg-white p-3 rounded shadow text-center">
          <p className="text-sm text-gray-500">Aulas</p>
          <p className="text-lg sm:text-xl font-bold text-[#163E72]">
            {totalAulas}
          </p>
        </div>
        <div className="bg-white p-3 rounded shadow text-center">
          <p className="text-sm text-gray-500">Alunos</p>
          <p className="text-lg sm:text-xl font-bold text-[#163E72]">
            {totalAlunos}
          </p>
        </div>
      </div>

      {/* Lista detalhada de professores */}
      <h1 className="text-xl sm:text-2xl font-bold text-[#163E72] mb-4">
        Professores
      </h1>

      <div className="space-y-4">
        {teachers.map((teacher) => {
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
