"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      {/* Rodapé fixo */}
      <footer className="w-full bg-white py-6 px-8 flex justify-center items-center text-[#163E72] shadow-md">
        <p className="text-sm font-medium">
          Desenvolvido por <span className="font-bold">Fábio Costa</span>
        </p>
      </footer>

      {/* Ícone do WhatsApp fixo no canto inferior direito */}
      <a
        href="https://wa.me/5513996285971"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#1EBE5D] transition"
      >
        <FaWhatsapp className="text-3xl" />
      </a>
    </>
  );
}
