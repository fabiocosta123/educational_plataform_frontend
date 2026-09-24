"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

interface AssessmentItem {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  description?: string;
  type: string;
  passingScore: number;
  bestScore?: number | null;
  attemptsCount: number;
  maxAttempts?: number | null;
  canStart: boolean;
  blockReason?: string | null;
  activitiesCompleted?: number;
  activitiesTotal?: number;
  inProgress?: boolean;
}

export default function StudentAssessmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<AssessmentItem[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    api
      .get<AssessmentItem[]>("/Assessments/mine")
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Não foi possível carregar atividades e provas."));
  }, [user, loading, router]);

  if (loading || !user) return <p>Carregando...</p>;

  const activities = items.filter((item) => item.type !== "Exam");
  const exams = items.filter((item) => item.type === "Exam");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#163E72] mb-2">Atividades e provas</h1>
      <p className="text-gray-600 mb-6">
        A prova exige 90% das atividades concluídas (com pelo menos 70%), tem no máximo 3 tentativas e nota mínima de 70%.
      </p>

      <Section title="Atividades" rows={activities} exam={false} />
      <Section title="Provas" rows={exams} exam />
    </div>
  );
}

function Section({ title, rows, exam }: { title: string; rows: AssessmentItem[]; exam: boolean }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-[#163E72] mb-3">{title}</h2>
      {rows.length === 0 && <p className="text-gray-600 text-sm">Nada publicado ainda.</p>}
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between gap-4">
            <div>
              <p className="font-semibold text-[#163E72]">{row.title}</p>
              <p className="text-sm text-gray-600">{row.courseTitle}</p>
              {row.bestScore != null && (
                <p className="text-sm text-gray-500">Melhor nota: {row.bestScore}%</p>
              )}
              {exam && (
                <p className="text-sm text-gray-500">
                  Tentativas: {row.attemptsCount}/{row.maxAttempts ?? 3}
                </p>
              )}
              {exam && !row.canStart && !row.inProgress && (
                <p className="text-sm text-amber-700 mt-1">{row.blockReason}</p>
              )}
            </div>
            {exam && !row.canStart && !row.inProgress ? (
              <span className="text-sm text-gray-500 h-fit">Bloqueada</span>
            ) : (
              <Link
                href={`/dashboard-student/assessments/${row.id}`}
                className="bg-[#338B97] text-white px-4 py-2 rounded h-fit"
              >
                {row.inProgress ? "Continuar prova" : exam ? "Iniciar prova" : row.attemptsCount > 0 ? "Refazer" : "Responder"}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
