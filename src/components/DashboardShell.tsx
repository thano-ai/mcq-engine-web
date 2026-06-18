import type { ReactNode } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import type { AppPhase } from "../types/mcq";
import { MaterialIcon } from "./MaterialIcon";

interface DashboardShellProps {
  children: ReactNode;
  phase: AppPhase;
  onCreateQuiz?: () => void;
}

function ThemeToggle() {
  const { toggleTheme, isLight } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      className="dash-icon-btn"
      onClick={toggleTheme}
      aria-label={isLight ? t.nav.darkMode : t.nav.lightMode}
    >
      <MaterialIcon name={isLight ? "dark_mode" : "light_mode"} />
    </button>
  );
}

function LanguageToggle() {
  const { toggleLanguage, language, isArabic, t } = useLanguage();

  return (
    <button
      type="button"
      className={`dash-lang-btn ${isArabic ? "active" : ""}`}
      onClick={toggleLanguage}
      aria-label={isArabic ? t.nav.english : t.nav.arabic}
    >
      {language === "en" ? "AR" : "EN"}
    </button>
  );
}

export function DashboardShell({ children, phase, onCreateQuiz }: DashboardShellProps) {
  const { t } = useLanguage();
  const isResults = phase === "results";

  const sidebarNav = [
    { id: "dashboard", icon: "dashboard", label: t.nav.dashboard, active: !isResults },
    { id: "history", icon: "history", label: t.nav.history, active: isResults },
    { id: "analytics", icon: "analytics", label: t.nav.analytics, active: false },
    { id: "settings", icon: "settings", label: t.nav.settings, active: false },
  ];

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-brand">
          <h1 className="dash-brand-title">{t.brand}</h1>
          <p className="dash-brand-sub">{t.workspace}</p>
        </div>

        <nav className="dash-sidebar-nav" aria-label="Sidebar">
          {sidebarNav.map((item) => (
            <div
              key={item.id}
              className={`dash-sidebar-link ${item.active ? "active" : ""}`}
              aria-current={item.active ? "page" : undefined}
            >
              <MaterialIcon name={item.icon} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          {onCreateQuiz && (
            <button type="button" className="btn-primary dash-create-btn" onClick={onCreateQuiz}>
              {t.upload.createQuiz}
            </button>
          )}
          <div className="dash-sidebar-link muted">
            <MaterialIcon name="help" />
            <span>{t.nav.help}</span>
          </div>
        </div>
      </aside>

      <div className="dash-main-wrap">
        <header className="dash-topbar">
          <nav className="dash-topbar-nav" aria-label="Breadcrumb">
            <span className="dash-topbar-link">{t.nav.dashboard}</span>
            <span className="dash-topbar-link active">{t.nav.workspaces}</span>
          </nav>
          <div className="dash-topbar-actions">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>

        <main className="dash-main">{children}</main>
      </div>
    </div>
  );
}
