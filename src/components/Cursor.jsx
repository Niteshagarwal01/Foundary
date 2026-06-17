import { useState, useRef, useEffect } from "react";
import { usePreview } from "../context/AppContext";

export default function Cursor() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const posRef   = useRef({ x: -100, y: -100 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let raf;
    let ring = { x: -100, y: -100 };

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      posRef.current = { x, y };

      // Move dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }
    };

    window.addEventListener("mousemove", onMove);

    // Smoothly animate the ring
    const loop = () => {
      ring.x += (posRef.current.x - ring.x) * 0.15;
      ring.y += (posRef.current.y - ring.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x - 16}px, ${ring.y - 16}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

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
          ringRef.current.style.transform = `translate(${ring.x - 24}px, ${ring.y - 24}px) scale(1.5)`;
          ringRef.current.style.borderColor = "rgba(201,163,85,0.8)";
          ringRef.current.style.backgroundColor = "rgba(201,163,85,0.1)";
        }
      }
    };

    const onLeave = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x - 16}px, ${ring.y - 16}px) scale(1)`;
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
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#C9A355]/40 pointer-events-none z-[9999] transition-colors duration-200"
        style={{
          transform: "translate(-100px, -100px)",
          willChange: "transform",
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#C9A355] pointer-events-none z-[10000]"
        style={{
          transform: "translate(-100px, -100px)",
          willChange: "transform",
        }}
      />
    </>
  );
}
