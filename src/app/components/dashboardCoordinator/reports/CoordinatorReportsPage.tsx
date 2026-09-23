"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import type {
  CoordinatorReportsDto,
} from "@/types/interfaces";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = {
  primary: "#163E72",
  secondary: "#338B97",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  blue: "#2563EB",
  lightBlue: "#60A5FA",
  purple: "#7C3AED",
  gray: "#64748B",
};

const chartTooltip = {
  backgroundColor: "#0F172A",
  titleColor: "#FFFFFF",
  bodyColor: "#FFFFFF",
  padding: 12,
  cornerRadius: 8,
};

export default function CoordinatorReportsPage() {
  const [reports, setReports] =
    useState<CoordinatorReportsDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<CoordinatorReportsDto>(
          "/coordinator/reports"
        );

        setReports(response.data);
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);

        setError(
          "Não foi possível carregar os relatórios."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#338B97]" />

          <p className="text-sm text-gray-600">
            Carregando relatórios...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="p-6">
        <p className="text-gray-600">
          Nenhum relatório disponível.
        </p>
      </div>
    );
  }

  /*
   * ============================================================
   * FORMATADORES
   * ============================================================
   */

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  /*
   * ============================================================
   * GRÁFICO — SITUAÇÃO DAS MATRÍCULAS
   * ============================================================
   */

  const enrollmentChartData = {
    labels: [
      "Pendentes",
      "Ativas",
      "Concluídas",
      "Canceladas",
    ],

    datasets: [
      {
        label: "Matrículas",

        data: [
          reports.enrollments.pending,
          reports.enrollments.active,
          reports.enrollments.completed,
          reports.enrollments.cancelled,
        ],

        backgroundColor: [
          COLORS.warning,
          COLORS.secondary,
          COLORS.success,
          COLORS.danger,
        ],

        borderColor: "#FFFFFF",
        borderWidth: 3,

        hoverOffset: 8,
      },
    ],
  };

  /*
   * ============================================================
   * GRÁFICO — MATRÍCULAS POR CURSO
   * ============================================================
   */

  const studentsByCourseData = {
    labels: reports.courses.map(
      (course) => course.title
    ),

    datasets: [
      {
        label: "Matrículas",

        data: reports.courses.map(
          (course) => course.studentsCount
        ),

        backgroundColor: COLORS.primary,

        hoverBackgroundColor: COLORS.secondary,

        borderRadius: 6,

        borderSkipped: false,
      },
    ],
  };

  /*
   * ============================================================
   * GRÁFICO — PROGRESSO POR CURSO
   * ============================================================
   */

  const progressByCourseData = {
    labels: reports.courses.map(
      (course) => course.title
    ),

    datasets: [
      {
        label: "Progresso médio",

        data: reports.courses.map(
          (course) => course.progress ?? 0
        ),

        backgroundColor: COLORS.secondary,

        hoverBackgroundColor: COLORS.primary,

        borderRadius: 6,

        borderSkipped: false,
      },
    ],
  };

  /*
   * ============================================================
   * GRÁFICO — FINANCEIRO
   * ============================================================
   */

  const financialOverviewData = {
    labels: [
      "Recebido",
      "Pendente",
    ],

    datasets: [
      {
        label: "Valor",

        data: [
          reports.financial.totalReceived,
          reports.financial.totalPending,
        ],

        backgroundColor: [
          COLORS.success,
          COLORS.warning,
        ],

        borderColor: "#FFFFFF",
        borderWidth: 3,

        hoverOffset: 8,
      },
    ],
  };

  /*
   * ============================================================
   * GRÁFICO — PAGAMENTOS
   * ============================================================
   */

  const paymentStatusData = {
    labels: [
      "Pagos",
      "Pendentes",
    ],

    datasets: [
      {
        label: "Pagamentos",

        data: [
          reports.financial.paid,
          reports.financial.pending,
        ],

        backgroundColor: [
          COLORS.success,
          COLORS.warning,
        ],

        borderColor: "#FFFFFF",
        borderWidth: 3,

        hoverOffset: 8,
      },
    ],
  };

  /*
   * ============================================================
   * OPÇÕES DOS GRÁFICOS
   * ============================================================
   */

  const doughnutOptions = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "65%",

    plugins: {
      legend: {
        position: "bottom" as const,

        labels: {
          padding: 18,

          usePointStyle: true,

          pointStyle: "circle",
        },
      },

      tooltip: chartTooltip,
    },
  };

  const barOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: chartTooltip,
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: COLORS.gray,
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "#E5E7EB",
        },

        ticks: {
          color: COLORS.gray,

          stepSize: 1,

          precision: 0,
        },
      },
    },
  };

  const progressBarOptions = {
    ...barOptions,

    scales: {
      ...barOptions.scales,

      y: {
        ...barOptions.scales.y,

        max: 100,

        ticks: {
          color: COLORS.gray,

          callback: (value: string | number) =>
            `${value}%`,
        },
      },
    },
  };

  const currencyBarOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        ...chartTooltip,

        callbacks: {
          label: (context: any) => {
            return formatCurrency(context.raw);
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "#E5E7EB",
        },

        ticks: {
          callback: (value: string | number) =>
            formatCurrency(Number(value)),
        },
      },
    },
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ======================================================
            CABEÇALHO
        ====================================================== */}

        <div className="rounded-2xl bg-gradient-to-r from-[#163E72] to-[#338B97] p-6 text-white shadow-sm">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Relatórios
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-white/80 sm:text-base">
            Visão gerencial dos principais indicadores
            acadêmicos e financeiros da plataforma.
          </p>
        </div>

        {/* ======================================================
            VISÃO GERAL
        ====================================================== */}

        <section className="space-y-4">

          <div>
            <h2 className="text-xl font-bold text-[#163E72]">
              Visão geral
            </h2>

            <p className="text-sm text-gray-600">
              Principais indicadores da plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {/* Cursos */}

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Cursos
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-[#163E72]">
                  {reports.coursesCount}
                </p>
              </CardContent>
            </Card>

            {/* Professores */}

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Professores
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-[#163E72]">
                  {reports.teachersCount}
                </p>
              </CardContent>
            </Card>

            {/* Alunos */}

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Alunos
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-[#163E72]">
                  {reports.studentsCount}
                </p>
              </CardContent>
            </Card>

            {/* Aulas */}

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Aulas
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-[#163E72]">
                  {reports.lessonsCount}
                </p>
              </CardContent>
            </Card>

            {/* Progresso */}

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Progresso médio
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-[#338B97]">
                  {reports.avgProgress}%
                </p>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* ======================================================
            MATRÍCULAS
        ====================================================== */}

        <section className="space-y-4">

          <div>
            <h2 className="text-xl font-bold text-[#163E72]">
              Matrículas
            </h2>

            <p className="text-sm text-gray-600">
              Distribuição e situação das matrículas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Gráfico */}

            <Card className="border-0 shadow-sm">

              <CardHeader>
                <CardTitle className="text-lg text-[#163E72]">
                  Situação das matrículas
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="h-[320px]">
                  <Doughnut
                    data={enrollmentChartData}
                    options={doughnutOptions}
                  />
                </div>
              </CardContent>

            </Card>

            {/* Resumo */}

            <Card className="border-0 shadow-sm">

              <CardHeader>
                <CardTitle className="text-lg text-[#163E72]">
                  Resumo das matrículas
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">

                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                  <span className="text-sm text-gray-600">
                    Total
                  </span>

                  <strong className="text-lg text-[#163E72]">
                    {reports.enrollments.total}
                  </strong>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4">
                  <span className="text-sm text-gray-600">
                    Pendentes
                  </span>

                  <strong className="text-lg text-amber-700">
                    {reports.enrollments.pending}
                  </strong>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-cyan-50 p-4">
                  <span className="text-sm text-gray-600">
                    Ativas
                  </span>

                  <strong className="text-lg text-cyan-700">
                    {reports.enrollments.active}
                  </strong>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
                  <span className="text-sm text-gray-600">
                    Concluídas
                  </span>

                  <strong className="text-lg text-green-700">
                    {reports.enrollments.completed}
                  </strong>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">
                  <span className="text-sm text-gray-600">
                    Canceladas
                  </span>

                  <strong className="text-lg text-red-700">
                    {reports.enrollments.cancelled}
                  </strong>
                </div>

              </CardContent>

            </Card>

          </div>
        </section>

        {/* ======================================================
            CURSOS
        ====================================================== */}

        <section className="space-y-4">

          <div>
            <h2 className="text-xl font-bold text-[#163E72]">
              Desempenho dos cursos
            </h2>

            <p className="text-sm text-gray-600">
              Comparativo de matrículas e progresso médio.
            </p>
          </div>

          {/* Matrículas por curso */}

          <Card className="border-0 shadow-sm">

            <CardHeader>
              <CardTitle className="text-lg text-[#163E72]">
                Matrículas por curso
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="h-[360px]">
                <Bar
                  data={studentsByCourseData}
                  options={barOptions}
                />
              </div>
            </CardContent>

          </Card>

          {/* Progresso */}

          <Card className="border-0 shadow-sm">

            <CardHeader>
              <CardTitle className="text-lg text-[#163E72]">
                Progresso médio por curso
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="h-[360px]">
                <Bar
                  data={progressByCourseData}
                  options={progressBarOptions}
                />
              </div>
            </CardContent>

          </Card>

        </section>

        {/* ======================================================
            FINANCEIRO
        ====================================================== */}

        <section className="space-y-4">

          <div>
            <h2 className="text-xl font-bold text-[#163E72]">
              Indicadores financeiros
            </h2>

            <p className="text-sm text-gray-600">
              Visão consolidada da situação financeira
              da plataforma.
            </p>
          </div>

          {/* Cards financeiros */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Recebido */}

            <Card className="border-0 border-l-4 border-l-green-500 shadow-sm">

              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total recebido
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    reports.financial.totalReceived
                  )}
                </p>
              </CardContent>

            </Card>

            {/* Pendente */}

            <Card className="border-0 border-l-4 border-l-amber-500 shadow-sm">

              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total pendente
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(
                    reports.financial.totalPending
                  )}
                </p>
              </CardContent>

            </Card>

            {/* Receita mensal */}

            <Card className="border-0 border-l-4 border-l-[#338B97] shadow-sm">

              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Receita mensal
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-2xl font-bold text-[#338B97]">
                  {formatCurrency(
                    reports.financial.monthlyRevenue
                  )}
                </p>
              </CardContent>

            </Card>

            {/* Inadimplência */}

            <Card className="border-0 border-l-4 border-l-red-500 shadow-sm">

              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Taxa de inadimplência
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {reports.financial.defaultRate.toFixed(1)}%
                </p>
              </CardContent>

            </Card>

          </div>

          {/* Indicadores quantitativos */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total de pagamentos
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-[#163E72]">
                  {reports.financial.totalPayments}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Pagamentos realizados
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {reports.financial.paid}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Pagamentos pendentes
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-amber-600">
                  {reports.financial.pending}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Alunos ativos
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-[#338B97]">
                  {reports.financial.activeStudents}
                </p>
              </CardContent>
            </Card>

          </div>

          {/* Gráficos financeiros */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Valores */}

            <Card className="border-0 shadow-sm">

              <CardHeader>
                <CardTitle className="text-lg text-[#163E72]">
                  Situação financeira
                </CardTitle>
              </CardHeader>

              <CardContent>

                <div className="h-[320px]">
                  <Doughnut
                    data={financialOverviewData}
                    options={{
                      ...doughnutOptions,

                      plugins: {
                        ...doughnutOptions.plugins,

                        tooltip: {
                          ...chartTooltip,

                          callbacks: {
                            label: (context: any) => {
                              return `${context.label}: ${formatCurrency(
                                context.raw
                              )}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

              </CardContent>

            </Card>

            {/* Pagamentos */}

            <Card className="border-0 shadow-sm">

              <CardHeader>
                <CardTitle className="text-lg text-[#163E72]">
                  Situação dos pagamentos
                </CardTitle>
              </CardHeader>

              <CardContent>

                <div className="h-[320px]">
                  <Doughnut
                    data={paymentStatusData}
                    options={doughnutOptions}
                  />
                </div>

              </CardContent>

            </Card>

          </div>

          {/* Comparativo financeiro */}

          <Card className="border-0 shadow-sm">

            <CardHeader>
              <CardTitle className="text-lg text-[#163E72]">
                Recebimentos x valores pendentes
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="h-[360px]">

                <Bar
                  data={{
                    labels: [
                      "Recebido",
                      "Pendente",
                    ],

                    datasets: [
                      {
                        label: "Valor",

                        data: [
                          reports.financial.totalReceived,
                          reports.financial.totalPending,
                        ],

                        backgroundColor: [
                          COLORS.success,
                          COLORS.warning,
                        ],

                        borderRadius: 8,

                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={currencyBarOptions}
                />

              </div>

            </CardContent>

          </Card>

        </section>

      </div>
    </div>
  );
}