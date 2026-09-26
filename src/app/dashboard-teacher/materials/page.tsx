"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import api from "../../services/api";
import type { CourseReadDto, LessonReadDto } from "../../../types/interfaces";
import MaterialOpenLink from "../../components/MaterialOpenLink";

interface MaterialRow {
  courseTitle: string;
  moduleName: string;
  lesson: LessonReadDto;
}

export default function TeacherMaterialsPage() {
  const [rows, setRows] = useState<MaterialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const load = async () => {
    const response = await api.get<CourseReadDto[]>("/Courses/my-courses");
    const list: MaterialRow[] = [];
    for (const course of response.data ?? []) {
      for (const module of course.modules ?? []) {
        for (const lesson of module.lessons ?? []) {
          list.push({
            courseTitle: course.title,
            moduleName: module.name,
            lesson,
          });
        }
      }
    }
    setRows(list);
  };

  useEffect(() => {
    load()
      .catch(() => toast.error("Não foi possível carregar os materiais."))
      .finally(() => setLoading(false));
  }, []);

  const upload = async (lessonId: number, file: File | undefined) => {
    if (!file) return;
    try {
      setUploadingId(lessonId);
      const formData = new FormData();
      formData.append("material", file);
      await api.put(`/Lessons/${lessonId}/material`, formData);
      toast.success("Material atualizado.");
      await load();
    } catch {
      toast.error("Não foi possível enviar o material.");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return <p className="text-gray-600">Carregando materiais...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#163E72]">Materiais</h1>
        <p className="text-gray-600 mt-1">
          Veja e envie o PDF/TXT de apoio de cada aula dos seus cursos.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-600">Nenhuma aula cadastrada ainda.</p>
      ) : (
        <div className="space-y-3">
          {rows.map(({ courseTitle, moduleName, lesson }) => (
            <div key={lesson.id} className="bg-white rounded-lg shadow-md p-4 space-y-2">
              <p className="font-semibold text-[#163E72]">{lesson.title}</p>
              <p className="text-sm text-gray-500">
                {courseTitle} · {moduleName}
              </p>
              {lesson.pdfUrl ? (
                <MaterialOpenLink pdfUrl={lesson.pdfUrl} label="Abrir material atual" />
              ) : (
                <p className="text-sm text-amber-700">Sem material anexado.</p>
              )}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Input
                  type="file"
                  accept=".pdf,.txt,application/pdf,text/plain"
                  disabled={uploadingId === lesson.id}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    void upload(lesson.id, file);
                    e.target.value = "";
                  }}
                />
                {uploadingId === lesson.id && (
                  <span className="text-sm text-gray-500">Enviando...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
