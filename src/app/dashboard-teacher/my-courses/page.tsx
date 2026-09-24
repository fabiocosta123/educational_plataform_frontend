"use client";

import { Suspense } from "react";
import MyCoursesClient from "./MyCoursesClient";

export default function MyCoursesPage() {
  return (
    <Suspense fallback={<p className="text-gray-600">Carregando cursos...</p>}>
      <MyCoursesClient />
    </Suspense>
  );
}
