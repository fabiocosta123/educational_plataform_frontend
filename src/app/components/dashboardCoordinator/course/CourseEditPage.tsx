"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CourseReadDto, UserReadDto } from "../../../../types/interfaces";
import axios from "axios";
import { toast } from "react-toastify";
import api from "@/app/services/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function CourseEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<CourseReadDto | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState<string>("");
  const [price, setPrice] = useState("838.80");
  const [installmentCount, setInstallmentCount] = useState("12");
  const [teachers, setTeachers] = useState<UserReadDto[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get<CourseReadDto>(`/courses/${id}`);
        setCourse(res.data);
        setTitle(res.data.title ?? "");
        setDescription(res.data.description ?? "");
        setTeacherId(res.data.teacherId?.toString() ?? "");
        setPrice(String(res.data.price ?? 838.8));
        setInstallmentCount(String(res.data.installmentCount ?? 12));
      } catch {
        toast.error("Erro ao carregar curso");
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get<UserReadDto[]>(`teachers`);
        setTeachers(res.data);
      } catch {
        toast.error("Erro ao carregar professores");
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!course?.teacherId) {
      return;
    }
    setTeachers((current) => {
      if (current.some((teacher) => teacher.id === course.teacherId)) {
        return current;
      }
      return [
        {
          id: course.teacherId,
          userName: course.teacherName || "Professor atual",
          userEmail: "",
          birthDate: "",
          role: "",
          courseEnrolled: [],
          coursesCreated: [],
        },
        ...current,
      ];
    });
  }, [course, teachers.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedTeacherId = Number(teacherId) || course?.teacherId || 0;
    if (!resolvedTeacherId) {
      toast.error("Selecione um professor.");
      return;
    }
    try {
      await api.put(`/courses/${id}`, {
        title,
        description,
        teacherId: resolvedTeacherId,
        price: Number(String(price).replace(",", ".")) || 0,
        installmentCount: Number(installmentCount) || 12,
      });
      toast.success("Curso atualizado com sucesso!");
      router.push(`/dashboard-coordinator/courses/${id}/details`);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message
        : undefined;
      toast.error(message || "Erro ao atualizar curso");
    }
  };

  if (!course) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-[#163E72]">Editar Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Professor</Label>
            <Select value={teacherId} onValueChange={(value) => setTeacherId(value ?? "")}>
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
          <div>
            <Label htmlFor="edit-price">Valor total do curso (R$)</Label>
            <Input
              id="edit-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-installments">Parcelas (PIX)</Label>
            <Input
              id="edit-installments"
              type="number"
              min="1"
              max="24"
              value={installmentCount}
              onChange={(e) => setInstallmentCount(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              Ex.: 838,80 em 12x de 69,90. A 1ª parcela é na inscrição; as outras a cada 30 dias.
            </p>
          </div>
          <Button type="submit" className="bg-[#163E72]">Salvar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
