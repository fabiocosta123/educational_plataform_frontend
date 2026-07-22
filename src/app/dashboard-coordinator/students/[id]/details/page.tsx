"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { StudentDto } from "@/types/interfaces";

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
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-[#163E72] mb-6">
        Detalhes do Estudante
      </h1>

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

      {/* Ações */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => router.push(`/dashboard-coordinator/students/${student.id}/edit`)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Editar
        </button>
        <button
          onClick={() => router.push("/dashboard-coordinator/students")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
