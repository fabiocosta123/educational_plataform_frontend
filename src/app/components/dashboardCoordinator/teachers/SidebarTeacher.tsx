"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import LogoutButton from "../../logoutButton/LogoutButton";

const NAV_ITEMS = [
  { href: "/dashboard-teacher", label: "Início" },
  { href: "/dashboard-teacher/my-courses", label: "Meus cursos" },
  { href: "/dashboard-teacher/modules", label: "Gerenciar módulos" },
  { href: "/dashboard-teacher/add-lesson", label: "Adicionar aula" },
  { href: "/dashboard-teacher/materials", label: "Materiais" },
  { href: "/dashboard-teacher/assessments", label: "Atividades e provas" },
  { href: "/dashboard-teacher/forum", label: "Fórum" },
  { href: "/dashboard-teacher/certificates", label: "Certificados" },
];

export default function DashboardSidebarTeacher() {
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
        <h2 className="mb-8 mt-10 text-2xl font-bold md:mt-0">
          Portal do Professor
        </h2>

        <nav className="flex flex-col gap-4">
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

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
