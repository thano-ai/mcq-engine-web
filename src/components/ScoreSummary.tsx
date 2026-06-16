import type { QuizResult } from "../types/mcq";

interface ScoreSummaryProps {
  result: QuizResult;
  onRestart: () => void;
}

export function ScoreSummary({ result, onRestart }: ScoreSummaryProps) {
  const wrongAnswers = result.answers.filter((a) => !a.isCorrect);

  const getGradeColor = () => {
    if (result.percentage >= 80) return "text-emerald-400";
    if (result.percentage >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getGradeMessage = () => {
    if (result.percentage >= 90) return "Outstanding! 🎉";
    if (result.percentage >= 80) return "Great job! 💪";
    if (result.percentage >= 60) return "Good effort — keep practicing!";
    return "Keep studying — you'll get there!";
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold">Quiz Complete</h2>
        <p className="mt-2 text-indigo-200/70">{getGradeMessage()}</p>
      </div>

      <div className="mx-auto max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <p className={`font-display text-6xl font-bold ${getGradeColor()}`}>
          {result.percentage}%
        </p>
        <p className="mt-2 text-lg text-indigo-200/70">
          {result.correct} / {result.total} correct
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              result.percentage >= 80
                ? "bg-emerald-400"
                : result.percentage >= 60
                  ? "bg-amber-400"
                  : "bg-red-400"
            }`}
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>

      {wrongAnswers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-red-300/90">
            Review Incorrect ({wrongAnswers.length})
          </h3>
          {wrongAnswers.map((answer) => (
            <div
              key={answer.questionId}
              className="rounded-xl border border-red-500/20 bg-red-500/5 p-5"
            >
              <p className="font-medium">{answer.question}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span className="text-red-300">
                  Your answer: <strong>{answer.selected}</strong>
                </span>
                <span className="text-emerald-300">
                  Correct: <strong>{answer.correctAnswer}</strong>
                </span>
              </div>
              {answer.explanation && (
                <p className="mt-2 text-sm text-indigo-200/60">{answer.explanation}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {wrongAnswers.length === 0 && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
          <p className="text-emerald-300">Perfect score! You nailed every question.</p>
        </div>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="w-full rounded-xl border border-white/20 bg-white/5 py-3.5 font-semibold transition-all hover:bg-white/10"
      >
        Start New Quiz
      </button>
    </div>
  );
}
