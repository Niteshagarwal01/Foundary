import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Animated SVG checkmark ── */
function AnimatedCheck() {
  return (
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      {/* Circle */}
      <motion.circle
        cx="32"
        cy="32"
        r="28"
        stroke="#C9A355"
        strokeWidth="1.5"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
      />
      {/* Checkmark */}
      <motion.path
        d="M18 33l10 10 18-20"
        stroke="#C9A355"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut", delay: 0.4 },
          },
        }}
      />
    </motion.svg>
  );
}

/* ── Decorative double-rule border ── */
function DoubleBorder() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 12,
        border: "1px solid rgba(201,163,85,0.25)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 4,
          border: "1px solid rgba(201,163,85,0.10)",
        }}
      />
    </div>
  );
}

/* ── Corner ornaments ── */
function CornerOrnaments() {
  const corners = [
    { top: 8, left: 8 },
    { top: 8, right: 8 },
    { bottom: 8, left: 8 },
    { bottom: 8, right: 8 },
  ];
  return (
    <>
      {corners.map((style, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 16,
            height: 16,
            ...style,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <path
              d={
                style.right !== undefined && style.bottom !== undefined
                  ? "M16 0 L16 16 L0 16"
                  : style.right !== undefined
                  ? "M0 0 L16 0 L16 16"
                  : style.bottom !== undefined
                  ? "M0 0 L0 16 L16 16"
                  : "M16 16 L0 16 L0 0"
              }
              stroke="#C9A355"
              strokeWidth="1"
              strokeOpacity="0.55"
            />
          </svg>
        </div>
      ))}
    </>
  );
}

export default function Newsletter() {
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef                = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      inputRef.current?.focus();
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    // Simulate async subscription
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  };

  return (
    <section
      id="newsletter"
      style={{
        background: "#111111",
        position: "relative",
        overflow: "hidden",
        padding: "40px 24px",
      }}
    >
      {/* Ambient top rule */}
      <div className="rule-gold" style={{ marginBottom: 48, opacity: 0.6 }} />

      {/* Ambient glow */}
      <div
        className="ambient-glow"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(201,163,85,0.05) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: 640,
          margin: "0 auto",
          background: "#0E0E0E",
          position: "relative",
          padding: "64px 48px",
          zIndex: 1,
        }}
      >
        <DoubleBorder />
        <CornerOrnaments />

        {/* Inner content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                {/* Dateline pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 1,
                      background:
                        "linear-gradient(90deg, transparent, #C9A355)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "#C9A355",
                    }}
                  >
                    Vol. XII · Est. MMXXIV
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 1,
                      background:
                        "linear-gradient(90deg, #C9A355, transparent)",
                    }}
                  />
                </div>

                {/* Headline — blended Anton + Kaushan Script */}
                <div style={{ marginBottom: 16 }}>
                  <h2
                    style={{
                      margin: 0,
                      lineHeight: 1,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      gap: "0 10px",
                    }}
                  >
                    <span
                      className="gold-shimmer"
                      style={{
                        fontFamily: "'Anton', Impact, sans-serif",
                        fontSize: "clamp(2.2rem, 7vw, 3.8rem)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                      }}
                    >
                      THE WEEKLY
                    </span>
                    <span
                      style={{
                        fontFamily: "'Kaushan Script', cursive",
                        fontSize: "clamp(2rem, 6vw, 3.4rem)",
                        color: "#F4EFE6",
                        letterSpacing: "0.01em",
                        lineHeight: 1,
                        fontStyle: "normal",
                      }}
                    >
                      Specimen
                    </span>
                  </h2>
                </div>

                {/* Thin rule */}
                <div className="rule-thin" style={{ marginBottom: 20 }} />

                {/* Subtext */}
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "1.05rem",
                    color: "#A09890",
                    marginBottom: 32,
                    lineHeight: 1.65,
                  }}
                >
                  One typeface story. Every Monday morning.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                  <div
                    className="flex flex-col sm:flex-row w-full"
                    style={{
                      border: "1px solid rgba(201,163,85,0.28)",
                      background: "rgba(255,255,255,0.02)",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={() =>
                      (document.querySelector(
                        "[data-form-wrapper]"
                      ).style.borderColor = "rgba(201,163,85,0.65)")
                    }
                    onBlur={() =>
                      (document.querySelector(
                        "[data-form-wrapper]"
                      ).style.borderColor = "rgba(201,163,85,0.28)")
                    }
                    data-form-wrapper
                  >
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="your@email.com"
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        padding: "14px 18px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem",
                        color: "#F4EFE6",
                        letterSpacing: "0.02em",
                      }}
                    />
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      style={{
                        background:
                          status === "loading"
                            ? "rgba(201,163,85,0.5)"
                            : "#C9A355",
                        border: "none",
                        padding: "14px 24px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#0C0C0C",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        minWidth: 110,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                      whileHover={
                        status !== "loading"
                          ? {
                              background: "#F0D48A",
                              boxShadow: "0 0 18px rgba(201,163,85,0.45)",
                            }
                          : {}
                      }
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      {status === "loading" ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            style={{
                              display: "inline-block",
                              width: 12,
                              height: 12,
                              border: "2px solid #0C0C0C",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                            }}
                          />
                          Sending…
                        </>
                      ) : (
                        "Subscribe"
                      )}
                    </motion.button>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {status === "error" && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          color: "#e11d48",
                          marginTop: 8,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {errorMsg}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>

                {/* Small print */}
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.68rem",
                    color: "#4A4540",
                    marginTop: 20,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontVariantCaps: "all-small-caps",
                    lineHeight: 1.5,
                  }}
                >
                  Join 12,847 designers&ensp;·&ensp;No spam&ensp;·&ensp;Unsubscribe anytime
                </p>
              </motion.div>
            ) : (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "16px 0",
                  gap: 20,
                }}
              >
                <AnimatedCheck />

                <div>
                  <h3
                    style={{
                      fontFamily: "'Anton', Impact, sans-serif",
                      fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#C9A355",
                      margin: 0,
                      marginBottom: 8,
                    }}
                  >
                    Welcome to the Gazette
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "1rem",
                      color: "#8A8078",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    Your first issue arrives Monday morning.
                    <br />
                    Keep an eye on your inbox.
                  </p>
                </div>

                {/* Ornamental rule */}
                <div
                  style={{
                    width: 80,
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, #C9A355, transparent)",
                    marginTop: 4,
                  }}
                />

                <motion.button
                  onClick={() => {
                    setStatus("idle");
                    setEmail("");
                  }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#4A4540",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                  whileHover={{ color: "#C9A355" }}
                  transition={{ duration: 0.2 }}
                >
                  Subscribe another address
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Ambient bottom rule */}
      <div className="rule-gold" style={{ marginTop: 48, opacity: 0.6 }} />
    </section>
  );
}
