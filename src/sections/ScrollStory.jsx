import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function CinematicAct({ scrollProgress, range, children }) {
  const filter = useTransform(
    scrollProgress,
    [range[0], range[0] + 0.05, range[1] - 0.05, range[1]],
    ["blur(32px)", "blur(0px)", "blur(0px)", "blur(32px)"]
  );

  const opacity = useTransform(
    scrollProgress,
    [range[0], range[0] + 0.05, range[1] - 0.05, range[1]],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollProgress,
    [range[0], range[1]],
    [1.15, 0.95]
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 5vw",
        opacity,
        scale,
        filter,
        pointerEvents: "none"
      }}
    >
      <div style={{ maxWidth: "1400px", width: "100%", textAlign: "center" }}>
        {children}
      </div>
    </motion.div>
  );
}

function GiantAstrolabe({ scrollProgress }) {
  const rotate = useTransform(scrollProgress, [0, 1], [0, -120]);
  const size = "150vh"; // Giant element extending off-screen

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        width: size,
        height: size,
        opacity: 0.06, // Very subtle, cinematic backdrop
        rotate,
        pointerEvents: "none"
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main large text path */}
        <path id="giant-path-outer" d="M 500, 500 m -450, 0 a 450,450 0 1,1 900,0 a 450,450 0 1,1 -900,0" fill="none"/>
        <path id="giant-path-inner" d="M 500, 500 m -350, 0 a 350,350 0 1,1 700,0 a 350,350 0 1,1 -700,0" fill="none"/>
        
        {/* Outer Ring Text */}
        <text style={{ fontSize: "28px", fontWeight: "bold", fontFamily: "'Inter', sans-serif", letterSpacing: "14px", textTransform: "uppercase" }} fill="#C9A355">
          <textPath href="#giant-path-outer" startOffset="0%">
             PREMIUM TYPOGRAPHY • HUMAN CRAFTED • THE FOUNDRY STUDIO • PREMIUM TYPOGRAPHY • HUMAN CRAFTED • THE FOUNDRY STUDIO • 
          </textPath>
        </text>

        {/* Inner Ring Text */}
        <text style={{ fontSize: "20px", fontWeight: 500, fontFamily: "'Inter', sans-serif", letterSpacing: "8px", textTransform: "uppercase" }} fill="#F4EFE6">
          <textPath href="#giant-path-inner" startOffset="10%">
             ENGINEERING VOICES • ESTABLISHED 2026 • NEW DELHI • ENGINEERING VOICES • ESTABLISHED 2026 • NEW DELHI •
          </textPath>
        </text>

        {/* Concentric rings */}
        <circle cx="500" cy="500" r="300" stroke="#C9A355" strokeWidth="2" strokeDasharray="10 10" />
        <circle cx="500" cy="500" r="400" stroke="#F4EFE6" strokeWidth="1" strokeDasharray="4 12" />
        <circle cx="500" cy="500" r="480" stroke="#C9A355" strokeWidth="4" />
        <circle cx="500" cy="500" r="495" stroke="#F4EFE6" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

export default function ScrollStory() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className="hidden xl:block my-32" // Using margins to create space from other sections
      style={{
        height: "400vh", // Provides 4 screens worth of scroll distance for the acts
        position: "relative",
      }}
    >
      <div className="sticky top-0 h-screen w-full bg-[#000] overflow-hidden rounded-3xl border border-[#C9A355]/10 shadow-[0_0_100px_rgba(0,0,0,1)]">
        
        {/* Dynamic vignette / central glow */}
        <motion.div 
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(201,163,85,0.08) 0%, transparent 65%)",
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
          }}
        />

        <GiantAstrolabe scrollProgress={scrollYProgress} />

        {/* ACT 1 */}
        <CinematicAct scrollProgress={scrollYProgress} range={[0, 0.25]}>
          <h2 className="text-[#F4EFE6] text-7xl xl:text-8xl 2xl:text-9xl tracking-tight leading-none uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
            FORGED IN <br/>
            <span className="text-[#C9A355]" style={{ textShadow: "0 0 80px rgba(201,163,85,0.4)" }}>OBSESSION</span>
          </h2>
        </CinematicAct>

        {/* ACT 2 */}
        <CinematicAct scrollProgress={scrollYProgress} range={[0.25, 0.5]}>
          <h2 className="text-[#F4EFE6] text-6xl xl:text-7xl 2xl:text-8xl tracking-tight leading-tight uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
            EVERY CURVE <span className="font-serif italic text-[#C9A355] normal-case" style={{ fontFamily: "'Kaushan Script', cursive" }}>crafted.</span><br/>
            EVERY GLYPH <span className="font-serif italic text-[#C9A355] normal-case" style={{ fontFamily: "'Kaushan Script', cursive" }}>perfected.</span>
          </h2>
        </CinematicAct>

        {/* ACT 3 */}
        <CinematicAct scrollProgress={scrollYProgress} range={[0.5, 0.75]}>
          <h2 className="text-[#F4EFE6] text-6xl xl:text-7xl 2xl:text-8xl tracking-tight leading-none uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
            We don't just draw letters.<br/>
            <span className="text-[#C9A355] mt-6 block" style={{ textShadow: "0 0 80px rgba(201,163,85,0.4)" }}>
              We engineer voices.
            </span>
          </h2>
        </CinematicAct>

        {/* ACT 4 */}
        <CinematicAct scrollProgress={scrollYProgress} range={[0.75, 1]}>
          <h2 className="text-[#F4EFE6] text-8xl xl:text-9xl 2xl:text-[10rem] tracking-tighter leading-none uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
            THIS IS<br/>
            <span className="text-[#C9A355]" style={{ textShadow: "0 0 120px rgba(201,163,85,0.6)" }}>
              THE FOUNDRY
            </span>
            <span className="text-[#C9A355]">.</span>
          </h2>
        </CinematicAct>

        {/* Cinematic Scan Line / Film Grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.15]" 
          style={{ 
            background: "linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))", 
            backgroundSize: "100% 4px, 3px 100%" 
          }} 
        />
        
        {/* Progress Tracker Line */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-[#C9A355]"
                style={{ 
                    width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                    boxShadow: "0 0 10px rgba(201,163,85,0.5)"
                }}
            />
        </div>

        {/* ── Animated Stamps ── */}
        <Stamp
          scrollProgress={scrollYProgress}
          text="PREMIUM QUALITY • THE FOUNDRY • "
          path="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
          triggerRange={[0.0, 0.25]}
          initialPos={{ x: -450, y: -250 }}
          targetPos={{ x: -300, y: -200 }}
          rotateRange={[0, 90]}
          size={240}
        />
        <Stamp
          scrollProgress={scrollYProgress}
          text="100% HAND CRAFTED • TYPE STUDIO • "
          path="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
          triggerRange={[0.25, 0.5]}
          initialPos={{ x: 450, y: 200 }}
          targetPos={{ x: 300, y: 150 }}
          rotateRange={[-45, 45]}
          size={220}
        />
        <Stamp
          scrollProgress={scrollYProgress}
          text="NO AI CURVES • HUMAN MADE • "
          path="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
          triggerRange={[0.5, 0.75]}
          initialPos={{ x: -400, y: 250 }}
          targetPos={{ x: -280, y: 180 }}
          rotateRange={[90, -45]}
          size={260}
        />
        <Stamp
          scrollProgress={scrollYProgress}
          text="NEW DELHI • ORIGINAL DESIGN • "
          path="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
          triggerRange={[0.75, 1.0]}
          initialPos={{ x: 400, y: -250 }}
          targetPos={{ x: 250, y: -180 }}
          rotateRange={[180, 0]}
          size={250}
        />
      </div>
    </section>
  );
}

/* ── Animated Stamp Component ── */
function Stamp({ scrollProgress, text, path, triggerRange, initialPos, targetPos, rotateRange, size = 180, scaleRange = [2, 1, 0.8] }) {
  const opacity = useTransform(
    scrollProgress,
    [triggerRange[0], triggerRange[0] + 0.05, triggerRange[1] - 0.05, triggerRange[1]],
    [0, 1, 1, 0]
  );
  
  const scale = useTransform(
    scrollProgress,
    [triggerRange[0], triggerRange[0] + 0.1, triggerRange[1]],
    scaleRange
  );

  const rotate = useTransform(
    scrollProgress,
    [triggerRange[0], triggerRange[1]],
    rotateRange
  );

  const x = useTransform(
    scrollProgress,
    [triggerRange[0], triggerRange[1]],
    [initialPos.x, targetPos.x]
  );

  const y = useTransform(
    scrollProgress,
    [triggerRange[0], triggerRange[1]],
    [initialPos.y, targetPos.y]
  );

  const textId = `textPath-${text.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        x,
        y,
        scale,
        rotate,
        zIndex: 10,
        pointerEvents: "none",
        color: "#C9A355",
        opacity: useTransform(opacity, o => o * 0.25), // Cinematic subtle overlay
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id={textId} d={path} fill="none"/>
        <text style={{ fontSize: "19px", fontWeight: "bold", fontFamily: "'Inter', sans-serif", letterSpacing: "9px", textTransform: "uppercase" }} fill="currentColor">
          <textPath href={`#${textId}`} startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
        <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="3" />
        <text x="100" y="105" textAnchor="middle" style={{ fontSize: "24px", fontFamily: "'Anton', sans-serif", letterSpacing: "2px" }} fill="currentColor">EST.</text>
        <text x="100" y="130" textAnchor="middle" style={{ fontSize: "16px", fontFamily: "'Inter', sans-serif", fontWeight: "bold", letterSpacing: "4px" }} fill="currentColor">2026</text>
      </svg>
    </motion.div>
  );
}
