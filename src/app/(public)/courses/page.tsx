"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
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
        setError("Erro ao carregar cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading)
    return <p className="p-6 text-[#163E72] font-semibold">Carregando cursos...</p>;
  if (error)
    return <p className="p-6 text-red-600 font-semibold">{error}</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-[#163E72]">Cursos Disponíveis</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card key={course.id} className="shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-[#163E72]">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{course.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-[#163E72] hover:bg-[#255690] text-white w-full"
                onClick={() => router.push(`/dashboard-courses/${course.id}/register`)}
              >
                Inscrever
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
