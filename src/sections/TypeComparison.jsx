import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

// Font pairings for the comparison tool
const PAIRING_PRESETS = [
  { label: "Editorial",  a: { name: "Playfair Display", family: "Playfair Display", weight: 700 },  b: { name: "Lora", family: "Lora", weight: 400 } },
  { label: "Modern",     a: { name: "Space Grotesk",    family: "Space Grotesk",    weight: 700 },  b: { name: "Inter", family: "Inter", weight: 400 } },
  { label: "Luxury",     a: { name: "Cormorant",        family: "Cormorant Garamond", weight: 300 }, b: { name: "Raleway", family: "Raleway", weight: 300 } },
  { label: "Bold",       a: { name: "Anton",            family: "Anton",            weight: 400 },  b: { name: "Oswald", family: "Oswald", weight: 400 } },
  { label: "Classic",    a: { name: "EB Garamond",      family: "EB Garamond",      weight: 400 },  b: { name: "Crimson Text", family: "Crimson Text", weight: 400 } },
];

const SAMPLE_TEXTS = [
  { heading: "Design that Sells.", body: "Typography is not decoration. It is the voice of your brand, speaking before a single word is read." },
  { heading: "The Art of Type.", body: "Every great brand begins with a letter. Choose yours with intention, precision, and craft." },
  { heading: "Premium by Nature.", body: "The right typeface communicates hierarchy, emotion, and trust — all without saying a word." },
];

// Load a Google Font dynamically
const loadedFonts = new Set();
function loadGFont(family) {
  if (loadedFonts.has(family)) return;
  loadedFonts.add(family);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g,"+")}:wght@300;400;700&display=swap`;
  document.head.appendChild(link);
}

export default function TypeComparison() {
  const [preset, setPreset] = useState(0);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [splitPos, setSplitPos] = useState(50); // % from left
  const [dragging, setDragging] = useState(false);
  const [customA, setCustomA] = useState("");
  const [customB, setCustomB] = useState("");
  const containerRef = useRef(null);

  const pair = PAIRING_PRESETS[preset];
  const sample = SAMPLE_TEXTS[sampleIdx];

  // Load fonts
  useEffect(() => {
    loadGFont(pair.a.family);
    loadGFont(pair.b.family);
  }, [pair]);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPos(Math.max(10, Math.min(90, x)));
  }, [dragging]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  const displayA = customA || sample.heading;
  const displayB = customB || sample.heading;

  return (
    <section
      id="compare"
      style={{ background: "#080808", padding: "60px 0", position: "relative", overflow: "hidden" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(201,163,85,0.15) 0%, transparent 70%)",
        top: "0", right: "-100px", borderRadius: "50%", pointerEvents: "none",
      }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 md:px-14 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <div style={{ height: "1px", background: "rgba(244,239,230,0.08)", marginBottom: "24px" }} />
            <div className="flex items-baseline gap-3 flex-wrap">
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#F4EFE6", lineHeight: 0.9 }}>
                TYPE
              </span>
              <span className="gold-shimmer" style={{ fontFamily: "'Kaushan Script', cursive", fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", fontStyle: "italic", lineHeight: 0.9 }}>
                comparison
              </span>
            </div>
            <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "0.95rem", color: "#4A4540", marginTop: "12px" }}>
              Drag the divider to compare typeface pairings side by side.
            </p>
            <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C9A355 20%, #C9A355 80%, transparent)", marginTop: "16px", boxShadow: "0 0 8px rgba(201,163,85,0.4)" }} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          {/* Controls */}
          <div className="px-6 md:px-14 flex flex-wrap gap-4 items-center mb-8">
            {/* Preset selector */}
            <div className="flex gap-2 flex-wrap">
              {PAIRING_PRESETS.map((p, i) => (
                <motion.button
                  key={p.label}
                  onClick={() => setPreset(i)}
                  className="px-3 py-1.5 text-xs font-semibold uppercase"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.15em",
                    background: preset === i ? "#C9A355" : "transparent",
                    color: preset === i ? "#0C0C0C" : "#6B6560",
                    border: `1px solid ${preset === i ? "#C9A355" : "rgba(244,239,230,0.1)"}`,
                    boxShadow: preset === i ? "0 0 12px rgba(201,163,85,0.3)" : "none",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {p.label}
                </motion.button>
              ))}
            </div>

            {/* Sample text selector */}
            <div className="flex gap-2 ml-auto">
              {SAMPLE_TEXTS.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSampleIdx(i)}
                  style={{
                    width: "28px", height: "28px",
                    border: `1px solid ${sampleIdx === i ? "#C9A355" : "rgba(244,239,230,0.1)"}`,
                    background: sampleIdx === i ? "rgba(201,163,85,0.1)" : "transparent",
                    color: sampleIdx === i ? "#C9A355" : "#4A4540",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "10px",
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Split View */}
          <div
            ref={containerRef}
            className="relative mx-6 md:mx-14 overflow-hidden select-none"
            style={{ height: "60vh", cursor: dragging ? "col-resize" : "default", border: "1px solid rgba(201,163,85,0.12)" }}
          >
            {/* Left side — Font A */}
            <div
              className="absolute inset-0 flex flex-col justify-between p-5 md:p-10"
              style={{
                clipPath: `inset(0 ${100 - splitPos}% 0 0)`,
                background: "#0C0C0C",
              }}
            >
              <div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A355", display: "block", marginBottom: "8px" }}>
                  ✦ Font A — {pair.a.name}
                </span>
                <h2 style={{ fontFamily: `'${pair.a.family}', serif`, fontWeight: pair.a.weight, fontSize: "clamp(2rem, 5vw, 4.5rem)", color: "#F4EFE6", lineHeight: 1.05, marginBottom: "24px" }}>
                  {displayA}
                </h2>
                <p style={{ fontFamily: `'${pair.b.family}', serif`, fontWeight: pair.b.weight, fontSize: "1.05rem", color: "#6B6560", lineHeight: 1.8, maxWidth: "40ch" }}>
                  {sample.body}
                </p>
              </div>
              <div style={{ fontFamily: `'${pair.a.family}', serif`, fontWeight: pair.a.weight, fontSize: "clamp(4rem, 10vw, 8rem)", color: "rgba(244,239,230,0.04)", lineHeight: 0.85 }}>
                Ag
              </div>
            </div>

            {/* Right side — Font B */}
            <div
              className="absolute inset-0 flex flex-col justify-between p-5 md:p-10"
              style={{
                clipPath: `inset(0 0 0 ${splitPos}%)`,
                background: "#F4EFE6",
              }}
            >
              <div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B6914", display: "block", marginBottom: "8px" }}>
                  ✦ Font B — {pair.b.name}
                </span>
                <h2 style={{ fontFamily: `'${pair.b.family}', serif`, fontWeight: pair.b.weight, fontSize: "clamp(2rem, 5vw, 4.5rem)", color: "#0C0C0C", lineHeight: 1.05, marginBottom: "24px" }}>
                  {displayB}
                </h2>
                <p style={{ fontFamily: `'${pair.a.family}', serif`, fontWeight: pair.a.weight, fontSize: "1.05rem", color: "#5A5550", lineHeight: 1.8, maxWidth: "40ch" }}>
                  {sample.body}
                </p>
              </div>
              <div style={{ fontFamily: `'${pair.b.family}', serif`, fontWeight: pair.b.weight, fontSize: "clamp(4rem, 10vw, 8rem)", color: "rgba(12,12,12,0.05)", lineHeight: 0.85 }}>
                Ag
              </div>
            </div>

            {/* Drag handle */}
            <div
              className="absolute top-0 bottom-0 flex items-center justify-center"
              style={{ left: `${splitPos}%`, transform: "translateX(-50%)", zIndex: 10, cursor: "col-resize" }}
              onMouseDown={onMouseDown}
            >
              {/* Line */}
              <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0, bottom: 0, width: "2px", background: "#C9A355", boxShadow: "0 0 12px rgba(201,163,85,0.6)" }} />
              {/* Handle knob */}
              <motion.div
                className="relative flex items-center justify-center"
                style={{ width: "36px", height: "36px", background: "#C9A355", borderRadius: "50%", zIndex: 1, boxShadow: "0 0 20px rgba(201,163,85,0.4)" }}
                animate={{ scale: dragging ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4 2L1 6L4 10M8 2L11 6L8 10" stroke="#0C0C0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Font info row */}
          <div className="mx-6 md:mx-14 mt-4 grid grid-cols-2 gap-px" style={{ background: "rgba(244,239,230,0.04)" }}>
            {[pair.a, pair.b].map((f, i) => (
              <div key={i} className="p-4" style={{ background: "#0C0C0C" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "8px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A355", marginBottom: "4px" }}>
                  Font {i === 0 ? "A" : "B"}
                </div>
                <div style={{ fontFamily: `'${f.family}', serif`, fontSize: "1.4rem", color: "#F4EFE6", fontWeight: f.weight }}>
                  {f.name}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#3A3A3A", marginTop: "4px", letterSpacing: "0.1em" }}>
                  Weight {f.weight} · {f.family}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
