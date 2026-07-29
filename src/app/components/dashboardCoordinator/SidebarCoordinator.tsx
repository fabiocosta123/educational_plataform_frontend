"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "../logoutButton/LogoutButton";

export default function SidebarCoordinator() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar superior (mobile) */}
      <div className="md:hidden flex items-center justify-between bg-[#163E72] text-white p-4">
        <h2 className="text-lg font-bold">Portal do Coordenador</h2>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="text-white">
          {open ? <FiX /> : <FiMenu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-[#163E72] text-white flex flex-col p-6 transform transition-transform duration-300 ease-in-out 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-2xl font-bold mb-6 hidden md:block">Portal do Coordenador</h2>
        <Separator className="bg-[#255690] mb-6" />

        <nav className="flex flex-col gap-2">
          {[
            { href: "/dashboard-coordinator", label: "Início" },
            { href: "/dashboard-coordinator/courses", label: "Cursos" },
            { href: "/dashboard-coordinator/teachers", label: "Professores" },
            { href: "/dashboard-coordinator/students", label: "Alunos" },
            { href: "/dashboard-coordinator/reports", label: "Relatórios" },
            { href: "/dashboard-coordinator/finance", label: "Financeiro" },
            { href: "/dashboard-coordinator/forum", label: "Fórum" },
          ].map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="justify-start text-white hover:bg-[#255690]"
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <Separator className="bg-[#255690] mt-6 mb-4" />
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
