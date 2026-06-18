import type { ReactNode } from "react";
import type { AppPhase } from "../types/mcq";
import { DashboardShell } from "./DashboardShell";

interface LayoutProps {
  children: ReactNode;
  phase: AppPhase;
  onCreateQuiz?: () => void;
}

export function Layout({ children, phase, onCreateQuiz }: LayoutProps) {
  if (phase === "quiz") {
    return <div className="quiz-shell">{children}</div>;
  }

  return (
    <DashboardShell phase={phase} onCreateQuiz={onCreateQuiz}>
      {children}
    </DashboardShell>
  );
}
