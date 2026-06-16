import type { QuizResult, UploadResponse } from "../types/mcq";

const API_BASE = import.meta.env.VITE_API_URL?.trim() ?? "";

async function handleResponse<T>(response: Response): Promise<T> {
  let data: { error?: string };
  try {
    data = await response.json();
  } catch {
    throw new Error(
      response.ok
        ? "Invalid response from server"
        : `Cannot reach API server (${response.status}). Make sure the backend is running on port 3001.`
    );
  }
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed (${response.status})`);
  }
  return data as T;
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: init?.signal ?? AbortSignal.timeout(120_000),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new Error("Request timed out. Large files may need a Gemini API key in back/.env.");
    }
    throw new Error(
      "Cannot connect to the API. Start both servers from the project root with: npm run dev"
    );
  }
}

export async function uploadContent(
  formData: FormData
): Promise<UploadResponse> {
  const response = await apiFetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  return handleResponse<UploadResponse>(response);
}

export async function submitQuiz(
  sessionId: string,
  answers: Array<{ questionId: number; selected: string }>
): Promise<QuizResult> {
  const response = await apiFetch(`/api/quiz/${sessionId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return handleResponse<QuizResult>(response);
}
