"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";
import QuickActions from "./QuickActions";

interface CourseDto {
  id: number;
  title: string;
  description: string;
  progress?: number;
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data);
      } catch (err) {
        setError("Erro ao carregar cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Carregando cursos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Meus Cursos</h1>
      <QuickActions />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </main>
  );
}

