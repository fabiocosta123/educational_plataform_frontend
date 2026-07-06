"use client";

import CourseDetailsPage from "../../../components/course/course-coordinator/CourseDetailsPage";

export default function CourseDetailsRoute({ params }: { params: { id: string } }) {
  return <CourseDetailsPage />;
}
