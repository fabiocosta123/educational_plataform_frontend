"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "../logoutButton/LogoutButton";

const NAV_ITEMS = [
  { href: "/dashboard-coordinator", label: "Início" },
  { href: "/dashboard-coordinator/courses", label: "Cursos" },
  { href: "/dashboard-coordinator/teachers", label: "Professores" },
  { href: "/dashboard-coordinator/students", label: "Alunos" },
  { href: "/dashboard-coordinator/assessments", label: "Atividades e provas" },
  { href: "/dashboard-coordinator/forum", label: "Fórum" },
  { href: "/dashboard-coordinator/certificates", label: "Certificados" },
  { href: "/dashboard-coordinator/reports", label: "Relatórios" },
  { href: "/dashboard-coordinator/finance", label: "Financeiro" },
];

export default function SidebarCoordinator() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="fixed top-3 left-3 z-[70] flex h-11 w-11 items-center justify-center rounded-lg bg-[#163E72] text-white shadow-md md:hidden"
      >
        {open ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
      </button>

      {open && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-[50] bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-[60] flex h-screen w-64 flex-col bg-[#163E72] p-6 text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="mb-6 mt-10 text-2xl font-bold md:mt-0">
          Portal do Coordenador
        </h2>
        <Separator className="mb-6 bg-[#255690]" />

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded p-2 hover:bg-[#255690]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Separator className="mt-6 mb-4 bg-[#255690]" />
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
