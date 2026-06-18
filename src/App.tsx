import { useState } from "react";
import { Layout } from "./components/Layout";
import { FileDropZone } from "./components/FileDropZone";
import { QuizSession } from "./components/QuizSession";
import { ScoreSummary } from "./components/ScoreSummary";
import { uploadContent, submitQuiz } from "./api/client";
import { useLanguage } from "./context/LanguageContext";
import type {
  AppPhase,
  InputMode,
  OpenCommandWord,
  QuizMode,
  QuizQuestion,
  QuizResult,
  UserAnswer,
} from "./types/mcq";

const DEFAULT_OPEN_TYPES: OpenCommandWord[] = [
  "apply",
  "develop",
  "justify",
  "enhance",
];

export default function App() {
  const { t, format } = useLanguage();
  const [phase, setPhase] = useState<AppPhase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("extract");
  const [generateCount, setGenerateCount] = useState(10);
  const [includeMcq, setIncludeMcq] = useState(true);
  const [includeOpen, setIncludeOpen] = useState(true);
  const [openTypes, setOpenTypes] = useState<OpenCommandWord[]>(DEFAULT_OPEN_TYPES);
  const [mode, setMode] = useState<QuizMode>("all");
  const [sampleSize, setSampleSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const appendFormFields = (formData: FormData) => {
    formData.append("inputMode", inputMode);
    formData.append("generateCount", String(generateCount));
    formData.append("includeMcq", String(includeMcq));
    formData.append("includeOpen", String(includeOpen));
    formData.append("openTypes", openTypes.join(","));
    formData.append("mode", mode);
    if (mode === "random") formData.append("sampleSize", String(sampleSize));
  };

  const handleSubmit = async (fileOverride?: File) => {
    const uploadFile = fileOverride ?? file;

    if (!uploadFile && !pastedText.trim()) {
      setError(t.upload.errorNoContent);
      setStatusMessage(null);
      return;
    }

    if (inputMode === "generate" && !includeMcq && (!includeOpen || openTypes.length === 0)) {
      setError(t.upload.errorNoTypes);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusMessage(
      inputMode === "generate"
        ? t.upload.generating
        : uploadFile
          ? format(t.upload.processingFile, { name: uploadFile.name })
          : t.upload.processingQuiz
    );

    try {
      const formData = new FormData();
      if (uploadFile) formData.append("file", uploadFile);
      if (pastedText.trim()) formData.append("text", pastedText);
      appendFormFields(formData);

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

  const handleQuizComplete = async (answers: UserAnswer[], seconds: number) => {
    if (!sessionId) return;

    setElapsedSeconds(seconds);
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
    setElapsedSeconds(0);
    setError(null);
    setStatusMessage(null);
  };

  const handleExitQuiz = () => {
    if (window.confirm(t.quiz.exitConfirm)) {
      handleRestart();
    }
  };

  return (
    <Layout phase={phase} onCreateQuiz={phase === "results" ? handleRestart : undefined}>
      {phase === "upload" && (
        <FileDropZone
          selectedFile={file}
          onFileSelect={handleFileSelect}
          onClearFile={handleClearFile}
          pastedText={pastedText}
          onTextChange={setPastedText}
          inputMode={inputMode}
          onInputModeChange={setInputMode}
          generateCount={generateCount}
          onGenerateCountChange={setGenerateCount}
          includeMcq={includeMcq}
          onIncludeMcqChange={setIncludeMcq}
          includeOpen={includeOpen}
          onIncludeOpenChange={setIncludeOpen}
          openTypes={openTypes}
          onOpenTypesChange={setOpenTypes}
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
          onExit={handleExitQuiz}
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
        <ScoreSummary result={result} elapsedSeconds={elapsedSeconds} onRestart={handleRestart} />
      )}
    </Layout>
  );
}
