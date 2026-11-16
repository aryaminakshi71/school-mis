import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
  };
}

const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: "Light",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      textMuted: "#64748b",
      border: "#e2e8f0",
    },
  },
  dark: {
    name: "Dark",
    colors: {
      primary: "#3b82f6",
      secondary: "#94a3b8",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f1f5f9",
      textMuted: "#94a3b8",
      border: "#334155",
    },
  },
  system: {
    name: "System",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      textMuted: "#64748b",
      border: "#e2e8f0",
    },
  },
};

function getSystemTheme(): ThemeConfig {
  if (typeof window === "undefined" || !window.matchMedia) {
    return themes.light;
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return themes.dark;
  }
  return themes.light;
}

function loadTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem("school_theme");
  if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
    return saved;
  }
  return "system";
}

function loadCustomColors(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem("school_custom_colors");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  }
  return {};
}

function saveTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem("school_theme", theme);
}

function saveCustomColors(colors: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("school_custom_colors", JSON.stringify(colors));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => loadTheme());
  const [customColors, setCustomColors] = useState<Record<string, string>>(() =>
    loadCustomColors(),
  );
  const [resolvedTheme, setResolvedTheme] = useState<ThemeConfig>(
    theme === "system" ? getSystemTheme() : themes[theme],
  );

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      const systemTheme = getSystemTheme();
      setResolvedTheme(systemTheme);
      Object.entries(systemTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    } else {
      const themeConfig = themes[theme];
      setResolvedTheme(themeConfig);
      Object.entries(themeConfig.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }

    Object.entries(customColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.classList.remove("light", "dark");
    root.classList.add(
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme,
    );
  }, [theme, customColors]);

  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const systemTheme = getSystemTheme();
        setResolvedTheme(systemTheme);
        const root = document.documentElement;
        Object.entries(systemTheme.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value);
        });
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setThemeMode = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  }, []);

  const setCustomColor = useCallback((property: string, value: string) => {
    setCustomColors((prev) => {
      const updated = { ...prev, [property]: value };
      saveCustomColors(updated);
      return updated;
    });
  }, []);

  const resetTheme = useCallback(() => {
    setTheme("system");
    setCustomColors({});
    saveTheme("system");
    localStorage.removeItem("school_custom_colors");
  }, []);

  const toggleTheme = useCallback(() => {
    if (theme === "light") {
      setThemeMode("dark");
    } else if (theme === "dark") {
      setThemeMode("system");
    } else {
      setThemeMode("light");
    }
  }, [theme, setThemeMode]);

  return {
    theme,
    setTheme: setThemeMode,
    resolvedTheme,
    customColors,
    setCustomColor,
    resetTheme,
    toggleTheme,
    themes: Object.keys(themes) as Theme[],
    isDark: resolvedTheme.colors.background === themes.dark.colors.background,
  };
}

export { loadTheme, saveTheme, themes };
export default useTheme;
