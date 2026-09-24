"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const COLORS = ["#66BCA1", "#FF6B6B", "#338B97", "#255690", "#F4B942", "#163E72"];

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export interface CoordinatorReportData {
  avgProgress: number;
  enrollments: {
    total: number;
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  courses: { id: number; title: string; studentsCount: number; progress: number }[];
  financial: {
    totalReceived: number;
    totalPending: number;
    monthlyRevenue: number;
    activeStudents: number;
    paid?: number;
    pending?: number;
    defaultRate?: number;
    message?: string | null;
  };
}

const doughnutOptions = {
  plugins: { legend: { position: "bottom" as const } },
  maintainAspectRatio: false,
};

const percentBarOptions = {
  indexAxis: "y" as const,
  plugins: { legend: { display: false } },
  scales: {
    x: { min: 0, max: 100, ticks: { callback: (v: string | number) => `${v}%` } },
  },
  maintainAspectRatio: false,
};

export default function CoordinatorReports({ data }: { data: CoordinatorReportData }) {
  const courses = data.courses ?? [];
  const avg = Number.isFinite(data.avgProgress) ? data.avgProgress : 0;
  const remaining = Math.max(0, 100 - avg);
  const financial = data.financial;
  const received = Number(financial?.totalReceived ?? 0);
  const pendingAmount = Number(financial?.totalPending ?? 0);
  const monthly = Number(financial?.monthlyRevenue ?? 0);
  const hasFinance = received + pendingAmount + monthly > 0;

  const studentsByCourse = {
    labels: courses.map((c) => c.title),
    datasets: [
      {
        data: courses.map((c) => c.studentsCount),
        backgroundColor: COLORS,
      },
    ],
  };

  const avgProgressChart = {
    labels: ["Concluído", "Restante"],
    datasets: [
      {
        data: [avg, remaining],
        backgroundColor: ["#66BCA1", "#E5E7EB"],
      },
    ],
  };

  const progressByCourse = {
    labels: courses.map((c) => c.title),
    datasets: [
      {
        label: "Progresso médio",
        data: courses.map((c) => c.progress),
        backgroundColor: "#338B97",
      },
    ],
  };

  const financeDoughnut = {
    labels: ["Recebido", "Pendente"],
    datasets: [
      {
        data: [received, pendingAmount],
        backgroundColor: ["#66BCA1", "#FF6B6B"],
      },
    ],
  };

  const financeBars = {
    labels: ["Recebido", "Pendente", "Receita do mês"],
    datasets: [
      {
        label: "R$",
        data: [received, pendingAmount, monthly],
        backgroundColor: ["#66BCA1", "#FF6B6B", "#163E72"],
      },
    ],
  };

  const enrollments = data.enrollments;
  const enrollmentChart = {
    labels: ["Pendentes", "Ativas", "Concluídas", "Canceladas"],
    datasets: [
      {
        data: [
          enrollments?.pending ?? 0,
          enrollments?.active ?? 0,
          enrollments?.completed ?? 0,
          enrollments?.cancelled ?? 0,
        ],
        backgroundColor: ["#F4B942", "#66BCA1", "#338B97", "#FF6B6B"],
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#163E72]">Alunos por curso</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.some((c) => c.studentsCount > 0) ? (
            <div className="h-64">
              <Doughnut data={studentsByCourse} options={doughnutOptions} />
            </div>
          ) : (
            <p className="text-center text-gray-600">Sem matrículas para montar o gráfico.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#163E72]">Progresso médio do aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Doughnut data={avgProgressChart} options={doughnutOptions} />
          </div>
          <p className="text-center text-gray-600 mt-3">{avg}% concluído em média</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm rounded-lg md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#163E72]">
            Progresso médio por curso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length > 0 ? (
            <div className="h-72">
              <Bar data={progressByCourse} options={percentBarOptions} />
            </div>
          ) : (
            <p className="text-center text-gray-600">Nenhum curso cadastrado.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#163E72]">Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          {hasFinance ? (
            <>
              <div className="h-64">
                <Doughnut data={financeDoughnut} options={doughnutOptions} />
              </div>
              <div className="mt-4 space-y-1 text-sm text-gray-700 text-center">
                <p>Recebido: {money(received)}</p>
                <p>Pendente: {money(pendingAmount)}</p>
                <p>Receita do mês: {money(monthly)}</p>
                {financial?.defaultRate != null && (
                  <p>Inadimplência: {Number(financial.defaultRate).toFixed(1)}%</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">
              {financial?.message || "Nenhum dado financeiro encontrado."}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#163E72]">Valores financeiros</CardTitle>
        </CardHeader>
        <CardContent>
          {hasFinance ? (
            <div className="h-64">
              <Bar
                data={financeBars}
                options={{
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (v) =>
                          Number(v).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 0,
                          }),
                      },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          ) : (
            <p className="text-center text-gray-600">Sem valores para exibir no gráfico.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm rounded-lg md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#163E72]">Matrículas</CardTitle>
        </CardHeader>
        <CardContent>
          {(enrollments?.total ?? 0) > 0 ? (
            <div className="h-64 max-w-md mx-auto">
              <Doughnut data={enrollmentChart} options={doughnutOptions} />
            </div>
          ) : (
            <p className="text-center text-gray-600">Nenhuma matrícula cadastrada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
