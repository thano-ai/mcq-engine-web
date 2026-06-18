import type { ReactNode } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import type { AppPhase, DashboardView } from "../types/mcq";
import { MaterialIcon } from "./MaterialIcon";

interface DashboardShellProps {
  children: ReactNode;
  phase: AppPhase;
  dashboardView: DashboardView;
  onNav: (target: "dashboard" | "history" | "settings") => void;
  hasResults: boolean;
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

export function DashboardShell({
  children,
  phase,
  dashboardView,
  onNav,
  hasResults,
  onCreateQuiz,
}: DashboardShellProps) {
  const { t } = useLanguage();

  const sidebarNav = [
    {
      id: "home" as const,
      icon: "dashboard",
      label: t.nav.dashboard,
      active: dashboardView === "home" && phase === "upload",
    },
    {
      id: "history" as const,
      icon: "history",
      label: t.nav.history,
      active: dashboardView === "home" && phase === "results",
      disabled: !hasResults,
    },
    {
      id: "settings" as const,
      icon: "settings",
      label: t.nav.settings,
      active: dashboardView === "settings",
    },
  ];

  const handleNav = (id: "home" | "history" | "settings") => {
    if (id === "settings") {
      onNav("settings");
      return;
    }
    if (id === "history" && hasResults) {
      onNav("history");
      return;
    }
    onNav("dashboard");
  };

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-brand">
          <h1 className="dash-brand-title">{t.brand}</h1>
          <p className="dash-brand-sub">{t.workspace}</p>
        </div>

        <nav className="dash-sidebar-nav" aria-label="Sidebar">
          {sidebarNav.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={"disabled" in item && item.disabled}
              className={`dash-sidebar-link ${item.active ? "active" : ""} ${"disabled" in item && item.disabled ? "disabled" : ""}`}
              aria-current={item.active ? "page" : undefined}
              onClick={() => handleNav(item.id)}
            >
              <MaterialIcon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          {onCreateQuiz && (
            <button type="button" className="btn-primary dash-create-btn" onClick={onCreateQuiz}>
              {t.upload.createQuiz}
            </button>
          )}
          <button
            type="button"
            className="dash-sidebar-link muted"
            onClick={() => handleNav("settings")}
          >
            <MaterialIcon name="help" />
            <span>{t.nav.help}</span>
          </button>
        </div>
      </aside>

      <div className="dash-main-wrap">
        <header className="dash-topbar">
          <nav className="dash-topbar-nav" aria-label="Breadcrumb">
            <span className="dash-topbar-link">
              {dashboardView === "settings" ? t.nav.settings : t.nav.dashboard}
            </span>
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
