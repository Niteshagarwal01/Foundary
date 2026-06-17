import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabaseClient";
import { FONTS } from "../data/fonts";
import { loadFont } from "../utils/fontLoader";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Foundry", "Serif", "Sans", "Display", "Script", "Mono", "Saved"];
const PER_PAGE   = 48;
const ease       = [0.16, 1, 0.3, 1];

const LS_KEY = "foundry-favorites";

// ─── localStorage helpers ─────────────────────────────────────────────────────
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function setFavorites(ids) {
  localStorage.setItem(LS_KEY, JSON.stringify(ids));
  // Notify Navbar (and any other listener) of count change
  window.dispatchEvent(new CustomEvent("foundry:favorites-update", { detail: { count: ids.length } }));
}

// ─── Intersection-based font loader ───────────────────────────────────────────
function useIntersectionFont(family, weights) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadFont(family, weights?.length ? weights : [400, 700]);
          obs.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [family, weights]);
  return ref;
}

// ─── Copied toast ─────────────────────────────────────────────────────────────
function CopiedToast({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          key="copied-toast"
          initial={{ opacity: 0, scale: 0.8, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -4 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            zIndex: 9900,
            background: "rgba(201,163,85,0.15)",
            border: "1px solid rgba(201,163,85,0.45)",
            backdropFilter: "blur(16px)",
            color: "#C9A355",
            fontFamily: "'Inter', sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "7px 14px",
            borderRadius: "100px",
            boxShadow: "0 4px 20px rgba(201,163,85,0.2)",
            pointerEvents: "none",
          }}
        >
          ✓ Copied!
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── CSS Copy Button ──────────────────────────────────────────────────────────
function CopyButton({ font, onCopied }) {
  const [hov, setHov] = useState(false);

  const handleCopy = useCallback(
    async (e) => {
      e.stopPropagation(); // Don't open modal
      const familyEncoded = font.family.replace(/ /g, "+");
      const css = `@import url('https://fonts.googleapis.com/css2?family=${familyEncoded}:wght@400;700&display=swap');

.font-class {
  font-family: '${font.family}', serif;
  font-weight: 400;
  letter-spacing: 0.02em;
}`;
      try {
        await navigator.clipboard.writeText(css);
        onCopied();
      } catch {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = css;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        onCopied();
      }
    },
    [font, onCopied]
  );

  return (
    <motion.button
      onClick={handleCopy}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      title={`Copy CSS for ${font.name}`}
      aria-label={`Copy CSS for ${font.name}`}
      style={{
        position: "absolute",
        top: "8px",
        right: font.foundry ? "56px" : "8px", // shift left when foundry badge present
        width: "26px",
        height: "26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${hov ? "rgba(201,163,85,0.6)" : "rgba(201,163,85,0.2)"}`,
        background: hov ? "rgba(201,163,85,0.12)" : "rgba(10,10,10,0.7)",
        backdropFilter: "blur(8px)",
        color: "#C9A355",
        cursor: "pointer",
        zIndex: 10,
        transition: "all 0.2s ease",
        boxShadow: hov ? "0 0 10px rgba(201,163,85,0.25)" : "none",
      }}
    >
      {/* Clipboard SVG */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    </motion.button>
  );
}

// ─── Heart / Favorite Button ──────────────────────────────────────────────────
function HeartButton({ fontId, isFavorited, onToggle }) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onToggle(fontId);
      }}
      whileTap={{ scale: 1.4 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      title={isFavorited ? "Remove from saved" : "Save font"}
      aria-label={isFavorited ? "Remove from saved" : "Save font"}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isFavorited ? "#C9A355" : "#3A3A3A",
        transition: "color 0.25s ease",
        zIndex: 10,
      }}
    >
      {isFavorited ? (
        // Filled heart
        <motion.svg
          key="heart-filled"
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 18 }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="#C9A355"
          stroke="#C9A355"
          strokeWidth="1.5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </motion.svg>
      ) : (
        // Outline heart
        <motion.svg
          key="heart-outline"
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 18 }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </motion.svg>
      )}
    </motion.button>
  );
}

// ─── Font Card ────────────────────────────────────────────────────────────────
function FontCard({ font, onSelect, isFavorited, onToggleFavorite, onCopied, previewState }) {
  const [hov, setHov] = useState(false);
  const ref = useIntersectionFont(font.family, font.weights);

  // Resolve display text: use preview text if set, else font name
  const displayText = previewState.text || font.name;
  const displaySize = previewState.text
    ? Math.min(previewState.size, 72) // clamp in card
    : null;
  const displayWeight = previewState.text
    ? (font.weights?.includes(previewState.weight) ? previewState.weight : font.weights?.[0] || 400)
    : (font.weights?.includes(700) ? 700 : font.weights?.[0] || 400);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(font)}
      data-cursor="select"
      className="relative flex flex-col justify-between p-5 overflow-hidden group"
      style={{
        background: hov ? "#161616" : "#0F0F0F",
        border: `1px solid ${hov ? "rgba(201,163,85,0.3)" : "rgba(244,239,230,0.06)"}`,
        cursor: "none",
        minHeight: "160px",
        transform: hov ? "translateY(-4px)" : "translateY(0px)",
        boxShadow: hov ? "0 10px 30px -10px rgba(201,163,85,0.15)" : "none",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Foundry badge */}
      {font.foundry && (
        <div
          className="absolute top-0 right-0 px-2 py-1 text-center"
          style={{ background: "#C9A355" }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "7px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0C0C0C" }}>
            ✦ FOUNDRY
          </span>
        </div>
      )}

      {/* CSS Copy button — appears on hover */}
      <AnimatePresence>
        {hov && (
          <CopyButton font={font} onCopied={onCopied} />
        )}
      </AnimatePresence>

      {/* Category label */}
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: font.foundry ? "#C9A355" : "#3A3A3A",
          display: "block",
          marginBottom: "8px",
        }}
      >
        {font.foundry
          ? font.label
          : { serif: "SERIF", "sans-serif": "SANS SERIF", display: "DISPLAY", script: "SCRIPT", monospace: "MONO" }[font.category] || font.label}
      </span>

      {/* Font preview — name or custom text */}
      <div
        className="flex-1 flex items-center overflow-hidden"
        style={{
          fontFamily: `'${font.family}', serif`,
          fontSize: displaySize
            ? `${displaySize}px`
            : "clamp(1.4rem, 3vw, 2rem)",
          fontWeight: displayWeight,
          color: hov ? "#F4EFE6" : "#D4CFC8",
          lineHeight: 1.1,
          transform: hov ? "scale(1.03) translateX(2px)" : "scale(1) translateX(0px)",
          transformOrigin: "left center",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          whiteSpace: previewState.text ? "nowrap" : "normal",
          overflow: "hidden",
          textOverflow: previewState.text ? "ellipsis" : "unset",
          ...(font.foundryStyle || {}),
        }}
      >
        {displayText}
      </div>

      {/* Bottom meta */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {/* Heart button */}
          <HeartButton
            fontId={font.id}
            isFavorited={isFavorited}
            onToggle={onToggleFavorite}
          />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#3A3A3A", letterSpacing: "0.12em" }}>
            {font.designer?.split(" ").slice(-1)[0]} · {font.year}
          </span>
        </div>
        <motion.span
          animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : 4 }}
          transition={{ duration: 0.2 }}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A355" }}
        >
          Preview →
        </motion.span>
      </div>
    </motion.div>
  );
}

// ─── Main FontLibrary ─────────────────────────────────────────────────────────
export default function FontLibrary({ onSelectFont }) {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");
  const [page,     setPage]     = useState(0);
  const [sortMode, setSortMode] = useState("alpha");
  const [favorites, setFavoritesState] = useState([]);
  const [copiedVisible, setCopiedVisible] = useState(false);
  const copiedTimerRef = useRef(null);

  const { isSignedIn, user } = useUser();

  // Load favorites (Cloud if signed in, LocalStorage if guest)
  useEffect(() => {
    if (!isSignedIn) {
      setFavoritesState(getFavorites());
      return;
    }
    async function fetchCloudFavorites() {
      const { data, error } = await supabase
        .from("user_favorites")
        .select("font_id")
        .eq("user_id", user.id);
      
      if (!error && data) {
        const ids = data.map(d => d.font_id);
        setFavoritesState(ids);
        setFavorites(ids); // update local cache
      }
    }
    fetchCloudFavorites();
  }, [isSignedIn, user]);

  // Global preview state from PreviewBar
  const [previewState, setPreviewState] = useState({
    text: window.__foundryPreview?.text || "",
    size: window.__foundryPreview?.size || 32,
    weight: window.__foundryPreview?.weight || 400,
  });

  // Listen for preview updates
  useEffect(() => {
    const handler = (e) => setPreviewState({ ...e.detail });
    window.addEventListener("foundry:preview-update", handler);
    return () => window.removeEventListener("foundry:preview-update", handler);
  }, []);

  // Handle CSS copy + show toast
  const handleCopied = useCallback(() => {
    setCopiedVisible(true);
    clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopiedVisible(false), 1500);
  }, []);

  // Toggle favorite (Sync to cloud if logged in)
  const handleToggleFavorite = useCallback((fontId) => {
    setFavoritesState((prev) => {
      const isFav = prev.includes(fontId);
      const next = isFav
        ? prev.filter((id) => id !== fontId)
        : [...prev, fontId];
      
      setFavorites(next); // Sync to local storage / dispatch event
      
      if (isSignedIn && user) {
        if (isFav) {
          supabase.from("user_favorites").delete().match({ user_id: user.id, font_id: fontId }).then();
        } else {
          supabase.from("user_favorites").insert({ user_id: user.id, font_id: fontId }).then();
        }
      }
      return next;
    });
  }, [isSignedIn, user]);

  // Filter + sort
  const filtered = FONTS
    .filter((f) => {
      const matchQ = !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.tags?.some((t) => t.includes(query.toLowerCase()));
      const matchC =
        category === "All"     ? true
        : category === "Foundry" ? f.foundry
        : category === "Serif"   ? f.category === "serif"
        : category === "Sans"    ? f.category === "sans-serif"
        : category === "Display" ? f.category === "display"
        : category === "Script"  ? f.category === "script"
        : category === "Mono"    ? f.category === "monospace"
        : category === "Saved"   ? favorites.includes(f.id)
        : true;
      return matchQ && matchC;
    })
    .sort((a, b) =>
      sortMode === "foundry"
        ? (b.foundry ? 1 : 0) - (a.foundry ? 1 : 0) || a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name)
    );

  const total   = filtered.length;
  const pages   = Math.ceil(total / PER_PAGE);
  const visible = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  useEffect(() => { setPage(0); }, [query, category]);

  return (
    <section id="library" style={{ background: "#080808", paddingBottom: "100px", position: "relative", overflow: "hidden" }}>
      {/* Toast notification */}
      <CopiedToast visible={copiedVisible} />

      {/* Ambient glow */}
      <div
        className="ambient-glow"
        style={{
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(201,163,85,0.04) 0%, transparent 70%)",
          top: "0", left: "50%", transform: "translateX(-50%)",
          animationDelay: "1s",
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-6 md:px-14 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mb-8"
        >
          <div style={{ height: "1px", background: "rgba(244,239,230,0.08)", marginBottom: "24px" }} />
          <div className="flex items-baseline gap-3 flex-wrap">
            <span
              className="hover-glow transition-all duration-300"
              style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#F4EFE6", lineHeight: 0.9, letterSpacing: "0.02em" }}
            >
              THE LIBRARY
            </span>
            <span
              className="gold-shimmer"
              style={{ fontFamily: "'Kaushan Script', cursive", fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", fontStyle: "italic", lineHeight: 0.9 }}
            >
              {total} typefaces
            </span>
          </div>
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C9A355 20%, #C9A355 80%, transparent)", marginTop: "16px" }} />
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-4 items-start justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full max-w-sm">
            <input
              type="text"
              placeholder="Search fonts, tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent py-2.5 pl-4 pr-10 text-sm outline-none transition-all duration-300"
              style={{
                border: "1px solid rgba(244,239,230,0.12)",
                color: "#F4EFE6",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.02em",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,163,85,0.5)";
                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(201,163,85,0.12), 0 0 16px rgba(201,163,85,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(244,239,230,0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <svg className="absolute right-3 top-4" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "#3A3A3A" }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["modern", "luxury", "editorial", "retro", "bold", "minimal", "tech", "elegant"].map(t => (
                <button
                  key={t}
                  onClick={() => setQuery(query.includes(t) ? query.replace(t, '').trim() : `${query} ${t}`.trim())}
                  className="px-2 py-1 text-[9px] uppercase tracking-wider rounded-full transition-all"
                  style={{
                    background: query.includes(t) ? "#C9A355" : "rgba(244,239,230,0.05)",
                    color: query.includes(t) ? "#0C0C0C" : "#6B6560",
                    border: `1px solid ${query.includes(t) ? "#C9A355" : "rgba(244,239,230,0.1)"}`,
                  }}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3 py-1.5 text-xs font-semibold uppercase transition-all duration-250"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.15em",
                  background: category === cat ? "#C9A355" : "transparent",
                  color: category === cat ? "#0C0C0C" : cat === "Saved" ? (favorites.length > 0 ? "#C9A355" : "#6B6560") : "#6B6560",
                  border: `1px solid ${category === cat ? "#C9A355" : cat === "Saved" && favorites.length > 0 ? "rgba(201,163,85,0.3)" : "rgba(244,239,230,0.1)"}`,
                  boxShadow: category === cat ? "0 0 12px rgba(201,163,85,0.3)" : "none",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: category === cat
                    ? "0 0 18px rgba(201,163,85,0.5)"
                    : "0 0 8px rgba(201,163,85,0.2)",
                  color: category === cat ? "#0C0C0C" : "#C9A355",
                  borderColor: "#C9A355",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {cat === "Saved" ? (
                  <span className="flex items-center gap-1">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill={category === cat ? "#0C0C0C" : favorites.length > 0 ? "#C9A355" : "none"} stroke={category === cat ? "#0C0C0C" : favorites.length > 0 ? "#C9A355" : "currentColor"} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Saved
                    {favorites.length > 0 && (
                      <span
                        style={{
                          background: category === cat ? "#0C0C0C" : "#C9A355",
                          color: category === cat ? "#C9A355" : "#0C0C0C",
                          borderRadius: "100px",
                          padding: "0 5px",
                          fontSize: "8px",
                          fontWeight: 800,
                          minWidth: "16px",
                          textAlign: "center",
                          lineHeight: "14px",
                          display: "inline-block",
                        }}
                      >
                        {favorites.length}
                      </span>
                    )}
                  </span>
                ) : cat}
              </motion.button>
            ))}
          </div>

          {/* Sort toggle */}
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3A3A3A" }}>Sort:</span>
            {["A-Z", "Foundry First"].map((mode) => (
              <motion.button
                key={mode}
                onClick={() => { setSortMode(mode === "A-Z" ? "alpha" : "foundry"); setPage(0); }}
                className="px-3 py-1 text-xs font-semibold uppercase"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.12em",
                  background: (mode === "A-Z" ? sortMode === "alpha" : sortMode === "foundry") ? "rgba(201,163,85,0.15)" : "transparent",
                  color: (mode === "A-Z" ? sortMode === "alpha" : sortMode === "foundry") ? "#C9A355" : "#4A4540",
                  border: `1px solid ${(mode === "A-Z" ? sortMode === "alpha" : sortMode === "foundry") ? "rgba(201,163,85,0.4)" : "rgba(244,239,230,0.08)"}`,
                }}
                whileHover={{ borderColor: "rgba(201,163,85,0.4)", color: "#C9A355" }}
                transition={{ duration: 0.2 }}
              >
                {mode}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-14">
        {visible.length === 0 ? (
          <div className="text-center py-24" style={{ color: "#3A3A3A", fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "1.2rem" }}>
            {category === "Saved"
              ? "No saved fonts yet — click the ♡ on any card."
              : `No fonts match "${query}"`}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px"
            style={{ background: "rgba(244,239,230,0.04)" }}
          >
            <AnimatePresence mode="popLayout">
              {visible.map((font) => (
                <FontCard
                  key={font.id}
                  font={font}
                  onSelect={onSelectFont}
                  isFavorited={favorites.includes(font.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onCopied={handleCopied}
                  previewState={previewState}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 mt-10 px-6"
        >
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 text-xs font-semibold uppercase transition-all"
            style={{
              border: "1px solid rgba(244,239,230,0.1)",
              color: page === 0 ? "#2A2A2A" : "#6B6560",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.15em",
              cursor: page === 0 ? "not-allowed" : "default",
            }}
          >
            ← Prev
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
              const p = pages <= 7 ? i : page < 4 ? i : page >= pages - 4 ? pages - 7 + i : page - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-8 text-xs font-semibold transition-all"
                  style={{
                    background: p === page ? "#C9A355" : "transparent",
                    color: p === page ? "#0C0C0C" : "#4A4540",
                    border: `1px solid ${p === page ? "#C9A355" : "rgba(244,239,230,0.08)"}`,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {p + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={page >= pages - 1}
            className="px-4 py-2 text-xs font-semibold uppercase transition-all"
            style={{
              border: "1px solid rgba(244,239,230,0.1)",
              color: page >= pages - 1 ? "#2A2A2A" : "#6B6560",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.15em",
              cursor: page >= pages - 1 ? "not-allowed" : "default",
            }}
          >
            Next →
          </button>

          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#3A3A3A", letterSpacing: "0.15em", marginLeft: "16px" }}>
            {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, total)} of {total}
          </span>
        </motion.div>
      )}
    </section>
  );
}
