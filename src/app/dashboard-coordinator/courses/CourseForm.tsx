"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CourseReadDto } from "@/types/interfaces";
import api from "../../services/api";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Teacher {
  id: number;
  userName: string;
}

interface CourseFormProps {
  onSave: (data: CourseReadDto) => void;
  initialData?: CourseReadDto | null;
}

export default function CourseForm({ onSave, initialData }: CourseFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState<string>(""); // usar string para compatibilidade com Select
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setTeacherId(initialData.teacherId?.toString() || "");
    }
  }, [initialData]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get<Teacher[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/teachers`
        );
        setTeachers(res.data);
      } catch {
        toast.error("Erro ao carregar professores");
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (initialData) {
        const response = await api.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${initialData.id}`,
          { id: initialData.id, title, description, teacherId: Number(teacherId) }
        );
        onSave(response.data);
        toast.success("Curso atualizado com sucesso!");
      } else {
        const payload = { title, description, teacherId: Number(teacherId) };
        const response = await api.post<CourseReadDto>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
          payload
        );
        onSave(response.data);
        toast.success("Curso criado com sucesso!");
      }

      setTitle("");
      setDescription("");
      setTeacherId("");
    } catch {
      toast.error("Erro ao salvar curso");
    }
  };

  return (
    <Card className="mb-6 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#163E72]">
          {initialData ? "Editar Curso" : "Novo Curso"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              type="text"
              placeholder="Título do curso"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição do curso"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Professor</Label>
            <Select
              value={teacherId}
              onValueChange={(value) => setTeacherId(value ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um professor">
                  {teachers.find((t) => t.id.toString() === teacherId)?.userName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full sm:w-auto bg-[#163E72]">
            {initialData ? "Atualizar Curso" : "Salvar Curso"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
