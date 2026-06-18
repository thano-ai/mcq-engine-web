import type { ReactNode } from "react";
import type { AppPhase, DashboardView, SidebarNavTarget } from "../types/mcq";
import { DashboardShell } from "./DashboardShell";

interface LayoutProps {
  children: ReactNode;
  phase: AppPhase;
  dashboardView: DashboardView;
  onNav: (target: SidebarNavTarget) => void;
  hasResults: boolean;
  onCreateQuiz?: () => void;
}

export function Layout({
  children,
  phase,
  dashboardView,
  onNav,
  hasResults,
  onCreateQuiz,
}: LayoutProps) {
  if (phase === "quiz") {
    return <div className="quiz-shell">{children}</div>;
  }

  return (
    <DashboardShell
      phase={phase}
      dashboardView={dashboardView}
      onNav={onNav}
      hasResults={hasResults}
      onCreateQuiz={onCreateQuiz}
    >
      {children}
    </DashboardShell>
  );
}
