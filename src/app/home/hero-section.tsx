"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  const handleCourseClick = () => {
    router.push("/purchase");
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between w-full px-8 py-16 bg-gradient-to-br from-[#163E72] via-[#255690] to-[#66BCA1] text-white">
      {/* Texto principal */}
      <div className="max-w-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Curso de Teologia Cristã
        </h1>
        <p className="text-lg mb-8">
          Aprofunde sua fé e conhecimento bíblico com nosso curso completo de
          Teologia Cristã. Estude online, no seu ritmo, com suporte dedicado.
        </p>
        <button
          onClick={handleCourseClick}
          className="bg-[#338B97] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#255690] transition"
        >
          Inscreva-se Agora
        </button>
      </div>

      {/* Imagem */}
      <div className="mt-10 md:mt-0">
        <Image
          src="/img/pessoaEstudando.png"
          alt="Pessoa estudando"
          width={400}
          height={400}
          className="rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
