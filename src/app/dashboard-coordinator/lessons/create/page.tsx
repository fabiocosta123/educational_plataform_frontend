
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import api from "../../../services/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import type {
  CourseReadDto,
  CourseModuleReadDto,
} from "@/types/interfaces";

export default function CreateLessonPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const courseIdFromUrl = searchParams.get("courseId");
  const moduleIdFromUrl = searchParams.get("moduleId");  

  const [course, setCourse] = useState<CourseReadDto | null>(null);
  const [modules, setModules] = useState<CourseModuleReadDto[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("0");
  const [order, setOrder] = useState("1");
  const [isPublished, setIsPublished] = useState(true);
  const [material, setMaterial] = useState<File | null>(null);  

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    async function loadCourse() {
      if (!courseIdFromUrl) {
        setError("Curso não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get<CourseReadDto>(
          `/courses/${courseIdFromUrl}`
        );

        setCourse(response.data);
      } catch (err) {
        console.error("Erro ao carregar curso:", err);
        setError("Não foi possível carregar o curso.");
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseIdFromUrl]);  

  useEffect(() => {
    async function loadModules() {
      if (!courseIdFromUrl) {
        setModules([]);
        return;
      }

      try {
        const response = await api.get<CourseModuleReadDto[]>(
          `/coursemodules/course/${courseIdFromUrl}`
        );

        const loadedModules = [...response.data].sort(
          (a, b) => a.order - b.order
        );

        setModules(loadedModules);
        
        if (moduleIdFromUrl) {
          const selectedModule = loadedModules.find(
            (module) => module.id === Number(moduleIdFromUrl)
          );

          if (selectedModule) {
            const nextLessonOrder =
              selectedModule.lessons?.length > 0
                ? Math.max(
                    ...selectedModule.lessons.map(
                      (lesson) => lesson.order
                    )
                  ) + 1
                : 1;

            setOrder(String(nextLessonOrder));
          }
        }
      } catch (err) {
        console.error("Erro ao carregar módulos:", err);
        setError("Não foi possível carregar os módulos.");
        setModules([]);
      }
    }

    loadModules();
  }, [courseIdFromUrl, moduleIdFromUrl]);

  
  const selectedModule = modules.find(
    (module) => module.id === Number(moduleIdFromUrl)
  );

  const teacherName = course?.teacherName || "Não informado";

  function validateForm(): string | null {
    if (!courseIdFromUrl) {
      return "Curso não informado.";
    }

    if (!moduleIdFromUrl) {
      return "Módulo não informado.";
    }

    if (!course) {
      return "Curso não carregado.";
    }

    if (!selectedModule) {
      return "Módulo não encontrado.";
    }

    if (!title.trim()) {
      return "Informe o título da aula.";
    }

    const duration = Number(durationSeconds);

    if (!Number.isInteger(duration) || duration < 0) {
      return "A duração deve ser um número inteiro maior ou igual a zero.";
    }

    const lessonOrder = Number(order);

    if (!Number.isInteger(lessonOrder) || lessonOrder < 1) {
      return "A ordem da aula deve ser um número inteiro maior que zero.";
    }

    if (material) {
      const extension = material.name
        .substring(material.name.lastIndexOf("."))
        .toLowerCase();

      const allowedExtensions = [".pdf", ".txt"];

      if (!allowedExtensions.includes(extension)) {
        return "Formato de arquivo não permitido. Envie apenas PDF ou TXT.";
      }

      const maxFileSize = 10 * 1024 * 1024;

      if (material.size > maxFileSize) {
        return "O arquivo não pode ultrapassar 10 MB.";
      }
    }

    return null;
  } 

  async function handleCreateLesson() {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setCreating(true);
      setError("");

      const formData = new FormData();

      formData.append("Title", title.trim());

      formData.append(
        "Description",
        description.trim()
      );

      formData.append(
        "VideoUrl",
        videoUrl.trim()
      );

      formData.append(
        "DurationSeconds",
        String(Number(durationSeconds))
      );

      formData.append(
        "Order",
        String(Number(order))
      );

      formData.append(
        "IsPublished",
        String(isPublished)
      );

      formData.append(
        "CourseModuleId",
        String(Number(moduleIdFromUrl))
      );

      if (material) {
        formData.append("material", material);
      }

      await api.post("/lessons", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });     

      router.push(
        `/dashboard-coordinator/courses/${courseIdFromUrl}/details`
      );
    } catch (err) {
      console.error("Erro ao criar aula:", err);

      setError(
        "Não foi possível criar a aula. Verifique os dados e tente novamente."
      );
    } finally {
      setCreating(false);
    }
  }  

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl p-4">
        <p className="text-center mt-10">
          Carregando informações da aula...
        </p>
      </div>
    );
  }  

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Nova aula</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* =====================================================
              Erro
          ===================================================== */}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* =====================================================
              Contexto da aula
          ===================================================== */}

          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">

            <div>
              <Label className="text-muted-foreground">
                Professor
              </Label>

              <p className="font-medium mt-1">
                {teacherName}
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground">
                Curso
              </Label>

              <p className="font-medium mt-1">
                {course?.title || "Não informado"}
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground">
                Módulo
              </Label>

              <p className="font-medium mt-1">
                {selectedModule
                  ? `${selectedModule.order}. ${selectedModule.name}`
                  : "Não informado"}
              </p>
            </div>

          </div>

          {/* =====================================================
              Título
          ===================================================== */}

          <div className="space-y-2">
            <Label htmlFor="lesson-title">
              Título da aula
            </Label>

            <Input
              id="lesson-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Ex.: Introdução ao conteúdo"
              maxLength={200}
              disabled={creating}
            />
          </div>

          {/* =====================================================
              Descrição
          ===================================================== */}

          <div className="space-y-2">
            <Label htmlFor="lesson-description">
              Descrição
            </Label>

            <Textarea
              id="lesson-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Descrição da aula..."
              rows={5}
              disabled={creating}
            />
          </div>

          {/* =====================================================
              Vídeo
          ===================================================== */}

          <div className="space-y-2">
            <Label htmlFor="lesson-video">
              URL do vídeo
            </Label>

            <Input
              id="lesson-video"
              type="url"
              value={videoUrl}
              onChange={(event) =>
                setVideoUrl(event.target.value)
              }
              placeholder="https://..."
              disabled={creating}
            />
          </div>

          {/* =====================================================
              Material
          ===================================================== */}

          <div className="space-y-2">
            <Label htmlFor="lesson-material">
              Material da aula
            </Label>

            <Input
              id="lesson-material"
              type="file"
              accept=".pdf,.txt"
              disabled={creating}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;

                setMaterial(file);
              }}
            />

            <p className="text-xs text-muted-foreground">
              Formatos permitidos: PDF ou TXT. Tamanho máximo: 10 MB.
            </p>

            {material && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado:{" "}
                <strong>{material.name}</strong>
              </p>
            )}
          </div>

          {/* =====================================================
              Duração
          ===================================================== */}

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
                setDurationSeconds(event.target.value)
              }
              disabled={creating}
            />

            <p className="text-xs text-muted-foreground">
              Informe a duração total da aula em segundos.
            </p>
          </div>

          {/* =====================================================
              Ordem
          ===================================================== */}

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
                setOrder(event.target.value)
              }
              disabled={creating}
            />

            <p className="text-xs text-muted-foreground">
              A ordem é sugerida automaticamente com base nas
              aulas existentes no módulo.
            </p>
          </div>

          {/* =====================================================
              Publicação
          ===================================================== */}

          <div className="flex items-center gap-2">
            <input
              id="lesson-published"
              type="checkbox"
              checked={isPublished}
              onChange={(event) =>
                setIsPublished(event.target.checked)
              }
              disabled={creating}
              className="h-4 w-4"
            />

            <Label
              htmlFor="lesson-published"
              className="cursor-pointer"
            >
              Publicar aula imediatamente
            </Label>
          </div>

          {/* =====================================================
              Informação
          ===================================================== */}

          <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
            O professor, curso e módulo foram definidos
            automaticamente a partir do curso selecionado.
          </div>

          {/* =====================================================
              Botões
          ===================================================== */}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (courseIdFromUrl) {
                  router.push(
                    `/dashboard-coordinator/courses/${courseIdFromUrl}/details`
                  );
                } else {
                  router.push(
                    "/dashboard-coordinator/courses"
                  );
                }
              }}
              disabled={creating}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleCreateLesson}
              disabled={
                creating ||
                !course ||
                !selectedModule ||
                !title.trim()
              }
              className="bg-[#163E72] hover:bg-[#255690]"
            >
              {creating
                ? "Criando aula..."
                : "Criar aula"}
            </Button>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}
