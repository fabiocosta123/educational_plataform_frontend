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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseReadDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

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

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleCourses = showAll ? filteredCourses : filteredCourses.slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-sm border rounded-lg">
        <CardHeader className="flex justify-between items-center">
          <Input
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 border-gray-300"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-[#163E72]">Título</TableHead>
                <TableHead className="font-semibold text-[#163E72]">Descrição</TableHead>
                <TableHead className="font-semibold text-[#163E72]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Detalhes
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(course.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCourses.length > 6 && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                className="border-gray-300"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Mostrar menos" : "Mostrar mais"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
