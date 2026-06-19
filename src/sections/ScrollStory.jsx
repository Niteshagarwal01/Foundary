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
      className="hidden xl:block my-12" // Reduced margins to prevent massive empty space
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

        {/* ── Cinematic Journey Stamps ── */}
        <Stamp
          scrollProgress={scrollYProgress}
          text="PREMIUM QUALITY • THE FOUNDRY • "
          centerTextLine1="100%"
          centerTextLine2="QUALITY"
          centerSubtext="SINCE DAY ONE"
          triggerRange={[0.0, 0.25]}
          initialPos={{ x: "-30vw", y: "-25vh" }}
          targetPos={{ x: "-25vw", y: "-20vh" }}
          rotateRange={[0, 45]}
          size={300}
        />
        <Stamp
          scrollProgress={scrollYProgress}
          text="100% HAND CRAFTED • TYPE STUDIO • "
          centerTextLine1="HAND"
          centerTextLine2="CRAFTED"
          centerSubtext="NO AI USED"
          triggerRange={[0.25, 0.5]}
          initialPos={{ x: "25vw", y: "20vh" }}
          targetPos={{ x: "20vw", y: "15vh" }}
          rotateRange={[-45, 0]}
          size={280}
        />
        <Stamp
          scrollProgress={scrollYProgress}
          text="NO AI CURVES • HUMAN MADE • "
          centerTextLine1="HUMAN"
          centerTextLine2="MADE"
          centerSubtext="ORIGINAL ART"
          triggerRange={[0.5, 0.75]}
          initialPos={{ x: "-25vw", y: "25vh" }}
          targetPos={{ x: "-20vw", y: "20vh" }}
          rotateRange={[45, -45]}
          size={320}
        />
        <Stamp
          scrollProgress={scrollYProgress}
          text="NEW DELHI • ORIGINAL DESIGN • "
          centerTextLine1="THE"
          centerTextLine2="FOUNDRY"
          centerSubtext="EST 2026"
          triggerRange={[0.75, 1.0]}
          initialPos={{ x: "25vw", y: "-25vh" }}
          targetPos={{ x: "20vw", y: "-20vh" }}
          rotateRange={[90, 0]}
          size={300}
        />
      </div>
    </section>
  );
}

/* ── Perfectly Crafted Cinematic Stamp Component ── */
function Stamp({ scrollProgress, text, centerTextLine1, centerTextLine2, centerSubtext, triggerRange, initialPos, targetPos, rotateRange, size = 300, scaleRange = [1.5, 1, 0.9] }) {
  const filter = useTransform(
    scrollProgress,
    [triggerRange[0], triggerRange[0] + 0.1, triggerRange[1] - 0.1, triggerRange[1]],
    ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]
  );

  const opacity = useTransform(
    scrollProgress,
    [triggerRange[0], triggerRange[0] + 0.1, triggerRange[1] - 0.1, triggerRange[1]],
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

  const x = useTransform(scrollProgress, [triggerRange[0], triggerRange[1]], [initialPos.x, targetPos.x]);
  const y = useTransform(scrollProgress, [triggerRange[0], triggerRange[1]], [initialPos.y, targetPos.y]);

  const textId = `textPath-${text.replace(/[^a-zA-Z0-9]/g, '')}`;
  // Only repeat twice to prevent multi-wrap overlapping
  const repeatedText = `${text}${text}`;

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
        filter,
        zIndex: 5,
        pointerEvents: "none",
        opacity: useTransform(opacity, o => o * 0.8), // high visibility for glass
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Premium Glassmorphic Backdrop */}
      <div 
        className="absolute inset-0 rounded-full" 
        style={{ 
          background: "rgba(201,163,85,0.02)", 
          backdropFilter: "blur(12px)", 
          border: "1px solid rgba(201,163,85,0.2)", 
          boxShadow: "0 0 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(201,163,85,0.08)" 
        }} 
      />

      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
        <defs>
          <linearGradient id={`grad-${textId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A355" stopOpacity="1" />
            <stop offset="50%" stopColor="#F4EFE6" stopOpacity="1" />
            <stop offset="100%" stopColor="#C9A355" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Perfect clockwise circle starting from top-center */}
        <path id={textId} d="M 100, 15 A 85 85 0 1 1 99.9 15" fill="none" />
        
        <text style={{ fontSize: "13px", fontWeight: "600", fontFamily: "'Inter', sans-serif", letterSpacing: "4px", textTransform: "uppercase" }} fill={`url(#grad-${textId})`}>
          <textPath href={`#${textId}`} startOffset="0%" textLength="534" lengthAdjust="spacing">
            {repeatedText}
          </textPath>
        </text>
        
        {/* Crisp metallic inner rings */}
        <circle cx="100" cy="100" r="66" stroke={`url(#grad-${textId})`} strokeWidth="1" strokeDasharray="3 4" opacity="0.8" />
        <circle cx="100" cy="100" r="72" stroke={`url(#grad-${textId})`} strokeWidth="1.5" opacity="0.6" />
        
        {/* Center content - perfectly balanced vertically */}
        <text x="100" y="90" textAnchor="middle" style={{ fontSize: "30px", fontFamily: "'Anton', sans-serif", letterSpacing: "2px" }} fill={`url(#grad-${textId})`}>{centerTextLine1}</text>
        <text x="100" y="118" textAnchor="middle" style={{ fontSize: "26px", fontFamily: "'Anton', sans-serif", letterSpacing: "2px" }} fill={`url(#grad-${textId})`}>{centerTextLine2}</text>
        
        <text x="100" y="140" textAnchor="middle" style={{ fontSize: "10px", fontFamily: "'Inter', sans-serif", fontWeight: "600", letterSpacing: "6px" }} fill="#F4EFE6" opacity="0.7">{centerSubtext}</text>
        
        {/* Star adornments perfectly centered using text */}
        <text x="100" y="52" textAnchor="middle" fontSize="16" fill="#C9A355" opacity="0.8">★</text>
        <text x="100" y="165" textAnchor="middle" fontSize="16" fill="#C9A355" opacity="0.8">★</text>
      </svg>
    </motion.div>
  );
}


