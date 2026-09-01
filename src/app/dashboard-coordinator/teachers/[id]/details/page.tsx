"use client";

import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeacherReadDto } from "../../../../../types/interfaces";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function TeacherDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const teacherId = params.id;

  const { data: teacher, error, isLoading } = useSWR<TeacherReadDto>(
    teacherId ? `/teachers/${teacherId}` : null,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <p>Carregando professor...</p>
      </div>
    );
  }

  if (error) {
    toast.error("Erro ao carregar os dados do professor.");

    return (
      <div className="p-6 text-center">
        <p className="text-red-600">
          Não foi possível carregar os dados do professor.
        </p>

        <Button
          className="mt-4"
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-6 text-center">
        <p>Professor não encontrado.</p>

        <Button
          className="mt-4"
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </div>
    );
  }

  const cursos = teacher.courses ?? [];

  const totalCursos = cursos.length;

  const totalAulas = cursos.reduce(
    (total, course) => total + (course.lessonsCount ?? 0),
    0
  );

  const totalAlunos = cursos.reduce(
    (total, course) =>
      total + (course.enrolledUsers?.length ?? 0),
    0
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2 px-0"
          >
            ← Voltar
          </Button>

          <h1 className="text-2xl font-bold text-[#163E72]">
            {teacher.userName}
          </h1>

          <p className="text-sm text-gray-500">
            Professor
          </p>
        </div>

      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <DashboardCard
          title="Cursos"
          value={totalCursos}
        />

        <DashboardCard
          title="Aulas"
          value={totalAulas}
        />

        <DashboardCard
          title="Alunos"
          value={totalAlunos}
        />

      </div>

      {/* Cursos */}
      <Card>

        <CardHeader>
          <CardTitle className="text-[#163E72]">
            Cursos do professor
          </CardTitle>
        </CardHeader>

        <CardContent>

          {cursos.length === 0 ? (

            <div className="text-center py-8 text-gray-500">
              Este professor ainda não possui cursos.
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {cursos.map((course) => (

                <Card
                  key={course.id}
                  className="border shadow-sm"
                >

                  <CardHeader>
                    <CardTitle className="text-lg">
                      {course.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">

                    {course.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {course.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-sm">

                      <div className="rounded-md bg-gray-50 p-3">
                        <p className="text-gray-500">
                          Aulas
                        </p>

                        <p className="font-semibold">
                          {course.lessonsCount ?? 0}
                        </p>
                      </div>

                      <div className="rounded-md bg-gray-50 p-3">
                        <p className="text-gray-500">
                          Alunos
                        </p>

                        <p className="font-semibold">
                          {course.enrolledUsers?.length ?? 0}
                        </p>
                      </div>

                    </div>

                    <Button
                      className="w-full bg-[#163E72]"
                      onClick={() =>
                        router.push(
                          `/dashboard-coordinator/courses/${course.id}/details`
                        )
                      }
                    >
                      Abrir curso
                    </Button>

                  </CardContent>

                </Card>

              ))}

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <Card className="text-center shadow-sm">

      <CardContent className="py-6">

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="text-2xl font-bold text-[#163E72] mt-1">
          {value}
        </p>

      </CardContent>

    </Card>
  );
}