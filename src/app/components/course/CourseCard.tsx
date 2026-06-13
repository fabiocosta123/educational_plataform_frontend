"use client";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  const handleEnroll = () => {
    router.push(`/purchase?courseId=${course.id}`);
  };

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#163E72] mb-2">{course.title}</h2>
        <p className="text-gray-600">{course.description}</p>
      </div>
      <button
        onClick={handleEnroll}
        className="mt-4 bg-[#338B97] text-white px-4 py-2 rounded-lg hover:bg-[#255690] transition"
      >
        Inscreva-se
      </button>
    </div>
  );
}
