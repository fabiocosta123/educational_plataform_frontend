"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CourseReadDto } from "../../types/interfaces";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
import CourseForm from "./CourseForm";
import { toast } from "react-toastify";

export default function CoursesCoordinatorPage() {
  const [courses, setCourses] = useState<CourseReadDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseReadDto | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get<CourseReadDto[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`
      );
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  const handleAddCourse = (newCourse: CourseReadDto) => {
    setCourses(prev => [...prev, newCourse]);
    setShowForm(false);
  };


  const handleDeleteCourse = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success("Curso excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir curso");
    }
  };


  const handleEditCourse = (course: CourseReadDto) => {
    setEditingCourse(course); // abre form com dados preenchidos
  };

  const handleUpdateCourse = async (updatedCourse: CourseReadDto) => {
    try {
      const res = await axios.put<CourseReadDto>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${updatedCourse.id}`,
        updatedCourse
      );
      setCourses(prev =>
        prev.map(c => (c.id === updatedCourse.id ? res.data : c))
      );
      setEditingCourse(null);
      toast.success("Curso atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar curso");
    }
  };

  const handleDetailsCourse = (course: CourseReadDto) => {

    window.location.href = `/courses-coordinator/${course.id}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#163E72]">Cursos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#163E72] text-white px-4 py-2 rounded hover:bg-[#255690]"
        >
          + Criar Curso
        </button>
      </div>

      {showForm && <CourseForm onSave={handleAddCourse} />}

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
              <td className="p-3 flex gap-3">
                <button
                  onClick={() => handleDetailsCourse(course)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Detalhes"
                >
                  <FiEye />
                </button>
                <button
                  onClick={() => handleEditCourse(course)}
                  className="text-green-600 hover:text-green-800"
                  title="Editar"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Excluir"
                >
                  <FiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
