import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const POSTERS = [
  {
    id: 1,
    title: "Anton Specimen",
    font: "'Anton', sans-serif",
    text: "HEAVY",
    color: "#C9A355",
    bg: "#111",
    aspect: "4/5",
  },
  {
    id: 2,
    title: "Playfair Display",
    font: "'Playfair Display', serif",
    text: "Elegance",
    color: "#F4EFE6",
    bg: "#1A1812",
    aspect: "3/4",
  },
  {
    id: 3,
    title: "Space Grotesk",
    font: "'Space Grotesk', sans-serif",
    text: "1998",
    color: "#0C0C0C",
    bg: "#C9A355",
    aspect: "1/1",
  },
  {
    id: 4,
    title: "Dancing Script",
    font: "'Dancing Script', cursive",
    text: "Flow",
    color: "#F4EFE6",
    bg: "#2A1F1D",
    aspect: "4/5",
  },
  {
    id: 5,
    title: "Bodoni Moda",
    font: "'Bodoni Moda', serif",
    text: "VOGUE",
    color: "#111",
    bg: "#F4EFE6",
    aspect: "3/4",
  },
];

export default function Lookbook() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={containerRef} id="lookbook" className="py-16 px-8 md:px-16" style={{ background: "#080808" }}>
      <div className="mb-20 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-widest block mb-4"
          style={{ color: "#C9A355", letterSpacing: "0.3em", fontFamily: "'Inter', sans-serif" }}
        >
          Gallery
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 6vw, 5rem)", color: "#F4EFE6", lineHeight: 1 }}
        >
          Foundry Lookbook
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto">
        <div className="flex flex-col gap-8 md:gap-16">
          {POSTERS.filter((_, i) => i % 2 === 0).map((p) => (
            <motion.div
              key={p.id}
              style={{ y: y1 }}
              className="relative w-full overflow-hidden group rounded-sm flex items-center justify-center"
            >
              <div
                className="w-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105"
                style={{ aspectRatio: p.aspect, background: p.bg }}
              >
                <div style={{ fontFamily: p.font, fontSize: "clamp(4rem, 10vw, 8rem)", color: p.color, lineHeight: p.font.includes("cursive") ? 1.4 : 1, padding: p.font.includes("cursive") ? "0.2em" : "0" }}>
                  {p.text}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-xs uppercase tracking-widest px-3 py-1" style={{ background: p.color, color: p.bg }}>{p.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col gap-8 md:gap-16 mt-0 md:mt-32">
          {POSTERS.filter((_, i) => i % 2 !== 0).map((p) => (
            <motion.div
              key={p.id}
              style={{ y: y2 }}
              className="relative w-full overflow-hidden group rounded-sm flex items-center justify-center"
            >
              <div
                className="w-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105"
                style={{ aspectRatio: p.aspect, background: p.bg }}
              >
                <div style={{ fontFamily: p.font, fontSize: "clamp(4rem, 10vw, 8rem)", color: p.color, lineHeight: p.font.includes("cursive") ? 1.4 : 1, padding: p.font.includes("cursive") ? "0.2em" : "0" }}>
                  {p.text}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-xs uppercase tracking-widest px-3 py-1" style={{ background: p.color, color: p.bg }}>{p.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
