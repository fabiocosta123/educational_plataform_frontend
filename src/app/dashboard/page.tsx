"use client";

import CircularProgress from "./CircularProgress";
import CourseCard from "./CourseCard";



export default function DashboardPage() {
  const courses = [
    { id: 1, title: "Design Gráfico Avançado", progress: 85, nextLesson: "Módulo 4, Aula 10" },
    { id: 2, title: "Marketing Digital: Estratégias", progress: 68, nextLesson: "Módulo 4, Aula 8" },
    { id: 3, title: "Programação em Python", progress: 42, nextLesson: "Módulo 3, Aula 5" },
    { id: 4, title: "Gestão de Projetos Ágeis", progress: 91, nextLesson: "Módulo 5, Aula 12" },
  ];

  return (
    <main className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-[#163E72] text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-6">Portal do Aluno</h2>
        <nav className="space-y-3">
          {["Início", "Meus Cursos", "Atividades", "Calendário", "Boletim", "Financeiro", "Certificados", "Fórum"].map((item) => (
            <button key={item} className="block w-full text-left hover:bg-[#255690] rounded-md px-3 py-2 transition">
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <section className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <h1 className="text-3xl font-bold text-gray-800">Olá, Ana Silva!</h1>
            <p className="text-gray-500">27 de Outubro de 2023</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4c">
            <button className="text-gray-600 hover:text-gray-800">
              <i className="fas fa-search"></i>
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <i className="fas fa-bell"></i>
            </button>
            <div className="bg-[#255690] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
              AS
            </div>
          </div>
        </header>

        {/* Progress overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Meu Progresso Geral</h2>
          <div className="flex items-center gap-6">
            <CircularProgress percentage={72} size={80} />
            <div>
              <p className="text-gray-600">Cursos Concluídos: 5/7</p>
              <p className="text-gray-600">Total de Aulas: 145/201</p>
            </div>
          </div>
        </div>

        {/* Courses */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Meus Cursos Matriculados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}
