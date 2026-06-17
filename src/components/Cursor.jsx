import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreview } from "../context/AppContext";

const ease = [0.16, 1, 0.3, 1];

const TRAIL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789αβγδεΩ∞◆●".split("");
const TRAIL_FONTS = [
  "'Anton', sans-serif",
  "'Kaushan Script', cursive",
  "'Playfair Display', serif",
  "'Dancing Script', cursive",
  "'Cormorant Garamond', serif",
  "'Space Grotesk', sans-serif",
  "'Lora', serif",
];

export default function Cursor() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const canvasRef = useRef(null);
  const posRef   = useRef({ x: -100, y: -100 });
  const particlesRef = useRef([]);
  const rafRef   = useRef(null);
  const lastSpawnRef = useRef(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Size canvas to window
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Animation loop
  useEffect(() => {
    let wasEmpty = false;
    function drawLoop(ts) {
      rafRef.current = requestAnimationFrame(drawLoop);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const isEmpty = particlesRef.current.length === 0;
      if (isEmpty && wasEmpty) return;
      wasEmpty = isEmpty;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw particles
      particlesRef.current = particlesRef.current.filter(p => p.opacity > 0.01);
      for (const p of particlesRef.current) {
        p.y  += p.vy;
        p.x  += p.vx;
        p.opacity -= 0.016;
        p.rotation += p.dr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.weight} ${p.size}px ${p.font}`;
        ctx.fillStyle = p.color;
        ctx.fillText(p.letter, 0, 0);
        ctx.restore();
      }
    }
    rafRef.current = requestAnimationFrame(drawLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    let raf;
    let ring = { x: -100, y: -100 };

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      posRef.current = { x, y };

      // Move dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }

      // Spawn trail particle (throttle to every ~40ms)
      const now = performance.now();
      if (now - lastSpawnRef.current > 40) {
        lastSpawnRef.current = now;
        const isGold = Math.random() < 0.3;
        particlesRef.current.push({
          x, y,
          letter: TRAIL_LETTERS[Math.floor(Math.random() * TRAIL_LETTERS.length)],
          font:   TRAIL_FONTS[Math.floor(Math.random() * TRAIL_FONTS.length)],
          size:   Math.random() * 18 + 10,
          weight: Math.random() < 0.5 ? "400" : "700",
          opacity: 0.7,
          vy: -(Math.random() * 0.6 + 0.2),
          vx: (Math.random() - 0.5) * 0.4,
          rotation: (Math.random() - 0.5) * 0.4,
          dr: (Math.random() - 0.5) * 0.02,
          color: isGold ? "#C9A355" : "#F4EFE6",
        });
      }
    };

    // Smooth ring follow
    const followRing = () => {
      raf = requestAnimationFrame(followRing);
      ring.x += (posRef.current.x - ring.x) * 0.12;
      ring.y += (posRef.current.y - ring.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x - 18}px, ${ring.y - 18}px)`;
      }
    };
    raf = requestAnimationFrame(followRing);

    const onEnter = (e) => {
      const t = e.target;
      const isInteractive = t.tagName === "BUTTON" || t.tagName === "A" || t.tagName === "INPUT" || t.closest("button") || t.closest("a");
      if (isInteractive && ringRef.current) {
        ringRef.current.style.width  = "44px";
        ringRef.current.style.height = "44px";
        ringRef.current.style.borderColor = "#F4EFE6";
        ringRef.current.style.boxShadow = "0 0 20px rgba(201,163,85,0.5)";
      }
    };
    const onLeave = (e) => {
      const t = e.target;
      const isInteractive = t.tagName === "BUTTON" || t.tagName === "A" || t.tagName === "INPUT" || t.closest("button") || t.closest("a");
      if (isInteractive && ringRef.current) {
        ringRef.current.style.width  = "36px";
        ringRef.current.style.height = "36px";
        ringRef.current.style.borderColor = "rgba(201,163,85,0.5)";
        ringRef.current.style.boxShadow = "0 0 10px rgba(201,163,85,0.25)";
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: "8px", height: "8px",
          background: "#C9A355",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-100px,-100px)",
          boxShadow: "0 0 8px rgba(201,163,85,0.9), 0 0 20px rgba(201,163,85,0.4)",
          willChange: "transform",
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: "36px", height: "36px",
          border: "1px solid rgba(201,163,85,0.5)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-100px,-100px)",
          boxShadow: "0 0 10px rgba(201,163,85,0.25)",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
