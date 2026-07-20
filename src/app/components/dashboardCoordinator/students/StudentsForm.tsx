"use client";

import { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";

interface StudentFormProps {
  onSave: (data: any) => void;
}

export default function StudentForm({ onSave }: StudentFormProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [courseId, setCourseId] = useState(0);
  const [teacherId, setTeacherId] = useState(0);
  const [status, setStatus] = useState("Ativo");

  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

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
        birthDate: new Date(birthDate).toISOString(),
        courseId,
        teacherId,
        status
      };

      const response = await api.post(
        `/users/students`,
        payload
      );

      onSave(response.data);
      toast.success("Aluno criado com sucesso!");
    } catch (error: any) {
      const message =
        error.response?.data?.title ||
        error.response?.data?.errors ||
        "Erro ao criar aluno";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#163E72] mb-4">Novo Estudante</h3>

      <input type="text" placeholder="Nome do aluno" value={userName}
        onChange={(e) => setUserName(e.target.value)} className="w-full border rounded p-2 mb-4" required />

      <input type="email" placeholder="Email" value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)} className="w-full border rounded p-2 mb-4" required />

      <input type="date" placeholder="Data de nascimento" value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)} className="w-full border rounded p-2 mb-4" required />

      <input type="text" placeholder="CPF" value={cpf}
        onChange={(e) => setCpf(e.target.value)} className="w-full border rounded p-2 mb-4" />

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
        Salvar Estudante
      </button>
    </form>
  );
}
