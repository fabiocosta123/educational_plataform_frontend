import api from "./api";

export async function getTeachers() {
  const res = await api.get("/teachers");
  return res.data;
}
