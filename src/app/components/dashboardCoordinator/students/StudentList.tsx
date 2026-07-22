"use client";
import { useState } from "react";
import { useStudents } from "./hooks/useStudent";


export default function StudentList() {
  const { students, loading, error } = useStudents();
  const [search, setSearch] = useState("");

  if (loading) return <p>Carregando alunos...</p>;
  if (error) return <p>Erro: {error}</p>;

  const filtered = students.filter(s =>
    s.userName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Pesquisar aluno..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border rounded p-2 w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded">Ativos: {students.filter(s => s.status === "ativo").length}</div>
        <div className="bg-yellow-100 p-4 rounded">Trancados: {students.filter(s => s.status === "trancado").length}</div>
        <div className="bg-blue-100 p-4 rounded">Concluídos: {students.filter(s => s.status === "concluido").length}</div>
      </div>
    
      <ul className="divide-y">
        {filtered.map(s => (
          <li key={s.id} className="p-2">
            <strong>{s.userName}</strong> — {s.userEmail} ({s.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
