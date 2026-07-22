"use client";
import { useState } from "react";

export default function ModuleForm({ onSave }: { onSave: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfMaterial, setPdfMaterial] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, videoUrl, pdfMaterial });
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setPdfMaterial(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#163E72] mb-4">Novo Módulo</h3>

      <input
        type="text"
        placeholder="Título do módulo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <textarea
        placeholder="Descrição do módulo"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <input
        type="text"
        placeholder="Link da videoaula (YouTube)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdfMaterial(e.target.files?.[0]?.name || null)}
        className="mb-4"
      />

      <button
        type="submit"
        className="bg-[#163E72] text-white px-4 py-2 rounded hover:bg-[#255690] transition"
      >
        Salvar Módulo
      </button>
    </form>
  );
}
