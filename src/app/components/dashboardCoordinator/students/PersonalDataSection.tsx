"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCpf, formatPhone } from "./masks";

interface Props {
  userName: string;
  setUserName: (value: string) => void;

  userEmail: string;
  setUserEmail: (value: string) => void;

  cpf: string;
  setCpf: (value: string) => void;

  phoneNumber: string;
  setPhoneNumber: (value: string) => void;

  birthDate: string;
  setBirthDate: (value: string) => void;

  isEditing: boolean;
}

export default function PersonalDataSection({
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  cpf,
  setCpf,
  phoneNumber,
  setPhoneNumber,
  birthDate,
  setBirthDate,
  isEditing,
}: Props) {
  return (
    <div className="space-y-4">

      <div className="space-y-2">
        <Label>Nome</Label>

        <Input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>

        <Input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="email@empresa.com"
        />
      </div>

      {!isEditing && (
        <div className="space-y-2">
          <Label>CPF</Label>

          <Input
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            placeholder="000.000.000-00"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Telefone</Label>

        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
          placeholder="(11) 99999-9999"
        />
      </div>

      <div className="space-y-2">
        <Label>Data de nascimento</Label>

        <Input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

    </div>
  );
}