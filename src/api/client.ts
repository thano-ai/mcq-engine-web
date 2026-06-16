import type { QuizResult, UploadResponse } from "../types/mcq";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed (${response.status})`);
  }
  return data as T;
}

export async function uploadContent(
  formData: FormData
): Promise<UploadResponse> {
  const response = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<UploadResponse>(response);
}

export async function submitQuiz(
  sessionId: string,
  answers: Array<{ questionId: number; selected: string }>
): Promise<QuizResult> {
  const response = await fetch(`${API_BASE}/api/quiz/${sessionId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return handleResponse<QuizResult>(response);
}
