import { createContext, useContext, useState, useEffect } from "react";

// ── Font Preview Context ───────────────────────────────────────────────────────
// Global state for the live preview text bar
export const PreviewContext = createContext({
  previewText: "",
  setPreviewText: () => {},
  previewSize: 40,
  setPreviewSize: () => {},
  previewWeight: 400,
  setPreviewWeight: () => {},
  previewOpen: false,
  setPreviewOpen: () => {},
});

export function PreviewProvider({ children }) {
  const [previewText, setPreviewText] = useState("");
  const [previewSize, setPreviewSize] = useState(40);
  const [previewWeight, setPreviewWeight] = useState(400);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("foundry:preview-update", {
      detail: { text: previewText, size: previewSize, weight: previewWeight }
    }));
  }, [previewText, previewSize, previewWeight]);

  return (
    <PreviewContext.Provider value={{ previewText, setPreviewText, previewSize, setPreviewSize, previewWeight, setPreviewWeight, previewOpen, setPreviewOpen }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  return useContext(PreviewContext);
}

// ── Cart Context ───────────────────────────────────────────────────────────────
export const CartContext = createContext({
  cartOpen: false,
  setCartOpen: () => {},
  cartFont: null,
  setCartFont: () => {},
});

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartFont, setCartFont] = useState(null);

  return (
    <CartContext.Provider value={{ cartOpen, setCartOpen, cartFont, setCartFont }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

// ── Theme Context ──────────────────────────────────────────────────────────────
const themes = {
  dark: {
    "--bg":     "#0C0C0C",
    "--bg2":    "#111111",
    "--fg":     "#F4EFE6",
    "--fg2":    "#D4CFC8",
    "--muted":  "#6B6560",
    "--muted2": "#3A3A3A",
    "--gold":   "#C9A355",
    "--border": "rgba(244,239,230,0.1)",
  },
  light: {
    "--bg":     "#F4EFE6",
    "--bg2":    "#EDE8DE",
    "--fg":     "#0C0C0C",
    "--fg2":    "#1A1A1A",
    "--muted":  "#5A5550",
    "--muted2": "#8A857E",
    "--gold":   "#A6802E",
    "--border": "rgba(12,12,12,0.12)",
  },
  sepia: {
    "--bg":     "#F0E6C8",
    "--bg2":    "#E8D9B0",
    "--fg":     "#2A1F0E",
    "--fg2":    "#3D2E18",
    "--muted":  "#7A6040",
    "--muted2": "#A08060",
    "--gold":   "#8B6914",
    "--border": "rgba(42,31,14,0.15)",
  },
};

export const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
  colors: themes.dark,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeRaw] = useState(() => localStorage.getItem("foundry-theme") || "dark");

  const setTheme = (t) => {
    setThemeRaw(t);
    localStorage.setItem("foundry-theme", t);
  };

  useEffect(() => {
    const root = document.documentElement;
    const vars = themes[theme] || themes.dark;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
