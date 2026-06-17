import { useState, useRef, useEffect, useCallback } from "react";
import { usePreview } from "../context/AppContext";

const TRAIL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789αβγδεΩ∞◆●".split("");
const TRAIL_FONTS = [
  "'Inter', sans-serif",
  "'Playfair Display', serif",
  "'Space Grotesk', sans-serif",
];

export default function Cursor() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const canvasRef = useRef(null);
  const posRef   = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
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

  // Size canvas to window (no devicePixelRatio for performance)
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

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      posRef.current = { x, y };

      // Move dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }

      // Spawn trail particle (throttle to every ~200ms to heavily reduce lag)
      const now = performance.now();
      if (now - lastSpawnRef.current > 200) {
        lastSpawnRef.current = now;
        
        // Strict limit of 10 particles
        if (particlesRef.current.length < 10) {
          const isGold = Math.random() < 0.3;
          particlesRef.current.push({
            x, y,
            letter: TRAIL_LETTERS[Math.floor(Math.random() * TRAIL_LETTERS.length)],
            font:   TRAIL_FONTS[Math.floor(Math.random() * TRAIL_FONTS.length)],
            size:   Math.random() * 12 + 10,
            weight: Math.random() < 0.5 ? "400" : "700",
            opacity: 0.6,
            vy: -(Math.random() * 0.4 + 0.2),
            vx: (Math.random() - 0.5) * 0.3,
            rotation: (Math.random() - 0.5) * 0.3,
            dr: (Math.random() - 0.5) * 0.02,
            color: isGold ? "#C9A355" : "#F4EFE6",
          });
        }
      }
    };

    window.addEventListener("mousemove", onMove);

    // Single unified Animation Loop for both Canvas and Ring
    let wasEmpty = false;
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      
      // 1. Update Ring
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.15;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPosRef.current.x - 16}px, ${ringPosRef.current.y - 16}px)`;
      }

      // 2. Update Canvas Particles
      const canvas = canvasRef.current;
      if (!canvas) return;

      const isEmpty = particlesRef.current.length === 0;
      if (isEmpty && wasEmpty) return; // Skip canvas clear/draw if nothing changed
      wasEmpty = isEmpty;

      const ctx = canvas.getContext("2d", { alpha: true }); // optimize context
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Filter and draw particles
      particlesRef.current = particlesRef.current.filter(p => p.opacity > 0.01);
      
      if (particlesRef.current.length > 0) {
        ctx.save();
        for (const p of particlesRef.current) {
          p.y  += p.vy;
          p.x  += p.vx;
          p.opacity -= 0.05; // Fade out quickly (lives for ~12 frames)
          p.rotation += p.dr;
          
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.font = `${p.weight} ${p.size}px ${p.font}`;
          ctx.fillStyle = p.color;
          
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillText(p.letter, 0, 0);
          ctx.rotate(-p.rotation);
          ctx.translate(-p.x, -p.y);
        }
        ctx.restore();
      }
    };
    
    rafRef.current = requestAnimationFrame(loop);

    const onEnter = (e) => {
      const t = e.target;
      if (
        t.tagName?.toLowerCase() === "a" ||
        t.tagName?.toLowerCase() === "button" ||
        t.closest("a") ||
        t.closest("button") ||
        t.hasAttribute?.("data-cursor")
      ) {
        if (ringRef.current) {
          ringRef.current.style.transform = `translate(${ringPosRef.current.x - 24}px, ${ringPosRef.current.y - 24}px) scale(1.5)`;
          ringRef.current.style.borderColor = "rgba(201,163,85,0.8)";
          ringRef.current.style.backgroundColor = "rgba(201,163,85,0.1)";
        }
      }
    };

    const onLeave = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPosRef.current.x - 16}px, ${ringPosRef.current.y - 16}px) scale(1)`;
        ringRef.current.style.borderColor = "rgba(201,163,85,0.4)";
        ringRef.current.style.backgroundColor = "transparent";
      }
    };

    window.addEventListener("mouseover", onEnter, true);
    window.addEventListener("mouseout", onLeave, true);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onEnter, true);
      window.removeEventListener("mouseout", onLeave, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#C9A355]/40 pointer-events-none z-[9998] transition-colors duration-200"
        style={{
          transform: "translate(-100px, -100px)",
          willChange: "transform",
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#C9A355] pointer-events-none z-[9999]"
        style={{
          transform: "translate(-100px, -100px)",
          willChange: "transform",
        }}
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9997]"
        style={{ opacity: 0.8 }}
      />
    </>
  );
}
