"use client";

import CourseEditPage from "../../../../components/dashboardCoordinator/course/CourseEditPage";

export default function CourseEditRoute({ params }: { params: { id: string } }) {
  return <CourseEditPage />;
}