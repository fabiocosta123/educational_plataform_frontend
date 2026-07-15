"use client";

import StudentForm from "../../../components/dashboardCoordinator/students/StudentsForm";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateStudentPage() {
  const router = useRouter();

  const handleSave = (student: any) => {
    toast.success(`Aluno ${student.userName} criado com sucesso!`);
    router.push("/dashboard-coordinator/students");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Criar Estudante</h1>
      <StudentForm onSave={handleSave} />
    </div>
  );
}
