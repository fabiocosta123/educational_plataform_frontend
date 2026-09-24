"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "../../hooks/useAuth";

interface CourseDto {
  id: number;
  title: string;
  description: string;
}

export default function AvailableCoursesPage() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await api.get<CourseDto[]>("/Courses");
        setCourses(response.data);
      } catch {
        setError("Erro ao carregar cursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <p className="text-center font-semibold text-[#163E72]">Carregando cursos...</p>;
  }

  if (error) {
    return <p className="text-center font-semibold text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#163E72] sm:text-3xl">Cursos disponíveis</h1>
      <p className="mt-3 max-w-2xl text-sm text-gray-600 mb-8">
        Escolhe um curso para ver detalhes. 
      </p>

      {courses.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">Nenhum curso disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex h-full flex-col rounded-xl border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-[#163E72]">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-4 text-sm leading-6 text-gray-600">
                  {course.description || "Descrição não informada."}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#163E72] text-[#163E72] hover:bg-[#163E72] hover:text-white"
                  onClick={() => router.push(`/dashboard-student/available-courses/${course.id}`)}
                >
                  Detalhes do curso
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
