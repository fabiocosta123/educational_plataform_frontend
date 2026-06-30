"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { CourseReadDto } from "../../../../types/interfaces";

export default function CourseDetailsPage() {
  const { id } = useParams(); // pega o id do curso da rota
  const [course, setCourse] = useState<CourseReadDto | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axios.get<CourseReadDto>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`
      );
      setCourse(res.data);
    };
    fetchCourse();
  }, [id]);

  if (!course) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#163E72] mb-4">{course.title}</h1>
      <p className="text-gray-700 mb-6">{course.description}</p>

      {/* Aqui depois adicionamos alunos, professores e aulas */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-[#163E72] mb-2">Resumo</h2>
        <p><strong>ID:</strong> {course.id}</p>
        {/* Exemplo: <p><strong>Alunos:</strong> {course.studentsCount}</p> */}
      </div>
    </div>
  );
}
