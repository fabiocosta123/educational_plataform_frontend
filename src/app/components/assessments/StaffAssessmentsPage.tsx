"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { dangerActionClass, editActionClass, quietActionClass } from "@/app/components/AppLinks";
import api from "../../services/api";

interface CourseOption {
  id: number;
  title: string;
}

interface AssessmentRow {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  type: string;
  passingScore: number;
  isPublished: boolean;
  questionsCount: number;
}

interface QuestionDraft {
  prompt: string;
  options: { text: string; isCorrect: boolean }[];
}

interface ManagePayload {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  type: number;
  passingScore: number;
  isPublished: boolean;
  questions: {
    prompt: string;
    points: number;
    options: { text: string; isCorrect: boolean }[];
  }[];
}

const emptyQuestion = (): QuestionDraft => ({
  prompt: "",
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
});

export default function StaffAssessmentsPage({
  coursesEndpoint,
}: {
  coursesEndpoint: string;
}) {
  const [rows, setRows] = useState<AssessmentRow[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [type, setType] = useState<"1" | "2">("1");
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCourseId("");
    setType("1");
    setQuestions([emptyQuestion()]);
  };

  const load = async () => {
    const [assessments, courseRes] = await Promise.all([
      api.get<AssessmentRow[]>("/Assessments"),
      api.get<CourseOption[]>(coursesEndpoint),
    ]);
    setRows(assessments.data);
    setCourses(courseRes.data);
  };

  useEffect(() => {
    load().catch(() => toast.error("Não foi possível carregar atividades e provas."));
  }, [coursesEndpoint]);

  const payload = () => ({
    courseId: Number(courseId),
    title: title.trim(),
    description,
    type: Number(type),
    passingScore: 70,
    isPublished: true,
    questions: questions.map((q) => ({
      prompt: q.prompt,
      points: 1,
      options: q.options,
    })),
  });

  const save = async () => {
    if (!courseId || !title.trim()) {
      toast.error("Escolha o curso e informe o título.");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/Assessments/${editingId}`, payload());
        toast.success("Alterações guardadas.");
      } else {
        await api.post("/Assessments", payload());
        toast.success("Publicado.");
      }
      resetForm();
      await load();
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = async (id: number) => {
    try {
      const res = await api.get<ManagePayload>(`/Assessments/${id}/manage`);
      setEditingId(id);
      setCourseId(String(res.data.courseId));
      setTitle(res.data.title);
      setDescription(res.data.description ?? "");
      setType(res.data.type === 2 ? "2" : "1");
      setQuestions(
        res.data.questions.map((question) => ({
          prompt: question.prompt,
          options: question.options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        }))
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Não foi possível abrir para edição.");
    }
  };

  const remove = async (id: number, name: string) => {
    if (!window.confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/Assessments/${id}`);
      toast.success("Excluído.");
      if (editingId === id) resetForm();
      await load();
    } catch {
      toast.error("Não foi possível excluir.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#163E72] mb-2">Atividades e provas</h1>
      <p className="text-gray-600 mb-6">
        Atividades servem para praticar. A prova só abre com 90% das atividades concluídas (nota mínima 70%), tem 3 tentativas e nota mínima de 70%.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
        <h2 className="font-semibold text-[#163E72]">
          {editingId ? "Editar publicação" : "Nova publicação"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-sm">
            Curso
            <select
              className="mt-1 w-full border rounded p-2"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">Selecione</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Tipo
            <select
              className="mt-1 w-full border rounded p-2"
              value={type}
              onChange={(e) => setType(e.target.value as "1" | "2")}
            >
              <option value="1">Atividade</option>
              <option value="2">Prova</option>
            </select>
          </label>
        </div>
        <input
          className="w-full border rounded p-2"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded p-2"
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {questions.map((question, qi) => (
          <div key={qi} className="border rounded p-4 space-y-2">
            <p className="text-sm font-medium">Pergunta {qi + 1}</p>
            <input
              className="w-full border rounded p-2"
              placeholder="Enunciado"
              value={question.prompt}
              onChange={(e) => {
                const next = [...questions];
                next[qi] = { ...next[qi], prompt: e.target.value };
                setQuestions(next);
              }}
            />
            {question.options.map((option, oi) => (
              <label key={oi} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`correct-${qi}`}
                  checked={option.isCorrect}
                  onChange={() => {
                    const next = [...questions];
                    next[qi] = {
                      ...next[qi],
                      options: next[qi].options.map((item, idx) => ({
                        ...item,
                        isCorrect: idx === oi,
                      })),
                    };
                    setQuestions(next);
                  }}
                />
                <input
                  className="flex-1 border rounded p-2"
                  placeholder={`Alternativa ${oi + 1}`}
                  value={option.text}
                  onChange={(e) => {
                    const next = [...questions];
                    next[qi].options[oi] = { ...next[qi].options[oi], text: e.target.value };
                    setQuestions(next);
                  }}
                />
                <span className="text-gray-500">correta</span>
              </label>
            ))}
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="border border-[#163E72] text-[#163E72] px-4 py-2 rounded"
            onClick={() => setQuestions((current) => [...current, emptyQuestion()])}
          >
            Adicionar pergunta
          </button>
          <button
            type="button"
            disabled={saving}
            className="bg-[#338B97] text-white px-4 py-2 rounded disabled:opacity-60"
            onClick={() => void save()}
          >
            {saving ? "A guardar..." : editingId ? "Guardar alterações" : "Publicar"}
          </button>
          {editingId && (
            <button type="button" className={quietActionClass} onClick={resetForm}>
              Cancelar edição
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between gap-4">
            <div>
              <p className="font-semibold text-[#163E72]">{row.title}</p>
              <p className="text-sm text-gray-600">
                {row.courseTitle} • {row.type === "Exam" ? "Prova" : "Atividade"} • {row.questionsCount} perguntas
              </p>
            </div>
            <div className="flex gap-2 h-fit">
              <button type="button" className={editActionClass} onClick={() => void startEdit(row.id)}>
                Editar
              </button>
              <button type="button" className={dangerActionClass} onClick={() => void remove(row.id, row.title)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-gray-600">Nenhuma atividade ou prova publicada ainda.</p>}
      </div>
    </div>
  );
}
