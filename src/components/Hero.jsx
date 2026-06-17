import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1];

// ── Thin animated rule ────────────────────────────────────────────────────────
function Rule({ delay = 0, gold = false, double = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: double ? "3px" : 0 }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay, ease }}
        style={{
          height: gold ? "2px" : "1px",
          background: gold
            ? "linear-gradient(90deg, transparent, #C9A355 15%, #C9A355 85%, transparent)"
            : "rgba(244,239,230,0.12)",
          transformOrigin: "left center",
        }}
      />
      {double && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: delay + 0.05, ease }}
          style={{ height: "1px", background: "rgba(244,239,230,0.07)", transformOrigin: "left center" }}
        />
      )}
    </div>
  );
}

// ── Glow-on-hover paragraph line ─────────────────────────────────────────────
function GlowLine({ children, delay = 0, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.span
      style={{
        display: "block",
        transition: "text-shadow 0.4s ease, color 0.4s ease",
        textShadow: hov ? "0 0 16px rgba(201,163,85,0.55)" : "none",
        color: hov ? "#F4EFE6" : "#6B6560",
        ...style,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.7, ease }}
    >
      {children}
    </motion.span>
  );
}

// ── Magnetic floating element ─────────────────────────────────────────────────
function Magnetic({ children, style = {}, delay = 0 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });

  const move = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.22);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={move}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease }}
      style={{ display: "inline-block", x: sx, y: sy, ...style }}
    >
      {children}
    </motion.span>
  );
}

// ── Keyframe style tag ───────────────────────────────────────────────────────
const heroStyles = `
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.006); }
  }
  @keyframes floatScript {
    0%, 100% { transform: translateY(-10%) translateY(0px); }
    50%       { transform: translateY(-10%) translateY(-4px); }
  }
  .hero-breathe-1 {
    animation: breathe 4s ease-in-out infinite;
    display: inline-block;
  }
  .hero-breathe-2 {
    animation: breathe 4s ease-in-out infinite;
    animation-delay: 0.5s;
    display: inline-block;
  }
  .hero-float-script {
    animation: floatScript 3s ease-in-out infinite;
    display: inline-block;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
export default function Hero({ onExplore, fontCount = 500 }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="hero"
      className="relative flex flex-col overflow-hidden"
      style={{ background: "#0C0C0C" }}
    >
      {/* Kinetic animation keyframes */}
      <style>{heroStyles}</style>
      {/* ── Ambient glow blobs ── */}
      <div
        className="ambient-glow"
        style={{
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(201,163,85,0.07) 0%, transparent 70%)",
          top: "-100px", left: "-100px",
          animationDelay: "0s",
        }}
      />
      <div
        className="ambient-glow"
        style={{
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(201,163,85,0.05) 0%, transparent 70%)",
          top: "40%", right: "-80px",
          animationDelay: "2.5s",
        }}
      />
      <div
        className="ambient-glow"
        style={{
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(201,163,85,0.04) 0%, transparent 70%)",
          bottom: "10%", left: "30%",
          animationDelay: "1.2s",
        }}
      />

      {/* ── Floating particles ── */}
      <div className="particle" style={{ left: "8%",  bottom: "20%" }} />
      <div className="particle" style={{ left: "22%", bottom: "30%", animationDelay: "1.1s" }} />
      <div className="particle" style={{ left: "55%", bottom: "15%", animationDelay: "2.0s" }} />
      <div className="particle" style={{ left: "78%", bottom: "25%", animationDelay: "0.5s" }} />
      <div className="particle" style={{ left: "92%", bottom: "35%", animationDelay: "3.0s" }} />
      {/* ══════════════════════════════
          MASTHEAD
      ══════════════════════════════ */}
      <div className="relative z-10 pt-20 px-6 md:px-14">
        <Rule delay={0.1} gold />

        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Left meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="hidden sm:flex flex-col gap-0.5"
          >
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#C9A355", fontWeight: 600 }}>
              Issue №&nbsp;001
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A3A3A", fontWeight: 600 }}>
              Premium Type Studio
            </span>
          </motion.div>

          {/* Centre masthead — Anton + script blend */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease }}
            className="text-center flex-1"
          >
            {/* "THE" Anton + "Foundry" script + "GAZETTE" Anton — all one visual unit */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.6rem, 4vw, 3.2rem)", color: "#F4EFE6", letterSpacing: "0.04em", lineHeight: 1 }}>
                THE
              </span>
              <span style={{ fontFamily: "'Kaushan Script', cursive", fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", color: "#C9A355", fontStyle: "italic", lineHeight: 1.2, margin: "0 0.15em", padding: "0.1em 0.2em" }}>
                Foundry
              </span>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.6rem, 4vw, 3.2rem)", color: "#F4EFE6", letterSpacing: "0.04em", lineHeight: 1 }}>
                GAZETTE
              </span>
            </div>

            {/* Thin script subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(0.75rem, 1.5vw, 1rem)", color: "#4A4540", marginTop: "2px" }}
            >
              where every typeface tells a story
            </motion.div>
          </motion.div>

          {/* Right meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="hidden sm:flex flex-col gap-0.5 items-end"
          >
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#C9A355", fontWeight: 600 }}>
              Est.&nbsp;2024
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A3A3A", fontWeight: 600 }}>
              {fontCount}+ Typefaces
            </span>
          </motion.div>
        </div>

        <Rule delay={0.15} double />
      </div>

      {/* ══════════════════════════════
          MAIN HERO CONTENT
      ══════════════════════════════ */}
      <motion.div style={{ y, opacity }} className="relative z-10 flex-1 px-6 md:px-14 flex flex-col justify-center py-12 lg:py-16">

        {/* Newspaper Background Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none"
          style={{
            backgroundImage: "url('/newspaper.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* ── BIG bespoke headline block ── */}
        <div className="mb-8 lg:mb-6 text-center lg:text-left select-none relative z-10">
          
          {/* LINE 1: DESIGN that SELLS. */}
          <h1 className="leading-[1.1] lg:leading-[1.05]" style={{ overflow: "visible" }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease }}
              className="inline-block hover-glow hero-breathe-1"
              style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.4rem, 7vw, 12rem)", color: "#F4EFE6", textTransform: "uppercase", marginRight: "0.25em" }}
            >
              DESIGN
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease }}
              className="inline-block gold-shimmer hero-float-script"
              style={{
                fontFamily: "'Kaushan Script', cursive",
                fontSize: "clamp(2.1rem, 6vw, 6.5rem)",
                fontStyle: "italic",
                marginRight: "0.25em",
                transform: "translateY(-5%)" // optical tweak
              }}
            >
              that
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease }}
              className="inline-block hover-glow hero-breathe-2"
              style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.4rem, 7vw, 12rem)", color: "#F4EFE6", textTransform: "uppercase" }}
            >
              SELLS.
            </motion.span>
          </h1>

          {/* Thin rule between headline lines */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.8, ease }}
            className="mx-auto lg:mx-0"
            style={{ width: "100%", maxWidth: "800px", height: "1px", background: "rgba(244,239,230,0.07)", margin: "1.5rem 0 lg:1rem 0", transformOrigin: "left" }}
          />

          {/* LINE 2: THE ART of perfect TYPE */}
          <h2 className="leading-[1.1] lg:leading-[1.05]" style={{ overflow: "visible" }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease }}
              className="inline-block hover-glow"
              style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.1rem, 6vw, 7rem)", color: "#F4EFE6", textTransform: "uppercase", marginRight: "0.25em" }}
            >
              THE ART
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease }}
              className="inline-block gold-shimmer"
              style={{
                fontFamily: "'Kaushan Script', cursive",
                fontSize: "clamp(1.9rem, 5vw, 4.5rem)",
                fontStyle: "italic",
                marginRight: "0.25em",
                transform: "translateY(-5%)" // optical tweak
              }}
            >
              of perfect
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease }}
              className="inline-block hover-glow"
              style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.1rem, 6vw, 7rem)", color: "#F4EFE6", textTransform: "uppercase" }}
            >
              TYPE
            </motion.span>
          </h2>
        </div>

        <Rule delay={0.95} gold />

        {/* ── Sub-content row ── */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10 lg:gap-6 mt-8 lg:mt-6">

          {/* Left: body copy with glow hover */}
          <div className="space-y-2 lg:space-y-1 max-w-sm lg:max-w-xs text-center lg:text-left text-[1.15rem] lg:text-[clamp(0.85rem,1.3vw,0.95rem)] leading-[1.7] lg:leading-[1.5]">
            <GlowLine delay={1.0} style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>
              Discover typefaces that don't just look good —
            </GlowLine>
            <GlowLine delay={1.1} style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>
              they communicate, convert, and captivate.
            </GlowLine>
            <GlowLine delay={1.2} style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>
              {fontCount}+ fonts. 50 Foundry exclusives. 1-click CSS.
            </GlowLine>
          </div>

          {/* Centre: stat trio */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex gap-10 lg:gap-8 justify-center lg:justify-start pt-6 lg:pt-2"
          >
            {[
              { n: `${fontCount}+`, l: "Fonts" },
              { n: "50", l: "Foundry" },
              { n: "∞", l: "Pairings" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-[2.5rem] lg:text-[clamp(1.8rem,3.5vw,2.8rem)]" style={{ fontFamily: "'Anton', sans-serif", color: "#C9A355", lineHeight: 1 }}>
                  {s.n}
                </div>
                <div className="text-[11px] lg:text-[9px]" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.25em", textTransform: "uppercase", color: "#4A4540", fontWeight: 600, marginTop: "6px" }}>
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right: CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7, ease }}
            className="flex flex-col sm:w-auto gap-5 lg:gap-3 items-center"
          >
            <Link
              to="/sign-up"
              className="w-[280px] lg:w-[260px] flex items-center justify-center gap-3 px-7 py-4 lg:py-3.5 text-[13px] lg:text-xs font-bold uppercase transition-all duration-300 group"
              style={{ background: "#C9A355", color: "#0C0C0C", letterSpacing: "0.2em", fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = "#E2C07A"; 
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 20px -10px rgba(201,163,85,0.4)";
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = "#C9A355"; 
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Sign Up Now
              <motion.svg 
                className="transition-transform duration-300 group-hover:translate-x-1"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
              >
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </Link>
            <button
              onClick={() => document.getElementById("library")?.scrollIntoView({ behavior: "smooth" })}
              className="w-[280px] lg:w-[260px] flex items-center justify-center gap-2 px-7 py-4 lg:py-3.5 text-[13px] lg:text-xs font-bold uppercase transition-all duration-300"
              style={{ border: "1px solid rgba(244,239,230,0.12)", color: "#6B6560", letterSpacing: "0.2em", fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.borderColor = "rgba(201,163,85,0.4)"; 
                e.currentTarget.style.color = "#C9A355"; 
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.borderColor = "rgba(244,239,230,0.12)"; 
                e.currentTarget.style.color = "#6B6560"; 
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              Browse Library
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════════════════════
          BOTTOM STATS BAR
      ══════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="relative z-10"
      >
        <Rule delay={0} />
        <div className="grid grid-cols-2 md:grid-cols-4 w-full border-t border-[rgba(201,163,85,0.1)]">
          {[
            { n: `${fontCount}+`, l: "Typefaces", dark: true },
            { n: "50", l: "Foundry Exclusives", dark: false },
            { n: "∞", l: "Combinations", dark: true },
            { n: "1-Click", l: "CSS Export", dark: false },
          ].map((s, i) => (
            <motion.div
              key={i}
              className={`flex flex-col items-center justify-center py-6 md:py-8 gap-1 cursor-default group border-b md:border-b-0 ${i % 2 === 0 ? "border-r border-[rgba(201,163,85,0.1)]" : ""} md:border-r md:border-[rgba(201,163,85,0.1)]`}
              style={{
                background: s.dark ? "rgba(12, 12, 12, 0.8)" : "rgba(17, 17, 17, 0.8)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
              whileHover={{
                y: -6,
                background: "rgba(201,163,85,0.06)",
                boxShadow: "inset 0 0 30px rgba(201,163,85,0.08)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                  color: "#C9A355",
                  lineHeight: 1,
                  transition: "text-shadow 0.3s ease",
                }}
                className="group-hover:[text-shadow:0_0_20px_rgba(201,163,85,0.8)]"
              >
                {s.n}
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B6560", fontWeight: 600, textAlign: "center", padding: "0 8px" }}>
                {s.l}
              </span>
            </motion.div>
          ))}
        </div>
        {/* Bottom marquee ticker */}
        <div className="overflow-hidden py-2.5" style={{ borderTop: "1px solid rgba(201,163,85,0.15)", background: "#0C0C0C" }}>
          <div className="marquee-track flex items-center">
            {Array(6).fill(["Cormorant Garamond", "Anton", "Dancing Script", "Playfair Display", "Space Grotesk", "Kaushan Script", "Syne", "Lora", "Great Vibes", "JetBrains Mono"]).flat().map((name, i) => (
              <span
                key={i}
                className="flex-shrink-0 flex items-center"
                style={{
                  marginRight: "32px",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: i % 4 === 0 ? "#C9A355" : "#2A2A2A",
                  fontFamily: i % 3 === 0 ? `'${name}', serif` : "'Inter', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
                <span style={{ color: "#C9A355", fontSize: "4px", marginLeft: "32px" }}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
