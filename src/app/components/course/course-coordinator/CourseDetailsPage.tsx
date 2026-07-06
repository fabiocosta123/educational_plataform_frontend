"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { useParams } from "next/navigation";
import { CourseReadDto } from "../../../../types/interfaces";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#163E72] mb-4">{course.title}</h1>
      <p className="text-gray-700 mb-6">{course.description}</p>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold text-[#163E72] mb-2">Resumo</h2>
        
        <p><strong>Professor:</strong> {course.teacherName}</p>
        {/* <p><strong>Total de aulas:</strong> {course.lessonsCount}</p> */}
        <p><strong>Alunos inscritos:</strong> {course.enrolledUsers?.length ?? 0}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold text-[#163E72] mb-2">Aulas</h2>
        {course.lessons && course.lessons.length > 0 ? (
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
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-[#163E72] mb-2">Alunos</h2>
        {course.enrolledUsers && course.enrolledUsers.length > 0 ? (
          <ul className="list-disc pl-6">
            {course.enrolledUsers.map((student) => (
              <li key={student.id}>{student.userName}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhum aluno inscrito.</p>
        )}
      </div>
    </div>
  );
}
