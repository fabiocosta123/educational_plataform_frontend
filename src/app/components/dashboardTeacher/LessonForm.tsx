"use client";
import { useState } from "react";

export default function LessonForm({ onSave }: { onSave: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfMaterial, setPdfMaterial] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, date, videoUrl, pdfMaterial });
    setTitle("");
    setDescription("");
    setDate("");
    setVideoUrl("");
    setPdfMaterial(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-gray-50 p-4 rounded-lg">
      <h4 className="text-md font-semibold text-[#163E72] mb-2">Nova Aula</h4>

      <input
        type="text"
        placeholder="Título da aula"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2 mb-2"
      />

      <textarea
        placeholder="Descrição da aula"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded p-2 mb-2"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded p-2 mb-2"
      />

      <input
        type="text"
        placeholder="Link da videoaula (YouTube)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full border rounded p-2 mb-2"
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdfMaterial(e.target.files?.[0]?.name || null)}
        className="mb-2"
      />

      <button
        type="submit"
        className="bg-[#66BCA1] text-white px-4 py-2 rounded hover:bg-[#255690] transition"
      >
        Adicionar Aula
      </button>
    </form>
  );
}
