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
  questionType: "MultipleChoice" | "TrueFalse";
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
    questionType?: string;
    options: { text: string; isCorrect: boolean }[];
  }[];
}

const emptyMultipleChoice = (): QuestionDraft => ({
  prompt: "",
  questionType: "MultipleChoice",
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
});

const emptyTrueFalse = (): QuestionDraft => ({
  prompt: "",
  questionType: "TrueFalse",
  options: [
    { text: "Verdadeiro", isCorrect: true },
    { text: "Falso", isCorrect: false },
  ],
});

const isTrueFalseQuestion = (options: { text: string }[], questionType?: string) => {
  if (questionType === "TrueFalse") return true;
  const texts = options.map((option) => option.text.trim().toLowerCase());
  return texts.length === 2 && texts.includes("verdadeiro") && texts.includes("falso");
};

const padMultipleChoice = (options: { text: string; isCorrect: boolean }[]): QuestionDraft["options"] => {
  const next = options.slice(0, 5).map((option) => ({
    text: option.text,
    isCorrect: option.isCorrect,
  }));
  if (!next.some((option) => option.isCorrect) && next[0]) next[0].isCorrect = true;
  while (next.length < 5) next.push({ text: "", isCorrect: false });
  return next;
};

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
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyMultipleChoice()]);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCourseId("");
    setType("1");
    setQuestions([emptyMultipleChoice()]);
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
      questionType: q.questionType,
      options:
        q.questionType === "TrueFalse"
          ? [
              { text: "Verdadeiro", isCorrect: q.options[0]?.isCorrect === true },
              { text: "Falso", isCorrect: q.options[0]?.isCorrect !== true },
            ]
          : q.options,
    })),
  });

  const save = async () => {
    if (!courseId || !title.trim()) {
      toast.error("Escolha o curso e informe o título.");
      return;
    }
    if (questions.some((question) => !question.prompt.trim())) {
      toast.error("Preencha o enunciado de todas as perguntas.");
      return;
    }
    if (
      questions.some(
        (question) =>
          question.questionType === "MultipleChoice" &&
          question.options.filter((option) => option.text.trim()).length !== 5
      )
    ) {
      toast.error("Nas perguntas de múltipla escolha, preencha as 5 alternativas.");
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
        res.data.questions.map((question) => {
          const trueFalse = isTrueFalseQuestion(question.options, question.questionType);
          if (trueFalse) {
            const correctIsTrue = question.options.some(
              (option) => option.isCorrect && option.text.trim().toLowerCase() === "verdadeiro"
            );
            return {
              prompt: question.prompt,
              questionType: "TrueFalse" as const,
              options: [
                { text: "Verdadeiro", isCorrect: correctIsTrue },
                { text: "Falso", isCorrect: !correctIsTrue },
              ],
            };
          }
          return {
            prompt: question.prompt,
            questionType: "MultipleChoice" as const,
            options: padMultipleChoice(question.options),
          };
        })
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
        Atividades servem para praticar. A prova só abre com 90% das atividades concluídas (nota mínima 70%), tem 3 tentativas e nota mínima de 70%. Use múltipla escolha (5 alternativas) ou verdadeiro/falso.
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Pergunta {qi + 1}</p>
              <label className="text-sm text-gray-600">
                Tipo
                <select
                  className="ml-2 border rounded p-1"
                  value={question.questionType}
                  onChange={(e) => {
                    const nextType = e.target.value as QuestionDraft["questionType"];
                    const next = [...questions];
                    next[qi] =
                      nextType === "TrueFalse"
                        ? { ...emptyTrueFalse(), prompt: next[qi].prompt }
                        : { ...emptyMultipleChoice(), prompt: next[qi].prompt };
                    setQuestions(next);
                  }}
                >
                  <option value="MultipleChoice">Múltipla escolha (5 alternativas)</option>
                  <option value="TrueFalse">Verdadeiro ou falso</option>
                </select>
              </label>
            </div>
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
            {question.questionType === "TrueFalse" ? (
              <div className="space-y-2">
                {["Verdadeiro", "Falso"].map((label, oi) => (
                  <label key={label} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={!!question.options[oi]?.isCorrect}
                      onChange={() => {
                        const next = [...questions];
                        next[qi] = {
                          ...next[qi],
                          options: [
                            { text: "Verdadeiro", isCorrect: oi === 0 },
                            { text: "Falso", isCorrect: oi === 1 },
                          ],
                        };
                        setQuestions(next);
                      }}
                    />
                    <span className="font-medium">{label}</span>
                    <span className="text-gray-500">resposta correta</span>
                  </label>
                ))}
              </div>
            ) : (
              question.options.map((option, oi) => (
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
              ))
            )}
            {questions.length > 1 && (
              <button
                type="button"
                className="text-sm text-red-700"
                onClick={() => setQuestions((current) => current.filter((_, idx) => idx !== qi))}
              >
                Remover pergunta
              </button>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="border border-[#163E72] text-[#163E72] px-4 py-2 rounded"
            onClick={() => setQuestions((current) => [...current, emptyMultipleChoice()])}
          >
            Adicionar múltipla escolha
          </button>
          <button
            type="button"
            className="border border-[#163E72] text-[#163E72] px-4 py-2 rounded"
            onClick={() => setQuestions((current) => [...current, emptyTrueFalse()])}
          >
            Adicionar verdadeiro ou falso
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
