"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { useParams } from "next/navigation";
import { CourseReadDto } from "../../../../types/interfaces";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CourseDetailsPage() {
  const { id } = useParams(); 
  const [course, setCourse] = useState<CourseReadDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get<CourseReadDto>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`
        );
        setCourse(res.data);
      } catch (error) {
        console.error("Erro ao carregar curso:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (!course) return <p className="text-center mt-10">Curso não encontrado.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#163E72]">{course.title}</h1>
      <p className="text-gray-700">{course.description}</p>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Professor:</strong> {course.teacherName}</p>
          <p><strong>Alunos inscritos:</strong> {course.enrolledUsers?.length ?? 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aulas</CardTitle>
        </CardHeader>
        <CardContent>
          {course.lessons?.length ? (
            <ul className="list-disc pl-6">
              {course.lessons.map((lesson) => (
                <li key={lesson.id}>
                  {lesson.title} - {new Date(lesson.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma aula cadastrada.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          {course.enrolledUsers?.length ? (
            <ul className="list-disc pl-6">
              {course.enrolledUsers.map((student, index) => (
                <li key={`${student.id}-${student.userName}`}>{student.userName}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhum aluno inscrito.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
