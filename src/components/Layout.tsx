import type { ReactNode } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import type { AppPhase } from "../types/mcq";

interface LayoutProps {
  children: ReactNode;
  phase: AppPhase;
}

function NavIcon({ name }: { name: string }) {
  if (name === "home") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
    </svg>
  );
}

function ThemeIcon({ isLight }: { isLight: boolean }) {
  if (isLight) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

export function Layout({ children, phase }: LayoutProps) {
  const { t, language, toggleLanguage, isArabic } = useLanguage();
  const { toggleTheme, isLight } = useTheme();
  const activeNav = phase === "results" ? "stats" : "home";

  const navItems = [
    { id: "home", label: t.nav.home },
    { id: "stats", label: t.nav.results },
  ] as const;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <h1 className="app-brand-title">{t.brand}</h1>
          </div>

          <nav className="top-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`top-nav-item ${activeNav === item.id ? "active" : ""}`}
                aria-current={activeNav === item.id ? "page" : undefined}
              >
                <NavIcon name={item.id} />
                <span>{item.label}</span>
              </button>
            ))}

            <div className="top-nav-divider" aria-hidden="true" />

            <button
              type="button"
              className="top-nav-item top-nav-item--icon"
              onClick={toggleTheme}
              aria-label={isLight ? t.nav.darkMode : t.nav.lightMode}
              title={isLight ? t.nav.darkMode : t.nav.lightMode}
            >
              <ThemeIcon isLight={isLight} />
            </button>

            <button
              type="button"
              className={`top-nav-item top-nav-item--lang ${isArabic ? "active" : ""}`}
              onClick={toggleLanguage}
              aria-label={isArabic ? t.nav.english : t.nav.arabic}
              title={isArabic ? t.nav.english : t.nav.arabic}
            >
              <span className="top-nav-lang-code">{language === "en" ? "AR" : "EN"}</span>
              <span className="top-nav-lang-label">
                {isArabic ? t.nav.english : t.nav.arabic}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
