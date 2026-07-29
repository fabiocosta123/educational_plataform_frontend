"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { StudentDto } from "@/types/interfaces";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#163E72]">Estudantes</h1>
        <Button
          onClick={() => router.push("/dashboard-coordinator/students/create")}
          className="bg-[#163E72] hover:bg-[#255690] text-white"
        >
          Criar Estudante
        </Button>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-[#163E72]">{student.userName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Email:</strong> {student.userEmail}</p>

              {student.courseEnrolled && student.courseEnrolled.length > 0 && (
                <div>
                  <strong>Cursos matriculados:</strong>
                  <ul className="list-disc pl-5 text-sm">
                    {student.courseEnrolled.map((course) => (
                      <li key={course.id}>
                        {course.courseTitle} — Status: {course.status}
                        {course.teacherName && <> — Professor: {course.teacherName}</>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => router.push(`/dashboard-coordinator/students/${student.id}/details`)}
              >
                <FaEye className="mr-1" /> Detalhes
              </Button>
              <Button
                variant="ghost"
                className="text-green-600 hover:text-green-800"
                onClick={() => router.push(`/dashboard-coordinator/students/${student.id}/edit`)}
              >
                <FaEdit className="mr-1" /> Editar
              </Button>
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-800"
                onClick={() => setStudentToDelete(student.id)}
              >
                <FaTrash className="mr-1" /> Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modal de confirmação */}
      {studentToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="max-w-sm w-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Confirmar exclusão</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tem certeza que deseja excluir este estudante?</p>
            </CardContent>
            <CardFooter className="flex gap-4 justify-end">
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sim
              </Button>
              <Button
                onClick={() => setStudentToDelete(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white"
              >
                Cancelar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="text-center">
      <CardContent>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg sm:text-xl font-bold text-[#163E72]">{value}</p>
      </CardContent>
    </Card>
  );
}
