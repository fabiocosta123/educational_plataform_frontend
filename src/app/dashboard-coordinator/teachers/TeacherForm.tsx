"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../services/api";
import { isValidCpf, formatCpf } from "@/utils/cpf";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface TeacherInitialData {
  id: number;
  userName?: string;
  userEmail?: string;
  phoneNumber?: string;
  cpf?: string;
  birthDate?: string;
}

interface TeacherFormProps {
  onSave: (data: unknown) => void;
  initialData?: TeacherInitialData | null;
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (payload.errors && typeof payload.errors === "object") {
      const messages = Object.values(payload.errors as Record<string, unknown>)
        .flat()
        .filter((item): item is string => typeof item === "string");

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }

    if (typeof payload.title === "string" && payload.title.trim()) {
      return payload.title;
    }
  }

  return fallback;
}

export default function TeacherForm({ onSave, initialData }: TeacherFormProps) {
  const isEditing = Boolean(initialData);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setUserName(initialData.userName ?? "");
    setUserEmail(initialData.userEmail ?? "");
    setPhoneNumber(initialData.phoneNumber ?? "");
    setCpf(initialData.cpf ? formatCpf(initialData.cpf) : "");
    setBirthDate(
      initialData.birthDate ? initialData.birthDate.slice(0, 10) : ""
    );
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cpf && !isValidCpf(cpf)) {
      const message = "Informe um CPF válido.";
      setCpfError(message);
      toast.error(message);
      return;
    }

    if (!isEditing && !isValidCpf(cpf)) {
      const message = "Informe um CPF válido.";
      setCpfError(message);
      toast.error(message);
      return;
    }

    if (!isEditing && password.trim().length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (isEditing && password.trim() && password.trim().length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (!birthDate) {
      toast.error("Informe a data de nascimento.");
      return;
    }

    try {
      setSaving(true);
      setCpfError("");

      const payload = {
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        phoneNumber,
        birthDate,
        cpf,
        ...(password.trim() ? { password: password.trim() } : {}),
        ...(!isEditing ? { profile: 2, role: "Teacher" } : {}),
      };

      const response = isEditing
        ? await api.put(`/teachers/${initialData!.id}`, payload)
        : await api.post("/teachers", payload);

      onSave(response.data);

      if (!isEditing) {
        toast.success("Professor criado com sucesso!");
        setUserName("");
        setUserEmail("");
        setPassword("");
        setBirthDate("");
        setCpf("");
        setPhoneNumber("");
      } else {
        toast.success("Dados do professor atualizados.");
        setPassword("");
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Erro ao salvar professor."));
    } finally {
      setSaving(false);
    }
  };

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2");
  }

  return (
    <Card className="mb-6 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#163E72]">
          {isEditing ? "Editar professor" : "Novo Professor"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="teacher-name">Nome *</Label>
            <Input
              id="teacher-name"
              placeholder="Nome do professor"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="teacher-phone">Telefone</Label>
            <Input
              id="teacher-phone"
              placeholder="(00) 00000-0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="teacher-email">E-mail *</Label>
            <Input
              id="teacher-email"
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <Input value="Professor" readOnly className="bg-gray-100" />

          <div className="space-y-1">
            <Label htmlFor="teacher-password">
              {isEditing ? "Nova senha (opcional)" : "Senha *"}
            </Label>
            <Input
              id="teacher-password"
              type="password"
              placeholder={
                isEditing
                  ? "Deixe em branco para manter a senha atual"
                  : "Mínimo de 6 caracteres"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditing}
              minLength={isEditing ? undefined : 6}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="teacher-birth">Data de nascimento *</Label>
            <Input
              id="teacher-birth"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="teacher-cpf">{isEditing ? "CPF" : "CPF *"}</Label>
            <Input
              id="teacher-cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => {
                const value = formatCpf(e.target.value);
                setCpf(value);
                setCpfError(
                  value.length === 0 || isValidCpf(value)
                    ? ""
                    : "CPF inválido."
                );
              }}
              required={!isEditing}
            />
            {cpfError && (
              <p className="text-xs text-red-500">{cpfError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full sm:w-auto bg-[#163E72] text-white"
            )}
          >
            {saving
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Salvar Professor"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
