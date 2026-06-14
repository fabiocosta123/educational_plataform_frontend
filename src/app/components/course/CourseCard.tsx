import axios from "axios";
import { toast } from "react-toastify";
import { Course, User } from "../../../types/interfaces"

interface CourseCardProps {
  course: Course,
  user: User;
}

export default function CourseCard({ course, user }: CourseCardProps) {
  const handleEnroll = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/CoursesEnrollment`, {
        userId: user.id,   
        courseId: course.id,
      });
      toast.success("Inscrição realizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao realizar inscrição");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-[#163E72] mb-2">{course.title}</h2>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <button
        onClick={handleEnroll}
        className="bg-[#338B97] text-white px-4 py-2 rounded-lg hover:bg-[#255690] transition"
      >
        Inscreva-se
      </button>
    </div>
  );
}
