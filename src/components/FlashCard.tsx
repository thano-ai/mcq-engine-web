import { useState } from "react";
import type { McqQuestion, UserAnswer } from "../types/mcq";

interface FlashCardProps {
  question: McqQuestion;
  index: number;
  total: number;
  onAnswer: (answer: UserAnswer) => void;
  onNext: () => void;
  isLast: boolean;
}

export function FlashCard({
  question,
  index,
  total,
  onAnswer,
  onNext,
  isLast,
}: FlashCardProps) {
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

  const getOptionLetter = (option: string) => option.trim().charAt(0).toUpperCase();

  return (
    <div className="animate-slide-in space-y-6">
      <div className="flex items-center justify-between text-sm text-indigo-300/70">
        <span>
          Question {index + 1} of {total}
        </span>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-indigo-400 transition-all duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="perspective-[1200px]">
        <div
          className={`card-flip relative min-h-[320px] w-full ${isFlipped ? "flipped" : ""}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="card-face card-front rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-2xl backdrop-blur-sm">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-lg bg-white/10 px-2 py-1 text-xs text-indigo-300/70 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
            >
              Flip for hint
            </button>
            <p className="font-display text-xl font-semibold leading-relaxed">{question.question}</p>
            <p className="mt-4 text-xs text-indigo-300/50">Click card to flip</p>
          </div>

          <div className="card-face card-back rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/20 to-violet-500/10 p-8 shadow-2xl backdrop-blur-sm">
            <p className="text-sm font-medium text-indigo-300">Study Tip</p>
            <p className="mt-3 text-indigo-100/80">
              Read each option carefully. Eliminate obviously wrong answers first, then compare the
              remaining choices against key concepts in the question.
            </p>
            <button
              type="button"
              className="mt-6 text-sm text-indigo-400 hover:text-indigo-300"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              ← Back to question
            </button>
          </div>
        </div>
      </div>

      <div
        className={`space-y-3 transition-all duration-500 ${revealed ? "" : "animate-fade-in-delay"}`}
      >
        {question.options.map((option) => {
          const letter = getOptionLetter(option);
          const isSelected = selected === letter;

          let optionClass = "border-white/10 bg-white/5 hover:border-indigo-400/50 hover:bg-white/10";
          if (revealed && isSelected) {
            optionClass = "border-indigo-400 bg-indigo-500/30 glow-correct";
          }

          return (
            <button
              key={letter}
              type="button"
              disabled={revealed}
              onClick={() => handleSelect(letter)}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${optionClass} ${
                revealed ? "cursor-default" : "cursor-pointer"
              } ${revealed && isSelected ? "glow-correct" : ""}`}
            >
              <span className="text-sm leading-relaxed">{option}</span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-xl bg-indigo-500 py-3.5 font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-400 animate-fade-in"
        >
          {isLast ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}
