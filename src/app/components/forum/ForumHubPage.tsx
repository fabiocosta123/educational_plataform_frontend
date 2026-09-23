"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { MessageSquare } from "lucide-react";

import api from "@/app/services/api";
import { getForumErrorMessage } from "@/app/services/forumService";
import { useAuth } from "@/app/hooks/useAuth";
import type { CourseReadDto, Enrollment } from "@/types/interfaces";
import { forumCoursePath } from "./forumPaths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ForumHubMode = "all" | "teaching" | "enrolled";

interface ForumHubPageProps {
  basePath: string;
  mode: ForumHubMode;
}

interface ForumCourseOption {
  id: number;
  title: string;
}

export default function ForumHubPage({ basePath, mode }: ForumHubPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<ForumCourseOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    async function loadCourses() {
      try {
        setLoading(true);

        if (mode === "enrolled") {
          const response = await api.get<Enrollment[]>(
            `/CoursesEnrollment?userId=${user!.id}`
          );
          const uniqueCourses = new Map<number, ForumCourseOption>();

          for (const enrollment of response.data) {
            if (!uniqueCourses.has(enrollment.courseId)) {
              uniqueCourses.set(enrollment.courseId, {
                id: enrollment.courseId,
                title: enrollment.courseTitle,
              });
            }
          }

          setCourses(Array.from(uniqueCourses.values()));
          return;
        }

        const path = mode === "teaching" ? "/courses/my-courses" : "/courses";
        const response = await api.get<CourseReadDto[]>(path);
        setCourses(
          response.data.map((course) => ({
            id: course.id,
            title: course.title,
          }))
        );
      } catch (error) {
        toast.error(
          getForumErrorMessage(error, "Não foi possível carregar os cursos.")
        );
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [authLoading, mode, user]);

  if (authLoading || loading) {
    return <p className="text-gray-600">Carregando fórum...</p>;
  }

  if (!user) {
    return <p className="text-gray-600">Faça login para acessar o fórum.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#163E72]">Fórum</h1>
        <p className="text-gray-600 mt-1">
          Escolha um curso para ver as dúvidas e respostas.
        </p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-600">
            Nenhum curso disponível para o fórum.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="text-[#163E72]">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="bg-[#163E72] hover:bg-[#255690]">
                  <Link href={forumCoursePath(basePath, course.id)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Abrir fórum
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
