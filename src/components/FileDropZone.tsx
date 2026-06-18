import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useFileDrop } from "../hooks/useFileDrop";
import { MaterialIcon } from "./MaterialIcon";
import type { InputMode, OpenCommandWord, QuizMode } from "../types/mcq";

const OPEN_TYPES: OpenCommandWord[] = [
  "apply",
  "develop",
  "justify",
  "enhance",
  "analyze",
  "evaluate",
];

interface FileDropZoneProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;
  pastedText: string;
  onTextChange: (text: string) => void;
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
  generateCount: number;
  onGenerateCountChange: (count: number) => void;
  includeMcq: boolean;
  onIncludeMcqChange: (value: boolean) => void;
  includeOpen: boolean;
  onIncludeOpenChange: (value: boolean) => void;
  openTypes: OpenCommandWord[];
  onOpenTypesChange: (types: OpenCommandWord[]) => void;
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
  inputMode,
  onInputModeChange,
  generateCount,
  onGenerateCountChange,
  includeMcq,
  onIncludeMcqChange,
  includeOpen,
  onIncludeOpenChange,
  openTypes,
  onOpenTypesChange,
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

  const isGenerate = inputMode === "generate";

  const toggleOpenType = (word: OpenCommandWord) => {
    if (openTypes.includes(word)) {
      onOpenTypesChange(openTypes.filter((w) => w !== word));
    } else {
      onOpenTypesChange([...openTypes, word]);
    }
  };

  return (
    <div className="home-page animate-fade-in">
      <div className="home-ambient home-ambient--left" aria-hidden="true" />
      <div className="home-ambient home-ambient--right" aria-hidden="true" />

      <header className="home-header">
        <div>
          <h2 className="home-display">{t.upload.heroTitle}</h2>
          <p className="home-subtitle">
            {isGenerate ? t.upload.generateHint : t.upload.subtitle}
          </p>
        </div>
        <span className="home-badge">
          <MaterialIcon name="auto_awesome" className="text-sm" />
          {isGenerate ? t.upload.generateMode : t.upload.aiPowered}
        </span>
      </header>

      <div className="home-grid">
        <section className="glass-panel home-upload-panel">
          <div
            {...dropProps}
            onClick={() => inputRef.current?.click()}
            className={`home-drop-zone ${isDragging ? "dragging" : ""}`}
          >
            <input ref={inputRef} {...inputProps} />
            <div className="home-drop-icon">
              <MaterialIcon name={isGenerate ? "psychology" : "upload_file"} />
            </div>
            <div>
              <p className="home-drop-title">{t.upload.dropTitle}</p>
              <p className="home-drop-hint">{t.upload.dropHint}</p>
              <p className="home-drop-meta">{t.upload.supportedFormats}</p>
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
            placeholder={isGenerate ? t.upload.contentPlaceholder : t.upload.placeholder}
            className="textarea-input"
            rows={isGenerate ? 10 : 8}
          />
        </section>

        <aside className="glass-panel home-settings-panel">
          <h3 className="home-panel-title">{t.upload.title}</h3>

          <div className="settings-block">
            <p className="settings-label">{t.upload.inputMode}</p>
            <div className="segmented-track">
              <button
                type="button"
                className={`segmented-option ${inputMode === "extract" ? "active" : ""}`}
                onClick={() => onInputModeChange("extract")}
              >
                {t.upload.extractMode}
              </button>
              <button
                type="button"
                className={`segmented-option ${inputMode === "generate" ? "active" : ""}`}
                onClick={() => onInputModeChange("generate")}
              >
                {t.upload.generateMode}
              </button>
            </div>
          </div>

          {isGenerate && (
            <>
              <div className="settings-block">
                <p className="settings-label">{t.upload.questionTypes}</p>
                <label className="type-check">
                  <input
                    type="checkbox"
                    checked={includeMcq}
                    onChange={(e) => onIncludeMcqChange(e.target.checked)}
                  />
                  <span>{t.upload.typeMcq}</span>
                </label>
                <label className="type-check">
                  <input
                    type="checkbox"
                    checked={includeOpen}
                    onChange={(e) => onIncludeOpenChange(e.target.checked)}
                  />
                  <span>{t.upload.typeOpen}</span>
                </label>
              </div>

              {includeOpen && (
                <div className="settings-block">
                  <p className="settings-label">{t.upload.openTypes}</p>
                  <div className="type-chips">
                    {OPEN_TYPES.map((word) => (
                      <button
                        key={word}
                        type="button"
                        className={`type-chip ${openTypes.includes(word) ? "active" : ""}`}
                        onClick={() => toggleOpenType(word)}
                      >
                        {t.quiz.commands[word]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="stepper-row">
                <span className="stepper-label">{t.upload.generateCount}</span>
                <div className="stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => onGenerateCountChange(Math.max(3, generateCount - 1))}
                  >
                    −
                  </button>
                  <span className="stepper-value">{generateCount}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => onGenerateCountChange(Math.min(30, generateCount + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="settings-block">
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
          </div>

          {error && <div className="alert-error">{error}</div>}

          <button type="button" className="btn-primary" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="spinner h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {isGenerate ? t.upload.generating : t.upload.processing}
              </>
            ) : (
              <>
                <MaterialIcon name={isGenerate ? "auto_awesome" : "play_arrow"} />
                {t.upload.generateQuiz}
              </>
            )}
          </button>
        </aside>
      </div>
    </div>
  );
}
