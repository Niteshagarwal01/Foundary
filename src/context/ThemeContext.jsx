import { createContext, useContext, useState, useLayoutEffect } from "react";

/* ── Theme definitions ── */
export const THEMES = {
  dark: {
    key: "dark",
    label: "Dark",
    "--bg":      "#0C0C0C",
    "--fg":      "#F4EFE6",
    "--muted":   "#6B6560",
    "--gold":    "#C9A355",
    "--surface":   "#111111",
    "--surface-2": "#1A1A1A",
    "--border":  "rgba(201,163,85,0.18)",
  },
  light: {
    key: "light",
    label: "Light",
    "--bg":      "#F4EFE6",
    "--fg":      "#0C0C0C",
    "--muted":   "#6B6560",
    "--gold":    "#A6802E",
    "--surface":   "#EAE4D8",
    "--surface-2": "#DDD6C8",
    "--border":  "rgba(166,128,46,0.25)",
  },
  sepia: {
    key: "sepia",
    label: "Sepia",
    "--bg":      "#F0E6C8",
    "--fg":      "#2A1F0E",
    "--muted":   "#7A6A4A",
    "--gold":    "#8B6914",
    "--surface":   "#E8D9B0",
    "--surface-2": "#DFD0A0",
    "--border":  "rgba(139,105,20,0.28)",
  },
};

export const ThemeContext = createContext(null);

function applyTheme(theme) {
  const root = document.documentElement;
  const def = THEMES[theme] || THEMES.dark;
  Object.entries(def).forEach(([k, v]) => {
    if (k.startsWith("--")) root.style.setProperty(k, v);
  });
  root.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("foundry-theme") || "dark";
    }
    return "dark";
  });

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem("foundry-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
