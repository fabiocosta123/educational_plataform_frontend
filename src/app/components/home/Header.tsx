"use client";
import Image from "next/image";
import Link from "next/link";
import { FaUserGraduate, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md py-4 px-6 sm:px-8 flex justify-between items-center">
      {/* Logo + Nome */}
      <div className="flex items-center gap-3">
        <Link href="/home">
          <Image
            src="/img/logoAnexa.png"
            alt="Logo Anexa"
            width={130}
            height={100}
          />
        </Link>
        {/* <span className="text-[#163E72] font-bold text-xl">Anexa</span> */}
      </div>

      {/* Botão hamburguer (mobile) */}
      <button
        className="sm:hidden text-[#163E72] text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Menu desktop */}
      <nav className="hidden sm:flex gap-6 text-[#163E72] font-semibold items-center">
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

      {/* Menu mobile (abre com hamburguer) */}
      {menuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 text-[#163E72] font-semibold sm:hidden z-50">
          <Link href="/courses" onClick={() => setMenuOpen(false)}>
            Cursos
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            Quem Somos
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Fale Conosco
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 bg-[#338B97] text-white px-4 py-2 rounded-lg hover:bg-[#255690] transition"
          >
            <FaUserGraduate className="text-lg" />
            Área de Membros
          </Link>
        </nav>
      )}
    </header>
  );
}
