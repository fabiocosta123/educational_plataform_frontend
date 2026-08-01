"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  return (
    <Card className="shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-[#163E72]">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{course.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="bg-[#163E72] hover:bg-[#255690] text-white w-full"
          onClick={() => router.push(`/dashboard-coordinator/courses/${course.id}/register`)}
        >
          Inscrever
        </Button>
      </CardFooter>
    </Card>
  );
}
