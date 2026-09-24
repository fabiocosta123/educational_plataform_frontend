"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import api from "../../services/api";
import type { CourseReadDto } from "../../../types/interfaces";
import CourseDashboard from "./CourseDashboard";

export default function MyCoursesClient() {
  const searchParams = useSearchParams();
  const courseIdFromUrl = searchParams.get("courseId");
  const [courses, setCourses] = useState<CourseReadDto[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(
    courseIdFromUrl ? Number(courseIdFromUrl) : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<CourseReadDto[]>("/Courses/my-courses")
      .then((res) => {
        const list = res.data ?? [];
        setCourses(list);
        setSelectedId((current) => current ?? list[0]?.id ?? null);
      })
      .catch(() => toast.error("Não foi possível carregar seus cursos."))
      .finally(() => setLoading(false));
  }, []);

  const selected = useMemo(
    () => courses.find((course) => course.id === selectedId) ?? null,
    [courses, selectedId]
  );

  if (loading) return <p className="text-gray-600">Carregando cursos...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#163E72]">Meus cursos</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe o progresso da turma e abra o conteúdo de cada curso.
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-600">Nenhum curso atribuído ainda.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {courses.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => setSelectedId(course.id)}
              className={`rounded-lg px-4 py-2 text-sm ${
                selectedId === course.id
                  ? "bg-[#163E72] text-white"
                  : "bg-white text-[#163E72] shadow"
              }`}
            >
              {course.title}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <>
          <div className="bg-white rounded-lg shadow-md p-5">
            <h2 className="text-lg font-bold text-[#163E72]">{selected.title}</h2>
            {selected.description && (
              <p className="text-sm text-gray-600 mt-1">{selected.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {selected.enrolledUsers?.length ?? 0} alunos · {selected.lessonsCount ?? 0} aulas
            </p>
          </div>
          <CourseDashboard courseId={selected.id} />
        </>
      )}
    </div>
  );
}
