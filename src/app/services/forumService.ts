import axios from "axios";
import api from "./api";
import type {
  ForumQuestionCreateDto,
  ForumQuestionListDto,
  ForumQuestionReadDto,
  ForumReplyCreateDto,
  ForumReplyReadDto,
} from "@/types/interfaces";

export function getForumErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }
  }

  return fallback;
}

export async function getForumQuestions(
  courseId: number,
  filters?: { lessonId?: number; resolved?: boolean }
): Promise<ForumQuestionListDto[]> {
  const response = await api.get<ForumQuestionListDto[]>(
    `/courses/${courseId}/forum/questions`,
    {
      params: {
        lessonId: filters?.lessonId,
        resolved: filters?.resolved,
      },
    }
  );

  return response.data;
}

export async function getForumQuestion(
  questionId: number
): Promise<ForumQuestionReadDto> {
  const response = await api.get<ForumQuestionReadDto>(
    `/forum/questions/${questionId}`
  );
  return response.data;
}

export async function createForumQuestion(
  dto: ForumQuestionCreateDto
): Promise<ForumQuestionReadDto> {
  const response = await api.post<ForumQuestionReadDto>(
    "/forum/questions",
    dto
  );
  return response.data;
}

export async function createForumReply(
  questionId: number,
  dto: ForumReplyCreateDto
): Promise<ForumReplyReadDto> {
  const response = await api.post<ForumReplyReadDto>(
    `/forum/questions/${questionId}/replies`,
    dto
  );
  return response.data;
}

export async function resolveForumQuestion(
  questionId: number,
  isResolved: boolean
): Promise<ForumQuestionReadDto> {
  const response = await api.patch<ForumQuestionReadDto>(
    `/forum/questions/${questionId}/resolve`,
    { isResolved }
  );
  return response.data;
}
