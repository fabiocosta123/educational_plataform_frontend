"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { StudentDto } from "@/types/interfaces";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get<StudentDto>(`/users/${id}`);
        setStudent(res.data);
      } catch {
        toast.error("Erro ao carregar estudante");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (!student) return <p className="text-center mt-10">Aluno não encontrado</p>;

  return (
    <Card className="max-w-2xl mx-auto shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#163E72]">
          Detalhes do Estudante
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Dados básicos */}
        <section className="space-y-2 mb-6">
          <p><strong>Nome:</strong> {student.userName}</p>
          <p><strong>Email:</strong> {student.userEmail}</p>
          {student.cpf && <p><strong>CPF:</strong> {student.cpf}</p>}
          {student.phoneNumber && <p><strong>Telefone:</strong> {student.phoneNumber}</p>}
          {student.birthDate && (
            <p><strong>Data de Nascimento:</strong> {student.birthDate.split("T")[0]}</p>
          )}
        </section>

        {/* Cursos matriculados */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Cursos matriculados</h2>
          {student.courseEnrolled && student.courseEnrolled.length > 0 ? (
            <ul className="space-y-4">
              {student.courseEnrolled.map((course) => {
                const progress = course.totalLessons
                  ? Math.round((course.completedLessons! * 100) / course.totalLessons)
                  : 0;

                return (
                  <li key={course.id} className="border rounded p-4">
                    <p><strong>Curso:</strong> {course.courseTitle}</p>
                    {course.teacherName && <p><strong>Professor:</strong> {course.teacherName}</p>}
                    <p><strong>Status:</strong> {course.status}</p>

                    {/* Progresso */}
                    <div className="mt-2">
                      <p>
                        <strong>Progresso:</strong>{" "}
                        {course.completedLessons}/{course.totalLessons} aulas ({progress}%)
                      </p>
                      <div className="w-full bg-gray-200 rounded h-3 mt-1">
                        <div
                          className="bg-[#163E72] h-3 rounded"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Nenhum curso matriculado.</p>
          )}
        </section>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button
          onClick={() => router.push(`/dashboard-coordinator/students/${student.id}/edit`)}
          className="bg-[#163E72] hover:bg-gray-700 text-white"
        >
          Editar
        </Button>
        <Button
          onClick={() => router.push("/dashboard-coordinator/students")}
          className="bg-gray-500 hover:bg-gray-600 text-white"
        >
          Voltar
        </Button>
      </CardFooter>
    </Card>
  );
}
