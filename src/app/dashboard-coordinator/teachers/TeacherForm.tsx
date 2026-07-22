"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";


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
        Role: "Teacher"
      };

      console.log("Payload enviado:", payload);

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teachers`,
        payload
      );

      onSave(response.data);
      toast.success("Professor criado com sucesso!");
      setUserName("");
      setUserEmail("");
      setPassword("");
      setBirthDate("");
      setCpf("");
    } catch (error: any) {
      console.error("Erro detalhado:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      const message =
        error.response?.data?.title ||
        error.response?.data?.errors ||
        "Erro ao criar professor";
      toast.error(message);
    }

  };


  function formatCpf(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, "")        // remove tudo que não for número
      .slice(0, 11)              // limita a 11 dígitos
      .replace(/(\d{2})(\d)/, "($1) $2") // adiciona parênteses no DDD
      .replace(/(\d{5})(\d{4})$/, "$1-$2"); // adiciona hífen
  }



  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#163E72] mb-4">Novo Professor</h3>

      <input type="text" placeholder="Nome do professor" value={userName}
        onChange={(e) => setUserName(e.target.value)} className="w-full border rounded p-2 mb-4" required />

        <input
  type="text"
  placeholder="Telefone (00) 00000-0000"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
  className="w-full border rounded p-2 mb-4"
/>


      <input type="email" placeholder="Email" value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)} className="w-full border rounded p-2 mb-4" required />

      <input
        type="text"
        value="Professor"
        readOnly
        className="w-full border rounded p-2 mb-4 bg-gray-100"
      />



      <input type="password" placeholder="Senha" value={password}
        onChange={(e) => setPassword(e.target.value)} className="w-full border rounded p-2 mb-4" required />

      <input type="date" placeholder="Data de nascimento" value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)} className="w-full border rounded p-2 mb-4" required />

      {/* CPF com máscara */}
      <input
        type="text"
        placeholder="CPF (000.000.000-00)"
        value={cpf}
        onChange={(e) => setCpf(formatCpf(e.target.value))}
        className="w-full border rounded p-2 mb-4"
      />


      <button type="submit" className="bg-[#163E72] text-white px-4 py-2 rounded hover:bg-[#255690] transition">
        Salvar Professor
      </button>
    </form>
  );
}
