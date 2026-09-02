"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  TeacherReadDto,
  CourseReadDto,
  CourseModuleReadDto,
} from "@/types/interfaces";

import api from "../../../services/api";

export default function CreateLessonPage() {
  const router = useRouter();

  const [teachers, setTeachers] = useState<TeacherReadDto[]>([]);
  const [courses, setCourses] = useState<CourseReadDto[]>([]);
  const [modules, setModules] = useState<CourseModuleReadDto[]>([]);

  const [teacherId, setTeacherId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");

  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // Carrega professores
  // =========================================================

  useEffect(() => {
    async function loadTeachers() {
      try {
        setLoadingTeachers(true);
        setError("");

        const response = await api.get("/teachers");

        setTeachers(response.data);
      } catch (err) {
        console.error("Erro ao carregar professores:", err);
        setError("Não foi possível carregar os professores.");
      } finally {
        setLoadingTeachers(false);
      }
    }

    loadTeachers();
  }, []);

  // =========================================================
  // Quando o professor muda
  // =========================================================

  useEffect(() => {
    async function loadCourses() {
      if (!teacherId) {
        setCourses([]);
        setModules([]);
        setCourseId("");
        setModuleId("");
        return;
      }

      try {
        setLoadingCourses(true);
        setError("");

        const teacher = teachers.find(
          (item) => item.id === Number(teacherId)
        );

        if (!teacher) {
          setCourses([]);
          return;
        }

        setCourses(teacher.courses ?? []);

        setCourseId("");
        setModuleId("");
        setModules([]);
      } catch (err) {
        console.error("Erro ao carregar cursos:", err);
        setError("Não foi possível carregar os cursos.");
      } finally {
        setLoadingCourses(false);
      }
    }

    loadCourses();
  }, [teacherId, teachers]);

  // =========================================================
  // Quando o curso muda
  // =========================================================

  useEffect(() => {
    async function loadModules() {
      if (!courseId) {
        setModules([]);
        setModuleId("");
        return;
      }

      try {
        setLoadingModules(true);
        setError("");

        const response = await api.get(
          `/coursemodules/course/${courseId}`
        );

        setModules(response.data);
        setModuleId("");
      } catch (err) {
        console.error("Erro ao carregar módulos:", err);
        setError("Não foi possível carregar os módulos.");
        setModules([]);
      } finally {
        setLoadingModules(false);
      }
    }

    loadModules();
  }, [courseId]);

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Nova aula</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Professor */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Professor
            </label>

            <select
              value={teacherId}
              onChange={(event) =>
                setTeacherId(event.target.value)
              }
              disabled={loadingTeachers}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">
                {loadingTeachers
                  ? "Carregando professores..."
                  : "Selecione o professor"}
              </option>

              {teachers.map((teacher) => (
                <option
                  key={teacher.id}
                  value={teacher.id}
                >
                  {teacher.userName}
                </option>
              ))}
            </select>
          </div>

          {/* Curso */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Curso
            </label>

            <select
              value={courseId}
              onChange={(event) =>
                setCourseId(event.target.value)
              }
              disabled={!teacherId || loadingCourses}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">
                {!teacherId
                  ? "Selecione primeiro o professor"
                  : loadingCourses
                    ? "Carregando cursos..."
                    : "Selecione o curso"}
              </option>

              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Módulo */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Módulo
            </label>

            <select
              value={moduleId}
              onChange={(event) =>
                setModuleId(event.target.value)
              }
              disabled={!courseId || loadingModules}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">
                {!courseId
                  ? "Selecione primeiro o curso"
                  : loadingModules
                    ? "Carregando módulos..."
                    : "Selecione o módulo"}
              </option>

              {modules.map((module) => (
                <option
                  key={module.id}
                  value={module.id}
                >
                  {module.order}. {module.name}
                </option>
              ))}
            </select>
          </div>

          {/* Próxima etapa */}

          <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
            Selecione o professor, curso e módulo para
            continuar o cadastro da aula.
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard-coordinator/lessons"
                )
              }
            >
              Cancelar
            </Button>

            <Button
              type="button"
              disabled={!moduleId}
            >
              Continuar
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}