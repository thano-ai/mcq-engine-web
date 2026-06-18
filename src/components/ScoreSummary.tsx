import { useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useCardPerspective } from "../hooks/useCardPerspective";
import type { QuizResult } from "../types/mcq";
import { MaterialIcon } from "./MaterialIcon";

interface ScoreSummaryProps {
  result: QuizResult;
  elapsedSeconds: number;
  onRestart: () => void;
}

type Filter = "all" | "correct" | "incorrect";

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function ReviewCard({
  answer,
  index,
}: {
  answer: QuizResult["answers"][number];
  index: number;
}) {
  const { t, format } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const { ref, onMove, onLeave } = useCardPerspective();

  const isCorrect = answer.isCorrect;
  const num = String(index + 1).padStart(2, "0");
  const isOpen = answer.type === "open";

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`result-card glass-panel perspective-card ${isCorrect ? "result-card--correct" : "result-card--wrong"}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="result-card-head">
        <div className="result-card-head-main">
          <span className={`result-card-num ${isCorrect ? "result-card-num--ok" : "result-card-num--bad"}`}>
            {num}
          </span>
          <div>
            <div className="result-card-tags">
              <span className="quiz-tag quiz-tag--primary">
                {isOpen ? t.quiz.openEnded : t.quiz.mcq}
              </span>
              <span className="quiz-tag">{answer.commandWord}</span>
            </div>
            <h4 className="result-card-question">{answer.question}</h4>
            <div className={`result-card-status ${isCorrect ? "result-card-status--ok" : "result-card-status--bad"}`}>
              <MaterialIcon
                name={isCorrect ? "check_circle" : "cancel"}
                filled
                className="text-sm"
              />
              <span>{isCorrect ? t.results.correct : t.results.incorrect}</span>
            </div>
          </div>
        </div>
        <span className="result-card-pts">
          {format(t.results.pts, { points: isCorrect ? 50 : 0 })}
        </span>
      </div>

      <div className="result-answer-grid">
        <div className={`result-answer-box ${isCorrect ? "result-answer-box--yours-ok" : "result-answer-box--yours-bad"}`}>
          <p className="result-answer-label">{t.results.yourAnswer}</p>
          <p className="result-answer-text">{answer.selected}</p>
        </div>
        <div className="result-answer-box result-answer-box--correct">
          <p className="result-answer-label">
            {isOpen ? t.results.modelAnswer : t.results.correctAnswer}
          </p>
          <p className="result-answer-text">{answer.correctAnswer}</p>
        </div>
      </div>

      {answer.aiFeedback && (
        <p className="result-ai-feedback">
          <strong>{t.results.aiFeedback}:</strong> {answer.aiFeedback}
        </p>
      )}

      {answer.explanation && (
        <div className={`result-explanation ${expanded ? "expanded" : ""}`}>
          <button
            type="button"
            className="result-explanation-toggle"
            onClick={() => setExpanded((v) => !v)}
          >
            <MaterialIcon name="smart_toy" />
            {t.results.aiExplanation}
            <MaterialIcon
              name="expand_more"
              className={`result-explanation-chevron ${expanded ? "rotated" : ""}`}
            />
          </button>
          <div className="expandable-content">
            <div className="result-explanation-body">{answer.explanation}</div>
          </div>
        </div>
      )}
    </article>
  );
}

export function ScoreSummary({ result, elapsedSeconds, onRestart }: ScoreSummaryProps) {
  const { t, format } = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");

  const correctCount = result.answers.filter((a) => a.isCorrect).length;
  const incorrectCount = result.total - correctCount;
  const circumference = 264;
  const dashOffset = circumference - (result.percentage / 100) * circumference;
  const totalPoints = correctCount * 50;

  const filtered = useMemo(() => {
    if (filter === "correct") return result.answers.filter((a) => a.isCorrect);
    if (filter === "incorrect") return result.answers.filter((a) => !a.isCorrect);
    return result.answers;
  }, [filter, result.answers]);

  return (
    <div className="results-page animate-fade-in">
      <header className="results-header">
        <div>
          <h2 className="results-display">{t.results.title}</h2>
          <p className="results-subtitle">{t.results.subtitle}</p>
        </div>
        <div className="results-header-actions">
          <button type="button" className="btn-outline" onClick={onRestart}>
            {t.results.returnHome}
          </button>
          <button type="button" className="btn-primary btn-primary--inline" onClick={() => setFilter("all")}>
            {t.results.reviewAll}
          </button>
        </div>
      </header>

      <section className="glass-panel results-summary">
        <div className="results-summary-glow" aria-hidden="true" />

        <div className="results-ring">
          <svg viewBox="0 0 100 100" className="results-ring-svg">
            <circle
              className="results-ring-track"
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              strokeWidth="8"
            />
            <circle
              className="results-ring-fill"
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="results-ring-center">
            <span className="results-ring-score">{result.percentage}%</span>
            <span className="results-ring-fraction">
              {result.correct}/{result.total}
            </span>
          </div>
        </div>

        <div className="results-stats">
          <div className="results-stat">
            <div className="results-stat-label">
              <MaterialIcon name="schedule" />
              <span>{t.results.timeTaken}</span>
            </div>
            <p className="results-stat-value">{formatTime(elapsedSeconds)}</p>
            <p className="results-stat-hint">{t.results.fastLearner}</p>
          </div>
          <div className="results-stat">
            <div className="results-stat-label">
              <MaterialIcon name="verified" />
              <span>{t.results.accuracy}</span>
            </div>
            <p className="results-stat-value">{result.percentage}%</p>
            <p className="results-stat-hint">{t.results.consistent}</p>
          </div>
          <div className="results-stat">
            <div className="results-stat-label">
              <MaterialIcon name="military_tech" />
              <span>{t.results.totalPoints}</span>
            </div>
            <p className="results-stat-value">
              {totalPoints}/{result.total * 50}
            </p>
            <p className="results-stat-hint">
              {format(t.results.bonusStreak, { points: Math.max(0, correctCount * 5) })}
            </p>
          </div>
        </div>
      </section>

      <section className="results-review">
        <div className="results-review-head">
          <h3 className="results-review-title">{t.results.questionReview}</h3>
          <div className="results-filters">
            <button
              type="button"
              className={`results-filter ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              {format(t.results.filterAll, { count: result.total })}
            </button>
            <button
              type="button"
              className={`results-filter results-filter--ok ${filter === "correct" ? "active" : ""}`}
              onClick={() => setFilter("correct")}
            >
              {format(t.results.filterCorrect, { count: correctCount })}
            </button>
            <button
              type="button"
              className={`results-filter results-filter--bad ${filter === "incorrect" ? "active" : ""}`}
              onClick={() => setFilter("incorrect")}
            >
              {format(t.results.filterIncorrect, { count: incorrectCount })}
            </button>
          </div>
        </div>

        <div className="results-list">
          {filtered.map((answer, i) => (
            <ReviewCard key={answer.questionId} answer={answer} index={i} />
          ))}
        </div>
      </section>

      <footer className="results-footer">
        <button type="button" className="btn-outline btn-outline--icon">
          <MaterialIcon name="download" />
          {t.results.downloadCert}
        </button>
        <button type="button" className="btn-primary btn-primary--inline" onClick={onRestart}>
          <MaterialIcon name="restart_alt" />
          {t.results.retakeQuiz}
        </button>
        <button type="button" className="btn-outline btn-outline--icon">
          <MaterialIcon name="share" />
          {t.results.shareResults}
        </button>
      </footer>
    </div>
  );
}
