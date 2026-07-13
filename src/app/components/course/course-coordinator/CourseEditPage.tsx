"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CourseReadDto, UserReadDto } from "../../../../types/interfaces";
import { toast } from "react-toastify";
import api from "@/app/services/api";

interface Teacher {
  id: number;
  userName: string;
}

export default function CourseEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<CourseReadDto | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState<string>(""); 
  const [teachers, setTeachers] = useState<UserReadDto[]>([]);

  // Buscar curso
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get<CourseReadDto>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`
        );
        setCourse(res.data);
        setTitle(res.data.title ?? "");
        setDescription(res.data.description ?? "");
        setTeacherId(res.data.teacherId?.toString() ?? "");
      } catch {
        toast.error("Erro ao carregar curso");
      }
    };
    fetchCourse();
  }, [id]);

  // Buscar lista de professores
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get<Teacher[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/teachers`
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
      await api.put(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`, {
        title,
        description,
        teacherId: Number(teacherId),
      });
      toast.success("Curso atualizado com sucesso!");
      router.push(`/courses-coordinator/${id}/details`);
    } catch {
      toast.error("Erro ao atualizar curso");
    }
  };

  if (!course) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-[#163E72] mb-4">Editar Curso</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-1">Título:</label>
          <input
            className="w-full border rounded px-3 py-2 mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Descrição:</label>
          <textarea
            className="w-full border rounded px-3 py-2 mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Professor:</label>
          <select
            className="w-full border rounded px-3 py-2 mb-3"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">Selecione um professor</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.userName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#163E72] text-white px-4 py-2 rounded hover:bg-[#255690]"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
