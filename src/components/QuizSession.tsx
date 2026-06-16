import { useRef, useState } from "react";
import { FlashCard } from "./FlashCard";
import type { McqQuestion, UserAnswer } from "../types/mcq";

interface QuizSessionProps {
  questions: McqQuestion[];
  onComplete: (answers: UserAnswer[]) => void;
  isSubmitting: boolean;
}

export function QuizSession({ questions, onComplete, isSubmitting }: QuizSessionProps) {
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
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <svg className="h-10 w-10 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-4 text-indigo-300/70">Calculating your score...</p>
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
