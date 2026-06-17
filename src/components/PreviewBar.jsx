import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreview } from "../context/AppContext";

const ease = [0.16, 1, 0.3, 1];

export default function PreviewBar() {
  const { previewText, setPreviewText, previewSize, setPreviewSize, previewWeight: weight, setPreviewWeight: setWeight, previewOpen: open, setPreviewOpen: setOpen } = usePreview();
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      <motion.button
        key="toggle"
        onClick={() => setOpen(o => !o)}
        className="fixed z-40 flex items-center justify-center rounded-full"
        style={{
          bottom: open ? "84px" : "24px",
          right: "24px",
          width: "48px",
          height: "48px",
          background: open ? "rgba(12,12,12,0.95)" : "#C9A355",
          color: open ? "#C9A355" : "#0C0C0C",
          border: "1px solid #C9A355",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 20px rgba(201,163,85,0.3)",
          transition: "bottom 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        title={open ? "Close Preview" : "Live Preview"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </>
          ) : (
            <>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </>
          )}
        </svg>
      </motion.button>

      {open && (
        <motion.div
          key="bar"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{
            background: "rgba(8,8,8,0.97)",
            borderTop: "1px solid rgba(201,163,85,0.3)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center gap-4 px-6 py-3 flex-wrap">
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.2rem", color: "#C9A355", flexShrink: 0 }}>Aa</span>
            <input
              ref={inputRef}
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Preview all fonts in Library & Playground..."
              className="flex-1 bg-transparent outline-none min-w-0"
              style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "1rem", color: "#F4EFE6", caretColor: "#C9A355" }}
            />
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A3A3A" }}>Size</span>
              <input type="range" min="12" max="120" value={previewSize} onChange={(e) => setPreviewSize(Number(e.target.value))} style={{ accentColor: "#C9A355", width: "80px" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#C9A355", minWidth: "30px" }}>{previewSize}px</span>
            </div>
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
              {["300","400","700"].map((w) => (
                <button key={w} onClick={() => setWeight(w)} style={{ padding: "2px 8px", fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: w, color: weight === w ? "#C9A355" : "#3A3A3A", border: `1px solid ${weight === w ? "rgba(201,163,85,0.4)" : "rgba(244,239,230,0.06)"}`, background: weight === w ? "rgba(201,163,85,0.1)" : "transparent", transition: "all 0.2s" }}>
                  {w === "300" ? "Thin" : w === "400" ? "Regular" : "Bold"}
                </button>
              ))}
            </div>
            {previewText && (
              <motion.button onClick={() => setPreviewText("")} style={{ color: "#3A3A3A", flexShrink: 0 }} whileHover={{ color: "#C9A355", scale: 1.2 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </motion.button>
            )}
            <div className="flex flex-col items-end gap-1">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#6B6560", letterSpacing: "0.05em", flexShrink: 0 }}>* Updates Font Library & Variable Playground</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#2A2A2A", letterSpacing: "0.1em", flexShrink: 0, alignSelf: "flex-end" }}>ESC to close</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
