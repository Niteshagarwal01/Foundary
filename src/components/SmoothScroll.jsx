// Lenis smooth scroll wrapper for the entire app
import { useEffect } from "react";
import Lenis from "lenis";

let lenisInstance = null;

export function getLenis() { return lenisInstance; }

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisInstance = lenis;

    // Wire lenis into GSAP ScrollTrigger if available
    lenis.on("scroll", () => {
      if (window.ScrollTrigger) window.ScrollTrigger.update();
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const handle = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(handle);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return children;
}
