"use client";

import CourseDetailsPage from "../../../../components/dashboardCoordinator/course/CourseDetailsPage";

export default function CourseDetailsRoute({ params }: { params: { id: string } }) {
  return <CourseDetailsPage />;
}