"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "../../services/api";
import type { CourseReadDto, CourseModuleReadDto } from "../../../types/interfaces";

export default function TeacherAddLessonPage() {
  const [courses, setCourses] = useState<CourseReadDto[]>([]);
  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [material, setMaterial] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<CourseReadDto[]>("/Courses/my-courses")
      .then((res) => {
        const list = res.data ?? [];
        setCourses(list);
        if (list.length === 1) setCourseId(String(list[0].id));
      })
      .catch(() => toast.error("Não foi possível carregar seus cursos."))
      .finally(() => setLoading(false));
  }, []);

  const modules: CourseModuleReadDto[] = useMemo(() => {
    const course = courses.find((item) => item.id === Number(courseId));
    return [...(course?.modules ?? [])].sort((a, b) => a.order - b.order);
  }, [courses, courseId]);

  useEffect(() => {
    if (modules.length === 1) setModuleId(String(modules[0].id));
    else setModuleId("");
  }, [courseId, modules.length]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!courseId || !moduleId) {
      toast.error("Selecione o curso e o módulo.");
      return;
    }
    const minutes = Number(durationMinutes);
    if (!title.trim() || !videoUrl.trim() || minutes < 1) {
      toast.error("Preencha título, vídeo e duração em minutos.");
      return;
    }

    const module = modules.find((item) => item.id === Number(moduleId));
    const nextOrder = (module?.lessons?.length ?? 0) + 1;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("Title", title.trim());
      formData.append("Description", description.trim());
      formData.append("VideoUrl", videoUrl.trim());
      formData.append("DurationSeconds", String(minutes * 60));
      formData.append("Order", String(nextOrder));
      formData.append("IsPublished", "true");
      formData.append("CourseModuleId", moduleId);
      if (material) formData.append("material", material);

      await api.post("/Lessons", formData);
      toast.success("Aula criada com sucesso.");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setDurationMinutes("");
      setMaterial(null);
    } catch {
      toast.error("Não foi possível criar a aula.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-600">Carregando...</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#163E72]">Adicionar aula</h1>
        <p className="text-gray-600 mt-1">
          Crie a videoaula no módulo do seu curso. A duração é em minutos.
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-600">Você ainda não possui cursos para adicionar aulas.</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <label className="block text-sm font-medium">
            Curso
            <select
              className="mt-1 w-full border rounded-lg p-2"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            Módulo
            <select
              className="mt-1 w-full border rounded-lg p-2"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              required
              disabled={!courseId}
            >
              <option value="">Selecione</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </label>
          {courseId && modules.length === 0 && (
            <p className="text-sm text-amber-700">
              Este curso ainda não tem módulo. Crie um em Gerenciar módulos.
            </p>
          )}

          <label className="block text-sm font-medium">
            Título
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
          </label>

          <label className="block text-sm font-medium">
            Descrição
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={4} />
          </label>

          <label className="block text-sm font-medium">
            URL do vídeo
            <Input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              className="mt-1"
            />
          </label>

          <label className="block text-sm font-medium">
            Duração (minutos)
            <Input
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
              className="mt-1"
            />
          </label>

          <label className="block text-sm font-medium">
            Material de apoio (PDF ou TXT)
            <Input
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              className="mt-1"
              onChange={(e) => setMaterial(e.target.files?.[0] ?? null)}
            />
          </label>

          <Button type="submit" disabled={saving} className="bg-[#163E72] hover:bg-[#255690]">
            {saving ? "Salvando..." : "Salvar aula"}
          </Button>
        </form>
      )}
    </div>
  );
}
