import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Slider from "@radix-ui/react-slider";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import { X, Copy, Check, ChevronDown } from "lucide-react";

const COLORS = [
  { label: "Ivory", value: "#F4EFE6" },
  { label: "Gold", value: "#C9A355" },
  { label: "Black", value: "#0C0C0C" },
  { label: "Slate", value: "#64748b" },
  { label: "Rose", value: "#e11d48" },
  { label: "Teal", value: "#0d9488" },
];

const ANIMATIONS = [
  { id: "none", label: "None" },
  { id: "pulse", label: "Pulse" },
  { id: "float", label: "Float" },
  { id: "glitch", label: "Glitch" },
];

export default function FontModal({ font, open, onClose }) {
  const [text, setText] = useState("Typography is the art of arranging type.");
  const [size, setSize] = useState(42);
  const [weight, setWeight] = useState(null);
  const [spacing, setSpacing] = useState(0);
  const [color, setColor] = useState("#F4EFE6");
  const [anim, setAnim] = useState("none");
  const [copied, setCopied] = useState(false);

  // Reset when font changes
  useEffect(() => {
    if (font) {
      setWeight(font.weights.includes(700) ? 700 : font.weights[Math.floor(font.weights.length / 2)]);
      setAnim("none");
      setSize(42);
      setSpacing(0);
      setColor("#F4EFE6");
    }
  }, [font]);

  if (!font) return null;

  const activeWeight = weight ?? font.weights[0];

  const animClass = {
    none: "",
    pulse: "anim-pulse",
    float: "anim-float",
    glitch: "anim-glitch",
  }[anim];

  const cssCode = `/* ${font.name} */
@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family).replace(/%20/g, "+")}:wght@${activeWeight}&display=swap');

.your-text {
  font-family: '${font.family}', sans-serif;
  font-size: ${size}px;
  font-weight: ${activeWeight};
  letter-spacing: ${spacing}px;
  color: ${color};
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = cssCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-radix-dialog-overlay
          asChild
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(12,12,12,0.92)",
              backdropFilter: "blur(16px)",
              zIndex: 100,
            }}
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, x: "-50%", y: "calc(-50% + 40px)", scale: 0.97 }}
            animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: "-50%", y: "calc(-50% + 20px)", scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 101,
              width: "min(92vw, 820px)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#141414",
              border: "1px solid rgba(201,163,85,0.2)",
              outline: "none",
            }}
          >
            {/* Gold top accent */}
            <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C9A355, transparent)" }} />

            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: "#C9A355", letterSpacing: "0.2em" }}
                    >
                      {font.label}
                    </span>
                    <span style={{ color: "rgba(201,163,85,0.3)" }}>·</span>
                    <span className="text-xs" style={{ color: "#6B6560" }}>
                      {font.designer}, {font.year}
                    </span>
                  </div>
                  <Dialog.Title asChild>
                    <h2
                      className="font-display font-bold"
                      style={{ fontSize: "2.2rem", color: "#F4EFE6", lineHeight: 1, fontFamily: `'${font.family}', serif` }}
                    >
                      {font.name}
                    </h2>
                  </Dialog.Title>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    data-cursor="copy"
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300"
                    style={{
                      border: "1px solid rgba(201,163,85,0.4)",
                      color: copied ? "#0C0C0C" : "#C9A355",
                      background: copied ? "#C9A355" : "transparent",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied!" : "Copy CSS"}
                  </button>
                  <Dialog.Close asChild>
                    <button
                      data-cursor="close"
                      className="w-8 h-8 flex items-center justify-center transition-colors duration-200"
                      style={{ border: "1px solid rgba(244,239,230,0.1)", color: "#6B6560" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#F4EFE6"; e.currentTarget.style.borderColor = "rgba(244,239,230,0.3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#6B6560"; e.currentTarget.style.borderColor = "rgba(244,239,230,0.1)"; }}
                    >
                      <X size={14} />
                    </button>
                  </Dialog.Close>
                </div>
              </div>

              <Tabs.Root defaultValue="preview">
                <Tabs.List className="tabs-list">
                  {["preview", "glyphs", "css", "pairings", "stress", "license"].map((tab) => (
                    <Tabs.Trigger key={tab} value={tab} className="tabs-trigger">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>

                {/* Preview Tab */}
                <Tabs.Content value="preview">
                  {/* Preview area */}
                  <div
                    className="relative mb-6 overflow-hidden"
                    style={{
                      background: "#0C0C0C",
                      border: "1px solid rgba(244,239,230,0.06)",
                      minHeight: "160px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "40px 32px",
                    }}
                  >
                    {/* Big bg letter */}
                    <span
                      className="absolute select-none pointer-events-none"
                      style={{
                        fontFamily: `'${font.family}', serif`,
                        fontSize: "20rem",
                        color: "#fff",
                        opacity: 0.02,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        lineHeight: 1,
                        fontWeight: 700,
                      }}
                    >
                      {font.bigLetter}
                    </span>

                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => setText(e.currentTarget.textContent)}
                      className={`relative z-10 text-center outline-none ${animClass}`}
                      style={{
                        fontFamily: `'${font.family}', serif`,
                        fontSize: `${size}px`,
                        fontWeight: activeWeight,
                        letterSpacing: `${spacing}px`,
                        color,
                        lineHeight: 1.25,
                        maxWidth: "100%",
                        wordBreak: "break-word",
                        cursor: "text",
                        minWidth: "60px",
                      }}
                    >
                      {text}
                    </div>
                  </div>

                  {/* Controls grid */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
                    {/* Size */}
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#6B6560", letterSpacing: "0.15em" }}>
                        Size — {size}px
                      </label>
                      <Slider.Root value={[size]} min={12} max={100} step={2} onValueChange={([v]) => setSize(v)}>
                        <Slider.Track><Slider.Range /></Slider.Track>
                        <Slider.Thumb />
                      </Slider.Root>
                    </div>

                    {/* Spacing */}
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#6B6560", letterSpacing: "0.15em" }}>
                        Spacing — {spacing}px
                      </label>
                      <Slider.Root value={[spacing]} min={-3} max={20} step={0.5} onValueChange={([v]) => setSpacing(v)}>
                        <Slider.Track><Slider.Range /></Slider.Track>
                        <Slider.Thumb />
                      </Slider.Root>
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#6B6560", letterSpacing: "0.15em" }}>
                        Weight
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {font.weights.map((w) => (
                          <button
                            key={w}
                            data-cursor=""
                            onClick={() => setWeight(w)}
                            className="px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                            style={{
                              border: "1px solid",
                              borderColor: activeWeight === w ? "#C9A355" : "rgba(244,239,230,0.1)",
                              color: activeWeight === w ? "#C9A355" : "#6B6560",
                              background: activeWeight === w ? "rgba(201,163,85,0.08)" : "transparent",
                              fontWeight: w,
                            }}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#6B6560", letterSpacing: "0.15em" }}>
                        Color
                      </label>
                      <div className="flex gap-2 flex-wrap items-center">
                        {COLORS.map((c) => (
                          <button
                            key={c.value}
                            data-cursor=""
                            onClick={() => setColor(c.value)}
                            title={c.label}
                            className="w-7 h-7 transition-all duration-200"
                            style={{
                              background: c.value,
                              border: color === c.value ? "2px solid #C9A355" : "2px solid transparent",
                              outline: color === c.value ? "1px solid #C9A355" : "none",
                              outlineOffset: "2px",
                            }}
                          />
                        ))}
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          style={{ width: "28px", height: "28px", borderRadius: "0", border: "none", background: "none", cursor: "none" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Animations */}
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#6B6560", letterSpacing: "0.15em" }}>
                      Animation
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {ANIMATIONS.map((a) => (
                        <button
                          key={a.id}
                          data-cursor=""
                          onClick={() => setAnim(a.id)}
                          className="px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200"
                          style={{
                            letterSpacing: "0.15em",
                            border: "1px solid",
                            borderColor: anim === a.id ? "#C9A355" : "rgba(244,239,230,0.1)",
                            color: anim === a.id ? "#C9A355" : "#6B6560",
                            background: anim === a.id ? "rgba(201,163,85,0.08)" : "transparent",
                          }}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </Tabs.Content>

                {/* Glyphs Tab */}
                <Tabs.Content value="glyphs">
                  <div className="grid grid-cols-6 md:grid-cols-10 gap-2 mt-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':\",./<>?".split("").map((char, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center p-3 border transition-colors"
                        style={{
                          borderColor: "rgba(244,239,230,0.06)",
                          fontFamily: `'${font.family}', serif`,
                          fontSize: "28px",
                          color: "#F4EFE6",
                          background: "#080808"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9A355"; e.currentTarget.style.color = "#C9A355"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(244,239,230,0.06)"; e.currentTarget.style.color = "#F4EFE6"; }}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </Tabs.Content>

                {/* License Tab */}
                <Tabs.Content value="license">
                  <div className="mt-4 p-6 border custom-scrollbar max-h-[400px] overflow-y-auto" style={{ borderColor: "rgba(244,239,230,0.1)", background: "#080808" }}>
                    {font.foundry ? (
                      <div>
                        <h4 className="text-xl font-bold mb-4 text-[#C9A355]" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}>Foundry Premium License</h4>
                        <p className="text-[#D4CFC8] mb-4 text-sm leading-relaxed font-sans">
                          This typeface is an exclusive Foundry property. To use this font in commercial projects, you must purchase a valid license tier from the library grid.
                        </p>
                        <ul className="list-disc pl-5 text-[#8A8078] text-sm mb-6 space-y-2">
                          <li><strong className="text-[#D4CFC8]">Desktop:</strong> For static imagery, logos, and print.</li>
                          <li><strong className="text-[#D4CFC8]">Web:</strong> For website embedding using @font-face.</li>
                          <li><strong className="text-[#D4CFC8]">App:</strong> For software and mobile applications.</li>
                        </ul>
                        <p className="text-xs text-[#8A8078] font-mono italic">
                          Reproduction, redistribution, or modification of the underlying font software without explicit permission is strictly prohibited.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-xl font-bold mb-4 text-[#F4EFE6]" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}>SIL Open Font License (OFL)</h4>
                        <p className="text-[#D4CFC8] mb-4 text-sm leading-relaxed font-sans">
                          This typeface is open-source and free for both personal and commercial use. 
                        </p>
                        <p className="text-[#8A8078] mb-4 text-sm leading-relaxed font-sans">
                          You can freely use it in your products & projects - print or digital, commercial or otherwise. However, you can't sell the fonts on their own. This isn't legal advice, please consider consulting a lawyer and see the full license for all details.
                        </p>
                        <a href={`https://fonts.google.com/specimen/${font.family.replace(/ /g, "+")}`} target="_blank" rel="noreferrer" className="inline-block mt-2 px-4 py-2 border border-white/20 text-[#D4CFC8] text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors rounded-sm">
                          Download Font
                        </a>
                      </div>
                    )}
                  </div>
                </Tabs.Content>


                {/* CSS Tab */}
                <Tabs.Content value="css">
                  <div className="relative">
                    <pre
                      className="p-6 text-sm leading-relaxed overflow-x-auto"
                      style={{
                        background: "#0C0C0C",
                        color: "#a78bfa",
                        border: "1px solid rgba(244,239,230,0.06)",
                        fontFamily: "'Courier New', monospace",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {cssCode}
                    </pre>
                    <button
                      data-cursor="copy"
                      onClick={handleCopy}
                      className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase"
                      style={{
                        border: "1px solid rgba(201,163,85,0.3)",
                        color: copied ? "#0C0C0C" : "#C9A355",
                        background: copied ? "#C9A355" : "rgba(12,12,12,0.8)",
                        backdropFilter: "blur(8px)",
                        letterSpacing: "0.12em",
                        transition: "all 0.2s",
                      }}
                    >
                      {copied ? <Check size={10} /> : <Copy size={10} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </Tabs.Content>

                {/* Pairings Tab */}
                <Tabs.Content value="pairings">
                  <div className="space-y-4">
                    <p className="text-sm" style={{ color: "#6B6560" }}>
                      Recommended pairings for <strong style={{ color: "#F4EFE6" }}>{font.name}</strong>
                    </p>
                    <div className="grid grid-cols-1 gap-px" style={{ background: "rgba(244,239,230,0.05)" }}>
                      {[
                        {
                          role: "Body / UI",
                          name: font.pairsWith,
                          sample: "The best typography works invisibly, guiding the eye without demanding attention.",
                          weight: "400",
                        },
                        {
                          role: "Headline",
                          name: font.name,
                          sample: "Luxury has many faces.",
                          weight: "700",
                          family: font.family,
                        },
                      ].map((pair, i) => (
                        <div key={i} className="p-6" style={{ background: "#0C0C0C" }}>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A355", letterSpacing: "0.15em" }}>
                              {pair.role}
                            </span>
                            <span className="text-xs" style={{ color: "#6B6560" }}>
                              {pair.name}
                            </span>
                          </div>
                          <p
                            style={{
                              fontFamily: pair.family ? `'${pair.family}', serif` : `'${pair.name}', sans-serif`,
                              fontSize: i === 0 ? "1rem" : "1.8rem",
                              fontWeight: pair.weight,
                              color: "#F4EFE6",
                              lineHeight: 1.4,
                            }}
                          >
                            {pair.sample}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tabs.Content>

                {/* Stress Test Tab */}
                <Tabs.Content value="stress">
                  <div className="space-y-6" style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "10px" }}>
                    {[12, 14, 16, 20, 24, 32, 48, 64, 96, 120].map((sz) => (
                      <div key={sz} className="border-b pb-4" style={{ borderColor: "rgba(244,239,230,0.05)" }}>
                        <div className="text-xs mb-2 uppercase tracking-widest" style={{ color: "#6B6560", letterSpacing: "0.1em" }}>{sz}px</div>
                        <div
                          style={{
                            fontFamily: `'${font.family}', serif`,
                            fontSize: `${sz}px`,
                            fontWeight: activeWeight,
                            color: "#F4EFE6",
                            lineHeight: 1.1,
                            wordBreak: "break-word"
                          }}
                        >
                          {sz < 30 ? "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed." : "The quick brown fox jumps over the lazy dog."}
                        </div>
                      </div>
                    ))}
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>

            {/* Bottom gold line */}
            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,163,85,0.3), transparent)" }} />
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
