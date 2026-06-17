import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "../context/ThemeContext";
import { PreviewProvider } from "../context/AppContext";

// Core
import Navbar        from "../components/Navbar";
import Hero          from "../components/Hero";
import Marquee       from "../components/Marquee";
import FontShowcase  from "../components/FontShowcase";
import FontLibrary   from "../components/FontLibrary";
import FontModal     from "../components/FontModal";
import FlipPage      from "../components/FlipPage";
import SmoothScroll  from "../components/SmoothScroll";
import PreviewBar    from "../components/PreviewBar";

// New sections
import TypeComparison    from "../sections/TypeComparison";
import VariablePlayground from "../sections/VariablePlayground";
import ScrollStory       from "../sections/ScrollStory";
import BrandTryOn        from "../sections/BrandTryOn";
import MoodBoard         from "../sections/MoodBoard";
import TypeTimeline      from "../sections/TypeTimeline";
import Newsletter        from "../sections/Newsletter";
import Lookbook          from "../sections/Lookbook";
import FontAnatomy       from "../sections/FontAnatomy";

import { FONT_COUNT } from "../data/fonts";

export default function Home() {
  const [selectedFont, setSelectedFont] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");

  // Track which section is in view
  useEffect(() => {
    const sections = ["hero", "showcase", "compare", "playground", "library", "timeline", "brand-tryon", "mood", "lookbook", "anatomy", "newsletter"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <ThemeProvider>
      <PreviewProvider>
        <SmoothScroll>
          {/* Grain overlay */}
          <div className="grain-overlay" />

          {/* Nav */}
          <Navbar activeSection={activeSection} />

          {/* Live preview bar — floats above everything */}
          <PreviewBar />

          {/* ─────────────────────────────────────────────
              PAGE SECTIONS
          ───────────────────────────────────────────── */}

          {/* 1. Hero */}
          <Hero
            fontCount={FONT_COUNT}
            onExplore={() =>
              document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" })
            }
          />

          {/* 2. Marquee */}
          <FlipPage>
            <Marquee />
          </FlipPage>

          {/* 3. Font Showcase */}
          <FlipPage>
            <FontShowcase onSelectFont={setSelectedFont} />
          </FlipPage>

          {/* 4. Scroll Story */}
          <div className="hidden xl:block">
            <ScrollStory />
          </div>

          {/* 5. Type Comparison */}
          <TypeComparison />

          {/* 6. Variable Font Playground */}
          <VariablePlayground />

          {/* 7. Marquee 2 (inverted) */}
          <FlipPage>
            <Marquee inverted />
          </FlipPage>

          {/* 8. Font Library Grid */}
          <FlipPage>
            <FontLibrary onSelectFont={setSelectedFont} />
          </FlipPage>

          {/* 9. Typeface Timeline */}
          <TypeTimeline />

          {/* 10. Brand Try-On */}
          <BrandTryOn />

          {/* 11. Mood Board */}
          <MoodBoard />

          {/* 11.5 Lookbook */}
          <Lookbook />

          {/* 11.75 Font Anatomy */}
          <FontAnatomy />

          {/* 12. Newsletter */}
          <Newsletter />

          {/* 13. Footer */}
          <FlipPage>
            <footer
              id="footer"
              className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-10 gap-6 border-t"
              style={{ borderColor: "rgba(201,163,85,0.12)", background: "#080808" }}
            >
              <div
                className="ambient-glow"
                style={{
                  width: "400px", height: "400px",
                  background: "radial-gradient(circle, rgba(201,163,85,0.04) 0%, transparent 70%)",
                  bottom: "-80px", left: "50%", transform: "translateX(-50%)",
                }}
              />

              <motion.div className="flex items-center gap-3 group" whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 350, damping: 22 }}>
                <motion.div className="w-7 h-7 border flex items-center justify-center" style={{ borderColor: "#C9A355" }} whileHover={{ boxShadow: "0 0 16px rgba(201,163,85,0.5)" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.8rem", color: "#C9A355" }}>F</span>
                </motion.div>
                <span className="text-xs font-semibold uppercase transition-colors duration-300 group-hover:text-[#C9A355]" style={{ color: "#F4EFE6", letterSpacing: "0.25em", fontFamily: "'Inter', sans-serif" }}>
                  The Foundry Gazette
                </span>
              </motion.div>

              <p className="font-display italic hover-glow transition-all duration-300" style={{ fontSize: "1.1rem", color: "#4A4540" }}>
                code that works. design that sells.
              </p>

              <div className="flex flex-wrap justify-center gap-4 md:gap-8 relative z-10">
                {["Explore", "Playground", "Pairings"].map((item, i) => (
                  <motion.button
                    key={item}
                    onClick={() => document.getElementById(["showcase","playground","compare"][i])?.scrollIntoView({ behavior: "smooth" })}
                    className="underline-anim text-xs font-semibold uppercase hover-glow"
                    style={{ color: "#6B6560", letterSpacing: "0.15em", fontFamily: "'Inter', sans-serif" }}
                    whileHover={{ y: -2, color: "#C9A355" }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </footer>
          </FlipPage>

          {/* Font Modal */}
          <AnimatePresence>
            {selectedFont && (
              <FontModal
                font={selectedFont}
                open={!!selectedFont}
                onClose={() => setSelectedFont(null)}
              />
            )}
          </AnimatePresence>
        </SmoothScroll>
      </PreviewProvider>
    </ThemeProvider>
  );
}
