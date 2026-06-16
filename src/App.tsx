import { useState } from "react";
import { Layout } from "./components/Layout";
import { FileDropZone } from "./components/FileDropZone";
import { QuizSession } from "./components/QuizSession";
import { ScoreSummary } from "./components/ScoreSummary";
import { uploadContent, submitQuiz } from "./api/client";
import { useLanguage } from "./context/LanguageContext";
import type { AppPhase, McqQuestion, QuizMode, QuizResult, UserAnswer } from "./types/mcq";

export default function App() {
  const { t, format } = useLanguage();
  const [phase, setPhase] = useState<AppPhase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [mode, setMode] = useState<QuizMode>("all");
  const [sampleSize, setSampleSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleSubmit = async (fileOverride?: File) => {
    const uploadFile = fileOverride ?? file;

    if (!uploadFile && !pastedText.trim()) {
      setError(t.upload.errorNoContent);
      setStatusMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusMessage(
      uploadFile
        ? format(t.upload.processingFile, { name: uploadFile.name })
        : t.upload.processingQuiz
    );

    try {
      const formData = new FormData();
      if (uploadFile) formData.append("file", uploadFile);
      if (pastedText.trim()) formData.append("text", pastedText);
      formData.append("mode", mode);
      if (mode === "random") formData.append("sampleSize", String(sampleSize));

      const response = await uploadContent(formData);
      setSessionId(response.sessionId);
      setQuestions(response.questions);
      setStatusMessage(null);
      setPhase("quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.upload.errorProcess);
      setStatusMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (selected: File) => {
    setFile(selected);
    setError(null);
    setStatusMessage(format(t.upload.selectedFile, { name: selected.name }));
    void handleSubmit(selected);
  };

  const handleClearFile = () => {
    setFile(null);
    setStatusMessage(null);
    setError(null);
  };

  const handleQuizComplete = async (answers: UserAnswer[]) => {
    if (!sessionId) return;

    setIsSubmitting(true);
    try {
      const quizResult = await submitQuiz(sessionId, answers);
      setResult(quizResult);
      setPhase("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.quiz.errorSubmit);
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
    setStatusMessage(null);
  };

  return (
    <Layout phase={phase}>
      {phase === "upload" && (
        <FileDropZone
          selectedFile={file}
          onFileSelect={handleFileSelect}
          onClearFile={handleClearFile}
          pastedText={pastedText}
          onTextChange={setPastedText}
          mode={mode}
          onModeChange={setMode}
          sampleSize={sampleSize}
          onSampleSizeChange={setSampleSize}
          onSubmit={() => void handleSubmit()}
          isLoading={isLoading}
          error={error}
          statusMessage={statusMessage}
        />
      )}

      {phase === "quiz" && questions.length > 0 && (
        <QuizSession
          questions={questions}
          onComplete={handleQuizComplete}
          isSubmitting={isSubmitting}
        />
      )}

      {phase === "quiz" && questions.length === 0 && (
        <div className="alert-error">
          {t.quiz.noQuestions}{" "}
          <button type="button" onClick={handleRestart} className="underline">
            {t.quiz.tryAgain}
          </button>
        </div>
      )}

      {phase === "results" && result && (
        <ScoreSummary result={result} onRestart={handleRestart} />
      )}
    </Layout>
  );
}
