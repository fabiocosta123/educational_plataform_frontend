"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import {
  BookOpen,
  Plus,
  Layers3,
  Video,
  FileText,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  Upload,
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description?: string;
  videoUrl?: string;
  pdfUrl?: string;
  order: number;
  durationSeconds: number;
  isPublished: boolean;
  courseModuleId: number;
}

interface CourseModule {
  id: number;
  name: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description?: string;
  modules: CourseModule[];
}

export default function ModulesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Aula atualmente aberta para criação
  const [openLessonModuleId, setOpenLessonModuleId] = useState<number | null>(
    null
  );

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonPublished, setLessonPublished] = useState(true);
  const [lessonMaterial, setLessonMaterial] = useState<File | null>(null);

  const [savingLesson, setSavingLesson] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);

      const response = await api.get<Course[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Courses/my-courses`
      );

      setCourses(response.data ?? []);

      if (response.data?.length === 1) {
        setSelectedCourseId(String(response.data[0].id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar seus cursos.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find(
    (course) => course.id === Number(selectedCourseId)
  );

  const handleCreateModule = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCourseId) {
      toast.error("Selecione um curso.");
      return;
    }

    if (!name.trim()) {
      toast.error("Informe o nome do módulo.");
      return;
    }

    try {
      setSaving(true);

      const nextOrder =
        (selectedCourse?.modules?.length ?? 0) + 1;

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        courseId: Number(selectedCourseId),
        order: nextOrder,
        isPublished,
      };

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/CourseModules`,
        payload
      );

      const createdModule = response.data;

      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course.id === Number(selectedCourseId)
            ? {
                ...course,
                modules: [
                  ...(course.modules ?? []),
                  {
                    ...createdModule,
                    lessons: createdModule.lessons ?? [],
                  },
                ],
              }
            : course
        )
      );

      setName("");
      setDescription("");
      setIsPublished(true);

      toast.success("Módulo criado com sucesso!");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.title ||
        error?.response?.data?.message ||
        error?.response?.data ||
        "Erro ao criar módulo.";

      toast.error(
        typeof message === "string"
          ? message
          : "Erro ao criar módulo."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // ABRIR FORMULÁRIO DE AULA
  // --------------------------------------------------

  const openLessonForm = (moduleId: number) => {
    setOpenLessonModuleId(moduleId);

    setLessonTitle("");
    setLessonDescription("");
    setLessonVideoUrl("");
    setLessonDuration("");
    setLessonPublished(true);
    setLessonMaterial(null);
  };

  // --------------------------------------------------
  // FECHAR FORMULÁRIO DE AULA
  // --------------------------------------------------

  const closeLessonForm = () => {
    setOpenLessonModuleId(null);

    setLessonTitle("");
    setLessonDescription("");
    setLessonVideoUrl("");
    setLessonDuration("");
    setLessonPublished(true);
    setLessonMaterial(null);
  };

  // --------------------------------------------------
  // CRIAR AULA
  // --------------------------------------------------

  const handleCreateLesson = async (
    event: React.FormEvent,
    module: CourseModule
  ) => {
    event.preventDefault();

    if (!lessonTitle.trim()) {
      toast.error("Informe o título da aula.");
      return;
    }

    if (!lessonVideoUrl.trim()) {
      toast.error("Informe o link da videoaula.");
      return;
    }

    const durationMinutes = Number(lessonDuration);

    if (!lessonDuration || durationMinutes <= 0) {
      toast.error("Informe uma duração válida.");
      return;
    }

    try {
      setSavingLesson(true);

      const nextOrder = (module.lessons?.length ?? 0) + 1;

      const formData = new FormData();

      formData.append("Title", lessonTitle.trim());
      formData.append(
        "Description",
        lessonDescription.trim()
      );

      formData.append(
        "VideoUrl",
        lessonVideoUrl.trim()
      );

      formData.append(
        "DurationSeconds",
        String(durationMinutes * 60)
      );

      formData.append(
        "Order",
        String(nextOrder)
      );

      formData.append(
        "IsPublished",
        String(lessonPublished)
      );

      formData.append(
        "CourseModuleId",
        String(module.id)
      );

      if (lessonMaterial) {
        formData.append(
          "material",
          lessonMaterial
        );
      }

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Lessons`,
        formData
      );

      const createdLesson: Lesson = response.data;

      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course.id === Number(selectedCourseId)
            ? {
                ...course,
                modules: course.modules.map(
                  (currentModule) =>
                    currentModule.id === module.id
                      ? {
                          ...currentModule,
                          lessons: [
                            ...(currentModule.lessons ?? []),
                            createdLesson,
                          ],
                        }
                      : currentModule
                ),
              }
            : course
        )
      );

      toast.success("Aula criada com sucesso!");

      closeLessonForm();
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.title ||
        error?.response?.data?.message ||
        error?.response?.data ||
        "Erro ao criar aula.";

      toast.error(
        typeof message === "string"
          ? message
          : "Erro ao criar aula."
      );
    } finally {
      setSavingLesson(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-gray-500">
            Carregando seus cursos...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HEADER */}

        <section>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#163E72] text-white">
              <Layers3 size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#163E72]">
                Conteúdo dos cursos
              </h1>

              <p className="text-sm text-gray-500">
                Crie módulos e organize as aulas do curso.
              </p>
            </div>

          </div>
        </section>

        {/* NENHUM CURSO */}

        {courses.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">

              <BookOpen
                size={42}
                className="mb-4 text-gray-400"
              />

              <h2 className="text-lg font-semibold text-gray-700">
                Você ainda não possui cursos
              </h2>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                Crie ou tenha um curso atribuído antes de
                adicionar módulos.
              </p>

            </CardContent>
          </Card>
        )}

        {courses.length > 0 && (
          <>

            {/* SELEÇÃO DO CURSO */}

            <Card>

              <CardHeader>
                <CardTitle className="text-lg text-[#163E72]">
                  1. Escolha o curso
                </CardTitle>
              </CardHeader>

              <CardContent>

                <Select
                  value={selectedCourseId}
                  onValueChange={(value) =>
                    setSelectedCourseId(value ?? "")
                  }
                >

                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>

                  <SelectContent>

                    {courses.map((course) => (
                      <SelectItem
                        key={course.id}
                        value={String(course.id)}
                      >
                        {course.title}
                      </SelectItem>
                    ))}

                  </SelectContent>

                </Select>

                {selectedCourse && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-4">

                    <p className="font-medium text-[#163E72]">
                      {selectedCourse.title}
                    </p>

                    {selectedCourse.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {selectedCourse.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">

                      <Badge variant="secondary">
                        {selectedCourse.modules?.length ?? 0} módulos
                      </Badge>

                      <Badge variant="secondary">
                        {selectedCourse.modules?.reduce(
                          (total, module) =>
                            total +
                            (module.lessons?.length ?? 0),
                          0
                        ) ?? 0}{" "}
                        aulas
                      </Badge>

                    </div>

                  </div>
                )}

              </CardContent>

            </Card>

            {/* CRIAR MÓDULO */}

            <Card>

              <CardHeader>

                <CardTitle className="flex items-center gap-2 text-lg text-[#163E72]">

                  <Plus size={20} />

                  2. Criar módulo

                </CardTitle>

              </CardHeader>

              <CardContent>

                <form
                  onSubmit={handleCreateModule}
                  className="space-y-5"
                >

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Nome do módulo
                    </label>

                    <Input
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Ex.: Introdução ao curso"
                      maxLength={100}
                      required
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Descrição
                    </label>

                    <Textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="Descreva brevemente o conteúdo deste módulo..."
                      maxLength={1000}
                      rows={4}
                    />

                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">

                    <div>

                      <p className="text-sm font-medium">
                        Publicar módulo
                      </p>

                      <p className="text-xs text-gray-500">
                        O módulo ficará disponível para os alunos.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(event) =>
                        setIsPublished(
                          event.target.checked
                        )
                      }
                      className="h-5 w-5"
                    />

                  </div>

                  <Button
                    type="submit"
                    disabled={
                      saving ||
                      !selectedCourseId
                    }
                    className="w-full bg-[#163E72] hover:bg-[#255690] sm:w-auto"
                  >

                    {saving
                      ? "Salvando..."
                      : "Criar módulo"}

                  </Button>

                </form>

              </CardContent>

            </Card>

            {/* LISTA DE MÓDULOS */}

            {selectedCourse && (

              <section>

                <div className="mb-4">

                  <h2 className="text-xl font-bold text-[#163E72]">
                    3. Conteúdo do curso
                  </h2>

                  <p className="text-sm text-gray-500">
                    Adicione as aulas dentro de cada módulo.
                  </p>

                </div>

                {selectedCourse.modules?.length === 0 ? (

                  <Card>

                    <CardContent className="py-10 text-center">

                      <Layers3
                        size={36}
                        className="mx-auto mb-3 text-gray-400"
                      />

                      <p className="font-medium text-gray-600">
                        Nenhum módulo criado ainda.
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Crie o primeiro módulo acima.
                      </p>

                    </CardContent>

                  </Card>

                ) : (

                  <div className="space-y-4">

                    {[...(selectedCourse.modules ?? [])]
                      .sort((a, b) => a.order - b.order)
                      .map((module, index) => (

                        <Card
                          key={module.id}
                          className="overflow-hidden"
                        >

                          <CardContent className="p-0">

                            {/* CABEÇALHO DO MÓDULO */}

                            <div className="p-5">

                              <div className="flex items-start gap-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#163E72] font-bold text-white">
                                  {index + 1}
                                </div>

                                <div className="min-w-0 flex-1">

                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                    <h3 className="font-semibold text-[#163E72]">
                                      {module.name}
                                    </h3>

                                    <Badge>
                                      {module.lessons?.length ?? 0}{" "}
                                      {module.lessons?.length === 1
                                        ? "aula"
                                        : "aulas"}
                                    </Badge>

                                  </div>

                                  {module.description && (
                                    <p className="mt-2 text-sm text-gray-600">
                                      {module.description}
                                    </p>
                                  )}

                                  <div className="mt-4 flex flex-wrap gap-2">

                                    <Badge variant="outline">
                                      Ordem {module.order}
                                    </Badge>

                                    <Badge variant="outline">
                                      {module.lessons?.length ?? 0} aulas
                                    </Badge>

                                  </div>

                                </div>

                              </div>

                              {/* BOTÃO ADICIONAR AULA */}

                              <Button
                                type="button"
                                onClick={() =>
                                  openLessonForm(module.id)
                                }
                                className="mt-5 w-full bg-[#66BCA1] hover:bg-[#4e9f86]"
                              >

                                {openLessonModuleId === module.id ? (
                                  <>
                                    <ChevronUp className="mr-2 h-4 w-4" />
                                    Fechar formulário
                                  </>
                                ) : (
                                  <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar aula
                                  </>
                                )}

                              </Button>

                            </div>

                            {/* FORMULÁRIO DE AULA */}

                            {openLessonModuleId === module.id && (

                              <div className="border-t bg-gray-50 p-5">

                                <div className="mb-5">

                                  <div className="flex items-center justify-between">

                                    <div>

                                      <h4 className="font-semibold text-[#163E72]">
                                        Nova aula
                                      </h4>

                                      <p className="text-sm text-gray-500">
                                        Módulo: {module.name}
                                      </p>

                                    </div>

                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={closeLessonForm}
                                    >
                                      <X />
                                    </Button>

                                  </div>

                                </div>

                                <form
                                  onSubmit={(event) =>
                                    handleCreateLesson(
                                      event,
                                      module
                                    )
                                  }
                                  className="space-y-5"
                                >

                                  {/* TÍTULO */}

                                  <div>

                                    <label className="mb-2 block text-sm font-medium">
                                      Título da aula
                                    </label>

                                    <Input
                                      value={lessonTitle}
                                      onChange={(event) =>
                                        setLessonTitle(
                                          event.target.value
                                        )
                                      }
                                      placeholder="Ex.: Introdução ao tema"
                                      maxLength={100}
                                      required
                                    />

                                  </div>

                                  {/* DESCRIÇÃO */}

                                  <div>

                                    <label className="mb-2 block text-sm font-medium">
                                      Descrição
                                    </label>

                                    <Textarea
                                      value={lessonDescription}
                                      onChange={(event) =>
                                        setLessonDescription(
                                          event.target.value
                                        )
                                      }
                                      placeholder="Descreva o que o aluno aprenderá nesta aula..."
                                      maxLength={1000}
                                      rows={4}
                                    />

                                  </div>

                                  {/* VÍDEO */}

                                  <div>

                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">

                                      <Video className="h-4 w-4" />

                                      Vídeo da aula

                                    </label>

                                    <Input
                                      type="url"
                                      value={lessonVideoUrl}
                                      onChange={(event) =>
                                        setLessonVideoUrl(
                                          event.target.value
                                        )
                                      }
                                      placeholder="https://www.youtube.com/watch?v=..."
                                      required
                                    />

                                    <p className="mt-1 text-xs text-gray-500">
                                      Informe o link da videoaula.
                                    </p>

                                  </div>

                                  {/* DURAÇÃO */}

                                  <div>

                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">

                                      <Clock className="h-4 w-4" />

                                      Duração

                                    </label>

                                    <div className="relative">

                                      <Input
                                        type="number"
                                        min="1"
                                        value={lessonDuration}
                                        onChange={(event) =>
                                          setLessonDuration(
                                            event.target.value
                                          )
                                        }
                                        placeholder="Ex.: 15"
                                        required
                                      />

                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                        minutos
                                      </span>

                                    </div>

                                  </div>

                                  {/* MATERIAL */}

                                  <div>

                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">

                                      <FileText className="h-4 w-4" />

                                      Material de apoio

                                    </label>

                                    <div className="rounded-lg border border-dashed bg-white p-4">

                                      <Input
                                        type="file"
                                        accept=".pdf,.txt,application/pdf,text/plain"
                                        onChange={(event) =>
                                          setLessonMaterial(
                                            event.target.files?.[0] ??
                                              null
                                          )
                                        }
                                      />

                                      <p className="mt-2 text-xs text-gray-500">
                                        Formatos aceitos: PDF ou TXT.
                                        Tamanho máximo: 10 MB.
                                      </p>

                                      {lessonMaterial && (
                                        <div className="mt-3 flex items-center gap-2 rounded-md bg-gray-50 p-2 text-sm">

                                          <FileText className="h-4 w-4 text-[#163E72]" />

                                          <span className="truncate">
                                            {lessonMaterial.name}
                                          </span>

                                        </div>
                                      )}

                                    </div>

                                  </div>

                                  {/* PUBLICAÇÃO */}

                                  <div className="flex items-center justify-between rounded-lg border bg-white p-4">

                                    <div>

                                      <p className="text-sm font-medium">
                                        Publicar aula
                                      </p>

                                      <p className="text-xs text-gray-500">
                                        A aula ficará disponível para os alunos.
                                      </p>

                                    </div>

                                    <input
                                      type="checkbox"
                                      checked={lessonPublished}
                                      onChange={(event) =>
                                        setLessonPublished(
                                          event.target.checked
                                        )
                                      }
                                      className="h-5 w-5"
                                    />

                                  </div>

                                  {/* BOTÕES */}

                                  <div className="flex flex-col gap-2 sm:flex-row">

                                    <Button
                                      type="submit"
                                      disabled={savingLesson}
                                      className="w-full bg-[#163E72] hover:bg-[#255690] sm:w-auto"
                                    >

                                      {savingLesson ? (
                                        "Enviando aula..."
                                      ) : (
                                        <>
                                          <Upload className="mr-2 h-4 w-4" />
                                          Salvar aula
                                        </>
                                      )}

                                    </Button>

                                    <Button
                                      type="button"
                                      variant="outline"
                                      disabled={savingLesson}
                                      onClick={closeLessonForm}
                                      className="w-full sm:w-auto"
                                    >
                                      Cancelar
                                    </Button>

                                  </div>

                                </form>

                              </div>

                            )}

                            {/* LISTA DE AULAS */}

                            {module.lessons?.length > 0 && (

                              <div className="border-t">

                                <div className="bg-white px-5 py-3">

                                  <p className="text-sm font-semibold text-gray-700">
                                    Aulas deste módulo
                                  </p>

                                </div>

                                <div className="divide-y">

                                  {[...(module.lessons ?? [])]
                                    .sort(
                                      (a, b) =>
                                        a.order - b.order
                                    )
                                    .map((lesson) => (

                                      <div
                                        key={lesson.id}
                                        className="flex items-start gap-3 bg-gray-50 p-4"
                                      >

                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#163E72] shadow-sm">
                                          {lesson.order}
                                        </div>

                                        <div className="min-w-0 flex-1">

                                          <p className="font-medium text-gray-800">
                                            {lesson.title}
                                          </p>

                                          <div className="mt-2 flex flex-wrap gap-2">

                                            {lesson.videoUrl && (
                                              <Badge
                                                variant="outline"
                                                className="gap-1"
                                              >
                                                <Video className="h-3 w-3" />
                                                Vídeo
                                              </Badge>
                                            )}

                                            {lesson.pdfUrl && (
                                              <Badge
                                                variant="outline"
                                                className="gap-1"
                                              >
                                                <FileText className="h-3 w-3" />
                                                Material
                                              </Badge>
                                            )}

                                            <Badge variant="outline">
                                              {Math.ceil(
                                                lesson.durationSeconds /
                                                  60
                                              )}{" "}
                                              min
                                            </Badge>

                                            <Badge
                                              variant={
                                                lesson.isPublished
                                                  ? "default"
                                                  : "secondary"
                                              }
                                            >
                                              {lesson.isPublished
                                                ? "Publicada"
                                                : "Rascunho"}
                                            </Badge>

                                          </div>

                                        </div>

                                      </div>

                                    ))}

                                </div>

                              </div>

                            )}

                          </CardContent>

                        </Card>

                      ))}

                  </div>

                )}

              </section>

            )}

          </>
        )}

      </div>
    </main>
  );
}