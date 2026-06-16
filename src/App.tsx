import { useState } from "react";
import { Layout } from "./components/Layout";
import { FileDropZone } from "./components/FileDropZone";
import { QuizSession } from "./components/QuizSession";
import { ScoreSummary } from "./components/ScoreSummary";
import { uploadContent, submitQuiz } from "./api/client";
import type { AppPhase, McqQuestion, QuizMode, QuizResult, UserAnswer } from "./types/mcq";

export default function App() {
  const [phase, setPhase] = useState<AppPhase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [mode, setMode] = useState<QuizMode>("all");
  const [sampleSize, setSampleSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleSubmit = async () => {
    if (!file && !pastedText.trim()) {
      setError("Please upload a file or paste MCQ text");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (pastedText.trim()) formData.append("text", pastedText);
      formData.append("mode", mode);
      if (mode === "random") formData.append("sampleSize", String(sampleSize));

      const response = await uploadContent(formData);
      setSessionId(response.sessionId);
      setQuestions(response.questions);
      setPhase("quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = async (answers: UserAnswer[]) => {
    if (!sessionId) return;

    setIsSubmitting(true);
    try {
      const quizResult = await submitQuiz(sessionId, answers);
      setResult(quizResult);
      setPhase("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
      setPhase("upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setPhase("upload");
    setFile(null);
    setPastedText("");
    setSessionId(null);
    setQuestions([]);
    setResult(null);
    setError(null);
  };

  return (
    <Layout>
      {phase === "upload" && (
        <FileDropZone
          onFileSelect={setFile}
          pastedText={pastedText}
          onTextChange={setPastedText}
          mode={mode}
          onModeChange={setMode}
          sampleSize={sampleSize}
          onSampleSizeChange={setSampleSize}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      )}

      {phase === "quiz" && (
        <QuizSession
          questions={questions}
          onComplete={handleQuizComplete}
          isSubmitting={isSubmitting}
        />
      )}

      {phase === "results" && result && (
        <ScoreSummary result={result} onRestart={handleRestart} />
      )}
    </Layout>
  );
}
