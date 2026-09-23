
import api from "./api";

export async function getStudents() {
  const res = await api.get("/users/students");
  return res.data;
}

export async function getStudentById(id: number) {
  const res = await api.get(`/users/students/${id}`);
  return res.data;
}

export async function createStudent(student: {
  userName: string;
  userEmail: string;
  cpf: string;
  birthDate: string; 
  courseId: number;
  teacherId: number;
  status: string;
}) {
  const res = await api.post("/users/students", student);
  return res.data;
}

