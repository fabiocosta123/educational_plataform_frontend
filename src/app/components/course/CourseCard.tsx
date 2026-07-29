import { toast } from "react-toastify";
import { Course, User } from "../../../types/interfaces";
import api from "@/app/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
  user: User;
}

export default function CourseCard({ course, user }: CourseCardProps) {
  const handleEnroll = async () => {
    try {
      await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/CoursesEnrollment`, {
        userId: user.id,
        courseId: course.id,
      });
      toast.success("Inscrição realizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao realizar inscrição");
    }
  };

  return (
    <Card className="shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#163E72]">
          {course.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <Button onClick={handleEnroll} className="bg-[#338B97] hover:bg-[#255690]">
          Inscreva-se
        </Button>
      </CardContent>
    </Card>
  );
}
