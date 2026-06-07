"use client";

import ProgressBar from "./ProgressBar";

export default function CourseCard({ course }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h3>
      <p className="text-sm text-gray-500 mb-4">Próxima Aula: {course.nextLesson}</p>
      <ProgressBar progress={course.progress} />
      <p className="text-sm text-gray-600 mt-2">{course.progress}% concluído</p>
      <button className="mt-4 w-full bg-[#338B97] text-white py-2 rounded-md hover:bg-[#255690] transition">
        Continuar
      </button>
    </div>
  );
}
