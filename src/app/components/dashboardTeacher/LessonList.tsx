"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Lesson {
  id: number;
  title: string;
  description: string;
  date?: string;
  videoUrl?: string;
  pdfMaterial?: string;
}

interface LessonListProps {
  lessons?: Lesson[]; 
}

export default function LessonList({ lessons: propLessons }: LessonListProps) {
  const [lessons, setLessons] = useState<Lesson[]>(propLessons || []);
  const [loading, setLoading] = useState(!propLessons); 

  useEffect(() => {
    if (!propLessons) {
      const fetchLessons = async () => {
        try {
          const response = await axios.get<Lesson[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/Lessons`
          );
          setLessons(response.data);
          toast.success("Aulas carregadas com sucesso!");
        } catch {
          toast.error("Erro ao carregar aulas");
        } finally {
          setLoading(false);
        }
      };

      fetchLessons();
    }
  }, [propLessons]);

  if (loading) {
    return <p className="text-center text-gray-600 mt-4">Carregando aulas...</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-[#163E72] mb-4">Lista de Aulas</h3>
      <ul className="list-disc list-inside text-gray-700">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="mb-4 bg-white p-4 rounded-lg shadow-md">
            <strong className="text-[#163E72]">{lesson.title}</strong>
            <p className="text-gray-600">{lesson.description}</p>

            {lesson.date && (
              <span className="block text-sm text-gray-500 mt-1">
                Data: {new Date(lesson.date).toLocaleDateString("pt-BR")}
              </span>
            )}

            {lesson.videoUrl && (
              <span className="block text-sm text-[#66BCA1] mt-1">
                Vídeo:{" "}
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#255690]"
                >
                  Assistir
                </a>
              </span>
            )}

            {lesson.pdfMaterial && (
              <span className="block text-sm text-gray-500 mt-1">
                Material: {lesson.pdfMaterial}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
