import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FEATURED } from "../data/fonts";
import { loadFont } from "../utils/fontLoader";

const CATS = [
  { id: "all", label: "All" },
  { id: "serif", label: "Serif" },
  { id: "sans-serif", label: "Sans" },
  { id: "display", label: "Display" },
  { id: "script", label: "Script" },
];

export default function FontShowcase({ onSelectFont }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  // Preload featured fonts
  useEffect(() => {
    FEATURED.forEach((f) => loadFont(f.family, f.weights?.slice(0, 3) || [400, 700]));
  }, []);

  const filtered = activeCategory === "all"
    ? FEATURED
    : FEATURED.filter((f) => f.category === activeCategory);

  // Drag-to-scroll
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.classList.add("grabbing");
  };
  const onMouseLeave = () => {
    setIsDragging(false);
    scrollRef.current?.classList.remove("grabbing");
  };
  const onMouseUp = () => {
    setIsDragging(false);
    scrollRef.current?.classList.remove("grabbing");
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Track active slide via scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveIndex(Math.min(idx, filtered.length - 1));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [filtered.length]);

  const goTo = (i) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.offsetWidth, behavior: "smooth" });
    setActiveIndex(i);
  };

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo(Math.min(activeIndex + 1, filtered.length - 1));
      if (e.key === "ArrowLeft") goTo(Math.max(activeIndex - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, filtered.length]);

  // Reset scroll on category change
  useEffect(() => {
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [activeCategory]);

  return (
    <section id="showcase" className="relative" style={{ background: "#0C0C0C" }}>
      {/* Section Header */}
      <div
        className="flex flex-col md:flex-row items-start md:items-end justify-between px-8 md:px-16 py-12 gap-6 border-b"
        style={{ borderColor: "rgba(201,163,85,0.15)" }}
      >
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase block mb-3"
            style={{ color: "#C9A355", letterSpacing: "0.25em" }}
          >
            ✦ Font Specimens
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#F4EFE6", lineHeight: 1 }}
          >
            Every typeface,<br />
            <em style={{ color: "#C9A355" }}>a story.</em>
          </motion.h2>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {CATS.map((cat) => (
            <button
              key={cat.id}
              data-cursor=""
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300"
              style={{
                letterSpacing: "0.15em",
                border: "1px solid",
                borderColor: activeCategory === cat.id ? "#C9A355" : "rgba(244,239,230,0.1)",
                color: activeCategory === cat.id ? "#C9A355" : "#6B6560",
                background: activeCategory === cat.id ? "rgba(201,163,85,0.08)" : "transparent",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div
        ref={scrollRef}
        className="h-scroll-container"
        style={{ height: "75vh" }}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {filtered.map((font, i) => (
          <FontSlide
            key={font.id}
            font={font}
            index={i}
            isActive={i === activeIndex}
            onOpen={() => onSelectFont(font)}
          />
        ))}
      </div>

      {/* Navigation dots + counter */}
      <div
        className="flex flex-wrap items-center justify-between px-8 md:px-16 py-6 border-t gap-4"
        style={{ borderColor: "rgba(201,163,85,0.15)" }}
      >
        {/* Dots */}
        <div className="flex gap-2">
          {filtered.map((_, i) => (
            <button
              key={i}
              data-cursor=""
              onClick={() => goTo(i)}
              className="transition-all duration-300"
              style={{
                width: i === activeIndex ? "24px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === activeIndex ? "#C9A355" : "rgba(244,239,230,0.2)",
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="flex items-center gap-4">
          <span
            className="font-display text-2xl font-light"
            style={{ color: "#C9A355" }}
          >
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span style={{ color: "rgba(244,239,230,0.2)" }}>/</span>
          <span
            className="font-sans text-xs"
            style={{ color: "#6B6560" }}
          >
            {String(filtered.length).padStart(2, "0")}
          </span>
        </div>

        {/* Arrow nav */}
        <div className="flex gap-3">
          <button
            onClick={() => goTo(Math.max(activeIndex - 1, 0))}
            className="w-10 h-10 flex items-center justify-center transition-all duration-300"
            style={{ border: "1px solid rgba(244,239,230,0.15)", color: "#6B6560" }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.borderColor = "#C9A355"; 
              e.currentTarget.style.color = "#C9A355"; 
              e.currentTarget.style.transform = "translateX(-4px)";
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.borderColor = "rgba(244,239,230,0.15)"; 
              e.currentTarget.style.color = "#6B6560"; 
              e.currentTarget.style.transform = "translateX(0px)";
            }}
          >
            ←
          </button>
          <button
            onClick={() => goTo(Math.min(activeIndex + 1, filtered.length - 1))}
            className="w-10 h-10 flex items-center justify-center transition-all duration-300"
            style={{ border: "1px solid rgba(244,239,230,0.15)", color: "#6B6560" }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.borderColor = "#C9A355"; 
              e.currentTarget.style.color = "#C9A355"; 
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.borderColor = "rgba(244,239,230,0.15)"; 
              e.currentTarget.style.color = "#6B6560"; 
              e.currentTarget.style.transform = "translateX(0px)";
            }}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

function FontSlide({ font, index, isActive, onOpen }) {
  const isEven = index % 2 === 0;
  const bg = isEven ? "#0C0C0C" : "#F4EFE6";
  const textMain = isEven ? "#F4EFE6" : "#0C0C0C";
  const textMuted = isEven ? "#6B6560" : "#8A857E";

  return (
    <div
      className="h-scroll-item relative flex flex-col justify-between overflow-hidden"
      style={{
        width: "100vw",
        height: "75vh",
        background: bg,
        flexShrink: 0,
      }}
    >
      {/* Giant background letter */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ userSelect: "none" }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isActive ? 0.04 : 0.02, scale: isActive ? 1 : 0.9 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: `'${font.family}', serif`,
            fontSize: "55vmin",
            color: textMain,
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          {font.bigLetter}
        </motion.span>
      </div>

      {/* Top-left metadata */}
      <div className="relative z-10 p-8 md:p-16 flex items-start justify-between">
        <div>
          <span
            className="text-xs font-semibold tracking-widest uppercase block mb-2"
            style={{ color: "#C9A355", letterSpacing: "0.2em" }}
          >
            {String(index + 1).padStart(2, "0")} · {font.label}
          </span>
          <h3
            className="font-sans font-bold"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: textMuted }}
          >
            {font.name}
          </h3>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: textMuted, letterSpacing: "0.15em" }}>
            by {font.designer}
          </div>
          <div className="text-xs" style={{ color: textMuted }}>
            {font.year}
          </div>
        </div>
      </div>

      {/* Center specimen text */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 md:px-20">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isActive ? 1 : 0.4, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl"
          style={{
            fontFamily: `'${font.family}', serif`,
            fontSize: "clamp(1.5rem, 4vw, 3.5rem)",
            color: textMain,
            lineHeight: 1.25,
            fontWeight: font.weights.includes(700) ? 700 : 400,
          }}
        >
          {font.specimen}
        </motion.p>
      </div>

      {/* Bottom row */}
      <div
        className="relative z-10 flex flex-wrap gap-6 items-end justify-between p-8 md:p-16"
      >
        {/* Pairs with */}
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: textMuted, letterSpacing: "0.15em" }}>
            Pairs well with
          </div>
          <div
            className="text-sm font-medium"
            style={{ color: textMain, fontStyle: "italic" }}
          >
            {font.pairsWith}
          </div>
        </div>

        {/* Weights */}
        <div className="flex gap-1 items-end">
          {font.weights.map((w) => (
            <div
              key={w}
              className="flex flex-col items-center gap-1"
            >
              <span
                style={{
                  fontFamily: `'${font.family}', serif`,
                  fontWeight: w,
                  fontSize: "1.1rem",
                  color: textMain,
                  opacity: 0.7,
                }}
              >
                Aa
              </span>
              <span className="text-xs" style={{ color: textMuted, fontSize: "9px" }}>
                {w}
              </span>
            </div>
          ))}
        </div>

        {/* Preview button */}
        <motion.button
          data-cursor="preview"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          className="flex items-center gap-3 px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-all duration-300"
          style={{
            border: `1px solid ${isEven ? "rgba(201,163,85,0.4)" : "rgba(12,12,12,0.3)"}`,
            color: isEven ? "#C9A355" : "#0C0C0C",
            letterSpacing: "0.18em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#C9A355";
            e.currentTarget.style.color = "#0C0C0C";
            e.currentTarget.style.borderColor = "#C9A355";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = isEven ? "#C9A355" : "#0C0C0C";
            e.currentTarget.style.borderColor = isEven ? "rgba(201,163,85,0.4)" : "rgba(12,12,12,0.3)";
          }}
        >
          Customise
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
