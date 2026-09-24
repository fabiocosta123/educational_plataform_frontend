"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

interface ForumQuestionList {
  id: number;
  title: string;
  isResolved: boolean;
  replyCount: number;
  userName: string;
  lessonTitle?: string | null;
}

interface ForumReply {
  id: number;
  content: string;
  userName: string;
}

interface ForumQuestionDetail extends ForumQuestionList {
  content: string;
  replies: ForumReply[];
}

export default function StaffForumCoursePage({ backHref }: { backHref: string }) {
  const params = useParams();
  const courseId = Number(params.courseId);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<ForumQuestionList[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ForumQuestionDetail | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  const loadQuestions = async () => {
    const res = await api.get<ForumQuestionList[]>(`/courses/${courseId}/forum/questions`);
    setQuestions(res.data);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!courseId) return;
    loadQuestions().catch(() => toast.error("Não foi possível carregar o fórum."));
  }, [user, loading, courseId, router]);

  const openQuestion = async (id: number) => {
    if (openId === id) {
      setOpenId(null);
      setDetail(null);
      return;
    }
    try {
      const res = await api.get<ForumQuestionDetail>(`/forum/questions/${id}`);
      setDetail(res.data);
      setOpenId(id);
    } catch {
      toast.error("Não foi possível abrir a pergunta.");
    }
  };

  const createQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/forum/questions", { title, content, courseId });
      setTitle("");
      setContent("");
      toast.success("Pergunta publicada.");
      await loadQuestions();
    } catch {
      toast.error("Não foi possível publicar a pergunta.");
    } finally {
      setSaving(false);
    }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openId) return;
    setSaving(true);
    try {
      await api.post(`/forum/questions/${openId}/replies`, { content: reply });
      setReply("");
      const res = await api.get<ForumQuestionDetail>(`/forum/questions/${openId}`);
      setDetail(res.data);
      await loadQuestions();
    } catch {
      toast.error("Não foi possível enviar a resposta.");
    } finally {
      setSaving(false);
    }
  };

  const setResolved = async (id: number, isResolved: boolean) => {
    setSaving(true);
    try {
      await api.patch(`/forum/questions/${id}/resolve`, { isResolved });
      toast.success(isResolved ? "Pergunta marcada como resolvida." : "Pergunta reaberta.");
      await loadQuestions();
      if (openId === id) {
        const res = await api.get<ForumQuestionDetail>(`/forum/questions/${id}`);
        setDetail(res.data);
      }
    } catch {
      toast.error("Não foi possível atualizar o status da pergunta.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return <p className="text-gray-600">Carregando...</p>;

  return (
    <div>
      <Link href={backHref} className="text-[#338B97] text-sm">
        ← Voltar aos cursos
      </Link>
      <h1 className="text-2xl font-bold text-[#163E72] mt-2 mb-6">Fórum do curso</h1>

      <form onSubmit={createQuestion} className="bg-white rounded-lg shadow-md p-5 mb-6 space-y-3">
        <h2 className="font-semibold text-[#163E72]">Nova pergunta</h2>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="w-full border rounded-lg px-3 py-2" />
        <textarea required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escreve a mensagem" rows={4} className="w-full border rounded-lg px-3 py-2" />
        <button disabled={saving} className="bg-[#338B97] text-white px-4 py-2 rounded-lg">Publicar</button>
      </form>

      <div className="space-y-3">
        {questions.length === 0 && <p className="text-gray-600">Ainda não há perguntas neste curso.</p>}
        {questions.map((question) => (
          <article key={question.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between gap-3 items-start">
              <button type="button" className="flex-1 text-left" onClick={() => void openQuestion(question.id)}>
                <h3 className="font-semibold text-[#163E72]">{question.title}</h3>
                <p className="text-sm text-gray-500">
                  {question.userName} · {question.replyCount} resposta(s)
                  {question.lessonTitle ? ` · ${question.lessonTitle}` : ""}
                </p>
              </button>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs px-2 py-1 rounded ${question.isResolved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                  {question.isResolved ? "Resolvida" : "Aberta"}
                </span>
                <button
                  type="button"
                  disabled={saving}
                  className="text-sm text-[#338B97] underline"
                  onClick={() => void setResolved(question.id, !question.isResolved)}
                >
                  {question.isResolved ? "Reabrir" : "Marcar como resolvida"}
                </button>
              </div>
            </div>
            {openId === question.id && detail && (
              <div className="mt-4 border-t pt-4 space-y-3">
                <p className="text-gray-700 whitespace-pre-wrap">{detail.content}</p>
                {detail.replies.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">{item.userName}</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.content}</p>
                  </div>
                ))}
                <form onSubmit={sendReply} className="space-y-2">
                  <textarea required value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Escreve uma resposta" rows={3} className="w-full border rounded-lg px-3 py-2" />
                  <button disabled={saving} className="bg-[#163E72] text-white px-4 py-2 rounded-lg">Responder</button>
                </form>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
