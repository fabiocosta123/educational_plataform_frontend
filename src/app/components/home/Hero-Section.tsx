"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex w-full flex-col-reverse items-center justify-between bg-gradient-to-br from-[#163E72] via-[#255690] to-[#66BCA1] px-6 py-12 text-white sm:px-8 sm:py-16 md:flex-row">
      <div className="mt-8 w-full text-center md:mt-0 md:w-1/2 md:text-left">
        <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl md:text-5xl">
          Curso de Teologia Cristã
        </h1>
        <p className="mb-8 text-base sm:text-lg">
          Aprofunde sua fé e conhecimento bíblico com nosso curso completo de Teologia Cristã. Estude online, no seu ritmo, com suporte dedicado.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
          <Link
            href="/courses"
            className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-[#163E72] shadow-lg transition hover:bg-[#E8F4F6]"
          >
            Inscreva-se agora
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full border-2 border-white bg-transparent px-8 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Saiba mais
          </Link>
        </div>
      </div>

      <div className="flex w-full justify-center md:w-1/2">
        <Image
          src="/img/pessoaEstudando.png"
          alt="Pessoa estudando"
          width={200}
          height={200}
          className="h-auto w-3/4 rounded-xl shadow-lg sm:w-2/3 md:w-full"
        />
      </div>
    </section>
  );
}
