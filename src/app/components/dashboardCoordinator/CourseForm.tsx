"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CourseForm({ onSave }: { onSave: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        description,
        creatorId: 1,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
        payload
      );

      onSave(response.data);
      toast.success("Curso criado com sucesso!");

      setTitle("");
      setDescription("");
    } catch {
      toast.error("Erro ao criar curso");
    }
  };

  return (
    <Card className="mb-6 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#163E72]">
          Novo Curso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Título do curso"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            placeholder="Descrição do curso"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" className="w-full sm:w-auto">
            Salvar Curso
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
