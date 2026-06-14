"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      {/* Rodapé */}
      <footer className="w-full bg-white py-4 px-6 sm:px-8 flex flex-col sm:flex-row justify-center items-center text-[#163E72] shadow-md gap-2">
        <p className="text-xs sm:text-sm font-medium text-center sm:text-left">
          Desenvolvido por <span className="font-bold">Fábio Costa</span>
        </p>
      </footer>

      {/* Ícone do WhatsApp fixo */}
      <a
        href="https://wa.me/5513996285971"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#1EBE5D] transition"
      >
        <FaWhatsapp className="text-2xl sm:text-3xl" />
      </a>
    </>
  );
}
