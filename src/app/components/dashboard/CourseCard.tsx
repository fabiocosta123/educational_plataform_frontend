import ProgressBar from "./ProgressBar";

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
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-[#163E72]">{course.title}</h2>
      <p className="text-gray-600 mt-2">{course.description}</p>

      {course.progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#338B97] h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {course.progress}% concluído
          </p>
        </div>
      )}
    </div>
  );
}
