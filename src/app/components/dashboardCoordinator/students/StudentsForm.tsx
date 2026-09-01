"use client";

import api from "../../../services/api";
import { toast } from "react-toastify";

import { StudentDto } from "@/types/interfaces";

import { useStudentForm } from "./hooks/useStudentForm";

import PersonalDataSection from "./PersonalDataSection";
import EnrollmentSection from "./EnrollmentSection";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface StudentFormProps {
  student?: StudentDto;
  editingCourseId?: number;
  onSave: (data: any) => void;
}

export default function StudentForm({
  student,
  editingCourseId,
  onSave,
}: StudentFormProps) {

  const {
    userName,
    setUserName,

    userEmail,
    setUserEmail,

    birthDate,
    setBirthDate,

    cpf,
    setCpf,

    phoneNumber,
    setPhoneNumber,

    courseId,
    setCourseId,

    status,
    setStatus,

    courses,
    selectedCourse,

    clearForm,
  } = useStudentForm({
    student,
    editingCourseId,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      let response;

      if (student) {
        const payload = {
          userName,
          userEmail,
          phoneNumber,
          birthDate: new Date(birthDate).toISOString(),
          profile: 1,

          currentCourseId: editingCourseId ?? courseId,
          newCourseId: courseId,

          status,
        };

        console.log("PUT /users payload:", payload);

        response = await api.put(
          `/users/${student.id}`,
          payload
        );
      } else {
        const payload = {
          userName,
          userEmail,
          cpf,
          phoneNumber,
          birthDate: new Date(birthDate).toISOString(),
          courseId,
          status,
        };

        console.log("POST /users/students payload:", payload);

        response = await api.post(
          "/users/students",
          payload
        );
      }

      onSave(response.data);
      clearForm();

    } catch (error: any) {
      console.error("Erro ao salvar aluno:", error);

      let message = "Erro ao salvar aluno.";

      if (typeof error.response?.data === "string") {
        message = error.response.data;
      } else if (error.response?.data?.title) {
        message = error.response.data.title;
      } else if (error.response?.data?.errors) {
        message = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
      }

      toast.error(message);
    }
  }
  return (
    <Card className="w-full shadow-lg">

      <CardHeader>
        <CardTitle>
          {student ? "Editar Aluno" : "Novo Aluno"}
        </CardTitle>
      </CardHeader>

      <CardContent>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <PersonalDataSection
            userName={userName}
            setUserName={setUserName}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            cpf={cpf}
            setCpf={setCpf}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            isEditing={!!student}
          />

          <Separator />

          <EnrollmentSection
            courses={courses}
            courseId={courseId}
            setCourseId={setCourseId}
            teacherName={selectedCourse?.teacherName ?? ""}
            status={status}
            setStatus={setStatus}
          />

          <Button
            type="submit"
            className="w-full"
          >
            {student ? "Salvar Alterações" : "Cadastrar Aluno"}
          </Button>

        </form>

      </CardContent>

    </Card>
  );
}