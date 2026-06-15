"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  const handleCourseClick = () => {
    router.push("/purchase");
  };

  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between w-full px-6 sm:px-8 py-12 sm:py-16 bg-gradient-to-br from-[#163E72] via-[#255690] to-[#66BCA1] text-white">
      {/* Texto principal */}
      <div className="w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">
          Curso de Teologia Cristã
        </h1>
        <p className="text-base sm:text-lg mb-8">
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
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/img/pessoaEstudando.png"
          alt="Pessoa estudando"
          width={400}
          height={400}
          className="rounded-xl shadow-lg w-3/4 sm:w-2/3 md:w-full h-auto"
        />
      </div>
    </section>
  );
}
