export interface McqQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface UploadResponse {
  sessionId: string;
  totalAvailable: number;
  questionCount: number;
  parseMethod: "regex" | "gemini" | "regex+gemini";
  questions: McqQuestion[];
}

export interface QuizResult {
  total: number;
  correct: number;
  percentage: number;
  answers: Array<{
    questionId: number;
    question: string;
    selected: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
}

export type QuizMode = "all" | "random";

export type AppPhase = "upload" | "quiz" | "results";

export interface UserAnswer {
  questionId: number;
  selected: string;
}
