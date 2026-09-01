"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import api from "@/app/services/api";
import { toast } from "react-toastify";
import { StudentDto } from "@/types/interfaces";

import StudentForm from "../../../../components/dashboardCoordinator/students/StudentsForm";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function EditStudentPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [student, setStudent] = useState<StudentDto | null>(null);
  const [loading, setLoading] = useState(true);

  const courseIdParam = searchParams.get("courseId");

  const editingCourseId = courseIdParam
    ? Number(courseIdParam)
    : undefined;

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await api.get<StudentDto>(
          `/users/${id}`
        );


        setStudent(response.data);

      } catch {
        toast.error("Erro ao carregar estudante.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();


  }, [id]);

  if (loading) {
    return (<p className="text-center mt-10">
      Carregando... </p>
    );
  }

  if (!student) {
    return (<p className="text-center mt-10">
      Aluno não encontrado. </p>
    );
  }

  return (<Card className="max-w-lg mx-auto shadow-sm rounded-lg">


    <CardHeader>

      <CardTitle className="text-[#163E72]">
        Editar Estudante
      </CardTitle>

    </CardHeader>

    <CardContent>

      <StudentForm
        student={student}
        editingCourseId={editingCourseId}
        onSave={() =>
          router.push(
            "/dashboard-coordinator/students"
          )
        }
      />

    </CardContent>

  </Card>


  );
}
