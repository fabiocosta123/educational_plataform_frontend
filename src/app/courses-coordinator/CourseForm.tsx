"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CourseReadDto } from "@/types/interfaces";

interface Teacher {
  id: number;
  userName: string;
}

interface CourseFormProps {
  onSave: (data: CourseReadDto) => void;
  initialData?: CourseReadDto | null;
}

export default function CourseForm({ onSave, initialData }: CourseFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setTeacherId(initialData.teacherId || null);
    }
  }, [initialData]);

  // Carrega lista de professores
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get<Teacher[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/teacher`
        );
        setTeachers(res.data);
      } catch {
        toast.error("Erro ao carregar professores");
      }
    };
    fetchTeachers();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (initialData) {
        // Atualização
        const response = await axios.put<CourseReadDto>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${initialData.id}`,
          { id: initialData.id, title, description, teacherId }
        );
        onSave(response.data);
        toast.success("Curso atualizado com sucesso!");
      } else {
        // Criação
        const payload = { title, description, creatorId: 1, teacherId };
        const response = await axios.post<CourseReadDto>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
          payload
        );
        onSave(response.data);
        toast.success("Curso criado com sucesso!");
      }

      // Limpa formulário
      setTitle("");
      setDescription("");
      setTeacherId(null);
    } catch {
      toast.error("Erro ao salvar curso");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#163E72] mb-4">
        {initialData ? "Editar Curso" : "Novo Curso"}
      </h3>

      <input
        type="text"
        placeholder="Título do curso"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2 mb-4"
        required
      />

      <textarea
        placeholder="Descrição do curso"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <select
        value={teacherId ?? ""}
        onChange={(e) => setTeacherId(Number(e.target.value))}
        className="w-full border rounded p-2 mb-4"
        required
      >
        <option value="">Selecione um professor</option>
        {teachers.map((t) => (
          <option key={t.id} value={t.id}>{t.userName}</option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-[#163E72] text-white px-4 py-2 rounded hover:bg-[#255690] transition"
      >
        {initialData ? "Atualizar Curso" : "Salvar Curso"}
      </button>
    </form>
  );
}
