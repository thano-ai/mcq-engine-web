import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { MaterialIcon } from "./MaterialIcon";
import { COLOR_PALETTES } from "../theme/colorPresets";
import type { InputMode, QuizMode } from "../types/mcq";

interface SettingsPageProps {
  defaultInputMode: InputMode;
  onDefaultInputModeChange: (mode: InputMode) => void;
  defaultQuizMode: QuizMode;
  onDefaultQuizModeChange: (mode: QuizMode) => void;
}

export function SettingsPage({
  defaultInputMode,
  onDefaultInputModeChange,
  defaultQuizMode,
  onDefaultQuizModeChange,
}: SettingsPageProps) {
  const { t, language, toggleLanguage, isArabic } = useLanguage();
  const { theme, setTheme, palette, setPalette } = useTheme();

  return (
    <div className="settings-page animate-fade-in">
      <header className="settings-page-header">
        <h2 className="settings-page-title">{t.settings.title}</h2>
        <p className="settings-page-subtitle">{t.settings.subtitle}</p>
      </header>

      <section className="glass-panel settings-section">
        <h3 className="settings-section-title">
          <MaterialIcon name="tune" />
          {t.settings.general}
        </h3>

        <div className="settings-row">
          <div>
            <p className="settings-row-label">{t.settings.defaultInputMode}</p>
            <p className="settings-row-hint">{t.settings.defaultInputModeHint}</p>
          </div>
          <div className="segmented-track segmented-track--compact">
            <button
              type="button"
              className={`segmented-option ${defaultInputMode === "extract" ? "active" : ""}`}
              onClick={() => onDefaultInputModeChange("extract")}
            >
              {t.upload.extractMode}
            </button>
            <button
              type="button"
              className={`segmented-option ${defaultInputMode === "generate" ? "active" : ""}`}
              onClick={() => onDefaultInputModeChange("generate")}
            >
              {t.upload.generateMode}
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <p className="settings-row-label">{t.settings.defaultQuizMode}</p>
            <p className="settings-row-hint">{t.settings.defaultQuizModeHint}</p>
          </div>
          <div className="segmented-track segmented-track--compact">
            <button
              type="button"
              className={`segmented-option ${defaultQuizMode === "all" ? "active" : ""}`}
              onClick={() => onDefaultQuizModeChange("all")}
            >
              {t.upload.allQuestions}
            </button>
            <button
              type="button"
              className={`segmented-option ${defaultQuizMode === "random" ? "active" : ""}`}
              onClick={() => onDefaultQuizModeChange("random")}
            >
              {t.upload.randomSample}
            </button>
          </div>
        </div>
      </section>

      <section className="glass-panel settings-section">
        <h3 className="settings-section-title">
          <MaterialIcon name="palette" />
          {t.settings.appearance}
        </h3>

        <div className="settings-row">
          <div>
            <p className="settings-row-label">{t.settings.theme}</p>
            <p className="settings-row-hint">{t.settings.themeHint}</p>
          </div>
          <div className="segmented-track segmented-track--compact">
            <button
              type="button"
              className={`segmented-option ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              {t.settings.dark}
            </button>
            <button
              type="button"
              className={`segmented-option ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
            >
              {t.settings.light}
            </button>
          </div>
        </div>

        <div className="settings-row settings-row--stack">
          <div>
            <p className="settings-row-label">{t.settings.accentColor}</p>
            <p className="settings-row-hint">{t.settings.accentColorHint}</p>
          </div>
          <div className="palette-grid">
            {COLOR_PALETTES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`palette-card ${palette === item.id ? "active" : ""}`}
                onClick={() => setPalette(item.id)}
              >
                <span className="palette-swatch" style={{ background: item.swatch }} />
                <span className="palette-card-label">{t.settings.colors[item.labelKey]}</span>
                <span className="palette-card-desc">{t.settings.colors[item.descriptionKey]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel settings-section">
        <h3 className="settings-section-title">
          <MaterialIcon name="language" />
          {t.settings.language}
        </h3>

        <div className="settings-row">
          <div>
            <p className="settings-row-label">{t.settings.languageLabel}</p>
            <p className="settings-row-hint">{t.settings.languageHint}</p>
          </div>
          <button type="button" className="btn-outline" onClick={toggleLanguage}>
            {isArabic ? t.nav.english : t.nav.arabic}
            <span className="settings-lang-code">{language === "en" ? "AR" : "EN"}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
