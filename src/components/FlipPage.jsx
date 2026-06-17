import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * FlipPage — Apple-style scroll-driven page flip wrapper.
 * Each section enters by rotating in from slight negative X (like turning a page).
 */
export default function FlipPage({ children, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Entry: flip from slightly behind → flat
  // Exit: flat → slightly forward
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [6, 0, 0, -4]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.4, 1, 1, 0.5]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0.975, 1, 1, 0.985]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [30, 0, 0, -10]
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
    >
      <motion.div style={{ rotateX, opacity, scale, y }}>
        {children}
      </motion.div>
    </div>
  );
}
