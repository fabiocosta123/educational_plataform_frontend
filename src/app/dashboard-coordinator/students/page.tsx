"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { StudentDto } from "@/types/interfaces";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get<StudentDto[]>(`/users/students`);
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

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await api.delete(`/users/${studentToDelete}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete));
      toast.success("Estudante excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir estudante");
    } finally {
      setStudentToDelete(null);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Alunos" value={totalAlunos} />
        <DashboardCard title="Cursos matriculados" value={totalCursos} />
      </div>

      {/* Header com botão */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#163E72]">Estudantes</h1>
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
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-[#163E72]">{student.userName}</h2>
                <p><strong>Email:</strong> {student.userEmail}</p>

                {student.courseEnrolled && student.courseEnrolled.length > 0 && (
                  <div>
                    <strong>Cursos matriculados:</strong>
                    <ul className="list-disc pl-5 text-sm sm:text-base">
                      {student.courseEnrolled.map((course) => (
                        <li key={course.id}>
                          {course.courseTitle} — Status: {course.status}
                          {course.teacherName && (
                            <> — Professor: {course.teacherName}</>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Ícones de ação */}
              <div className="flex gap-3 text-xl">
                <button
                  onClick={() => router.push(`/dashboard-coordinator/students/${student.id}/details`)}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Visualizar"
                >
                  <FaEye />
                </button>

                <button
                  onClick={() => router.push(`/dashboard-coordinator/students/${student.id}/edit`)}
                  className="text-green-600 hover:text-green-800 transition"
                  title="Editar"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setStudentToDelete(student.id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Excluir"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmação */}
      {studentToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">Tem certeza que deseja excluir este estudante?</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sim
              </button>
              <button
                onClick={() => setStudentToDelete(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
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
