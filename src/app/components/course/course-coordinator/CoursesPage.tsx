"use client";

import { useEffect, useState } from "react";
import { CourseReadDto } from "../../../../types/interfaces";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseReadDto[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await api.get<CourseReadDto[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`
      );
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  const handleDelete = (id: number) => {
    confirmAlert({
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir este curso?",
      buttons: [
        {
          label: "Sim",
          onClick: async () => {
            try {
              await api.delete(`/courses/${id}`);
              setCourses(courses.filter((c) => c.id !== id));
              toast.success("Curso excluído com sucesso!");
            } catch {
              toast.error("Erro ao excluir curso");
            }
          },
        },
        { label: "Cancelar" },
      ],
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#163E72]">Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="ghost" className="text-blue-600 hover:underline">
                      Detalhes
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(course.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
