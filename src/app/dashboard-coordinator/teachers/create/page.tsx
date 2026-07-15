"use client";

import TeacherForm from "../TeacherForm";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateTeacherPage() {

  const router = useRouter();
  const handleSave = (teacher: any) => {
    toast.success(`Professor ${teacher.userName} criado com sucesso!`);

    router.push("/dashboard-coordinator/teachers")
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Criar Professor</h1>
      <TeacherForm onSave={handleSave} />
    </div>
  );
}
