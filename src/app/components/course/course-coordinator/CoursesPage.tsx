"use client";

import { useEffect, useState } from "react";
import { CourseReadDto } from "../../../../types/interfaces";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseReadDto[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await api.get<CourseReadDto[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`
      );
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  const handleDelete = (id: number) => {
    confirmAlert({
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir este curso?",
      buttons: [
        {
          label: "Sim",
          onClick: async () => {
            try {
              await api.delete(`/courses/${id}`);
              setCourses(courses.filter(c => c.id !== id));
              toast.success("Curso excluído com sucesso!");
            } catch {
              toast.error("Erro ao excluir curso");
            }
          }
        },
        {
          label: "Cancelar"
        }
      ]
    });
  };



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
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
