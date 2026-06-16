import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
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
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging, dropProps, inputProps } = useFileDrop({
    onFile: onFileSelect,
  });

  return (
    <div className="page-upload animate-fade-in">
      <header className="page-header">
        <h2 className="page-title">{t.upload.title}</h2>
        <p className="page-subtitle">{t.upload.subtitle}</p>
      </header>

      <div className="page-upload-grid">
        <div className="page-upload-main">
          <div
            {...dropProps}
            onClick={() => inputRef.current?.click()}
            className={`drop-zone ${isDragging ? "dragging" : ""}`}
          >
            <input ref={inputRef} {...inputProps} />
            <div className="drop-zone-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="drop-zone-body">
              <p className="drop-zone-title">{t.upload.dropTitle}</p>
              <p className="drop-zone-hint">{t.upload.dropHint}</p>
            </div>
          </div>

          {statusMessage && isLoading && (
            <div className="alert-info flex items-center gap-2">
              <svg className="spinner h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {statusMessage}
            </div>
          )}

          {selectedFile && !isLoading && (
            <div className="file-chip">
              <span className="file-chip-name">{selectedFile.name}</span>
              <button type="button" onClick={onClearFile} className="file-chip-remove">
                {t.upload.remove}
              </button>
            </div>
          )}

          <div className="divider-or">
            <span>{t.upload.orPaste}</span>
          </div>

          <textarea
            id="mcq-text"
            value={pastedText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={t.upload.placeholder}
            className="textarea-input"
            rows={8}
          />
        </div>

        <aside className="page-upload-side">
          <div className="settings-panel">
            <p className="settings-label">{t.upload.quizMode}</p>
            <div className="segmented-track">
              <button
                type="button"
                className={`segmented-option ${mode === "all" ? "active" : ""}`}
                onClick={() => onModeChange("all")}
              >
                {t.upload.allQuestions}
              </button>
              <button
                type="button"
                className={`segmented-option ${mode === "random" ? "active" : ""}`}
                onClick={() => onModeChange("random")}
              >
                {t.upload.randomSample}
              </button>
            </div>

            {mode === "random" && (
              <div className="stepper-row">
                <span className="stepper-label">{t.upload.questionsToInclude}</span>
                <div className="stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => onSampleSizeChange(Math.max(1, sampleSize - 1))}
                    aria-label={t.upload.decreaseSample}
                  >
                    −
                  </button>
                  <span className="stepper-value">{sampleSize}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => onSampleSizeChange(Math.min(100, sampleSize + 1))}
                    aria-label={t.upload.increaseSample}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {error && <div className="alert-error">{error}</div>}

            <button type="button" className="btn-primary" onClick={onSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.upload.processing}
                </>
              ) : (
                t.upload.generateQuiz
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
