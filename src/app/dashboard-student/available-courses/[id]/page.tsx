"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../hooks/useAuth";

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

export default function AvailableCourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<CourseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const courseId = params.id;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!courseId) return;

    api
      .get<CourseDto>(`/Courses/${courseId}`)
      .then((response) => setCourse(response.data))
      .finally(() => setLoading(false));
  }, [user, authLoading, courseId, router]);

  if (authLoading || loading || !course) {
    return <p className="text-center font-semibold text-[#163E72]">Carregando curso...</p>;
  }

  const modules = [...(course.modules ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Button type="button" variant="ghost" className="text-[#163E72]" onClick={() => router.push("/dashboard-student/available-courses")}>
        ← Voltar para cursos disponíveis
      </Button>

      <Card>
        <CardHeader className="bg-gradient-to-br from-[#163E72] via-[#255690] to-[#338B97] text-white">
          <CardTitle className="text-2xl">{course.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <p className="whitespace-pre-line text-gray-600">{course.description || "Descrição não informada."}</p>
          {course.teacherName && <p className="font-semibold text-gray-800">Professor: {course.teacherName}</p>}
        </CardContent>
      </Card>

      {modules.map((module, index) => (
        <Card key={module.id}>
          <CardHeader>
            <CardTitle className="text-lg text-[#163E72]">
              Módulo {index + 1}: {module.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(module.lessons ?? []).map((lesson, lessonIndex) => (
              <div key={lesson.id} className="rounded-lg border bg-gray-50 p-4">
                <p className="font-medium">{lessonIndex + 1}. {lesson.title}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        className="bg-[#163E72] text-white hover:bg-[#255690]"
        onClick={() => router.push(`/courses/${course.id}/register`)}
      >
        Inscrever-se neste curso
      </Button>
    </div>
  );
}
