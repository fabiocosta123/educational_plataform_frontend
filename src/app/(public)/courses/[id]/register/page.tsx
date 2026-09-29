
"use client";

import { useParams } from "next/navigation";
import RegisterForm from "@/app/components/register/RegisterForm";

export default function CourseRegisterPage() {
  const params = useParams();

  const courseId = Number(params.id);

  if (!courseId || Number.isNaN(courseId)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-600">
          Curso inválido.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#163E72]">
            Inscrição no curso
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            A 1ª parcela de R$ 69,90 é paga agora via PIX e libera o curso.
            As outras 11 vencem a cada 30 dias.
          </p>
        </div>

        <RegisterForm courseId={courseId} />
      </div>
    </main>
  );
}
