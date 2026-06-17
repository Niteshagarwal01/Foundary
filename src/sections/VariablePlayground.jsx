import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreview } from "../context/AppContext";

const ease = [0.16, 1, 0.3, 1];

// ── Variable Font Playground ──────────────────────────────────────────────────
// Shows live font morphing with OpenType axes (weight, width, slant)
// Uses fonts that have variable axes on Google Fonts

const VARIABLE_FONTS = [
  { name: "Roboto Flex",     family: "Roboto Flex",     axes: { wght: [100,900], wdth: [25,151] },    specimen: "The Quick Brown Fox" },
  { name: "Fraunces",        family: "Fraunces",         axes: { wght: [100,900], SOFT: [0,100] },     specimen: "Timeless Elegance" },
  { name: "Recursive",       family: "Recursive",        axes: { wght: [300,1000], CASL: [0,1] },      specimen: "Design That Sells" },
  { name: "Anybody",         family: "Anybody",          axes: { wght: [100,900], wdth: [50,150] },    specimen: "Premium Typography" },
  { name: "Signika",         family: "Signika",          axes: { wght: [300,700] },                    specimen: "Clear & Beautiful" },
  { name: "Source Sans 3",   family: "Source Sans 3",    axes: { wght: [200,900] },                    specimen: "The Foundry Studio" },
];

// Preload variable fonts
const loaded = new Set();
function preloadVarFont(family) {
  if (loaded.has(family)) return;
  loaded.add(family);
  const slug = family.replace(/ /g, "+");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${slug}:wght@100..900&display=swap`;
  document.head.appendChild(link);
}

function AxisSlider({ label, min, max, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between" style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        <span style={{ color: "#6B6560" }}>{label}</span>
        <span style={{ color: "#C9A355" }}>{Math.round(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: "#C9A355", height: "2px" }}
      />
    </div>
  );
}

export default function VariablePlayground() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [axes, setAxes] = useState({ wght: 400, wdth: 100, CASL: 0, SOFT: 0 });
  const { previewText } = usePreview();

  const font = VARIABLE_FONTS[activeIdx];
  preloadVarFont(font.family);

  const fontVariationSettings = Object.entries(axes)
    .filter(([axis]) => font.axes[axis])
    .map(([axis, val]) => `'${axis}' ${val}`)
    .join(", ");

  const displayText = previewText || font.specimen;

  return (
    <section
      id="playground"
      style={{ background: "#080808", padding: "60px 0", position: "relative", overflow: "hidden" }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: "800px", height: "400px",
        background: "radial-gradient(ellipse, rgba(201,163,85,0.04) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <div className="relative z-10 px-6 md:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mb-12 text-center lg:text-left"
        >
          <div style={{ height: "1px", background: "rgba(244,239,230,0.08)", marginBottom: "24px" }} />
          <div className="flex items-baseline justify-center lg:justify-start gap-3 flex-wrap">
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#F4EFE6", lineHeight: 0.9 }}>
              VARIABLE
            </span>
            <span className="gold-shimmer" style={{ fontFamily: "'Kaushan Script', cursive", fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", fontStyle: "italic", lineHeight: 0.9 }}>
              playground
            </span>
          </div>
          <p className="mx-auto lg:mx-0" style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "0.95rem", color: "#4A4540", marginTop: "12px", maxWidth: "600px" }}>
            Drag the sliders to morph fonts in real-time. These fonts have OpenType variable axes.
          </p>
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C9A355 20%, #C9A355 80%, transparent)", marginTop: "16px", boxShadow: "0 0 8px rgba(201,163,85,0.4)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Left: font picker + sliders */}
          <div className="flex flex-col gap-6 mx-auto lg:mx-0 w-full max-w-[280px] lg:max-w-none lg:w-[280px] shrink-0">
            {/* Font selector */}
            <div className="flex flex-col gap-2">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B6560" }}>
                Select Font
              </span>
              {VARIABLE_FONTS.map((f, i) => (
                <motion.button
                  key={f.name}
                  onClick={() => { setActiveIdx(i); setAxes({ wght: 400, wdth: 100, CASL: 0, SOFT: 0 }); }}
                  className="text-left px-4 py-2.5 transition-all duration-200"
                  style={{
                    background: activeIdx === i ? "rgba(201,163,85,0.12)" : "transparent",
                    border: `1px solid ${activeIdx === i ? "rgba(201,163,85,0.4)" : "rgba(244,239,230,0.06)"}`,
                    fontFamily: `'${f.family}', sans-serif`,
                    fontSize: "1rem",
                    color: activeIdx === i ? "#C9A355" : "#6B6560",
                    boxShadow: activeIdx === i ? "0 0 12px rgba(201,163,85,0.1)" : "none",
                  }}
                  whileHover={{ x: 4, color: "#F4EFE6" }}
                >
                  {f.name}
                </motion.button>
              ))}
            </div>

            {/* Axis sliders */}
            <div className="flex flex-col gap-4 p-4" style={{ border: "1px solid rgba(201,163,85,0.15)", background: "rgba(201,163,85,0.03)" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A355" }}>
                Axes
              </span>
              {Object.entries(font.axes).map(([axis, [min, max]]) => (
                <AxisSlider
                  key={axis}
                  label={axis === "wght" ? "Weight" : axis === "wdth" ? "Width" : axis === "CASL" ? "Casual" : axis === "SOFT" ? "Softness" : axis}
                  min={min} max={max}
                  value={axes[axis] ?? (min + max) / 2}
                  onChange={(v) => setAxes(prev => ({ ...prev, [axis]: v }))}
                />
              ))}
            </div>

            {/* Copy CSS */}
            <motion.button
              onClick={() => {
                const css = `@import url('https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g,"+")}:wght@100..900&display=swap');\n\n.font {\n  font-family: '${font.family}', sans-serif;\n  font-variation-settings: ${fontVariationSettings};\n}`;
                navigator.clipboard.writeText(css);
              }}
              className="px-4 py-2 text-xs font-semibold uppercase"
              style={{ border: "1px solid rgba(201,163,85,0.3)", color: "#C9A355", letterSpacing: "0.2em", fontFamily: "'Inter', sans-serif" }}
              whileHover={{ background: "rgba(201,163,85,0.1)", scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Copy CSS
            </motion.button>
          </div>

          {/* Right: live preview */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Big preview */}
            <motion.div
              className="flex items-center justify-center flex-1 p-8 md:p-16"
              style={{
                border: "1px solid rgba(201,163,85,0.12)",
                background: "#0A0A0A",
                minHeight: "300px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Grid lines decoration */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(201,163,85,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,163,85,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                pointerEvents: "none",
              }} />

              <motion.p
                key={`${font.family}-${JSON.stringify(axes)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: `'${font.family}', sans-serif`,
                  fontVariationSettings,
                  fontSize: "clamp(2rem, 6vw, 5rem)",
                  color: "#F4EFE6",
                  textAlign: "center",
                  lineHeight: 1.1,
                  letterSpacing: axes.wdth > 110 ? "0.06em" : "normal",
                  position: "relative", zIndex: 1,
                }}
              >
                {displayText}
              </motion.p>
            </motion.div>

            {/* Weight ramp */}
            <div className="grid grid-cols-5 gap-px" style={{ background: "rgba(244,239,230,0.04)" }}>
              {[100, 300, 400, 600, 900].filter(w => {
                const [min, max] = font.axes.wght || [400, 700];
                return w >= min && w <= max;
              }).map(w => (
                <div
                  key={w}
                  className="flex flex-col items-center py-4 gap-1"
                  style={{ background: "#0C0C0C" }}
                >
                  <span style={{
                    fontFamily: `'${font.family}', sans-serif`,
                    fontVariationSettings: `'wght' ${w}`,
                    fontSize: "1.5rem",
                    color: "#F4EFE6",
                    lineHeight: 1,
                  }}>Aa</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#3A3A3A", letterSpacing: "0.15em" }}>{w}</span>
                </div>
              ))}
            </div>

            {/* Font variation settings output */}
            <div
              className="p-4"
              style={{ background: "#0A0A0A", border: "1px solid rgba(244,239,230,0.06)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#4A4540", letterSpacing: "0.02em" }}
            >
              <span style={{ color: "#C9A355" }}>font-family</span>: '{font.family}';<br/>
              <span style={{ color: "#C9A355" }}>font-variation-settings</span>: {fontVariationSettings};
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
