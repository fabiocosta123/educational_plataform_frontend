"use client";
import Image from "next/image";
import Link from "next/link";
import { FaUserGraduate } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
      {/* Logo + Nome */}
      <div className="flex items-center gap-3">
        <Image
          src="/img/logoAnexa.png"
          alt="Logo Anexa"
          width={40}
          height={40}
        />
        <span className="text-[#163E72] font-bold text-xl">Anexa</span>
      </div>

      {/* Menu */}
      <nav className="flex gap-6 text-[#163E72] font-semibold">
        <Link href="/courses" className="hover:text-[#338B97] transition">
          Cursos
        </Link>
        <Link href="/about" className="hover:text-[#338B97] transition">
          Quem Somos
        </Link>
        <Link href="/contact" className="hover:text-[#338B97] transition">
          Fale Conosco
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 bg-[#338B97] text-white px-4 py-2 rounded-lg hover:bg-[#255690] transition"
        >
          <FaUserGraduate className="text-lg" />
          Área de Membros
        </Link>
      </nav>
    </header>
  );
}
