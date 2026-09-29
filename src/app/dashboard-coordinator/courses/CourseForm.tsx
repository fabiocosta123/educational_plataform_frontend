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
  const [price, setPrice] = useState("838.80");
  const [installmentCount, setInstallmentCount] = useState("12");
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setTeacherId(initialData.teacherId?.toString() || "");
      setPrice(String(initialData.price ?? 0));
      setInstallmentCount(String(initialData.installmentCount ?? 12));
    }
  }, [initialData]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get<Teacher[]>("/teachers");
        setTeachers(res.data);
      } catch {
        toast.error("Erro ao carregar professores");
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherId) {
      toast.error("Selecione um professor.");
      return;
    }

    const pricing = {
      title,
      description,
      teacherId: Number(teacherId),
      price: Number(price.replace(",", ".")) || 0,
      installmentCount: Number(installmentCount) || 12,
    };

    try {
      if (initialData) {
        const response = await api.put(
          `/courses/${initialData.id}`,
          { id: initialData.id, ...pricing }
        );
        onSave(response.data);
        toast.success("Curso atualizado com sucesso!");
      } else {
        const payload = pricing;
        const response = await api.post<CourseReadDto>(
          "/courses",
          payload
        );
        onSave(response.data);
        toast.success("Curso criado com sucesso!");
      }

      setTitle("");
      setDescription("");
      setTeacherId("");
      setPrice("0");
      setInstallmentCount("12");
    } catch (error: unknown) {
      const data = (error as { response?: { data?: unknown } }).response?.data;
      let message = "Erro ao salvar curso";

      if (typeof data === "string" && data.trim()) {
        message = data;
      } else if (data && typeof data === "object") {
        const payload = data as { message?: string; title?: string; errors?: Record<string, unknown> };
        if (payload.message) {
          message = payload.message;
        } else if (payload.errors) {
          message = Object.values(payload.errors).flat().join(" ");
        } else if (payload.title) {
          message = payload.title;
        }
      }

      toast.error(message);
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
            <Label htmlFor="price">Valor total do curso (R$)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="installments">Parcelas (PIX)</Label>
            <Input
              id="installments"
              type="number"
              min="1"
              max="24"
              value={installmentCount}
              onChange={(e) => setInstallmentCount(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              Ex.: R$ 838,80 em 12x de R$ 69,90. A 1ª parcela é paga na inscrição e libera o curso.
              As demais vencem a cada 30 dias. PIX só é gerado na hora de pagar cada parcela.
            </p>
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
