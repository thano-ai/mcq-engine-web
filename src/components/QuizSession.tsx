import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useQuizTimer } from "../hooks/useQuizTimer";
import { QuestionCard } from "./QuestionCard";
import type { QuizQuestion, UserAnswer } from "../types/mcq";

interface QuizSessionProps {
  questions: QuizQuestion[];
  onComplete: (answers: UserAnswer[], elapsedSeconds: number) => void;
  onExit: () => void;
  isSubmitting: boolean;
}

export function QuizSession({
  questions,
  onComplete,
  onExit,
  isSubmitting,
}: QuizSessionProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const answersRef = useRef<UserAnswer[]>([]);
  const { formatted, seconds } = useQuizTimer(!isSubmitting);

  const handleAnswer = (answer: UserAnswer) => {
    const existing = answersRef.current.findIndex((a) => a.questionId === answer.questionId);
    if (existing >= 0) {
      answersRef.current[existing] = answer;
    } else {
      answersRef.current.push(answer);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete([...answersRef.current], seconds);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  if (isSubmitting) {
    return (
      <div className="quiz-loading animate-fade-in">
        <div className="quiz-loading-pill">
          <svg className="spinner h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t.quiz.calculating}
        </div>
        <p className="quiz-loading-text">{t.quiz.scoring}</p>
      </div>
    );
  }

  return (
    <QuestionCard
      key={questions[currentIndex].id}
      question={questions[currentIndex]}
      index={currentIndex}
      total={questions.length}
      formattedTime={formatted}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onPrev={handlePrev}
      onExit={onExit}
      isLast={currentIndex === questions.length - 1}
      isFirst={currentIndex === 0}
    />
  );
}
