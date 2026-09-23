"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import TeacherForm from "../../TeacherForm";
import { Button } from "@/components/ui/button";
import type { TeacherReadDto } from "@/types/interfaces";
import api from "@/app/services/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id;

  const { data: teacher, error, isLoading } = useSWR<TeacherReadDto>(
    teacherId ? `/teachers/${teacherId}` : null,
    fetcher
  );

  if (isLoading) {
    return <p className="p-6">Carregando professor...</p>;
  }

  if (error || !teacher) {
    return (
      <div className="p-6">
        <p>Não foi possível carregar o professor.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <Button
        variant="ghost"
        className="mb-4 px-0"
        onClick={() => router.back()}
      >
        ← Voltar
      </Button>

      <TeacherForm
        initialData={{
          id: teacher.id,
          userName: teacher.userName,
          userEmail: teacher.userEmail,
          phoneNumber: teacher.phoneNumber,
          cpf: teacher.cpf,
          birthDate: teacher.birthDate,
        }}
        onSave={() => {
          router.push(`/dashboard-coordinator/teachers/${teacher.id}/details`);
        }}
      />
    </div>
  );
}
