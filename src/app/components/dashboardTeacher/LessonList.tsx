"use client";

interface Lesson {
  id: number;
  title: string;
  description: string;
  date?: string;
  videoUrl?: string;
  pdfMaterial?: string;
}

export default function LessonList({ lessons }: { lessons: Lesson[] }) {
  return (
    <ul className="mt-4 list-disc list-inside text-gray-700">
      {lessons.map((lesson) => (
        <li key={lesson.id} className="mb-2">
          <strong>{lesson.title}</strong> - {lesson.description}
          {lesson.date && (
            <span className="block text-sm text-gray-500">Data: {lesson.date}</span>
          )}
          {lesson.videoUrl && (
            <span className="block text-sm text-[#66BCA1]">
              Vídeo: <a href={lesson.videoUrl}>{lesson.videoUrl}</a>
            </span>
          )}
          {lesson.pdfMaterial && (
            <span className="block text-sm text-gray-500">
              Material: {lesson.pdfMaterial}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
