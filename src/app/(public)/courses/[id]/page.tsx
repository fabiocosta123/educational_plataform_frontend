
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/app/services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LessonDto {
  id: number;
  title: string;
  description?: string | null;
}

interface ModuleDto {
  id: number;
  name: string;
  description?: string | null;
  order: number;
  isPublished: boolean;
  lessons: LessonDto[];
}

interface CourseDto {
  id: number;
  title: string;
  description?: string | null;
  teacherName?: string | null;
  lessonsCount?: number;
  modules?: ModuleDto[];
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<CourseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseId = params.id;

  useEffect(() => {
    if (!courseId) {
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Courses/${courseId}`
        );

        setCourse(response.data);
      } catch (error) {
        console.error("Erro ao carregar curso:", error);
        setError("Não foi possível carregar os dados do curso.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-center font-semibold text-[#163E72]">
            Carregando curso...
          </p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="font-semibold text-red-600">
                {error || "Curso não encontrado."}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-6 border-[#163E72] text-[#163E72]"
                onClick={() => router.push("/courses")}
              >
                Voltar para cursos
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const modules = [...(course.modules ?? [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Cabeçalho do curso */}
        <Card className="overflow-hidden rounded-xl border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-br from-[#163E72] via-[#255690] to-[#338B97] p-6 text-white sm:p-8">
            <p className="mb-2 text-sm font-medium text-white/80">
              Curso
            </p>

            <CardTitle className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              {course.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 p-5 sm:p-8">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-[#163E72]">
                Sobre o curso
              </h2>

              <p className="whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
                {course.description || "Descrição não informada."}
              </p>
            </div>

            {course.teacherName && (
              <div>
                <p className="text-sm text-gray-500">
                  Professor
                </p>

                <p className="font-semibold text-gray-800">
                  {course.teacherName}
                </p>
              </div>
            )}

            {typeof course.lessonsCount === "number" && (
              <div>
                <p className="text-sm text-gray-500">
                  Conteúdo
                </p>

                <p className="font-semibold text-gray-800">
                  {course.lessonsCount}{" "}
                  {course.lessonsCount === 1 ? "aula" : "aulas"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conteúdo */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#163E72] sm:text-2xl">
              Conteúdo do curso
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Conheça a estrutura do curso antes de realizar sua inscrição.
            </p>
          </div>

          {modules.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">
                  O conteúdo deste curso ainda está sendo preparado.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {modules.map((module, index) => {
                const lessons = [...(module.lessons ?? [])].sort(
                  (a, b) => a.id - b.id
                );

                return (
                  <Card
                    key={module.id}
                    className="rounded-xl border-gray-200 shadow-sm"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-[#163E72] sm:text-xl">
                        Módulo {index + 1}: {module.name}
                      </CardTitle>

                      {module.description && (
                        <p className="text-sm leading-6 text-gray-600">
                          {module.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent>
                      {lessons.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Este módulo ainda não possui aulas.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="rounded-lg border bg-gray-50 p-4"
                            >
                              <p className="font-medium text-gray-800">
                                {lessonIndex + 1}. {lesson.title}
                              </p>

                              {lesson.description && (
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Ação */}
        <Card className="rounded-xl border-[#338B97]/30 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-[#163E72]">
                Gostou do curso?
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Faça sua inscrição e comece sua jornada de estudos.
              </p>
            </div>

            <Button
              type="button"
              className="w-full bg-[#163E72] px-8 text-white hover:bg-[#255690] sm:w-auto"
              onClick={() => router.push(`/courses/${course.id}/register`)}
            >
              Inscrever-se neste curso
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="text-[#163E72] hover:bg-gray-100"
              onClick={() => router.push("/courses")}
            >
              Voltar para cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

