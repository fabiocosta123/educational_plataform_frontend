"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ModuleCard from "@/app/components/dashboardTeacher/ModuleCard";

interface Lesson {
  id: number;
  title: string;
  content: string;
  courseId: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export default function ModulesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesAndLessons = async () => {
      try {
        const coursesResponse = await axios.get<Course[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Courses`
        );

        const coursesWithLessons = await Promise.all(
          coursesResponse.data.map(async (course) => {
            const lessonsResponse = await axios.get<Lesson[]>(
              `${process.env.NEXT_PUBLIC_API_URL}/api/Lessons?courseId=${course.id}`
            );
            return { ...course, lessons: lessonsResponse.data };
          })
        );

        setCourses(coursesWithLessons);
      } catch (error) {
        console.error("Erro ao carregar cursos e aulas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndLessons();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-600">Carregando módulos...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#163E72] mb-6">Gerenciar Módulos</h1>
      {courses.map((course) => (
        <ModuleCard
          key={course.id}
          module={course}
          courseId={course.id}
          setCourses={setCourses}
        />
      ))}
    </div>
  );
}
