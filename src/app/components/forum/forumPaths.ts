export function forumCoursePath(basePath: string, courseId: number) {
  return `${basePath}/courses/${courseId}/forum`;
}

export function forumQuestionPath(
  basePath: string,
  courseId: number,
  questionId: number
) {
  return `${basePath}/courses/${courseId}/forum/${questionId}`;
}

export function formatForumDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isStaffReply(profile: string) {
  return profile === "Teacher" || profile === "Coordinator";
}
