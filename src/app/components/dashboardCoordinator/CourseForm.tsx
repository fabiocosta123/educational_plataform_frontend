"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CourseForm({ onSave }: { onSave: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        description,
        creatorId: 1, 
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
        payload
      );

      onSave(response.data);
      toast.success("Curso criado com sucesso!");

      setTitle("");
      setDescription("");
    } catch {
      toast.error("Erro ao criar curso");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#163E72] mb-4">Novo Curso</h3>

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

      <button
        type="submit"
        className="bg-[#163E72] text-white px-4 py-2 rounded hover:bg-[#255690] transition"
      >
        Salvar Curso
      </button>
    </form>
  );
}