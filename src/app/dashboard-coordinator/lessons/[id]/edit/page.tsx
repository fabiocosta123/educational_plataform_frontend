"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/app/services/api";

import type {
  CourseModuleReadDto,
  CourseReadDto,
  LessonReadDto,
} from "@/types/interfaces";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();

  const lessonId = params.id;

  const [lesson, setLesson] =
    useState<LessonReadDto | null>(null);

  const [course, setCourse] =
    useState<CourseReadDto | null>(null);

  const [modules, setModules] =
    useState<CourseModuleReadDto[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [videoUrl, setVideoUrl] =
    useState("");
  const [durationSeconds, setDurationSeconds] =
    useState("0");
  const [order, setOrder] =
    useState("1");
  const [isPublished, setIsPublished] =
    useState(true);
  const [courseModuleId, setCourseModuleId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * ============================================================
   * CARREGAR AULA
   * ============================================================
   */

  useEffect(() => {
    async function loadLesson() {
      if (!lessonId) {
        setError("Aula não informada.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<LessonReadDto>(
            `/lessons/${lessonId}`
          );

        const loadedLesson = response.data;

        setLesson(loadedLesson);

        setTitle(
          loadedLesson.title ?? ""
        );

        setDescription(
          loadedLesson.description ?? ""
        );

        setVideoUrl(
          loadedLesson.videoUrl ?? ""
        );

        setDurationSeconds(
          String(
            loadedLesson.durationSeconds ?? 0
          )
        );

        setOrder(
          String(
            loadedLesson.order ?? 1
          )
        );

        setIsPublished(
          loadedLesson.isPublished
        );

        setCourseModuleId(
          String(
            loadedLesson.courseModuleId
          )
        );

      } catch (err) {
        console.error(
          "Erro ao carregar aula:",
          err
        );

        setError(
          "Não foi possível carregar a aula."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  /*
   * ============================================================
   * CARREGAR CURSO E MÓDULOS
   * ============================================================
   */

  useEffect(() => {
    async function loadCourseAndModules() {
      if (!lesson?.courseModuleId) {
        return;
      }

      try {
        /*
         * Primeiro descobrimos o módulo.
         */

        const moduleResponse =
          await api.get<CourseModuleReadDto>(
            `/coursemodules/${lesson.courseModuleId}`
          );

        const module =
          moduleResponse.data;

        /*
         * Depois carregamos o curso.
         */

        const courseResponse =
          await api.get<CourseReadDto>(
            `/courses/${module.courseId}`
          );

        setCourse(
          courseResponse.data
        );

        /*
         * Carrega todos os módulos do curso.
         */

        const modulesResponse =
          await api.get<CourseModuleReadDto[]>(
            `/coursemodules/course/${module.courseId}`
          );

        const loadedModules =
          [...modulesResponse.data].sort(
            (a, b) => a.order - b.order
          );

        setModules(loadedModules);

      } catch (err) {
        console.error(
          "Erro ao carregar curso/módulos:",
          err
        );

        setError(
          "Não foi possível carregar as informações do curso."
        );
      }
    }

    loadCourseAndModules();
  }, [lesson]);

  /*
   * ============================================================
   * SALVAR
   * ============================================================
   */

  async function handleUpdateLesson() {
    if (!lessonId) {
      return;
    }

    if (!title.trim()) {
      setError(
        "Informe o título da aula."
      );
      return;
    }

    if (!courseModuleId) {
      setError(
        "Selecione o módulo da aula."
      );
      return;
    }

    const duration =
      Number(durationSeconds);

    if (
      !Number.isInteger(duration) ||
      duration < 0
    ) {
      setError(
        "A duração deve ser um número inteiro maior ou igual a zero."
      );
      return;
    }

    const lessonOrder =
      Number(order);

    if (
      !Number.isInteger(lessonOrder) ||
      lessonOrder < 1
    ) {
      setError(
        "A ordem da aula deve ser um número inteiro maior que zero."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.put(
        `/lessons/${lessonId}`,
        {
          title: title.trim(),

          description:
            description.trim() || null,

          videoUrl:
            videoUrl.trim() || null,

          durationSeconds: duration,

          order: lessonOrder,

          isPublished,

          courseModuleId:
            Number(courseModuleId),
        }
      );

      toast.success(
        "Aula atualizada com sucesso."
      );

      /*
       * Retorna para os detalhes do curso.
       */

      if (course?.id) {
        router.push(
          `/dashboard-coordinator/courses/${course.id}/details`
        );
      } else {
        router.back();
      }

    } catch (err) {
      console.error(
        "Erro ao atualizar aula:",
        err
      );

      setError(
        "Não foi possível atualizar a aula."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl p-4">
        <p className="text-center mt-10">
          Carregando aula...
        </p>
      </div>
    );
  }

  /*
   * ============================================================
   * ERRO / AULA NÃO ENCONTRADA
   * ============================================================
   */

  if (!lesson) {
    return (
      <div className="container mx-auto max-w-3xl p-4">

        <Card>

          <CardContent className="p-6">

            <p className="text-red-600">
              {error ||
                "Aula não encontrada."}
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() =>
                router.back()
              }
            >
              Voltar
            </Button>

          </CardContent>

        </Card>

      </div>
    );
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6">

      <Card>

        <CardHeader>

          <CardTitle>
            Editar aula
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Altere as informações da aula e salve as modificações.
          </p>

        </CardHeader>

        <CardContent className="space-y-6">

          {/* ====================================================
              ERRO
          ==================================================== */}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ====================================================
              CONTEXTO
          ==================================================== */}

          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">

            <div>

              <Label className="text-muted-foreground">
                Professor
              </Label>

              <p className="font-medium mt-1">
                {course?.teacherName ||
                  "Não informado"}
              </p>

            </div>

            <div>

              <Label className="text-muted-foreground">
                Curso
              </Label>

              <p className="font-medium mt-1">
                {course?.title ||
                  "Não informado"}
              </p>

            </div>

          </div>

          {/* ====================================================
              TÍTULO
          ==================================================== */}

          <div className="space-y-2">

            <Label htmlFor="lesson-title">
              Título da aula
            </Label>

            <Input
              id="lesson-title"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              maxLength={200}
              disabled={saving}
            />

          </div>

          {/* ====================================================
              DESCRIÇÃO
          ==================================================== */}

          <div className="space-y-2">

            <Label htmlFor="lesson-description">
              Descrição
            </Label>

            <Textarea
              id="lesson-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={5}
              disabled={saving}
            />

          </div>

          {/* ====================================================
              VÍDEO
          ==================================================== */}

          <div className="space-y-2">

            <Label htmlFor="lesson-video">
              URL do vídeo
            </Label>

            <Input
              id="lesson-video"
              type="url"
              value={videoUrl}
              onChange={(event) =>
                setVideoUrl(
                  event.target.value
                )
              }
              placeholder="https://..."
              disabled={saving}
            />

          </div>

          {/* ====================================================
              MÓDULO
          ==================================================== */}

          <div className="space-y-2">

            <Label htmlFor="lesson-module">
              Módulo
            </Label>

            <select
              id="lesson-module"
              value={courseModuleId}
              onChange={(event) =>
                setCourseModuleId(
                  event.target.value
                )
              }
              disabled={saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >

              <option value="">
                Selecione o módulo
              </option>

              {modules.map((module) => (
                <option
                  key={module.id}
                  value={module.id}
                >
                  {module.order}.{" "}
                  {module.name}
                </option>
              ))}

            </select>

          </div>

          {/* ====================================================
              DURAÇÃO
          ==================================================== */}

          <div className="space-y-2">

            <Label htmlFor="lesson-duration">
              Duração (segundos)
            </Label>

            <Input
              id="lesson-duration"
              type="number"
              min={0}
              value={durationSeconds}
              onChange={(event) =>
                setDurationSeconds(
                  event.target.value
                )
              }
              disabled={saving}
            />

          </div>

          {/* ====================================================
              ORDEM
          ==================================================== */}

          <div className="space-y-2">

            <Label htmlFor="lesson-order">
              Ordem da aula
            </Label>

            <Input
              id="lesson-order"
              type="number"
              min={1}
              value={order}
              onChange={(event) =>
                setOrder(
                  event.target.value
                )
              }
              disabled={saving}
            />

          </div>

          {/* ====================================================
              PUBLICAÇÃO
          ==================================================== */}

          <div className="flex items-center gap-2">

            <input
              id="lesson-published"
              type="checkbox"
              checked={isPublished}
              onChange={(event) =>
                setIsPublished(
                  event.target.checked
                )
              }
              disabled={saving}
              className="h-4 w-4"
            />

            <Label
              htmlFor="lesson-published"
              className="cursor-pointer"
            >
              Aula publicada
            </Label>

          </div>

          {/* ====================================================
              MATERIAL
          ==================================================== */}

          {lesson.pdfUrl && (

            <div className="rounded-md bg-muted p-4">

              <p className="text-sm font-medium">
                Material atual
              </p>

              <p className="text-sm text-muted-foreground mt-1">
                O material atual continuará associado à aula.
              </p>

            </div>

          )}

          {/* ====================================================
              BOTÕES
          ==================================================== */}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (course?.id) {
                  router.push(
                    `/dashboard-coordinator/courses/${course.id}`
                  );
                } else {
                  router.back();
                }
              }}
              disabled={saving}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleUpdateLesson}
              disabled={
                saving ||
                !title.trim() ||
                !courseModuleId
              }
              className="bg-[#163E72] hover:bg-[#255690]"
            >
              {saving
                ? "Salvando..."
                : "Salvar alterações"}
            </Button>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}

