"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CoordinatorReports({ data }: { data: any }) {
  const studentsByCourse = {
    labels: data.courses?.map((c: any) => c.title) || [],
    datasets: [
      {
        data: data.courses?.map((c: any) => c.studentsCount) || [],
        backgroundColor: ["#66BCA1", "#FF6B6B", "#338B97", "#255690"],
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Distribuição de alunos por curso */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-[#163E72] mb-4">Alunos por Curso</h3>
        <div className="w-64 h-64">
          <Doughnut data={studentsByCourse} options={{ plugins: { legend: { position: "bottom" } } }} />
        </div>
      </div>

      {/* Progresso médio dos cursos */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-[#163E72] mb-4">Progresso Médio</h3>
        <p className="text-gray-600 text-center">
          {data.avgProgress ? `${data.avgProgress}% concluído em média` : "Sem dados disponíveis"}
        </p>
      </div>
    </div>
  );
}
