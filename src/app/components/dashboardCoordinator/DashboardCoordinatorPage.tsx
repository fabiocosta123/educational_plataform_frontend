"use client";

import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { CoordinatorDashboardDto } from "../../../types/interfaces";
import Card from "../common/Card";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function DashboardCoordinatorPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CoordinatorDashboardDto | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get<CoordinatorDashboardDto>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/coordinator/dashboard`
      );

      setStats(res.data);
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!stats) return <p className="text-center mt-10">Carregando...</p>;

  // Gráfico de alunos por curso
  const courseChartData = {
    labels: stats.courses.map(c => c.title),
    datasets: [
      {
        label: "Alunos por curso",
        data: stats.courses.map(c => c.studentsCount),
        backgroundColor: "#338B97",
      },
    ],
  };

  const courseChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Quantidade de alunos por curso" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
      },
    },
  };

  // Gráfico de próximas aulas
  const nextLessonsChartData = {
    labels: ["Próximas aulas"],
    datasets: [
      {
        label: "Quantidade",
        data: [stats.nextLessonsCount],
        backgroundColor: "#338B97",
      },
    ],
  };

  // Gráfico de progresso médio por curso (pizza)
  const progressChartData = {
    labels: stats.courses.map(c => c.title),
    datasets: [
      {
        label: "Progresso (%)",
        data: stats.courses.map(c => c.progress),
        backgroundColor: ["#163E72", "#338B97", "#F59E0B", "#10B981", "#EF4444"],
      },
    ],
  };

  const progressChartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Progresso médio por curso (%)" },
      legend: { position: "right" as const },
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const chart = elements[0];
        const courseIndex = chart.index;
        const selectedCourse = stats.courses[courseIndex];

        toast.info(
          `📘 ${selectedCourse.title} — Progresso: ${selectedCourse.progress}%`,
          { position: "top-right" }
        );
      }
    }
  };



  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#163E72]">
              Olá, Coord. {user?.name}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">{today}</p>
          </div>
          <div className="mt-4 sm:mt-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#338B97] text-white flex items-center justify-center text-sm sm:text-lg font-bold">
            {user?.name.split(" ").map(n => n[0]).join("")}
          </div>
        </div>

        {/* Cards métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <Card title="Cursos ativos" value={stats.coursesCount} />
          <Card title="Professores" value={stats.teachersCount} />
          <Card title="Alunos matriculados" value={stats.studentsCount} />
          <Card title="Coordenadores" value={stats.coordinatorCount} />
          <Card title="Próximas aulas" value={stats.nextLessonsCount} />
        </div>

        {/* Relatórios */}
        <h2 className="text-lg sm:text-xl font-bold text-[#163E72] mb-4">Relatórios</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Bar data={courseChartData} options={courseChartOptions} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <Bar data={nextLessonsChartData} options={{ responsive: true }} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <Doughnut data={progressChartData} options={progressChartOptions} />
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
