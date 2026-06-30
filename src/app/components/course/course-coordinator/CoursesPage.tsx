"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CourseReadDto } from "../../../../types/interfaces";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseReadDto[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get<CourseReadDto[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`
      );
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#163E72] mb-4">Cursos</h1>
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Título</th>
            <th className="p-3">Descrição</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id} className="border-b">
              <td className="p-3">{course.title}</td>
              <td className="p-3">{course.description}</td>
              <td className="p-3">
                <button className="text-blue-600 hover:underline">Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
