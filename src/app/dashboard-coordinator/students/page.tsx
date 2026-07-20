"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface StudentDto {
  id: number;
  userName: string;
  userEmail: string;
  courseEnrolled?: { id: number; title: string; status: string }[];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get<StudentDto[]>(
          `/users/students`
        );
        setStudents(res.data);
      } catch {
        toast.error("Erro ao carregar estudantes");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  const totalAlunos = students.length;
  const totalCursos = students.reduce(
    (acc, s) => acc + (s.courseEnrolled?.length ?? 0),
    0
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Alunos" value={totalAlunos} />
        <DashboardCard title="Cursos matriculados" value={totalCursos} />
      </div>

      {/* Header com botão */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#163E72]">
          Estudantes
        </h1>
        <button
          onClick={() => router.push("/dashboard-coordinator/students/create")}
          className="bg-[#163E72] text-white px-4 py-2 rounded hover:bg-[#255690] transition"
        >
          Criar Estudante
        </button>
      </div>

      {/* Lista de alunos */}
      <div className="space-y-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
          >
            <h2 className="text-lg font-bold text-[#163E72]">
              {student.userName}
            </h2>
            <p><strong>Email:</strong> {student.userEmail}</p>

            {student.courseEnrolled && student.courseEnrolled.length > 0 && (
              <div>
                <strong>Cursos matriculados:</strong>
                <ul className="list-disc pl-5 text-sm sm:text-base">
                  {student.courseEnrolled.map((course) => (
                    <li key={course.id}>
                      {course.title} — Status: {course.status}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
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
