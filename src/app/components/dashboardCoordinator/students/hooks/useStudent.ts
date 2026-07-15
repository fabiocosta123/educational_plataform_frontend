"use client";
import { useState, useEffect } from "react";
import { getStudents } from "../../../../services/studentService";

export function useStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudents()
      .then(data => setStudents(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { students, loading, error };
}
