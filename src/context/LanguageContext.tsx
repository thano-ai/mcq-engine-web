import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  interpolate,
  translations,
  type Language,
  type TranslationKey,
} from "../i18n/translations";

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  isArabic: boolean;
  t: TranslationKey;
  format: (template: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "quizcard-language";

function getInitialLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "ar") return stored;
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === "en" ? "ar" : "en"));
  }, []);

  const value = useMemo(
    () => ({
      language,
      toggleLanguage,
      isArabic: language === "ar",
      t: translations[language] as TranslationKey,
      format: (template: string, vars: Record<string, string | number> = {}) =>
        interpolate(template, vars),
    }),
    [language, toggleLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
