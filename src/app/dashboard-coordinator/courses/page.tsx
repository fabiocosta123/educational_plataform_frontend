"use client";

import { useEffect, useState } from "react";
import { CourseReadDto } from "../../../types/interfaces";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
import CourseForm from "./CourseForm";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "../../services/api";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CoursesCoordinatorPage() {
  const [courses, setCourses] = useState<CourseReadDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get<CourseReadDto[]>("/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        toast.error("Erro ao carregar cursos.");
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = (newCourse: CourseReadDto) => {
    setCourses((prev) => [...prev, newCourse]);
    setShowForm(false);
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      await api.delete(`/courses/${id}`);

      setCourses((prev) =>
        prev.filter((course) => course.id !== id)
      );

      toast.success("Curso excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      toast.error("Erro ao excluir curso.");
    }
  };

  const handleDetailsCourse = (course: CourseReadDto) => {
    router.push(
      `/dashboard-coordinator/courses/${course.id}/details`
    );
  };

  // 🔹 Filtro pelo termo de busca
  const filteredCourses = courses.filter((course) =>
    course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 🔹 Mostrar apenas 6 cursos se não expandido
  const visibleCourses = showAll
    ? filteredCourses
    : filteredCourses.slice(0, 6);

  // ============================================================
  // MÉTRICAS
  // ============================================================

  // Cursos que possuem pelo menos uma aula
  const coursesWithContent = courses.filter(
    (course) =>
      course.modules?.some(
        (module) => module.lessons?.length > 0
      )
  );

  // Cursos que ainda não possuem aulas
  const coursesWithoutContent = courses.filter(
    (course) =>
      !course.modules?.some(
        (module) => module.lessons?.length > 0
      )
  );

  // Total de aulas de todos os cursos
  const totalLessons = courses.reduce(
    (total, course) =>
      total +
      (course.modules?.reduce(
        (moduleTotal, module) =>
          moduleTotal + (module.lessons?.length ?? 0),
        0
      ) ?? 0),
    0
  );

  // Total de alunos únicos inscritos
  const totalStudents = new Set(
    courses.flatMap(
      (course) =>
        course.enrolledUsers?.map(
          (student) => student.id
        ) ?? []
    )
  ).size;

  return (
    <div className="p-6 space-y-6">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Buscar curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 border-gray-300"
        />

        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#163E72] text-white hover:bg-[#255690]"
        >
          + Criar Curso
        </Button>
      </div>

      {/* ====================================================== */}
      {/* CARDS DE MÉTRICAS */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">

        {/* Total de cursos */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">
              Total de Cursos
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {courses.length}
            </p>
          </CardContent>
        </Card>

        {/* Alunos inscritos */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">
              Alunos Inscritos
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {totalStudents}
            </p>
          </CardContent>
        </Card>

        {/* Cursos com conteúdo */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-700">
              Com Conteúdo
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {coursesWithContent.length}
            </p>
          </CardContent>
        </Card>

        {/* Cursos sem conteúdo */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">
              Sem Conteúdo
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {coursesWithoutContent.length}
            </p>
          </CardContent>
        </Card>

        {/* Total de aulas */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-700">
              Total de Aulas
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {totalLessons}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* ====================================================== */}
      {/* FORMULÁRIO DE CURSO */}
      {/* ====================================================== */}

      {showForm && (
        <CourseForm onSave={handleAddCourse} />
      )}

      {/* ====================================================== */}
      {/* GRID DE CURSOS */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {visibleCourses.map((course) => (
          <Card
            key={course.id}
            className="shadow-sm rounded-lg flex flex-col justify-between"
          >

            <div>

              <CardHeader>
                <CardTitle className="text-[#163E72]">
                  {course.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600">
                  {course.description}
                </p>
              </CardContent>

            </div>

            <CardFooter className="flex gap-3 border-t pt-3">

              {/* Detalhes */}
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                onClick={() =>
                  handleDetailsCourse(course)
                }
              >
                <FiEye />
                Detalhes
              </Button>

              {/* Editar */}
              <Button
                variant="ghost"
                className="text-green-600 hover:text-green-800 flex items-center gap-1"
                onClick={() =>
                  router.push(
                    `/dashboard-coordinator/courses/${course.id}/edit`
                  )
                }
              >
                <FiEdit />
                Editar
              </Button>

              {/* Excluir */}
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                onClick={() =>
                  handleDeleteCourse(course.id)
                }
              >
                <FiTrash />
                Excluir
              </Button>

            </CardFooter>

          </Card>
        ))}

      </div>

      {/* ====================================================== */}
      {/* MOSTRAR MAIS */}
      {/* ====================================================== */}

      {filteredCourses.length > 6 && (
        <div className="flex justify-center mt-6">

          <Button
            variant="outline"
            className="border-gray-300"
            onClick={() =>
              setShowAll(!showAll)
            }
          >
            {showAll
              ? "Mostrar menos"
              : "Mostrar mais"}
          </Button>

        </div>
      )}

    </div>
  );
}