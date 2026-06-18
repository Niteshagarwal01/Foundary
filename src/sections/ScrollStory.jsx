import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────
   Story data
   Each "line" is an array of word objects.
   type: "anton" | "kaushan" | "blend"
   The last line gets "blend" which mimics the hero style.
──────────────────────────────────────────────── */
const STORY_LINES = [
  [
    { text: "Every",   type: "kaushan", gold: false },
    { text: "great",   type: "anton",   gold: false },
    { text: "brand",   type: "anton",   gold: true  },
    { text: "begins",  type: "kaushan", gold: false },
    { text: "with",    type: "anton",   gold: false },
    { text: "a",       type: "kaushan", gold: false },
    { text: "letter.", type: "anton",   gold: true  },
  ],
  [
    { text: "Typography", type: "anton",   gold: false },
    { text: "is",         type: "kaushan", gold: false },
    { text: "not",        type: "anton",   gold: false },
    { text: "decoration.", type: "kaushan", gold: false },
    { text: "It",         type: "anton",   gold: false },
    { text: "is",         type: "kaushan", gold: false },
    { text: "voice.",     type: "anton",   gold: true  },
  ],
  [
    { text: "The",        type: "kaushan", gold: false },
    { text: "right",      type: "anton",   gold: false },
    { text: "font",       type: "kaushan", gold: true  },
    { text: "changes",    type: "anton",   gold: false },
    { text: "everything.", type: "kaushan", gold: false },
  ],
  [
    { text: "This",     type: "blend", gold: false },
    { text: "is",       type: "blend", gold: false },
    { text: "The",      type: "blend", gold: true  },
    { text: "Foundry.", type: "blend", gold: true  },
  ],
];

/* Flatten to a single word list with their line index */
const ALL_WORDS = STORY_LINES.flatMap((line, lineIdx) =>
  line.map((word, wordIdx) => ({ ...word, lineIdx, wordIdx }))
);
const TOTAL_WORDS = ALL_WORDS.length;

function getWordStyle(word, isActive, isPast) {
  const opacity = isActive ? 1 : isPast ? 0.22 : 0;
  const blur    = isActive ? 0 : isPast ? 0 : 4;

  let fontFamily, fontWeight, fontSize;

  if (word.type === "anton") {
    fontFamily  = "'Anton', Impact, sans-serif";
    fontWeight  = 400;
    fontSize    = "clamp(2rem, 5vw, 4rem)";
  } else if (word.type === "kaushan") {
    fontFamily  = "'Kaushan Script', cursive";
    fontWeight  = 400;
    fontSize    = "clamp(1.8rem, 4.5vw, 3.6rem)";
  } else {
    // blend — Anton + Kaushan alternating per char visual trick:
    // we actually stack them via two spans, but keep it simple here
    fontFamily  = "'Anton', Impact, sans-serif";
    fontWeight  = 400;
    fontSize    = "clamp(2.4rem, 6.5vw, 5rem)";
  }

  const color = word.gold
    ? "#C9A355"
    : word.type === "kaushan"
    ? "#F4EFE6"
    : "#F4EFE6";

  const textShadow = isActive && word.gold
    ? "0 0 30px rgba(201,163,85,0.8), 0 0 60px rgba(201,163,85,0.4), 0 0 100px rgba(201,163,85,0.2)"
    : isActive
    ? "0 0 20px rgba(244,239,230,0.25)"
    : "none";

  return {
    opacity,
    filter: `blur(${blur}px)`,
    color,
    fontFamily,
    fontWeight,
    fontSize,
    textShadow,
    display: "inline-block",
    margin: "0 6px 0 0",
    transition: "opacity 0.4s ease, filter 0.4s ease, text-shadow 0.4s ease",
    letterSpacing: word.type === "anton" ? "0.03em" : "0.01em",
    lineHeight: 1.15,
  };
}

/* ── Single word that reacts to scroll progress ── */
function Word({ word, index, scrollProgress }) {
  // Fit all word animations between scrollProgress 0.1 and 0.9
  const wordFraction = 0.8 / TOTAL_WORDS;
  const activateAt   = 0.1 + index * wordFraction;
  const deactivateAt = 0.1 + (index + 2.5) * wordFraction;

  const rawOpacity = useTransform(
    scrollProgress,
    [activateAt - 0.01, activateAt, deactivateAt, deactivateAt + wordFraction],
    [0, 1, 1, 0.18]
  );

  const rawBlur = useTransform(
    scrollProgress,
    [activateAt - 0.01, activateAt],
    [6, 0]
  );

  const rawGlow = useTransform(
    scrollProgress,
    [activateAt - 0.01, activateAt, deactivateAt],
    [0, 1, 0]
  );

  let fontFamily, fontSize;
  if (word.type === "anton") {
    fontFamily = "'Anton', Impact, sans-serif";
    fontSize   = "clamp(2rem, 5vw, 4rem)";
  } else if (word.type === "kaushan") {
    fontFamily = "'Kaushan Script', cursive";
    fontSize   = "clamp(1.8rem, 4.5vw, 3.6rem)";
  } else {
    fontFamily = "'Anton', Impact, sans-serif";
    fontSize   = "clamp(2.4rem, 6.5vw, 5rem)";
  }

  const isBlendLine = word.type === "blend";

  return (
    <motion.span
      style={{
        display: "inline-block",
        marginRight: "0.28em",
        marginBottom: "0.1em",
        fontFamily,
        fontSize,
        fontWeight: 400,
        letterSpacing: word.type === "anton" || word.type === "blend" ? "0.03em" : "0.01em",
        lineHeight: 1.15,
        color: word.gold ? "#C9A355" : "#F4EFE6",
        opacity: rawOpacity,
        // For the last line blend style, add a bottom border-like glow
        borderBottom: isBlendLine && word.gold ? "1px solid rgba(201,163,85,0.35)" : "none",
        paddingBottom: isBlendLine ? "2px" : 0,
      }}
    >
      <motion.span
        style={{
          display: "inline-block",
          opacity: rawOpacity,
          filter: useTransform(rawBlur, (v) => `blur(${v}px)`),
          textShadow: useTransform(rawGlow, (g) =>
            word.gold
              ? `0 0 ${30 * g}px rgba(201,163,85,${0.85 * g}), 0 0 ${60 * g}px rgba(201,163,85,${0.4 * g}), 0 0 ${100 * g}px rgba(201,163,85,${0.2 * g})`
              : `0 0 ${20 * g}px rgba(244,239,230,${0.3 * g})`
          ),
        }}
      >
        {word.text}
      </motion.span>
    </motion.span>
  );
}

/* ── Line separator ornament ── */
function LineSeparator({ scrollProgress, triggerAt }) {
  const opacity = useTransform(
    scrollProgress,
    [triggerAt - 0.02, triggerAt + 0.03],
    [0, 1]
  );
  return (
    <motion.div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "8px 0 20px",
        opacity,
      }}
    >
      <div style={{ height: 1, flex: 1, background: "rgba(201,163,85,0.18)" }} />
      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C9A355", opacity: 0.5 }} />
      <div style={{ height: 1, flex: 1, background: "rgba(201,163,85,0.18)" }} />
    </motion.div>
  );
}

export default function ScrollStory() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lineData = STORY_LINES.reduce((acc, line) => {
    const start = acc.length > 0 ? acc[acc.length - 1].end : 0;
    const end = start + line.length;
    acc.push({ start, end, line });
    return acc;
  }, []);

  const lastLineOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="hidden md:block"
      style={{
        height: "300vh",
        position: "relative",
        background: "#000000",
      }}
    >
      {/* ── Sticky viewport ── */}
      <div
        className="sticky top-0 h-[100vh] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background radial pulse */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(201,163,85,0.04) 0%, transparent 65%)",
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.4]),
          }}
        />

        {/* Scan line effect */}
        <motion.div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,163,85,0.12), transparent)",
            top: useTransform(
              scrollYProgress,
              [0, 1],
              ["0vh", "100vh"]
            ),
          }}
        />

        {/* ── Story content ── */}
        <div
          style={{
            maxWidth: 820,
            width: "90%",
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Section eyebrow */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 48,
            }}
          >
            <div
              style={{
                height: 1,
                width: 48,
                background: "linear-gradient(90deg, transparent, #C9A355)",
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C9A355",
                opacity: 0.7,
              }}
            >
              The Foundry Manifesto
            </span>
            <div
              style={{
                height: 1,
                width: 48,
                background: "linear-gradient(90deg, #C9A355, transparent)",
              }}
            />
          </motion.div>

          {/* Words — rendered line by line */}
          {lineData.map(({ start, end, line }, lineIdx) => {
            const isLastLine = lineIdx === STORY_LINES.length - 1;
            const lineStartFraction = (start / TOTAL_WORDS) * 0.95;

            return (
              <div key={lineIdx}>
                {/* Line separator (between lines, not before first) */}
                {lineIdx > 0 && (
                  <LineSeparator
                    scrollProgress={scrollYProgress}
                    triggerAt={lineStartFraction}
                  />
                )}

                {/* Words */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "baseline",
                    justifyContent: isLastLine ? "center" : "flex-start",
                    marginBottom: 4,
                    // Last line gets extra top margin + center align
                    marginTop: isLastLine ? 32 : 0,
                  }}
                >
                  {line.map((word, wordIdx) => {
                    const globalIdx = start + wordIdx;
                    return (
                      <Word
                        key={`${lineIdx}-${wordIdx}`}
                        word={word}
                        index={globalIdx}
                        scrollProgress={scrollYProgress}
                      />
                    );
                  })}
                </div>

                {/* Last line underline ornament */}
                {isLastLine && (
                  <motion.div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 24,
                      opacity: lastLineOpacity,
                    }}
                  >
                    <div
                      style={{
                        width: 160,
                        height: 2,
                        background:
                          "linear-gradient(90deg, transparent, #C9A355, #F0D48A, #C9A355, transparent)",
                        boxShadow: "0 0 12px rgba(201,163,85,0.5)",
                      }}
                    />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Scroll progress bar ── */}
        <div
          style={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            height: 120,
            width: 1,
            background: "rgba(244,239,230,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <motion.div
            style={{
              width: 1,
              background: "#C9A355",
              boxShadow: "0 0 6px rgba(201,163,85,0.6)",
              height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
              transformOrigin: "top",
            }}
          />
        </div>

        {/* ── Scroll cue (fades out quickly) ── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#4A4540",
              fontWeight: 500,
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 1,
              height: 32,
              background:
                "linear-gradient(180deg, #C9A355 0%, transparent 100%)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
