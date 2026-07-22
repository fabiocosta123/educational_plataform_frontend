"use client";

import { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { StudentDto } from "@/types/interfaces";

interface StudentFormProps {
  student?: StudentDto;
  onSave: (data: any) => void;
}

export default function StudentForm({ student, onSave }: StudentFormProps) {
  const [userName, setUserName] = useState(student?.userName ?? "");
  const [userEmail, setUserEmail] = useState(student?.userEmail ?? "");
  const [birthDate, setBirthDate] = useState(student?.birthDate?.split("T")[0] ?? "");
  const [cpf, setCpf] = useState(student?.cpf ?? "");
  const [phoneNumber, setPhoneNumber] = useState(student?.phoneNumber ?? "");


  const [courseId, setCourseId] = useState(student?.courseEnrolled?.[0]?.courseId ?? 0);
  const [teacherId, setTeacherId] = useState(0);
  const [status, setStatus] = useState(student?.courseEnrolled?.[0]?.status ?? "Ativo");

  const [courses, setCourses] = useState<{ id: number; title: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: number; userName: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const coursesRes = await api.get("/courses");
        setCourses(coursesRes.data);
        const teachersRes = await api.get("/teachers/list");
        setTeachers(teachersRes.data);
      } catch {
        toast.error("Erro ao carregar cursos/professores");
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        userName,
        userEmail,
        cpf,
        phoneNumber,
        birthDate: new Date(birthDate).toISOString(),
        courseEnrollments: [
          {
            courseId,
            status
          }
        ]
      };

      let response;
      if (student) {
        // edição
        response = await api.put(`/users/${student.id}`, payload);
        toast.success("Aluno atualizado com sucesso!");
      } else {
        // criação
        response = await api.post(`/users/students`, payload);
        toast.success("Aluno criado com sucesso!");
      }

      onSave(response.data);
    } catch (error: any) {
      const message =
        error.response?.data?.title ||
        error.response?.data?.errors ||
        "Erro ao salvar aluno";
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
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#163E72] mb-4">
        {student ? "Editar Estudante" : "Novo Estudante"}
      </h3>

      <input type="text" placeholder="Nome do aluno" value={userName}
        onChange={(e) => setUserName(e.target.value)} className="w-full border rounded p-2 mb-4" required />

      <input type="text" placeholder="Telefone (00) 00000-0000" value={phoneNumber}
        onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
        className="w-full border rounded p-2 mb-4" />

      <input type="email" placeholder="Email" value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)} className="w-full border rounded p-2 mb-4" required />

      <input type="date" placeholder="Data de nascimento" value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)} className="w-full border rounded p-2 mb-4" required />

      <input type="text" placeholder="CPF (000.000.000-00)" value={cpf}
        onChange={(e) => setCpf(formatCpf(e.target.value))}
        className="w-full border rounded p-2 mb-4" />

      <select value={courseId} onChange={(e) => setCourseId(Number(e.target.value))}
        className="w-full border rounded p-2 mb-4">
        <option value={0}>Selecione um curso</option>
        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>

      <select value={teacherId} onChange={(e) => setTeacherId(Number(e.target.value))}
        className="w-full border rounded p-2 mb-4">
        <option value={0}>Selecione um professor</option>
        {teachers.map(t => <option key={t.id} value={t.id}>{t.userName}</option>)}
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}
        className="w-full border rounded p-2 mb-4">
        <option value="Ativo">Ativo</option>
        <option value="Trancado">Trancado</option>
        <option value="Concluido">Concluído</option>
      </select>

      <button type="submit" className="bg-[#163E72] text-white px-4 py-2 rounded hover:bg-[#255690] transition">
        {student ? "Salvar Alterações" : "Salvar Estudante"}
      </button>
    </form>
  );
}
