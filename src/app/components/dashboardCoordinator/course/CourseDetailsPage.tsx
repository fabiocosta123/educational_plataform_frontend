"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/app/services/api";
import type {
  CourseReadDto,
  CourseModuleReadDto,
} from "@/types/interfaces";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<CourseReadDto | null>(null);
  const [loading, setLoading] = useState(true);

 
   
  // MÓDULO - CRIAÇÃO 

  const [createModuleOpen, setCreateModuleOpen] = useState(false);

  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleOrder, setModuleOrder] = useState("1");
  const [modulePublished, setModulePublished] = useState(true);

  const [creatingModule, setCreatingModule] = useState(false);
   
   //MÓDULO - EDIÇÃO 
  

  const [editModuleOpen, setEditModuleOpen] = useState(false);

  const [editingModule, setEditingModule] =
    useState<CourseModuleReadDto | null>(null);

  const [editModuleName, setEditModuleName] = useState("");
  const [editModuleDescription, setEditModuleDescription] =
    useState("");
  const [editModuleOrder, setEditModuleOrder] = useState("1");
  const [editModulePublished, setEditModulePublished] =
    useState(true);

  const [updatingModule, setUpdatingModule] = useState(false);  

  const [lessonToDelete, setLessonToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [deletingLesson, setDeletingLesson] = useState(false);  

  async function loadCourse() {
    if (!id) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.get<CourseReadDto>(
        `/courses/${id}`
      );

      setCourse(response.data);
    } catch (error) {
      console.error("Erro ao carregar curso:", error);

      toast.error(
        "Não foi possível carregar os dados do curso."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourse();
  }, [id]);  

  function openCreateModuleDialog() {
    const modules = course?.modules ?? [];

    const nextOrder =
      modules.length > 0
        ? Math.max(
            ...modules.map((module) => module.order)
          ) + 1
        : 1;

    setModuleName("");
    setModuleDescription("");
    setModuleOrder(String(nextOrder));
    setModulePublished(true);

    setCreateModuleOpen(true);
  } 

  async function handleCreateModule() {
    if (!id) {
      return;
    }

    if (!moduleName.trim()) {
      toast.error("Informe o nome do módulo.");
      return;
    }

    const order = Number(moduleOrder);

    if (!Number.isInteger(order) || order < 1) {
      toast.error(
        "A ordem do módulo deve ser um número inteiro maior que zero."
      );
      return;
    }

    try {
      setCreatingModule(true);

      await api.post("/coursemodules", {
        name: moduleName.trim(),
        description: moduleDescription.trim() || null,
        courseId: Number(id),
        order,
        isPublished: modulePublished,
      });

      toast.success("Módulo criado com sucesso.");

      setCreateModuleOpen(false);

      await loadCourse();
    } catch (error) {
      console.error("Erro ao criar módulo:", error);

      toast.error(
        "Não foi possível criar o módulo."
      );
    } finally {
      setCreatingModule(false);
    }
  }  

  function openEditModuleDialog(
    module: CourseModuleReadDto
  ) {
    setEditingModule(module);

    setEditModuleName(module.name);
    setEditModuleDescription(module.description ?? "");
    setEditModuleOrder(String(module.order));
   
    setEditModulePublished(true);

    setEditModuleOpen(true);
  }
  

  async function handleUpdateModule() {
    if (!editingModule) {
      return;
    }

    if (!editModuleName.trim()) {
      toast.error("Informe o nome do módulo.");
      return;
    }

    const order = Number(editModuleOrder);

    if (!Number.isInteger(order) || order < 1) {
      toast.error(
        "A ordem do módulo deve ser um número inteiro maior que zero."
      );
      return;
    }

    try {
      setUpdatingModule(true);

      await api.put(
        `/coursemodules/${editingModule.id}`,
        {
          name: editModuleName.trim(),
          description:
            editModuleDescription.trim() || null,
          order,
          isPublished: editModulePublished,
        }
      );

      toast.success("Módulo atualizado com sucesso.");

      setEditModuleOpen(false);
      setEditingModule(null);

      await loadCourse();
    } catch (error) {
      console.error("Erro ao atualizar módulo:", error);

      toast.error(
        "Não foi possível atualizar o módulo."
      );
    } finally {
      setUpdatingModule(false);
    }
  } 

  async function handleDeleteLesson() {
    if (!lessonToDelete) {
      return;
    }

    try {
      setDeletingLesson(true);

      await api.delete(
        `/lessons/${lessonToDelete.id}`
      );

      toast.success("Aula excluída com sucesso.");

      setLessonToDelete(null);

      await loadCourse();
    } catch (error) {
      console.error("Erro ao excluir aula:", error);

      toast.error(
        "Não foi possível excluir a aula."
      );
    } finally {
      setDeletingLesson(false);
    }
  }  

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-center mt-10">
          Carregando...
        </p>
      </div>
    );
  }  

  if (!course) {
    return (
      <div className="p-4">
        <p className="text-center mt-10">
          Curso não encontrado.
        </p>
      </div>
    );
  }  

  const modules = [...(course.modules ?? [])].sort(
    (a, b) => a.order - b.order
  );

  const totalLessons = modules.reduce(
    (total, module) =>
      total + (module.lessons?.length ?? 0),
    0
  );  

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#163E72]">
          {course.title}
        </h1>

        {course.description && (
          <p className="text-gray-700 mt-1">
            {course.description}
          </p>
        )}
      </div>     

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">

          <p>
            <strong>Professor:</strong>{" "}
            {course.teacherName || "Não informado"}
          </p>

          <p>
            <strong>Alunos inscritos:</strong>{" "}
            {course.enrolledUsers?.length ?? 0}
          </p>

          <p>
            <strong>Módulos:</strong>{" "}
            {modules.length}
          </p>

          <p>
            <strong>Aulas:</strong>{" "}
            {totalLessons}
          </p>

        </CardContent>
      </Card>

      <Card>

        <CardHeader>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <CardTitle>
                Módulos e Aulas
              </CardTitle>

              <p className="text-sm text-muted-foreground mt-1">
                Organize o conteúdo do curso por módulos e aulas.
              </p>
            </div>

            <Button
              type="button"
              onClick={openCreateModuleDialog}
              className="bg-[#163E72] hover:bg-[#255690]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar módulo
            </Button>

          </div>

        </CardHeader>

        <CardContent>

          {modules.length > 0 ? (

            <div className="space-y-6">

              {modules.map((module) => {

                const lessons = [
                  ...(module.lessons ?? []),
                ].sort(
                  (a, b) => a.order - b.order
                );

                return (
                  <div
                    key={module.id}
                    className="border rounded-lg p-4 space-y-4"
                  >                  

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <h3 className="font-semibold text-lg text-[#163E72]">
                            Módulo {module.order}:{" "}
                            {module.name}
                          </h3>

                          {/* EDITAR MÓDULO */}

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="Editar módulo"
                            aria-label="Editar módulo"
                            onClick={() =>
                              openEditModuleDialog(module)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                        </div>

                        {module.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {module.description}
                          </p>
                        )}

                      </div>

                      {/* NOVA AULA */}

                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard-coordinator/lessons/create?courseId=${course.id}&moduleId=${module.id}`
                          )
                        }
                        className="bg-[#163E72] hover:bg-[#255690]"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nova aula
                      </Button>

                    </div>                    

                    {lessons.length > 0 ? (

                      <div className="space-y-2 pl-2 sm:pl-4">

                        {lessons.map((lesson) => (

                          <div
                            key={lesson.id}
                            className="border-l-2 pl-3 py-3"
                          >

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                              <div className="min-w-0">

                                <p className="font-medium">
                                  {lesson.order}.{" "}
                                  {lesson.title}
                                </p>

                                {lesson.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {lesson.description}
                                  </p>
                                )}

                              </div>

                              <div className="flex items-center gap-1 shrink-0">

                                {/* EDITAR AULA */}

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  title="Editar aula"
                                  aria-label="Editar aula"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard-coordinator/lessons/${lesson.id}/edit`
                                    )
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>

                                {/* EXCLUIR AULA */}

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  title="Excluir aula"
                                  aria-label="Excluir aula"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    setLessonToDelete({
                                      id: lesson.id,
                                      title: lesson.title,
                                    })
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>

                                {/* STATUS */}

                                <span
                                  className={`text-xs px-2 py-1 rounded-full ml-1 ${
                                    lesson.isPublished
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {lesson.isPublished
                                    ? "Publicada"
                                    : "Rascunho"}
                                </span>

                              </div>

                            </div>

                          </div>

                        ))}

                      </div>

                    ) : (

                      <div className="pl-2 sm:pl-4">

                        <p className="text-sm text-gray-500">
                          Nenhuma aula cadastrada neste módulo.
                        </p>

                      </div>

                    )}

                  </div>
                );
              })}

            </div>

          ) : (

            <div className="text-center py-8">

              <p className="text-gray-500">
                Nenhum módulo cadastrado neste curso.
              </p>

              <Button
                type="button"
                className="mt-4 bg-[#163E72] hover:bg-[#255690]"
                onClick={openCreateModuleDialog}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar primeiro módulo
              </Button>

            </div>

          )}

        </CardContent>
      </Card>      

      <Card>

        <CardHeader>
          <CardTitle>Alunos</CardTitle>
        </CardHeader>

        <CardContent>

          {course.enrolledUsers?.length ? (

            <ul className="list-disc pl-6 space-y-1">

              {course.enrolledUsers.map((student) => (
                <li
                  key={`${student.id}-${student.userName}`}
                >
                  {student.userName}
                </li>
              ))}

            </ul>

          ) : (

            <p>
              Nenhum aluno inscrito.
            </p>

          )}

        </CardContent>
      </Card>     

      <Dialog
        open={createModuleOpen}
        onOpenChange={(open) => {
          if (!creatingModule) {
            setCreateModuleOpen(open);
          }
        }}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>
              Criar módulo
            </DialogTitle>

            <DialogDescription>
              Adicione um novo módulo ao curso.
            </DialogDescription>

          </DialogHeader>

          <div className="space-y-4">

            <div className="space-y-2">

              <Label htmlFor="module-name">
                Nome do módulo
              </Label>

              <Input
                id="module-name"
                value={moduleName}
                onChange={(event) =>
                  setModuleName(event.target.value)
                }
                placeholder="Ex.: Introdução"
                maxLength={100}
                disabled={creatingModule}
              />

            </div>

            <div className="space-y-2">

              <Label htmlFor="module-description">
                Descrição
              </Label>

              <Textarea
                id="module-description"
                value={moduleDescription}
                onChange={(event) =>
                  setModuleDescription(
                    event.target.value
                  )
                }
                placeholder="Descrição do módulo..."
                rows={4}
                maxLength={1000}
                disabled={creatingModule}
              />

            </div>

            <div className="space-y-2">

              <Label htmlFor="module-order">
                Ordem
              </Label>

              <Input
                id="module-order"
                type="number"
                min={1}
                value={moduleOrder}
                onChange={(event) =>
                  setModuleOrder(event.target.value)
                }
                disabled={creatingModule}
              />

            </div>

            <div className="flex items-center gap-2">

              <input
                id="module-published"
                type="checkbox"
                checked={modulePublished}
                onChange={(event) =>
                  setModulePublished(
                    event.target.checked
                  )
                }
                disabled={creatingModule}
                className="h-4 w-4"
              />

              <Label
                htmlFor="module-published"
                className="cursor-pointer"
              >
                Publicar módulo imediatamente
              </Label>

            </div>

          </div>

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCreateModuleOpen(false)
              }
              disabled={creatingModule}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleCreateModule}
              disabled={
                creatingModule ||
                !moduleName.trim()
              }
              className="bg-[#163E72] hover:bg-[#255690]"
            >
              {creatingModule
                ? "Criando..."
                : "Criar módulo"}
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>      

      <Dialog
        open={editModuleOpen}
        onOpenChange={(open) => {
          if (!updatingModule) {
            setEditModuleOpen(open);

            if (!open) {
              setEditingModule(null);
            }
          }
        }}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>
              Editar módulo
            </DialogTitle>

            <DialogDescription>
              Corrija ou altere as informações do módulo.
            </DialogDescription>

          </DialogHeader>

          <div className="space-y-4">

            <div className="space-y-2">

              <Label htmlFor="edit-module-name">
                Nome do módulo
              </Label>

              <Input
                id="edit-module-name"
                value={editModuleName}
                onChange={(event) =>
                  setEditModuleName(
                    event.target.value
                  )
                }
                placeholder="Nome do módulo"
                maxLength={100}
                disabled={updatingModule}
              />

            </div>

            <div className="space-y-2">

              <Label htmlFor="edit-module-description">
                Descrição
              </Label>

              <Textarea
                id="edit-module-description"
                value={editModuleDescription}
                onChange={(event) =>
                  setEditModuleDescription(
                    event.target.value
                  )
                }
                placeholder="Descrição do módulo..."
                rows={4}
                maxLength={1000}
                disabled={updatingModule}
              />

            </div>

            <div className="space-y-2">

              <Label htmlFor="edit-module-order">
                Ordem
              </Label>

              <Input
                id="edit-module-order"
                type="number"
                min={1}
                value={editModuleOrder}
                onChange={(event) =>
                  setEditModuleOrder(
                    event.target.value
                  )
                }
                disabled={updatingModule}
              />

            </div>

            <div className="flex items-center gap-2">

              <input
                id="edit-module-published"
                type="checkbox"
                checked={editModulePublished}
                onChange={(event) =>
                  setEditModulePublished(
                    event.target.checked
                  )
                }
                disabled={updatingModule}
                className="h-4 w-4"
              />

              <Label
                htmlFor="edit-module-published"
                className="cursor-pointer"
              >
                Módulo publicado
              </Label>

            </div>

          </div>

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setEditModuleOpen(false)
              }
              disabled={updatingModule}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleUpdateModule}
              disabled={
                updatingModule ||
                !editModuleName.trim()
              }
              className="bg-[#163E72] hover:bg-[#255690]"
            >
              {updatingModule
                ? "Salvando..."
                : "Salvar alterações"}
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>      

      <Dialog
        open={!!lessonToDelete}
        onOpenChange={(open) => {
          if (!open && !deletingLesson) {
            setLessonToDelete(null);
          }
        }}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>
              Excluir aula?
            </DialogTitle>

            <DialogDescription>

              Tem certeza que deseja excluir a aula{" "}

              <strong>
                "{lessonToDelete?.title}"
              </strong>
              ?

              <br />

              <span className="text-red-600">
                Esta ação não poderá ser desfeita.
              </span>

            </DialogDescription>

          </DialogHeader>

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setLessonToDelete(null)
              }
              disabled={deletingLesson}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteLesson}
              disabled={deletingLesson}
            >
              {deletingLesson
                ? "Excluindo..."
                : "Excluir aula"}
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}

