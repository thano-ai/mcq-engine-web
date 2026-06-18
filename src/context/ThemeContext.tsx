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
  DEFAULT_PALETTE,
  type ColorPalette,
} from "../theme/colorPresets";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  palette: ColorPalette;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setPalette: (palette: ColorPalette) => void;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "quizcard-theme";
const PALETTE_KEY = "quizcard-palette";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

function getInitialPalette(): ColorPalette {
  const stored = localStorage.getItem(PALETTE_KEY);
  if (stored === "green" || stored === "indigo" || stored === "rose") return stored;
  return DEFAULT_PALETTE;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [palette, setPaletteState] = useState<ColorPalette>(getInitialPalette);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.palette = palette;
    root.style.colorScheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(PALETTE_KEY, palette);
  }, [theme, palette]);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const setPalette = useCallback((next: ColorPalette) => {
    setPaletteState(next);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      palette,
      toggleTheme,
      setTheme,
      setPalette,
      isLight: theme === "light",
    }),
    [theme, palette, toggleTheme, setTheme, setPalette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
