"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Enrollment {
  id: number;
  userName: string;
  courseTitle: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
}

export default function CourseDashboard({ courseId }: { courseId: number }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<Enrollment[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/CoursesEnrollment?courseId=${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEnrollments(response.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  if (loading) return <p>Carregando...</p>;

  
  const totalLessons = enrollments[0]?.totalLessons || 0;
  const avgCompleted = Math.round(
    enrollments.reduce((acc, e) => acc + e.completedLessons, 0) /
      enrollments.length
  );
  const avgProgress = Math.round(
    enrollments.reduce((acc, e) => acc + e.progressPercentage, 0) /
      enrollments.length
  );

  
  const bottomFive = [...enrollments]
    .sort((a, b) => a.progressPercentage - b.progressPercentage)
    .slice(0, 5);

  
  const goodStudents = enrollments.filter((e) => e.progressPercentage >= 70)
    .length;
  const badStudents = enrollments.length - goodStudents;

  return (
    <div className="p-6 space-y-6">
      {/* Card topo */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold text-[#163E72] mb-4">
          Andamento do Curso
        </h2>
        <div className="w-64 h-64">
          <Doughnut
            data={{
              labels: ["Concluídas", "Restantes"],
              datasets: [
                {
                  data: [avgCompleted, totalLessons - avgCompleted],
                  backgroundColor: ["#66BCA1", "#FF6B6B"],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              plugins: {
                legend: { position: "bottom" },
              },
              cutout: "70%",
            }}
          />
        </div>
        <p className="mt-4 text-lg font-semibold text-[#163E72]">
          Progresso médio: {avgProgress}%
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#163E72] mb-4">
            Alunos com menor progresso
          </h3>
          <ul className="space-y-3">
            {bottomFive.map((e) => (
              <li
                key={e.id}
                className="bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <span className="font-medium">{e.userName}</span>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className="bg-[#FF6B6B] h-3 rounded-full"
                    style={{ width: `${e.progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {e.progressPercentage}% concluído
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-[#163E72] mb-4">
            Acompanhamento dos alunos
          </h3>
          <div className="w-48 h-48">
            <Doughnut
              data={{
                labels: ["Acompanhando bem", "Atrasados"],
                datasets: [
                  {
                    data: [goodStudents, badStudents],
                    backgroundColor: ["#66BCA1", "#FF6B6B"],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: { position: "bottom" },
                },
                cutout: "60%",
              }}
            />
          </div>
          <p className="mt-4 text-gray-700">
            {goodStudents} alunos acompanhando bem • {badStudents} atrasados
          </p>
        </div>
      </div>
    </div>
  );
}
