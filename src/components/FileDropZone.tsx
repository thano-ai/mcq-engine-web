import { useRef } from "react";
import { useFileDrop } from "../hooks/useFileDrop";
import type { QuizMode } from "../types/mcq";

interface FileDropZoneProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;
  pastedText: string;
  onTextChange: (text: string) => void;
  mode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
  sampleSize: number;
  onSampleSizeChange: (size: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
  statusMessage: string | null;
}

export function FileDropZone({
  selectedFile,
  onFileSelect,
  onClearFile,
  pastedText,
  onTextChange,
  mode,
  onModeChange,
  sampleSize,
  onSampleSizeChange,
  onSubmit,
  isLoading,
  error,
  statusMessage,
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging, dropProps, inputProps } = useFileDrop({
    onFile: onFileSelect,
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold">Start Your Quiz</h2>
        <p className="mt-2 text-indigo-200/70">
          Drop a PDF, Word doc, or paste your MCQ text below
        </p>
      </div>

      <div
        {...dropProps}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10 scale-[1.02]"
            : "border-white/20 bg-white/5 hover:border-indigo-400/50 hover:bg-white/10"
        }`}
      >
        <input ref={inputRef} {...inputProps} />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20">
          <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-lg font-medium">Drag & drop your file here</p>
        <p className="mt-1 text-sm text-indigo-300/60">PDF, DOCX, DOC, or TXT — up to 10 MB</p>
        {selectedFile && !isLoading && (
          <p className="mt-3 text-sm font-medium text-emerald-300">
            Ready: {selectedFile.name}
          </p>
        )}
      </div>

      {statusMessage && isLoading && (
        <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">
          {statusMessage}
        </div>
      )}

      {selectedFile && !isLoading && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
          <span className="text-emerald-200">
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-emerald-300/70"> ({Math.round(selectedFile.size / 1024)} KB)</span>
          </span>
          <button
            type="button"
            onClick={onClearFile}
            className="text-emerald-300/70 hover:text-emerald-200"
          >
            Remove
          </button>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-transparent px-4 text-indigo-300/50">or paste text</span>
        </div>
      </div>

      <textarea
        value={pastedText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={`1. What is the primary goal of Zero Trust?\nA) Perimeter security\nB) Continuous verification\nC) Network caching\nAnswer: B`}
        rows={6}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-indigo-300/30 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
      />

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Quiz Mode</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onModeChange("all")}
            className={`rounded-xl border p-4 text-left transition-all ${
              mode === "all"
                ? "border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/20"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <p className="font-semibold">All Questions</p>
            <p className="mt-1 text-sm text-indigo-200/60">Practice every question in the file</p>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("random")}
            className={`rounded-xl border p-4 text-left transition-all ${
              mode === "random"
                ? "border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/20"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <p className="font-semibold">Random Sample</p>
            <p className="mt-1 text-sm text-indigo-200/60">Get a random subset to study</p>
          </button>
        </div>

        {mode === "random" && (
          <div className="mt-4 flex items-center gap-3">
            <label htmlFor="sampleSize" className="text-sm text-indigo-200/70">
              Sample size:
            </label>
            <input
              id="sampleSize"
              type="number"
              min={1}
              max={100}
              value={sampleSize}
              onChange={(e) => onSampleSizeChange(parseInt(e.target.value, 10) || 10)}
              className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-center text-sm focus:border-indigo-400 focus:outline-none"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full rounded-xl bg-indigo-500 py-4 font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-400 hover:shadow-indigo-400/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing your quiz...
          </span>
        ) : (
          "Generate Quiz"
        )}
      </button>
    </div>
  );
}
