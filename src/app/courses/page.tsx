"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../components/dashboard/CourseCard";


interface CourseDto {
    id: number;
    title: string;
    description: string;
}

export default function CoursePage() {
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/Courses`);
                setCourses(response.data)

            } catch (error) {
                setError("Erro ao carregar cursos");
            }
            finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, [])

    if (loading) return <p className="p-6">Carregando cursos...</p>;
    if (error) return <p className="p-6 text-red-600">{error}</p>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-[#163E72]">Cursos Disponíveis</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </main>
    );
} 