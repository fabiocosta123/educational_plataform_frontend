
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/app/services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseDto {
  id: number;
  title: string;
  description: string;
}

export default function CoursePage() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Courses`
        );

        setCourses(response.data);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        setError("Erro ao carregar cursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center font-semibold text-[#163E72]">
            Carregando cursos...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center font-semibold text-red-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-2xl font-bold text-[#163E72] sm:text-3xl lg:text-4xl">
            Cursos Disponíveis
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Conheça nossos cursos e escolha aquele que melhor atende aos
            seus objetivos de estudo.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              Nenhum curso disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="flex h-full flex-col rounded-xl border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-[#163E72]">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="line-clamp-4 text-sm leading-6 text-gray-600 sm:text-base">
                    {course.description || "Descrição não informada."}
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#163E72] text-[#163E72] hover:bg-[#163E72] hover:text-white"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    Detalhes do curso
                  </Button>

                  
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
