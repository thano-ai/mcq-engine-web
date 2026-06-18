export type QuestionType = "mcq" | "open";

export type InputMode = "extract" | "generate";

export type OpenCommandWord =
  | "apply"
  | "develop"
  | "justify"
  | "enhance"
  | "analyze"
  | "evaluate";

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  commandWord: string;
  cognitiveLevel: string;
  options: string[];
  correctAnswer?: string;
}

export interface UploadResponse {
  sessionId: string;
  totalAvailable: number;
  questionCount: number;
  parseMethod: "regex" | "gemini" | "regex+gemini" | "generate";
  inputMode: InputMode;
  questions: QuizQuestion[];
}

export interface QuizResult {
  total: number;
  correct: number;
  percentage: number;
  answers: Array<{
    questionId: number;
    question: string;
    type: QuestionType;
    commandWord: string;
    selected: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
    aiFeedback?: string;
  }>;
}

export type QuizMode = "all" | "random";

export type AppPhase = "upload" | "quiz" | "results";

export type DashboardView = "home" | "settings";

export type SidebarNavTarget = "dashboard" | "history" | "settings";

export interface UserAnswer {
  questionId: number;
  selected: string;
}

/** @deprecated use QuizQuestion */
export type McqQuestion = QuizQuestion;
