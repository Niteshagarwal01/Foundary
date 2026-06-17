import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

const ERAS = [
  {
    year: "1450",
    name: "Gutenberg Press",
    script: "The Birth of Print",
    description: "Johannes Gutenberg's movable type system ignited a revolution. Blackletter dominated the first printed bibles — dense, gothic, and sacred.",
    font: "IM Fell English",
    fontStyle: { fontFamily: "'IM Fell English', serif", fontStyle: "italic" },
    specimen: "Hier beginnet das heilige Evangelium",
    era: "Blackletter",
    accentColor: "#C9A355",
    bg: "linear-gradient(145deg, #0e0a04 0%, #1a1200 100%)",
  },
  {
    year: "1501",
    name: "Aldus Manutius",
    script: "The Italic Is Born",
    description: "The Venetian printer Aldus Manutius introduced the first italic typeface, inspired by humanist handwriting. Compact, cursive, and revolutionary.",
    font: "Cinzel",
    fontStyle: { fontFamily: "'Cinzel', serif", letterSpacing: "0.15em" },
    specimen: "ALDVS MANVTIVS ROMANVS",
    era: "Humanist",
    accentColor: "#C9A355",
    bg: "linear-gradient(145deg, #0d0c08 0%, #1c1800 100%)",
  },
  {
    year: "1734",
    name: "William Caslon",
    script: "Old Style Mastery",
    description: "Caslon's types brought warmth and readability to English printing. Old Style serifs with organic strokes and gentle contrast defined an era.",
    font: "Crimson Text",
    fontStyle: { fontFamily: "'Crimson Text', serif", fontSize: "1.15em" },
    specimen: "Where beauty meets the letter-press",
    era: "Old Style",
    accentColor: "#B8966A",
    bg: "linear-gradient(145deg, #0c0c0c 0%, #1a1408 100%)",
  },
  {
    year: "1757",
    name: "John Baskerville",
    script: "Transitional Clarity",
    description: "Baskerville pushed type into a new realm — higher contrast, crisp serifs, wider letterforms. The bridge between Old Style and Modern.",
    font: "Libre Baskerville",
    fontStyle: { fontFamily: "'Libre Baskerville', serif" },
    specimen: "Virtue is its own reward.",
    era: "Transitional",
    accentColor: "#C9A355",
    bg: "linear-gradient(145deg, #080c0e 0%, #0e1518 100%)",
  },
  {
    year: "1788",
    name: "Didot & Bodoni",
    script: "Modern Extremes",
    description: "Ultra-thin hairlines meet razor-sharp thick strokes. The Modern serif pushed contrast to its maximum — austere, mathematical, sublime.",
    font: "Bodoni Moda",
    fontStyle: { fontFamily: "'Bodoni Moda', serif", fontWeight: 700, letterSpacing: "0.04em" },
    specimen: "Fashion Above All Else",
    era: "Modern Serif",
    accentColor: "#D4AF6A",
    bg: "linear-gradient(145deg, #0a0a0a 0%, #181010 100%)",
  },
  {
    year: "1898",
    name: "Akzidenz-Grotesk",
    script: "Sans Arrives",
    description: "The first commercially successful sans-serif. Clean, rational, and stripped of ornament — it would inspire generations of designers.",
    font: "Space Grotesk",
    fontStyle: { fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.02em" },
    specimen: "Form Follows Function",
    era: "Grotesque",
    accentColor: "#A0C0D0",
    bg: "linear-gradient(145deg, #080c10 0%, #0a1018 100%)",
  },
  {
    year: "1957",
    name: "Helvetica",
    script: "Swiss Modernism",
    description: "Max Miedinger's Neue Haas Grotesk — renamed Helvetica — became the lingua franca of corporate design. Neutral, universal, eternal.",
    font: "Inter",
    fontStyle: { fontFamily: "'Inter', sans-serif", letterSpacing: "-0.01em", fontWeight: 500 },
    specimen: "The World in One Typeface",
    era: "Neo-Grotesque",
    accentColor: "#E0E0E0",
    bg: "linear-gradient(145deg, #0a0a0a 0%, #121212 100%)",
  },
  {
    year: "1984",
    name: "Macintosh",
    script: "Desktop Publishing",
    description: "The Mac democratized typography. Suddenly everyone could typeset — PageMaker, laser printers, and a thousand bad font choices were born.",
    font: "Space Grotesk",
    fontStyle: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "0.05em" },
    specimen: "Hello, I'm Macintosh.",
    era: "Digital",
    accentColor: "#FF8A80",
    bg: "linear-gradient(145deg, #0c080c 0%, #180818 100%)",
  },
  {
    year: "1994",
    name: "The Web Era",
    script: "Type Goes Online",
    description: "Verdana and Georgia — designed by Matthew Carter for screens — proved type could thrive at 72dpi. The web changed how we read forever.",
    font: "Lora",
    fontStyle: { fontFamily: "'Lora', serif", fontStyle: "italic" },
    specimen: "The internet finds a voice",
    era: "Screen Type",
    accentColor: "#7EB8F7",
    bg: "linear-gradient(145deg, #060c14 0%, #081018 100%)",
  },
  {
    year: "2010",
    name: "Google Fonts",
    script: "Type For Everyone",
    description: "Google Fonts launched the open-source typography revolution. Thousands of typefaces — free, fast, beautiful — available to every website on Earth.",
    font: "Playfair Display",
    fontStyle: { fontFamily: "'Playfair Display', serif", fontWeight: 900 },
    specimen: "Typography Democratized",
    era: "Open Source",
    accentColor: "#80BAFF",
    bg: "linear-gradient(145deg, #060a14 0%, #080e20 100%)",
  },
  {
    year: "2026",
    name: "The Foundry",
    script: "Variable & Beyond",
    description: "Variable fonts bend to any weight, width, and optical size. AI-assisted design, parametric type systems, and The Foundry Gazette — the future is now.",
    font: "Anton",
    fontStyle: { fontFamily: "'Anton', sans-serif", letterSpacing: "0.04em" },
    specimen: "THE FOUNDRY GAZETTE",
    era: "Variable Era",
    accentColor: "#C9A355",
    bg: "linear-gradient(145deg, #0C0C0C 0%, #1a1200 100%)",
  },
];

function EraCard({ era, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="h-scroll-item relative flex-shrink-0"
      style={{ width: "420px" }}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: Math.min(index * 0.06, 0.4), ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative mx-3 rounded-sm overflow-hidden border flex flex-col"
        style={{ background: era.bg, borderColor: `${era.accentColor}22`, minHeight: "490px" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 30% 20%, ${era.accentColor}0a 0%, transparent 65%)` }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${era.accentColor}, transparent)` }}
        />
        <div className="relative z-10 p-7 flex flex-col h-full">
          <div className="flex items-center justify-between mb-5">
            <span
              className="text-xs font-semibold uppercase px-2 py-1 rounded-sm"
              style={{ color: era.accentColor, background: `${era.accentColor}18`, fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}
            >
              {era.era}
            </span>
            <div className="w-5 h-5 rounded-full border flex items-center justify-center" style={{ borderColor: `${era.accentColor}40` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: era.accentColor }} />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 + index * 0.04, duration: 0.6 }}
          >
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "5.5rem", lineHeight: 0.88, color: era.accentColor, textShadow: `0 0 40px ${era.accentColor}35` }}>
              {era.year}
            </div>
          </motion.div>

          <div style={{ fontFamily: "'Kaushan Script', cursive", fontSize: "1.25rem", color: "#F4EFE6", marginTop: "0.6rem", opacity: 0.9 }}>
            {era.name}
          </div>
          <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "0.9rem", color: era.accentColor, opacity: 0.65, marginTop: "0.2rem" }}>
            {era.script}
          </div>

          <div className="my-4" style={{ height: "1px", background: `linear-gradient(90deg, ${era.accentColor}50, transparent)` }} />

          <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "0.83rem", color: "#F4EFE699", lineHeight: 1.72, flexGrow: 1 }}>
            {era.description}
          </p>

          <motion.div
            className="mt-5 pt-5"
            style={{ borderTop: `1px solid ${era.accentColor}20` }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 + index * 0.04, duration: 0.8 }}
          >
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: era.accentColor, opacity: 0.45, fontFamily: "'Inter', sans-serif" }}>
              Specimen · {era.font}
            </div>
            <div style={{ ...era.fontStyle, fontSize: era.specimen.length > 25 ? "0.92rem" : era.specimen.length > 18 ? "1.1rem" : "1.35rem", color: "#F4EFE6", lineHeight: 1.3 }}>
              {era.specimen}
            </div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full border-2 z-20"
          style={{ background: era.accentColor, borderColor: "#0C0C0C", boxShadow: `0 0 12px ${era.accentColor}70` }}
        />
      </div>
    </motion.div>
  );
}

export default function TypeTimeline() {
  const scrollRef = useRef(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollBy = useCallback((dir) => {
    scrollRef.current?.scrollBy({ left: dir * 450, behavior: "smooth" });
  }, []);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.4;
  };

  return (
    <section id="timeline" className="relative overflow-hidden" style={{ background: "#0C0C0C", paddingBottom: "5rem" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(201,163,85,0.03) 0%, transparent 60%)" }}
      />

      {/* Header */}
      <div ref={headerRef} className="px-8 md:px-16 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-2"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#C9A355", fontFamily: "'Inter', sans-serif", letterSpacing: "0.3em" }}>
            1450 — 2026
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5.5rem)", color: "#F4EFE6", lineHeight: 0.95, letterSpacing: "0.02em" }}>
            THE ART
          </span>
          <span style={{ fontFamily: "'Kaushan Script', cursive", fontSize: "clamp(2rem, 4.5vw, 4rem)", color: "#C9A355", lineHeight: 1 }}>
            of type
          </span>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5.5rem)", color: "#F4EFE6", lineHeight: 0.95, letterSpacing: "0.02em" }}>
            through
          </span>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5.5rem)", background: "linear-gradient(105deg,#C9A355 0%,#F0D48A 50%,#C9A355 100%)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 0.95, letterSpacing: "0.02em" }}>
            TIME
          </span>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 origin-left"
          style={{ height: "2px", background: "linear-gradient(90deg, #C9A355 0%, #F0D48A 40%, #C9A355 70%, transparent 100%)", boxShadow: "0 0 12px rgba(201,163,85,0.5)", maxWidth: "600px" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "1rem", color: "#F4EFE670", marginTop: "1rem", maxWidth: "500px" }}
        >
          From Gutenberg's press to variable fonts — six centuries of type history, one scroll away.
        </motion.p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-8 md:px-16 mb-5">
        <div className="text-xs uppercase tracking-widest flex items-center gap-2" style={{ color: "#F4EFE640", fontFamily: "'Inter', sans-serif" }}>
          <span>Drag or arrow to explore</span>
        </div>
        <div className="flex gap-3">
          {[-1, 1].map((dir) => (
            <motion.button
              key={dir}
              onClick={() => scrollBy(dir)}
              className="w-10 h-10 border flex items-center justify-center text-lg"
              style={{ borderColor: "rgba(201,163,85,0.3)", color: "#C9A355", background: "transparent" }}
              whileHover={{ background: "rgba(201,163,85,0.1)", borderColor: "#C9A355", boxShadow: "0 0 16px rgba(201,163,85,0.2)" }}
              whileTap={{ scale: 0.9 }}
            >
              {dir === -1 ? "←" : "→"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div
          className="absolute left-0 right-0 pointer-events-none z-10"
          style={{ bottom: "1px", height: "2px", background: "linear-gradient(90deg, transparent, rgba(201,163,85,0.35) 5%, rgba(201,163,85,0.35) 95%, transparent)" }}
        />
        <div
          ref={scrollRef}
          className="h-scroll-container pb-8 pt-2 select-none"
          style={{ cursor: isDragging ? "grabbing" : "grab", paddingLeft: "2rem", paddingRight: "4rem" }}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {ERAS.map((era, i) => (
            <EraCard key={era.year} era={era} index={i} />
          ))}
          <div style={{ flexShrink: 0, width: "80px" }} />
        </div>
      </div>
    </section>
  );
}
