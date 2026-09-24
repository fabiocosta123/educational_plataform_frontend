"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../services/api";
import { CourseModuleReadDto, LessonReadDto } from "../../../../types/interfaces";

interface ProgressItem {
  lessonId: number;
  completed: boolean;
}

function formatDuration(seconds: number) {
  if (!seconds) return "";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} min`;
}

export default function StudentCoursePage() {
  const params = useParams();
  const courseId = Number(params.id);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [modules, setModules] = useState<CourseModuleReadDto[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [title, setTitle] = useState("Curso");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!courseId) return;

    const load = async () => {
      try {
        const [modulesRes, progressRes, courseRes] = await Promise.all([
          api.get<CourseModuleReadDto[]>(`/CourseModules/course/${courseId}`),
          api.get<ProgressItem[]>(`/LessonProgress/course/${courseId}`),
          api.get(`/Courses/${courseId}`).catch(() => null),
        ]);
        setModules(modulesRes.data);
        setProgress(progressRes.data);
        if (courseRes?.data?.title) setTitle(courseRes.data.title);
      } catch {
        toast.error("Não foi possível abrir este curso. Confirma se a matrícula está ativa.");
      }
    };

    load();
  }, [user, loading, courseId, router]);

  const completedIds = useMemo(
    () => new Set(progress.filter((p) => p.completed).map((p) => p.lessonId)),
    [progress]
  );

  const publishedModules = modules
    .map((module) => ({
      ...module,
      lessons: (module.lessons ?? []).filter((lesson) => lesson.isPublished).sort((a, b) => a.order - b.order),
    }))
    .filter((module) => module.lessons.length > 0)
    .sort((a, b) => a.order - b.order);

  if (loading || !user) return <p className="text-gray-600">Carregando...</p>;

  return (
    <div>
      <Link href="/dashboard-student" className="text-[#338B97] text-sm">
        ← Voltar aos meus cursos
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-6">
        <h1 className="text-2xl font-bold text-[#163E72]">{title}</h1>
        <Link
          href={`/dashboard-student/courses/${courseId}/forum`}
          className="bg-[#163E72] text-white px-4 py-2 rounded-lg text-center"
        >
          Fórum do curso
        </Link>
      </div>

      {publishedModules.length === 0 && (
        <p className="text-gray-600">Ainda não há aulas publicadas neste curso.</p>
      )}

      <div className="space-y-6">
        {publishedModules.map((module) => (
          <section key={module.id} className="bg-white rounded-lg shadow-md p-5">
            <h2 className="text-lg font-semibold text-[#163E72] mb-3">{module.name}</h2>
            {module.description && <p className="text-sm text-gray-600 mb-4">{module.description}</p>}
            <ul className="space-y-2">
              {module.lessons.map((lesson: LessonReadDto) => {
                const done = completedIds.has(lesson.id);
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/dashboard-student/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center justify-between gap-3 border rounded-lg px-4 py-3 hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-[#163E72]">{lesson.title}</p>
                        <p className="text-xs text-gray-500">{formatDuration(lesson.durationSeconds)}</p>
                      </div>
                      <span className={`text-xs font-semibold ${done ? "text-green-700" : "text-gray-500"}`}>
                        {done ? "Concluída" : "Abrir"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
