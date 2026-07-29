"use client";

import useSWR from "swr";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { TeacherReadDto } from "../../../types/interfaces";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function TeachersPage() {
  const router = useRouter();
  const { data: teachers, error, isLoading } = useSWR<TeacherReadDto[]>("/teachers", fetcher);

  if (isLoading) return <p className="text-center mt-10">Carregando...</p>;
  if (error) {
    toast.error("Erro ao carregar professores");
    return null;
  }

  const totalProfessores = teachers?.length ?? 0;
  const totalCursos = teachers?.reduce((acc, t) => acc + t.courses.length, 0) ?? 0;
  const totalAulas = teachers?.reduce(
    (acc, t) => acc + t.courses.reduce((cAcc, c) => cAcc + c.lessonsCount, 0),
    0
  ) ?? 0;
  const totalAlunos = teachers?.reduce(
    (acc, t) => acc + t.courses.reduce((cAcc, c) => cAcc + (c.enrolledUsers?.length ?? 0), 0),
    0
  ) ?? 0;

  return (
    <div className="p-4 sm:p-6">
      {/* Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Professores" value={totalProfessores} />
        <DashboardCard title="Cursos" value={totalCursos} />
        <DashboardCard title="Aulas" value={totalAulas} />
        <DashboardCard title="Alunos Matriculados" value={totalAlunos} />
      </div>

      {/* Header com botão */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#163E72]">Professores</h1>
        <Button onClick={() => router.push("/dashboard-coordinator/teachers/create")} className="bg-[#163E72]">
          Criar Professor
        </Button>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers?.map((teacher) => {
          const aulas = teacher.courses.reduce((acc, c) => acc + c.lessonsCount, 0);
          const alunos = teacher.courses.reduce((acc, c) => acc + (c.enrolledUsers?.length ?? 0), 0);

          return (
            <Card key={teacher.id} className="shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-[#163E72]">{teacher.userName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Cursos:</strong> {teacher.courses.length}</p>
                <p><strong>Total de aulas:</strong> {aulas}</p>
                <p><strong>Total de alunos:</strong> {alunos}</p>
                <div>
                  <strong>Lista de cursos:</strong>
                  <ul className="list-disc pl-5 text-sm">
                    {teacher.courses.map((course) => (
                      <li key={course.id}>
                        {course.title} ({course.lessonsCount} aulas, {course.enrolledUsers?.length ?? 0} alunos)
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" onClick={() => router.push(`/dashboard-coordinator/teachers/${teacher.id}/details`)}>
                  Detalhes
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="text-center">
      <CardContent>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg sm:text-xl font-bold text-[#163E72]">{value}</p>
      </CardContent>
    </Card>
  );
}
