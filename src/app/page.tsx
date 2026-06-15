import { redirect } from "next/navigation";



export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#163E72] via-[#255690] to-[#66BCA1] flex flex-col items-center justify-center p-8 text-center">
      {/* Título principal */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
        Curso de Teologia Cristã
      </h1>

      {/* Subtítulo */}
      <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-100 max-w-2xl">
        Explore as Escrituras, aprofunde sua fé e desenvolva uma base sólida em teologia.
      </p>

      {/* Botões de ação */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button className="px-6 py-3 bg-[#338B97] text-white rounded-lg shadow-md hover:bg-[#255690] transition">
          Inscreva-se Agora
        </button>
        <button className="px-6 py-3 bg-white text-[#163E72] rounded-lg shadow-md hover:bg-gray-200 transition">
          Saiba Mais
        </button>
      </div>

      {/* Destaques */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-[#163E72] mb-2">Estudo Bíblico</h3>
          <p className="text-gray-600">Aprofunde-se na interpretação das Escrituras com base sólida e acadêmica.</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-[#163E72] mb-2">História da Igreja</h3>
          <p className="text-gray-600">Conheça os principais eventos e personagens que moldaram a fé cristã.</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-[#163E72] mb-2">Teologia Sistemática</h3>
          <p className="text-gray-600">Construa uma visão organizada e coerente da fé cristã.</p>
        </div>
      </section>
    </main>
  );

}

