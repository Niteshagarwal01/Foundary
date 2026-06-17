import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Font pairings ─────────────────────────────────────────────────────────────
const PAIRINGS = [
  {
    id: "editorial",
    label: "Editorial",
    headline: "'Playfair Display', serif",
    headlineWeight: 700,
    body: "'Lora', serif",
    bg: "#0F0E0C",
    surface: "#1A1812",
    text: "#F4EFE6",
    accent: "#C9A355",
    tagline_size: "0.95rem",
    head_size: "clamp(1.6rem, 3vw, 2.2rem)",
    description: "Playfair Display + Lora",
    css: `font-family: 'Playfair Display', serif;\nfont-weight: 700;\n/* Tagline: Lora, serif */`,
  },
  {
    id: "modern",
    label: "Modern",
    headline: "'Space Grotesk', sans-serif",
    headlineWeight: 700,
    body: "'Inter', sans-serif",
    bg: "#080C10",
    surface: "#0E1418",
    text: "#E8F4FF",
    accent: "#5B9BD5",
    tagline_size: "0.85rem",
    head_size: "clamp(1.5rem, 3vw, 2rem)",
    description: "Space Grotesk + Inter",
    css: `font-family: 'Space Grotesk', sans-serif;\nfont-weight: 700;\n/* Tagline: Inter, 400 */`,
  },
  {
    id: "luxury",
    label: "Luxury",
    headline: "'Cormorant Garamond', serif",
    headlineWeight: 300,
    body: "'Raleway', sans-serif",
    bg: "#080808",
    surface: "#111008",
    text: "#F0E8D0",
    accent: "#C9A355",
    tagline_size: "0.78rem",
    head_size: "clamp(1.8rem, 3.5vw, 2.6rem)",
    description: "Cormorant Garamond + Raleway",
    css: `font-family: 'Cormorant Garamond', serif;\nfont-weight: 300;\nletter-spacing: 0.08em;\n/* Tagline: Raleway, 300 */`,
  },
  {
    id: "bold",
    label: "Bold",
    headline: "'Anton', sans-serif",
    headlineWeight: 400,
    body: "'Bebas Neue', sans-serif",
    bg: "#0D0000",
    surface: "#1A0404",
    text: "#F4EFE6",
    accent: "#FF5252",
    tagline_size: "1rem",
    head_size: "clamp(2rem, 4vw, 3rem)",
    description: "Anton + Bebas Neue",
    css: `font-family: 'Anton', sans-serif;\nletter-spacing: 0.04em;\n/* Tagline: Bebas Neue */`,
  },
  {
    id: "friendly",
    label: "Friendly",
    headline: "'Nunito', sans-serif",
    headlineWeight: 800,
    body: "'Inter', sans-serif",
    bg: "#050D0C",
    surface: "#0C1A18",
    text: "#E8FFF8",
    accent: "#4ECDC4",
    tagline_size: "0.9rem",
    head_size: "clamp(1.5rem, 3vw, 2.1rem)",
    description: "Nunito + Inter",
    css: `font-family: 'Nunito', sans-serif;\nfont-weight: 800;\n/* Tagline: Inter, 400 */`,
  },
  {
    id: "classic",
    label: "Classic",
    headline: "'EB Garamond', serif",
    headlineWeight: 700,
    body: "'Crimson Text', serif",
    bg: "#0E0C08",
    surface: "#1C1A10",
    text: "#F5EDD5",
    accent: "#D4AF37",
    tagline_size: "0.95rem",
    head_size: "clamp(1.6rem, 3vw, 2.2rem)",
    description: "EB Garamond + Crimson Text",
    css: `font-family: 'EB Garamond', serif;\nfont-weight: 700;\n/* Tagline: Crimson Text, 400 */`,
  },
  {
    id: "minimal",
    label: "Minimal",
    headline: "'Josefin Sans', sans-serif",
    headlineWeight: 100,
    body: "'Josefin Sans', sans-serif",
    bg: "#F4EFE6",
    surface: "#FFFFFF",
    text: "#0C0C0C",
    accent: "#888880",
    tagline_size: "0.75rem",
    head_size: "clamp(1.5rem, 3vw, 2.2rem)",
    description: "Josefin Sans Light",
    css: `font-family: 'Josefin Sans', sans-serif;\nfont-weight: 100;\nletter-spacing: 0.25em;\n/* Tagline: Josefin Sans, 300 */`,
  },
  {
    id: "experimental",
    label: "Experimental",
    headline: "'Abril Fatface', serif",
    headlineWeight: 400,
    body: "'Space Grotesk', monospace",
    bg: "#06000E",
    surface: "#100820",
    text: "#F0E8FF",
    accent: "#A855F7",
    tagline_size: "0.8rem",
    head_size: "clamp(1.6rem, 3vw, 2.3rem)",
    description: "Abril Fatface + Space Grotesk",
    css: `font-family: 'Abril Fatface', serif;\n/* Tagline: Space Grotesk, mono */`,
  },
];

const INDUSTRIES = ["Tech", "Fashion", "Food", "Finance", "Creative"];

// Taglines by industry
const INDUSTRY_TAGLINES = {
  Tech: "Powering tomorrow, today.",
  Fashion: "Wear your identity.",
  Food: "Crafted with intention.",
  Finance: "Your wealth, simplified.",
  Creative: "Ideas that move the world.",
};

function BrandCard({ pairing, brandName, tagline, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(pairing.css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pairing.css]);

  const displayBrand = brandName || "Your Brand";
  const displayTagline = tagline || "Your tagline here";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.96 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="relative group overflow-hidden rounded-sm"
      style={{ background: pairing.surface, border: `1px solid ${pairing.accent}22` }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${pairing.accent}80, transparent)` }}
      />

      {/* Card body */}
      <div className="p-6 min-h-[180px] flex flex-col justify-between">
        {/* Label */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: pairing.accent, fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em", opacity: 0.7 }}
          >
            {pairing.label}
          </span>
          <span className="text-xs" style={{ color: pairing.accent, opacity: 0.4, fontFamily: "'Inter', sans-serif" }}>
            {pairing.description}
          </span>
        </div>

        {/* Brand name */}
        <div>
          <div
            style={{
              fontFamily: pairing.headline,
              fontWeight: pairing.headlineWeight,
              fontSize: pairing.head_size,
              color: pairing.text,
              lineHeight: 1.1,
              letterSpacing: pairing.id === "luxury" ? "0.08em" : pairing.id === "minimal" ? "0.25em" : pairing.id === "bold" ? "0.04em" : "0",
              wordBreak: "break-word",
            }}
          >
            {displayBrand}
          </div>
          <div
            style={{
              fontFamily: pairing.body,
              fontSize: pairing.tagline_size,
              color: pairing.text,
              opacity: 0.6,
              marginTop: "0.5rem",
              letterSpacing: pairing.id === "minimal" ? "0.2em" : pairing.id === "luxury" ? "0.12em" : "0.03em",
              lineHeight: 1.5,
            }}
          >
            {displayTagline}
          </div>
        </div>

        {/* Accent bar */}
        <div
          className="mt-4"
          style={{ height: "2px", background: pairing.accent, width: "32px", opacity: 0.7 }}
        />
      </div>

      {/* Copy CSS button (appears on hover) */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-2 transition-all duration-300"
        style={{
          background: `${pairing.bg}ee`,
          backdropFilter: "blur(8px)",
          transform: "translateY(100%)",
        }}
      >
        <motion.button
          onClick={handleCopy}
          className="text-xs uppercase tracking-widest px-4 py-2 border transition-colors"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: pairing.accent,
            borderColor: `${pairing.accent}50`,
            background: "transparent",
            letterSpacing: "0.15em",
          }}
          whileHover={{ background: `${pairing.accent}18` }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? "✓ Copied!" : "Copy CSS"}
        </motion.button>
      </div>

      {/* Hover overlay to show copy button */}
      <style>{`
        .brand-card-${pairing.id}:hover .copy-btn-${pairing.id} {
          transform: translateY(0) !important;
        }
      `}</style>
      <div
        className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center py-2"
        style={{ background: `${pairing.bg}ee`, backdropFilter: "blur(8px)" }}
      >
        <motion.button
          onClick={handleCopy}
          className="text-xs uppercase tracking-widest px-4 py-2 border"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: pairing.accent,
            borderColor: `${pairing.accent}50`,
            background: "transparent",
            letterSpacing: "0.15em",
          }}
          whileHover={{ background: `${pairing.accent}18` }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? "✓ Copied!" : "Copy CSS"}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function BrandTryOn() {
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [industry, setIndustry] = useState("Creative");

  const autoTagline = INDUSTRY_TAGLINES[industry] || "";
  const displayTagline = tagline || autoTagline;

  return (
    <section
      id="brand-tryon"
      className="relative overflow-hidden"
      style={{ background: "#0A0A0A", padding: "4rem 0 5rem" }}
    >
      {/* Background ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(201,163,85,0.04) 0%, transparent 55%)" }}
      />

      <div className="px-8 md:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-2"
        >
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#C9A355", fontFamily: "'Inter', sans-serif", letterSpacing: "0.3em" }}
          >
            Brand Studio
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3"
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5.5rem)", color: "#F4EFE6", lineHeight: 0.95, letterSpacing: "0.02em" }}>
            YOUR BRAND
          </span>
          <span style={{ fontFamily: "'Kaushan Script', cursive", fontSize: "clamp(2rem, 4.5vw, 4rem)", color: "#C9A355", lineHeight: 1 }}>
            in every voice
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{ fontFamily: "'Lora', serif", fontStyle: "italic", color: "#F4EFE660", fontSize: "1rem", marginBottom: "3rem", maxWidth: "480px" }}
        >
          Type your brand name and see it rendered instantly across 8 curated typographic voices.
        </motion.p>

        {/* Input row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          {/* Brand name */}
          <div className="flex-1 relative">
            <label
              className="absolute -top-5 left-0 text-xs uppercase tracking-widest"
              style={{ color: "#C9A355", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}
            >
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Lumina Studio"
              maxLength={30}
              className="w-full px-5 py-4 text-2xl outline-none transition-all duration-300"
              style={{
                background: "#111111",
                border: "1px solid rgba(201,163,85,0.2)",
                color: "#F4EFE6",
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                letterSpacing: "0.02em",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(201,163,85,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,163,85,0.2)")}
            />
          </div>

          {/* Tagline */}
          <div className="flex-1 relative">
            <label
              className="absolute -top-5 left-0 text-xs uppercase tracking-widest"
              style={{ color: "#C9A355", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}
            >
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder={autoTagline}
              maxLength={50}
              className="w-full px-5 py-4 text-base outline-none transition-all duration-300"
              style={{
                background: "#111111",
                border: "1px solid rgba(201,163,85,0.2)",
                color: "#F4EFE6",
                fontFamily: "'Lora', serif",
                fontStyle: "italic",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(201,163,85,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,163,85,0.2)")}
            />
          </div>

          {/* Industry select */}
          <div className="relative" style={{ minWidth: "160px" }}>
            <label
              className="absolute -top-5 left-0 text-xs uppercase tracking-widest"
              style={{ color: "#C9A355", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}
            >
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-full px-5 py-4 outline-none appearance-none transition-all duration-300"
              style={{
                background: "#111111",
                border: "1px solid rgba(201,163,85,0.2)",
                color: "#C9A355",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
              }}
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} style={{ background: "#111111" }}>
                  {ind}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#C9A355", fontSize: "0.7rem" }}>▼</div>
          </div>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
            key={`${brandName}-${tagline}-${industry}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {PAIRINGS.map((p, i) => (
              <BrandCard
                key={p.id}
                pairing={p}
                brandName={brandName}
                tagline={displayTagline}
                index={i}
              />
            ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
