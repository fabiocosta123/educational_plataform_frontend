"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";
import api, { API_BASE_URL } from "../../../services/api";
import { BackLink } from "../../../components/AppLinks";

interface Question {
  id: number;
  prompt: string;
  options: { id: number; text: string }[];
}

interface AssessmentDetail {
  id: number;
  title: string;
  courseTitle: string;
  type: string;
  passingScore: number;
  attemptsCount: number;
  maxAttempts?: number | null;
  canStart: boolean;
  blockReason?: string | null;
  activitiesCompleted?: number;
  activitiesTotal?: number;
  inProgressAttemptId?: number | null;
  questions: Question[];
}

export default function TakeAssessmentPage() {
  const params = useParams();
  const id = Number(params.id);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean; passingScore: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(false);
  const lockedRef = useRef(false);
  const finishingRef = useRef(false);

  const isExam = assessment?.type === "Exam";

  const load = useCallback(async () => {
    const res = await api.get<AssessmentDetail>(`/Assessments/${id}`);
    setAssessment(res.data);
    if (res.data.type !== "Exam") {
      setQuestions(res.data.questions ?? []);
    }
  }, [id]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    load().catch(() => toast.error("Não foi possível abrir esta avaliação."));
  }, [user, loading, router, load]);

  const abandon = useCallback(async () => {
    if (finishingRef.current || !lockedRef.current) return;
    finishingRef.current = true;
    lockedRef.current = false;
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/Assessments/${id}/abandon`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        keepalive: true,
      });
    } catch {
      /* ignore */
    }
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
    setLocked(false);
    toast.warn("A prova foi encerrada e esta tentativa foi usada.");
    router.replace("/dashboard-student/assessments");
  }, [id, router]);

  useEffect(() => {
    if (!locked) return;

    const onLeave = () => {
      void abandon();
    };
    const onVisibility = () => {
      if (document.hidden) onLeave();
    };
    const onFullscreen = () => {
      if (!document.fullscreenElement) onLeave();
    };
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
      void abandon();
    };
    const blockKeys = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && ["c", "v", "x", "u", "s", "p"].includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
      if (event.key === "F12" || event.key === "Tab") {
        event.preventDefault();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("fullscreenchange", onFullscreen);
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("keydown", blockKeys);
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("cut", prevent);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("fullscreenchange", onFullscreen);
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("cut", prevent);
    };
  }, [locked, abandon]);

  const startExam = async () => {
    setSaving(true);
    try {
      const res = await api.post<{ attemptId: number; questions: Question[] }>(`/Assessments/${id}/start`);
      setQuestions(res.data.questions ?? []);
      lockedRef.current = true;
      finishingRef.current = false;
      setLocked(true);
      await document.documentElement.requestFullscreen?.().catch(() => undefined);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Não foi possível iniciar a prova.");
    } finally {
      setSaving(false);
    }
  };

  const submit = async () => {
    if (!assessment) return;
    setSaving(true);
    finishingRef.current = true;
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          questionId: Number(questionId),
          optionId,
        })),
      };
      const res = await api.post(`/Assessments/${assessment.id}/submit`, payload);
      lockedRef.current = false;
      setLocked(false);
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch(() => undefined);
      }
      setResult(res.data);
      toast.success(`Nota: ${res.data.score}%`);
    } catch (error: unknown) {
      finishingRef.current = false;
      const message =
        typeof error === "object" && error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Não foi possível enviar as respostas.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || !assessment) return <p>Carregando...</p>;

  if (isExam && locked) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0f2744] text-white overflow-y-auto select-none">
        <div className="max-w-3xl mx-auto p-6">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <p className="text-sm text-white/70">Modo prova — não saias desta tela</p>
              <h1 className="text-2xl font-bold">{assessment.title}</h1>
              <p className="text-white/80">{assessment.courseTitle}</p>
            </div>
            <button
              type="button"
              className="border border-white/40 px-4 py-2 rounded"
              onClick={() => void abandon()}
            >
              Desistir da prova
            </button>
          </div>
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white text-[#163E72] rounded-lg p-4 mb-4">
              <p className="font-medium mb-2">
                {index + 1}. {question.prompt}
              </p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      checked={answers[question.id] === option.id}
                      onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            disabled={saving}
            onClick={() => void submit()}
            className="bg-[#338B97] text-white px-4 py-2 rounded"
          >
            {saving ? "Enviando..." : "Enviar prova"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/dashboard-student/assessments">Voltar</BackLink>
      <h1 className="text-2xl font-bold text-[#163E72] mt-2">{assessment.title}</h1>
      <p className="text-gray-600 mb-6">
        {assessment.courseTitle} • {isExam ? "Prova" : "Atividade"}
      </p>

      {result && (
        <p className="font-semibold text-[#163E72] mb-4">
          Nota {result.score}%. {result.passed ? "Aprovado." : `Mínimo: ${result.passingScore}%.`}
        </p>
      )}

      {isExam && !result && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
          <p>Ao iniciar, a prova ocupa a tela inteira. Sair, mudar de aba ou minimizar usa uma tentativa.</p>
          <p>Máximo de 3 tentativas. Nota mínima: {assessment.passingScore}%.</p>
          <p>Tentativas já usadas: {assessment.attemptsCount}/{assessment.maxAttempts ?? 3}.</p>
          {!assessment.canStart && !assessment.inProgressAttemptId && (
            <p className="text-amber-700">{assessment.blockReason}</p>
          )}
          {(assessment.canStart || assessment.inProgressAttemptId) && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void startExam()}
              className="bg-[#338B97] text-white px-4 py-2 rounded"
            >
              {saving ? "A iniciar..." : assessment.inProgressAttemptId ? "Retomar prova" : "Iniciar prova"}
            </button>
          )}
        </div>
      )}

      {!isExam && (
        <>
          {questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <p className="font-medium mb-2">{question.prompt}</p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      checked={answers[question.id] === option.id}
                      onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {!result && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void submit()}
              className="bg-[#338B97] text-white px-4 py-2 rounded"
            >
              {saving ? "Enviando..." : "Enviar respostas"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function prevent(event: Event) {
  event.preventDefault();
}
