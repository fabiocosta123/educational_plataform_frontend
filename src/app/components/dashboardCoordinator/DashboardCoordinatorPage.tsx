"use client";

import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardCoordinatorPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/coordinator/dashboard`);
      setStats(res.data);
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#163E72]">Olá, Coord. {user?.name}</h1>
            <p className="text-gray-600">{today}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#338B97] text-white flex items-center justify-center text-lg font-bold">
            {user?.name.split(" ").map(n => n[0]).join("")}
          </div>
        </div>

        {/* Cards métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card title="Cursos ativos" value={stats.coursesCount} />
          <Card title="Professores" value={stats.teachersCount} />
          <Card title="Alunos matriculados" value={stats.studentsCount} />
          <Card title="Próximas aulas" value={stats.nextLessonsCount} />
        </div>

        {/* Relatórios */}
        <h2 className="text-xl font-bold text-[#163E72] mb-4">Relatórios</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Aqui entram gráficos com Chart.js */}
        </div>
      </main>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <span className="text-2xl font-bold text-[#163E72]">{value}</span>
      <span className="text-gray-600">{title}</span>
    </div>
  );
}
