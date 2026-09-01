"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/app/services/api";
import { toast } from "react-toastify";
import { StudentDto } from "@/types/interfaces";

interface Course {
    id: number;
    title: string;
    teacherName: string;
}

interface Props {
    student?: StudentDto;
    editingCourseId?: number;
}

export function useStudentForm({
    student,
    editingCourseId,
}: Props) {

    

// Dados pessoais


const [userName, setUserName] = useState("");
const [userEmail, setUserEmail] = useState("");
const [birthDate, setBirthDate] = useState("");
const [cpf, setCpf] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");


// Matrícula


const [courseId, setCourseId] = useState(0);
const [status, setStatus] = useState("Ativo");


// Cursos


const [courses, setCourses] = useState<Course[]>([]);

const selectedCourse = useMemo(
    () => courses.find(course => course.id === courseId),
    [courses, courseId]
);


// Carregar cursos


useEffect(() => {
    async function loadCourses() {
        try {
            const { data } = await api.get<Course[]>("/courses");

            setCourses(data);
        } catch {
            toast.error("Erro ao carregar cursos.");
        }
    }

    loadCourses();
}, []);


// Carregar dados do aluno


useEffect(() => {
    if (!student) {
        return;
    }

    setUserName(student.userName ?? "");
    setUserEmail(student.userEmail ?? "");
    setBirthDate(student.birthDate?.split("T")[0] ?? "");
    setCpf(student.cpf ?? "");
    setPhoneNumber(student.phoneNumber ?? "");

    /*
     * Se editingCourseId foi informado, procuramos
     * especificamente essa matrícula.
     *
     * Caso contrário, utilizamos a primeira matrícula
     * encontrada para o aluno.
     */
    const enrollment =
        student.courseEnrolled?.find(
            enrollment =>
                enrollment.courseId === editingCourseId
        ) ??
        student.courseEnrolled?.[0];

    if (!enrollment) {
        setCourseId(0);
        setStatus("Ativo");
        return;
    }

    setCourseId(enrollment.courseId);
    setStatus(enrollment.status ?? "Ativo");

}, [student, editingCourseId]);


// Limpar formulário


function clearForm() {
    setUserName("");
    setUserEmail("");
    setBirthDate("");
    setCpf("");
    setPhoneNumber("");

    setCourseId(0);
    setStatus("Ativo");
}

return {
    // Dados pessoais
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

    // Matrícula
    courseId,
    setCourseId,

    status,
    setStatus,

    // Cursos
    courses,
    selectedCourse,

    // Ações
    clearForm,
};


}
