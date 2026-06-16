import { useLanguage } from "../context/LanguageContext";
import type { QuizResult } from "../types/mcq";

interface ScoreSummaryProps {
  result: QuizResult;
  onRestart: () => void;
}

export function ScoreSummary({ result, onRestart }: ScoreSummaryProps) {
  const { t, format } = useLanguage();
  const wrongAnswers = result.answers.filter((a) => !a.isCorrect);

  const scoreColor =
    result.percentage >= 80
      ? "text-[var(--color-primary)]"
      : result.percentage >= 60
        ? "text-[var(--color-secondary)]"
        : "text-[var(--color-tertiary)]";

  return (
    <div className="page-results animate-fade-in">
      <header className="page-header">
        <h2 className="page-title">{t.results.title}</h2>
        <div className="score-row">
          <p className={`score-hero ${scoreColor}`}>{result.percentage}%</p>
          <div className="score-meta">
            <p className="page-subtitle">
              {format(t.results.correctOf, {
                correct: result.correct,
                total: result.total,
              })}
            </p>
            <div className="progress-track score-progress">
              <div className="progress-fill" style={{ width: `${result.percentage}%` }} />
            </div>
          </div>
        </div>
      </header>

      {wrongAnswers.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">{t.results.perfectTitle}</p>
          <p className="empty-state-text">{t.results.perfectText}</p>
        </div>
      ) : (
        <section className="review-section">
          <h3 className="review-heading">
            {format(t.results.toReview, { count: wrongAnswers.length })}
          </h3>
          <div className="review-list">
            {wrongAnswers.map((answer) => (
              <article key={answer.questionId} className="review-item">
                <p className="review-question">{answer.question}</p>
                <div className="review-answers">
                  <span className="review-wrong">
                    {format(t.results.you, { answer: answer.selected })}
                  </span>
                  <span className="review-correct">
                    {format(t.results.correct, { answer: answer.correctAnswer })}
                  </span>
                </div>
                {answer.explanation && (
                  <p className="review-explanation">{answer.explanation}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="page-actions">
        <button type="button" className="btn-secondary" onClick={onRestart}>
          {t.results.newQuiz}
        </button>
      </div>
    </div>
  );
}
