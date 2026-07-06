"use client";

import CourseEditPage from "../../../components/course/course-coordinator/CourseEditPage";

export default function CourseEditRoute({ params }: { params: { id: string } }) {
  return <CourseEditPage />;
}
