import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOODS = [
  {
    id: "luxury",
    name: "LUXURY",
    color: "#0B132B",
    bg: "#F8F9FA",
    text: "Cormorant",
    body: "Raleway",
    headlineStyle: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: "italic", textTransform: "lowercase", letterSpacing: "0.02em" },
    bodyStyle: { fontFamily: "'Raleway', sans-serif", fontWeight: 300, letterSpacing: "0.05em", lineHeight: 1.8 },
    swatches: ["#0B132B", "#C9A355", "#EBEBEB", "#1C1C1C"],
    specimen: "Refined elegance. The perfect balance of proportion and grace.",
  },
  {
    id: "playful",
    name: "PLAYFUL",
    color: "#FF6B6B",
    bg: "#FFF5F5",
    text: "Righteous",
    body: "Nunito",
    headlineStyle: { fontFamily: "'Righteous', display", textTransform: "uppercase", letterSpacing: "0.05em" },
    bodyStyle: { fontFamily: "'Nunito', sans-serif", fontWeight: 600, letterSpacing: "0", lineHeight: 1.6 },
    swatches: ["#FF6B6B", "#FFD93D", "#4D96FF", "#6BCB77"],
    specimen: "Bold, bright, and full of character. Design that doesn't take itself too seriously.",
  },
  {
    id: "editorial",
    name: "EDITORIAL",
    color: "#1A1A1A",
    bg: "#F4EFE6",
    text: "Playfair Display",
    body: "Merriweather",
    headlineStyle: { fontFamily: "'Playfair Display', serif", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em" },
    bodyStyle: { fontFamily: "'Merriweather', serif", fontWeight: 300, letterSpacing: "0", lineHeight: 1.9 },
    swatches: ["#1A1A1A", "#D1495B", "#F4EFE6", "#6B6560"],
    specimen: "The authoritative voice. A modern approach to classic newspaper typography.",
  },
  {
    id: "technical",
    name: "TECHNICAL",
    color: "#00FF41",
    bg: "#0A0A0A",
    text: "JetBrains Mono",
    body: "Space Grotesk",
    headlineStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textTransform: "lowercase", letterSpacing: "-0.05em" },
    bodyStyle: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, letterSpacing: "0.02em", lineHeight: 1.6, color: "#A0A0A0" },
    swatches: ["#00FF41", "#0A0A0A", "#2B2B2B", "#008F11"],
    specimen: "function design() { return 'precision and logic'; }",
  },
  {
    id: "minimal",
    name: "MINIMAL",
    color: "#000000",
    bg: "#FFFFFF",
    text: "Josefin Sans",
    body: "Inter",
    headlineStyle: { fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100, textTransform: "uppercase", letterSpacing: "0.2em" },
    bodyStyle: { fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em", lineHeight: 2, color: "#666" },
    swatches: ["#000000", "#FFFFFF", "#F5F5F5", "#888888"],
    specimen: "Less is more. Removing the non-essential to reveal the truth.",
  },
  {
    id: "romantic",
    name: "ROMANTIC",
    color: "#8B4A5C",
    bg: "#FDF5F6",
    text: "Dancing Script",
    body: "Lora",
    headlineStyle: { fontFamily: "'Dancing Script', cursive", fontWeight: 600, textTransform: "none", letterSpacing: "0" },
    bodyStyle: { fontFamily: "'Lora', serif", fontWeight: 400, letterSpacing: "0.02em", lineHeight: 1.8, color: "#5A4A4D" },
    swatches: ["#8B4A5C", "#DDBEA9", "#FFE8D6", "#CB997E"],
    specimen: "Where beauty flows like ink. Expressive and emotionally resonant.",
  }
];

export default function MoodBoard() {
  const [activeId, setActiveId] = useState("luxury");

  const mood = MOODS.find(m => m.id === activeId);

  return (
    <section id="mood" style={{ background: "#080808", padding: "60px 0" }}>
      <div className="px-6 md:px-14 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ height: "1px", background: "rgba(244,239,230,0.08)", marginBottom: "24px" }} />
          <div className="flex items-baseline gap-3 flex-wrap">
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#F4EFE6", lineHeight: 0.9 }}>
              FIND YOUR
            </span>
            <span className="gold-shimmer" style={{ fontFamily: "'Kaushan Script', cursive", fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", fontStyle: "italic", lineHeight: 0.9 }}>
              type mood
            </span>
          </div>
          <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "0.95rem", color: "#4A4540", marginTop: "12px" }}>
            Select a mood to generate a customized typographic style board.
          </p>
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C9A355 20%, #C9A355 80%, transparent)", marginTop: "16px", boxShadow: "0 0 8px rgba(201,163,85,0.4)" }} />
        </motion.div>
      </div>

      <div className="px-6 md:px-14 flex flex-wrap gap-2 mb-8">
        {MOODS.map(m => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 + MOODS.indexOf(m) * 0.05 }}
            onClick={() => setActiveId(m.id)}
            className="px-4 py-2 text-xs font-semibold uppercase transition-all duration-300"
            style={{
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.15em",
              background: activeId === m.id ? "#C9A355" : "transparent",
              color: activeId === m.id ? "#0C0C0C" : "#6B6560",
              border: `1px solid ${activeId === m.id ? "#C9A355" : "rgba(244,239,230,0.12)"}`,
              boxShadow: activeId === m.id ? "0 0 16px rgba(201,163,85,0.4)" : "none",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {m.name}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="px-6 md:px-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mood.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col md:flex-row shadow-2xl"
            style={{ minHeight: "500px", background: mood.bg, color: mood.color, overflow: "hidden" }}
          >
            {/* Left Col */}
            <div className="flex-1 p-8 md:p-16 flex flex-col justify-between" style={{ borderRight: `1px solid ${mood.color}20` }}>
              <div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "16px" }}>
                  Primary Typeface
                </span>
                <h2 style={{ ...mood.headlineStyle, fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1, marginBottom: "24px" }}>
                  {mood.name}
                </h2>
                <div style={{ ...mood.bodyStyle, fontSize: "1.1rem", maxWidth: "35ch" }}>
                  {mood.specimen}
                </div>
              </div>

              <div className="mt-16">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "12px" }}>
                  Color Palette
                </span>
                <div className="flex gap-2">
                  {mood.swatches.map((color, i) => (
                    <motion.div
                      key={color}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                      style={{ width: "48px", height: "48px", borderRadius: "50%", background: color, border: `1px solid ${mood.color}30`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col */}
            <div className="flex-1 p-8 md:p-16 flex flex-col justify-center" style={{ background: `${mood.color}08` }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.6, display: "block", marginBottom: "24px" }}>
                Suggested Pairing
              </span>
              <div className="flex flex-col gap-6" style={{ background: mood.bg, padding: "32px", border: `1px solid ${mood.color}20`, boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ ...mood.headlineStyle, fontSize: "2rem", lineHeight: 1.1 }}>
                  {mood.text} & {mood.body}
                </div>
                <div style={{ width: "40px", height: "2px", background: mood.color, opacity: 0.3 }} />
                <div style={{ ...mood.bodyStyle, fontSize: "0.95rem" }}>
                  A harmonious combination designed for {mood.name.toLowerCase()} contexts. The contrast between {mood.text} and {mood.body} creates a compelling visual hierarchy.
                </div>
              </div>
              <motion.button
                className="mt-8 px-6 py-3 uppercase text-xs font-bold tracking-widest self-start"
                style={{ background: mood.color, color: mood.bg }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download PDF
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
