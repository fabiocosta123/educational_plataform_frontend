"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { useAuth } from "@/app/hooks/useAuth";
import {
  createForumReply,
  getForumErrorMessage,
  getForumQuestion,
  resolveForumQuestion,
} from "@/app/services/forumService";
import type { ForumQuestionReadDto } from "@/types/interfaces";
import {
  formatForumDate,
  forumCoursePath,
  isStaffReply,
} from "./forumPaths";
import { BackLink } from "@/app/components/AppLinks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ForumQuestionDetailPageProps {
  basePath: string;
}

export default function ForumQuestionDetailPage({
  basePath,
}: ForumQuestionDetailPageProps) {
  const params = useParams();
  const courseId = Number(params.id);
  const questionId = Number(params.questionId);
  const { user } = useAuth();

  const [question, setQuestion] = useState<ForumQuestionReadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [resolving, setResolving] = useState(false);

  async function loadQuestion() {
    const data = await getForumQuestion(questionId);
    setQuestion(data);
  }

  useEffect(() => {
    if (!questionId) {
      return;
    }

    async function load() {
      try {
        setLoading(true);
        await loadQuestion();
      } catch (error) {
        toast.error(
          getForumErrorMessage(error, "Não foi possível carregar a pergunta.")
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [questionId]);

  const canResolve =
    !!user &&
    !!question &&
    (user.id === question.userId ||
      user.role === "Coordinator" ||
      user.role === "Teacher");

  async function handleReply(event: FormEvent) {
    event.preventDefault();
    if (!reply.trim()) {
      toast.error("Escreva uma resposta.");
      return;
    }

    try {
      setSaving(true);
      await createForumReply(questionId, { content: reply.trim() });
      setReply("");
      toast.success("Resposta publicada.");
      await loadQuestion();
    } catch (error) {
      toast.error(
        getForumErrorMessage(error, "Não foi possível publicar a resposta.")
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleResolve() {
    if (!question) {
      return;
    }

    try {
      setResolving(true);
      const updated = await resolveForumQuestion(
        question.id,
        !question.isResolved
      );
      setQuestion(updated);
      toast.success(
        updated.isResolved ? "Pergunta marcada como resolvida." : "Pergunta reaberta."
      );
    } catch (error) {
      toast.error(
        getForumErrorMessage(error, "Não foi possível atualizar o status.")
      );
    } finally {
      setResolving(false);
    }
  }

  if (loading) {
    return <p className="text-gray-600">Carregando pergunta...</p>;
  }

  if (!question) {
    return <p className="text-gray-600">Pergunta não encontrada.</p>;
  }

  return (
    <div className="space-y-6">
      <BackLink href={forumCoursePath(basePath, courseId)}>Voltar ao fórum</BackLink>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <CardTitle className="text-[#163E72]">{question.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {question.userName} · {formatForumDate(question.createdAt)}
              {question.lessonTitle ? ` · ${question.lessonTitle}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={question.isResolved ? "secondary" : "outline"}>
              {question.isResolved ? "Resolvida" : "Aberta"}
            </Badge>
            {canResolve && (
              <Button
                type="button"
                variant="outline"
                disabled={resolving}
                onClick={handleResolve}
              >
                {question.isResolved ? "Reabrir" : "Marcar resolvida"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-gray-800">{question.content}</p>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#163E72]">
          Respostas ({question.replies.length})
        </h2>
        {question.replies.length === 0 ? (
          <p className="text-gray-600">Ainda não há respostas.</p>
        ) : (
          question.replies.map((item) => (
            <Card key={item.id}>
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium">{item.userName}</p>
                  {isStaffReply(item.userProfile) && (
                    <Badge variant="secondary">{item.userProfile === "Coordinator" ? "Coordenação" : "Professor"}</Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    {formatForumDate(item.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-gray-800">{item.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Responder</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleReply}>
            <div className="space-y-2">
              <Label htmlFor="forum-reply">Sua resposta</Label>
              <Textarea
                id="forum-reply"
                maxLength={5000}
                value={reply}
                onChange={(event) => setReply(event.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#163E72] hover:bg-[#255690]"
            >
              {saving ? "Publicando..." : "Publicar resposta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
