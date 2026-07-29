"use client";

import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { CourseReadDto } from "../../../types/interfaces";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
import CourseForm from "./CourseForm";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import "react-confirm-alert/src/react-confirm-alert.css";
import useSWR, { mutate } from "swr";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoursesCoordinatorPage() {
  const [courses, setCourses] = useState<CourseReadDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseReadDto | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await api.get<CourseReadDto[]>("/courses");
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  const handleAddCourse = (newCourse: CourseReadDto) => {
    setCourses(prev => [...prev, newCourse]);
    setShowForm(false);
  };

  const handleDeleteCourse = (id: number) => {
    confirmAlert({
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir este curso?",
      buttons: [
        {
          label: "Sim",
          onClick: async () => {
            try {
              await api.delete(`/courses/${id}`);
              setCourses(prev => prev.filter(c => c.id !== id));
              toast.success("Curso excluído com sucesso!");
            } catch {
              toast.error("Erro ao excluir curso");
            }
          }
        },
        { label: "Cancelar" }
      ]
    });
  };

  const handleDetailsCourse = (course: CourseReadDto) => {
    router.push(`/dashboard-coordinator/courses/${course.id}/details`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#163E72]">Cursos</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          + Criar Curso
        </Button>
      </div>

      {showForm && <CourseForm onSave={handleAddCourse} />}

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Card key={course.id} className="shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-[#163E72]">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{course.description}</p>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => handleDetailsCourse(course)}
              >
                <FiEye className="mr-1" /> Detalhes
              </Button>
              <Button
                variant="ghost"
                className="text-green-600 hover:text-green-800"
                onClick={() => router.push(`/dashboard-coordinator/courses/${course.id}/edit`)}
              >
                <FiEdit className="mr-1" /> Editar
              </Button>
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-800"
                onClick={() => handleDeleteCourse(course.id)}
              >
                <FiTrash className="mr-1" /> Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
