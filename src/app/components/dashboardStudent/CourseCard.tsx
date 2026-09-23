import { FaBookOpen } from "react-icons/fa";

interface Course {
  id: number;
  title: string;
  description: string;
  progress?: number;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
      {/* Cabeçalho do card */}
      <div className="flex items-center gap-3 mb-4 text-[#163E72]">
        <FaBookOpen className="text-2xl" />
        <h2 className="text-lg font-semibold">{course.title}</h2>
      </div>

      {/* Descrição */}
      <p className="text-gray-600 mb-4">{course.description}</p>

      {/* Barra de progresso */}
      {course.progress !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#66BCA1] h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {course.progress}% concluído
          </p>
        </div>
      )}

      {/* Botão de ação */}
      <button className="mt-6 w-full bg-[#163E72] text-white py-2 rounded-lg hover:bg-[#255690] transition">
        Ver Detalhes
      </button>
    </div>
  );
}
