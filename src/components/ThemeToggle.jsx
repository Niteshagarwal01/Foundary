import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

/* ── Icons ── */
const MoonIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
  </svg>
);

const SunIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const BookIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const THEME_BUTTONS = [
  {
    key: "dark",
    Icon: MoonIcon,
    tooltip: "Dark",
    bg: "#0C0C0C",
    ring: "#C9A355",
    iconColor: "#C9A355",
  },
  {
    key: "light",
    Icon: SunIcon,
    tooltip: "Light",
    bg: "#F4EFE6",
    ring: "#A6802E",
    iconColor: "#A6802E",
  },
  {
    key: "sepia",
    Icon: BookIcon,
    tooltip: "Sepia",
    bg: "#F0E6C8",
    ring: "#8B6914",
    iconColor: "#8B6914",
  },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-1.5"
      style={{
        padding: "4px 8px",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,163,85,0.12)",
      }}
    >
      {THEME_BUTTONS.map(({ key, Icon, tooltip, bg, ring, iconColor }) => {
        const isActive = theme === key;
        return (
          <motion.button
            key={key}
            onClick={() => setTheme(key)}
            title={tooltip}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: bg,
              border: `1.5px solid ${isActive ? ring : "rgba(255,255,255,0.08)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: iconColor,
              position: "relative",
              overflow: "visible",
              flexShrink: 0,
            }}
            animate={{
              scale: isActive ? 1.22 : 1,
              boxShadow: isActive
                ? `0 0 10px ${ring}55, 0 0 0 2px ${ring}33`
                : "none",
            }}
            whileHover={{ scale: isActive ? 1.22 : 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
          >
            <Icon />
            {isActive && (
              <motion.span
                layoutId="theme-active-ring"
                style={{
                  position: "absolute",
                  inset: -3,
                  borderRadius: "50%",
                  border: `1.5px solid ${ring}`,
                  pointerEvents: "none",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
