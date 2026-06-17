import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Slider from "@radix-ui/react-slider";
import { FONTS } from "../data/fonts";

const DEFAULT_TEXT = "The quick brown fox jumps over the lazy dog.";

export default function Playground() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [size, setSize] = useState(32);
  const [weight, setWeight] = useState(400);
  const [filterCat, setFilterCat] = useState("all");

  const displayed = filterCat === "all"
    ? FONTS
    : FONTS.filter((f) => f.category === filterCat);

  return (
    <section
      id="playground"
      className="relative"
      style={{ background: "#F4EFE6" }}
    >
      {/* Header */}
      <div
        className="px-8 md:px-16 pt-16 pb-10 border-b"
        style={{ borderColor: "rgba(12,12,12,0.08)" }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest uppercase block mb-3"
          style={{ color: "#C9A355", letterSpacing: "0.25em" }}
        >
          ✦ Live Playground
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#0C0C0C", lineHeight: 1 }}
        >
          Type anything.<br />
          <em style={{ color: "#C9A355" }}>See everything.</em>
        </motion.h2>
      </div>

      {/* Controls */}
      <div
        className="sticky top-0 z-20 flex flex-col md:flex-row gap-6 items-start md:items-center px-8 md:px-16 py-5"
        style={{
          background: "rgba(244,239,230,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(12,12,12,0.08)",
        }}
      >
        {/* Text Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
          className="flex-1 outline-none font-sans text-sm"
          style={{
            background: "transparent",
            border: "none",
            borderBottom: "1px solid rgba(12,12,12,0.2)",
            paddingBottom: "6px",
            color: "#0C0C0C",
            minWidth: "200px",
          }}
        />

        <div className="flex items-center gap-8 flex-wrap">
          {/* Size Slider */}
          <div className="flex items-center gap-3 min-w-[160px]">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B6560", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
              Size: {size}px
            </span>
            <Slider.Root
              value={[size]}
              min={12}
              max={80}
              step={2}
              onValueChange={([v]) => setSize(v)}
              style={{ width: "120px" }}
            >
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb />
            </Slider.Root>
          </div>

          {/* Weight */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B6560", letterSpacing: "0.15em" }}>
              Weight:
            </span>
            <div className="flex gap-1">
              {[300, 400, 600, 700].map((w) => (
                <button
                  key={w}
                  data-cursor=""
                  onClick={() => setWeight(w)}
                  className="px-2 py-1 text-xs font-bold transition-all duration-200"
                  style={{
                    background: weight === w ? "#0C0C0C" : "transparent",
                    color: weight === w ? "#F4EFE6" : "#6B6560",
                    border: "1px solid",
                    borderColor: weight === w ? "#0C0C0C" : "rgba(12,12,12,0.15)",
                    fontWeight: w,
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Category Quick Filter */}
          <div className="flex gap-1">
            {["all", "serif", "sans", "display", "script"].map((cat) => (
              <button
                key={cat}
                data-cursor=""
                onClick={() => setFilterCat(cat)}
                className="px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                style={{
                  letterSpacing: "0.12em",
                  background: filterCat === cat ? "#C9A355" : "transparent",
                  color: filterCat === cat ? "#0C0C0C" : "#6B6560",
                  border: "1px solid",
                  borderColor: filterCat === cat ? "#C9A355" : "rgba(12,12,12,0.15)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Font Grid */}
      <div className="p-8 md:p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(12,12,12,0.08)" }}>
          {displayed.map((font, i) => (
            <PlaygroundCard
              key={font.id}
              font={font}
              text={text || "Type something above…"}
              size={size}
              weight={weight}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlaygroundCard({ font, text, size, weight, index }) {
  const [hovered, setHovered] = useState(false);
  const isLast = index === 17;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
      style={{
        background: hovered ? "#0C0C0C" : "#F4EFE6",
        padding: "32px",
        transition: "background 0.4s ease",
        minHeight: "140px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor={font.name}
    >
      {/* Font label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: hovered ? "#C9A355" : "#6B6560", letterSpacing: "0.15em", transition: "color 0.3s" }}
          >
            {font.name}
          </span>
          <span
            className="text-xs px-2 py-0.5 border"
            style={{
              borderColor: hovered ? "rgba(201,163,85,0.3)" : "rgba(12,12,12,0.15)",
              color: hovered ? "#C9A355" : "#8A857E",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              transition: "all 0.3s",
            }}
          >
            {font.category}
          </span>
        </div>
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
          transition={{ duration: 0.2 }}
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#C9A355", letterSpacing: "0.15em" }}
        >
          {font.weights.includes(weight)
            ? `${weight}`
            : `${font.weights[Math.floor(font.weights.length / 2)]}`
          }
        </motion.div>
      </div>

      {/* Preview text */}
      <div
        style={{
          fontFamily: `'${font.family}', serif`,
          fontSize: `${size}px`,
          fontWeight: font.weights.includes(weight) ? weight : font.weights[Math.floor(font.weights.length/2)],
          color: hovered ? "#F4EFE6" : "#0C0C0C",
          lineHeight: 1.2,
          transition: "color 0.4s ease",
          wordBreak: "break-word",
          overflow: "hidden",
          maxHeight: "150px",
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}
