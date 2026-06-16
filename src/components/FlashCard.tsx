import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import type { McqQuestion, UserAnswer } from "../types/mcq";

interface FlashCardProps {
  question: McqQuestion;
  index: number;
  total: number;
  onAnswer: (answer: UserAnswer) => void;
  onNext: () => void;
  isLast: boolean;
}

function getOptionLetter(option: string): string {
  return option.trim().charAt(0).toUpperCase();
}

function getOptionText(option: string): string {
  return option.replace(/^[A-Ea-e][.)]\s*/, "").trim();
}

export function FlashCard({
  question,
  index,
  total,
  onAnswer,
  onNext,
  isLast,
}: FlashCardProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSelect = (letter: string) => {
    if (revealed) return;
    setSelected(letter);
    setRevealed(true);
    onAnswer({ questionId: question.id, selected: letter });
  };

  const handleNext = () => {
    setSelected(null);
    setRevealed(false);
    setIsFlipped(false);
    onNext();
  };

  const progress = ((index + 1) / total) * 100;

  return (
    <div className="page-quiz animate-slide-in">
      <div className="quiz-progress">
        <span className="quiz-progress-label">
          {index + 1} <span className="text-[var(--color-outline)]">/</span> {total}
        </span>
        <div className="progress-track flex-1">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="quiz-body">
        <div className="quiz-question-col">
          <div className="perspective-[1200px]">
            <div
              className={`card-flip relative w-full ${isFlipped ? "flipped" : ""}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="card-face card-front question-card">
                <button
                  type="button"
                  className="hint-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                >
                  {t.quiz.hint}
                </button>
                <p className="question-text">{question.question}</p>
              </div>

              <div className="card-face card-back question-card question-card--hint">
                <p className="hint-label">{t.quiz.tip}</p>
                <p className="hint-text">{t.quiz.hintText}</p>
                <button
                  type="button"
                  className="hint-back"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                >
                  {t.quiz.back}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="quiz-options-col">
          <div className="options-list">
            {question.options.map((option) => {
              const letter = getOptionLetter(option);
              const text = getOptionText(option);
              const isSelected = selected === letter;

              return (
                <button
                  key={letter}
                  type="button"
                  disabled={revealed}
                  onClick={() => handleSelect(letter)}
                  className={`mcq-option ${revealed && isSelected ? "selected" : ""}`}
                >
                  <span className="mcq-option-letter">{letter}</span>
                  <span>{text}</span>
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="page-actions">
              <button type="button" className="btn-primary animate-fade-in" onClick={handleNext}>
                {isLast ? t.quiz.seeResults : t.quiz.nextQuestion}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
