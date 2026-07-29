"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TeacherFormProps {
  onSave: (data: any) => void;
}

export default function TeacherForm({ onSave }: TeacherFormProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        UserName: userName,
        UserEmail: userEmail,
        Password: password,
        Profile: 2,
        BirthDate: new Date(birthDate).toISOString(),
        phoneNumber,
        CPF: cpf || "",
        Role: "Teacher",
      };

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teachers`,
        payload
      );

      onSave(response.data);
      toast.success("Professor criado com sucesso!");
      setUserName(""); setUserEmail(""); setPassword(""); setBirthDate(""); setCpf(""); setPhoneNumber("");
    } catch (error: any) {
      const message =
        error.response?.data?.title ||
        error.response?.data?.errors ||
        "Erro ao criar professor";
      toast.error(message);
    }
  };

  function formatCpf(value: string) {
    return value.replace(/\D/g, "").slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatPhone(value: string) {
    return value.replace(/\D/g, "").slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2");
  }

  return (
    <Card className="mb-6 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#163E72]">Novo Professor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Nome do professor" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          <Input placeholder="Telefone (00) 00000-0000" value={phoneNumber} onChange={(e) => setPhoneNumber(formatPhone(e.target.value))} />
          <Input type="email" placeholder="Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
          <Input value="Professor" readOnly className="bg-gray-100" />
          <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input type="date" placeholder="Data de nascimento" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
          <Input placeholder="CPF (000.000.000-00)" value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))} />
          <Button type="submit" className="w-full sm:w-auto bg-[#163E72]">Salvar Professor</Button>
        </form>
      </CardContent>
    </Card>
  );
}
