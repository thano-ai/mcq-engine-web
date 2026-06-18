import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useCardTilt } from "../hooks/useCardTilt";
import type { McqQuestion, UserAnswer } from "../types/mcq";
import { MaterialIcon } from "./MaterialIcon";

interface FlashCardProps {
  question: McqQuestion;
  index: number;
  total: number;
  formattedTime: string;
  onAnswer: (answer: UserAnswer) => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  isLast: boolean;
  isFirst: boolean;
}

function getOptionLetter(option: string): string {
  return option.trim().charAt(0).toUpperCase();
}

function getOptionText(option: string): string {
  return option.replace(/^[A-Ea-e][.)]\s*/, "").trim();
}

type OptionState = "idle" | "correct" | "wrong";

export function FlashCard({
  question,
  index,
  total,
  formattedTime,
  onAnswer,
  onNext,
  onPrev,
  onExit,
  isLast,
  isFirst,
}: FlashCardProps) {
  const { t, format } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { ref: cardRef, onMove, onLeave } = useCardTilt(3);

  const progress = ((index + 1) / total) * 100;
  const percentComplete = Math.round(progress);

  const handleSelect = (letter: string) => {
    if (revealed) return;
    setSelected(letter);
    setRevealed(true);
    onAnswer({ questionId: question.id, selected: letter });
  };

  const getOptionState = (letter: string): OptionState => {
    if (!revealed || !selected) return "idle";
    if (!question.correctAnswer) {
      return letter === selected ? "correct" : "idle";
    }
    const correct = question.correctAnswer.toUpperCase();
    if (letter === selected) {
      return letter === correct ? "correct" : "wrong";
    }
    if (letter === correct) return "correct";
    return "idle";
  };

  return (
    <div className="quiz-focus" onMouseMove={onMove} onMouseLeave={onLeave}>
      <header className="quiz-focus-header">
        <button type="button" className="quiz-exit-btn" onClick={onExit}>
          <MaterialIcon name="arrow_back" className="quiz-exit-icon" />
          <span>{t.quiz.exit}</span>
        </button>

        <div className="quiz-focus-progress">
          <div className="quiz-focus-progress-labels">
            <span className="quiz-focus-label">
              {format(t.quiz.questionOf, { current: index + 1, total })}
            </span>
            <span className="quiz-focus-percent">
              {format(t.quiz.complete, { percent: percentComplete })}
            </span>
          </div>
          <div className="progress-track progress-track--quiz">
            <div
              className="progress-fill progress-fill--pulse"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="quiz-timer">
          <MaterialIcon name="timer" className="quiz-timer-icon" />
          <span className="quiz-timer-value">{formattedTime}</span>
        </div>
      </header>

      <main className="quiz-focus-main">
        <div className="quiz-ambient quiz-ambient--left" aria-hidden="true" />
        <div className="quiz-ambient quiz-ambient--right" aria-hidden="true" />

        <div ref={cardRef} className="quiz-card glass-panel">
          <div className="quiz-card-header">
            <div className="quiz-tags">
              <span className="quiz-tag quiz-tag--primary">{t.quiz.mcq}</span>
              <span className="quiz-tag">{t.quiz.studyMode}</span>
            </div>
            {showHint ? (
              <div className="quiz-hint-panel">
                <p className="hint-label">{t.quiz.tip}</p>
                <p className="hint-text">{t.quiz.hintText}</p>
                <button type="button" className="hint-back" onClick={() => setShowHint(false)}>
                  {t.quiz.back}
                </button>
              </div>
            ) : (
              <h1 className="quiz-question-title">{question.question}</h1>
            )}
          </div>

          <div className="quiz-options">
            {question.options.map((option) => {
              const letter = getOptionLetter(option);
              const text = getOptionText(option);
              const state = getOptionState(letter);

              return (
                <button
                  key={letter}
                  type="button"
                  disabled={revealed}
                  onClick={() => handleSelect(letter)}
                  className={`option-card ${state !== "idle" ? `option-card--${state}` : ""} ${revealed && selected === letter ? "option-card--selected" : ""}`}
                >
                  <span className="option-card-letter">{letter}</span>
                  <span className="option-card-text">{text}</span>
                  <span className="option-card-icon">
                    {state === "correct" && (
                      <MaterialIcon name="check_circle" className="text-primary" filled />
                    )}
                    {state === "wrong" && (
                      <MaterialIcon name="cancel" className="text-error" filled />
                    )}
                    {state === "idle" && !revealed && (
                      <MaterialIcon name="radio_button_unchecked" className="option-card-icon-idle" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="quiz-side-tools">
          <div className="quiz-tool-wrap">
            <button type="button" className="quiz-tool-btn" onClick={() => setShowHint(true)}>
              <MaterialIcon name="lightbulb" />
            </button>
            <span className="quiz-tool-tip">{t.quiz.getHint}</span>
          </div>
          <div className="quiz-tool-wrap">
            <button type="button" className="quiz-tool-btn">
              <MaterialIcon name="psychology" />
            </button>
            <span className="quiz-tool-tip">{t.quiz.aiBreakdown}</span>
          </div>
        </div>
      </main>

      <footer className="quiz-focus-footer">
        <button
          type="button"
          className="quiz-nav-circle"
          onClick={onPrev}
          disabled={isFirst}
          aria-label={t.quiz.prevQuestion}
        >
          <MaterialIcon name="chevron_left" />
        </button>

        <div className="quiz-footer-pill glass-panel">
          <button type="button" className="quiz-footer-link" onClick={() => setShowHint(true)}>
            {t.quiz.hint}
          </button>
          <span className="quiz-footer-divider" />
          <button type="button" className="quiz-footer-link">
            {t.quiz.explainAi}
          </button>
          <span className="quiz-footer-divider" />
          <button type="button" className="quiz-footer-link">
            {t.quiz.flag}
          </button>
        </div>

        <button
          type="button"
          className="quiz-nav-circle quiz-nav-circle--primary"
          onClick={onNext}
          disabled={!revealed}
          aria-label={isLast ? t.quiz.seeResults : t.quiz.nextQuestion}
        >
          <MaterialIcon name="chevron_right" />
        </button>
      </footer>
    </div>
  );
}
