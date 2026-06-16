import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { FlashCard } from "./FlashCard";
import type { McqQuestion, UserAnswer } from "../types/mcq";

interface QuizSessionProps {
  questions: McqQuestion[];
  onComplete: (answers: UserAnswer[]) => void;
  isSubmitting: boolean;
}

export function QuizSession({ questions, onComplete, isSubmitting }: QuizSessionProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const answersRef = useRef<UserAnswer[]>([]);

  const handleAnswer = (answer: UserAnswer) => {
    answersRef.current.push(answer);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete([...answersRef.current]);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="status-pill mb-4">
          <svg className="spinner h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t.quiz.calculating}
        </div>
        <p className="text-sm text-[var(--color-on-surface-variant)]">{t.quiz.scoring}</p>
      </div>
    );
  }

  return (
    <FlashCard
      question={questions[currentIndex]}
      index={currentIndex}
      total={questions.length}
      onAnswer={handleAnswer}
      onNext={handleNext}
      isLast={currentIndex === questions.length - 1}
    />
  );
}
