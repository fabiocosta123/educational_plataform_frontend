"use client";

import CourseDetailsPage from "../../../../components/dashboardCoordinator/course/CourseDetailsPage";

export default function CourseDetailsRoute({ params,  }: { params: Promise<{ id: string }> }) {
  return <CourseDetailsPage />;
}