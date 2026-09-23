"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

import api from "@/app/services/api";
import {
  createForumQuestion,
  getForumErrorMessage,
  getForumQuestions,
} from "@/app/services/forumService";
import type { CourseReadDto, ForumQuestionListDto } from "@/types/interfaces";
import { formatForumDate, forumQuestionPath } from "./forumPaths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CourseForumPageProps {
  basePath: string;
}

export default function CourseForumPage({ basePath }: CourseForumPageProps) {
  const params = useParams();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<CourseReadDto | null>(null);
  const [questions, setQuestions] = useState<ForumQuestionListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonFilter, setLessonFilter] = useState("");
  const [resolvedFilter, setResolvedFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [saving, setSaving] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const lessons = useMemo(
    () =>
      (course?.modules ?? [])
        .flatMap((module) => module.lessons ?? [])
        .sort((a, b) => a.order - b.order),
    [course]
  );

  async function loadQuestions() {
    if (!courseId) {
      return;
    }

    const questionsData = await getForumQuestions(courseId, {
      lessonId: lessonFilter ? Number(lessonFilter) : undefined,
      resolved:
        resolvedFilter === ""
          ? undefined
          : resolvedFilter === "true",
    });

    setQuestions(questionsData);
  }

  useEffect(() => {
    if (!courseId) {
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setAccessDenied(false);
        const courseResponse = await api.get<CourseReadDto>(
          `/courses/${courseId}`
        );
        setCourse(courseResponse.data);
        const questionsData = await getForumQuestions(courseId, {
          lessonId: lessonFilter ? Number(lessonFilter) : undefined,
          resolved:
            resolvedFilter === ""
              ? undefined
              : resolvedFilter === "true",
        });
        setQuestions(questionsData);
      } catch (error) {
        const forbidden =
          axios.isAxiosError(error) && error.response?.status === 403;
        setAccessDenied(forbidden);
        toast.error(
          getForumErrorMessage(error, "Não foi possível carregar o fórum.")
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [courseId, lessonFilter, resolvedFilter]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Preencha título e pergunta.");
      return;
    }

    try {
      setSaving(true);
      await createForumQuestion({
        title: title.trim(),
        content: content.trim(),
        courseId,
        lessonId: lessonId ? Number(lessonId) : null,
      });
      setTitle("");
      setContent("");
      setLessonId("");
      setShowForm(false);
      toast.success("Pergunta publicada.");
      await loadQuestions();
    } catch (error) {
      toast.error(
        getForumErrorMessage(error, "Não foi possível publicar a pergunta.")
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-gray-600">Carregando fórum...</p>;
  }

  if (accessDenied) {
    return (
      <p className="text-gray-600">
        Você não tem acesso ao fórum deste curso. É preciso estar matriculado
        (status ativo) ou ser professor/coordenador do curso.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#163E72]">
            Fórum {course?.title ? `· ${course.title}` : ""}
          </h1>
          <p className="text-gray-600 mt-1">
            Dúvidas do curso e respostas da turma.
          </p>
        </div>
        <Button
          type="button"
          className="bg-[#163E72] hover:bg-[#255690]"
          onClick={() => setShowForm((value) => !value)}
        >
          {showForm ? "Cancelar" : "Nova pergunta"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova pergunta</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="space-y-2">
                <Label htmlFor="forum-title">Título</Label>
                <Input
                  id="forum-title"
                  maxLength={150}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="forum-content">Pergunta</Label>
                <Textarea
                  id="forum-content"
                  maxLength={5000}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="forum-lesson">Aula (opcional)</Label>
                <select
                  id="forum-lesson"
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  value={lessonId}
                  onChange={(event) => setLessonId(event.target.value)}
                >
                  <option value="">Curso inteiro</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#163E72] hover:bg-[#255690]"
              >
                {saving ? "Publicando..." : "Publicar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          value={resolvedFilter}
          onChange={(event) => setResolvedFilter(event.target.value)}
        >
          <option value="">Todas</option>
          <option value="false">Abertas</option>
          <option value="true">Resolvidas</option>
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          value={lessonFilter}
          onChange={(event) => setLessonFilter(event.target.value)}
        >
          <option value="">Todas as aulas</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.title}
            </option>
          ))}
        </select>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-600">
            Nenhuma pergunta neste filtro.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {questions.map((question) => (
            <Link
              key={question.id}
              href={forumQuestionPath(basePath, courseId, question.id)}
              className="block"
            >
              <Card className="hover:bg-muted/40 transition-colors">
                <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#163E72]">{question.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {question.userName} · {formatForumDate(question.createdAt)}
                      {question.lessonTitle ? ` · ${question.lessonTitle}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={question.isResolved ? "secondary" : "outline"}>
                      {question.isResolved ? "Resolvida" : "Aberta"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {question.replyCount}{" "}
                      {question.replyCount === 1 ? "resposta" : "respostas"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
