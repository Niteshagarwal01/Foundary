import { useState, useEffect } from "react";
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function SignInPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-sans">

      {/* ── Parallax background orbs ── */}
      <motion.div
        animate={{ x: mousePosition.x * -2, y: mousePosition.y * -2 }}
        transition={{ type: "spring", damping: 50, stiffness: 100 }}
        className="absolute pointer-events-none"
        style={{
          width: "700px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,163,85,0.35) 0%, transparent 70%)",
          filter: "blur(100px)",
          top: "-15%", right: "-15%",
          opacity: 0.5,
        }}
      />
      <motion.div
        animate={{ x: mousePosition.x * 2, y: mousePosition.y * 2 }}
        transition={{ type: "spring", damping: 50, stiffness: 100 }}
        className="absolute pointer-events-none"
        style={{
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(140,110,50,0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
          bottom: "-10%", left: "-10%",
          opacity: 0.3,
        }}
      />

      {/* Massive Background Typography */}
      <div className="absolute inset-0 flex flex-col justify-center overflow-hidden pointer-events-none opacity-[0.03] select-none z-0">
        <h1 className="text-[20vw] leading-none font-display uppercase whitespace-nowrap -ml-[10%] tracking-tighter">THE FOUNDRY</h1>
        <h1 className="text-[20vw] leading-none font-serif italic whitespace-nowrap ml-[10%] tracking-tighter">Est. 2026</h1>
      </div>

      <div className="grain-overlay" style={{ zIndex: 1 }} />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        
        {/* Left Typography Panel */}
        <motion.div
          className="hidden md:flex w-full md:w-[45%] lg:w-[50%] flex-col justify-center px-8 pt-16 pb-10 md:px-16 lg:px-24 xl:px-32 relative"
          style={{
            background: "linear-gradient(90deg, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0) 100%)",
          }}
        >
          {/* Back button */}
          <Link
            to="/"
            className="absolute top-12 left-6 md:top-16 md:left-12 flex items-center gap-3 group z-20"
          >
            <div className="w-10 h-10 border border-[#C9A355]/40 flex items-center justify-center group-hover:border-[#C9A355] bg-[#C9A355]/5 backdrop-blur-sm shadow-[0_0_15px_rgba(201,163,85,0.15)] group-hover:shadow-[0_0_20px_rgba(201,163,85,0.4)] transition-all duration-300">
              <svg className="w-4 h-4 text-[#C9A355] transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-[#F4EFE6] md:text-[#C9A355] text-[11px] md:text-xs tracking-[0.25em] uppercase font-bold group-hover:text-[#F4EFE6] transition-colors duration-300">
              The Foundry
            </span>
          </Link>

          <div className="relative z-10 w-full md:max-w-xl md:mx-auto md:flex md:flex-col md:items-center">
            {/* Thin gold rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-12 h-[2px] mb-5 origin-left md:origin-center"
              style={{ background: "linear-gradient(90deg, #C9A355, transparent)" }}
            />

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#F4EFE6] uppercase tracking-tighter leading-[0.85] mb-3 md:mb-5 text-center"
              style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(3.2rem, 10vw, 6.5rem)" }}
            >
              Enter
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
              style={{
                fontFamily: "'Kaushan Script', cursive",
                fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                color: "#C9A355",
                lineHeight: 1,
              }}
            >
              The Vault
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-4 md:mt-6 text-sm md:text-lg leading-relaxed max-w-[260px] md:max-w-md text-center"
              style={{ fontFamily: "'Lora', serif", fontStyle: "italic", color: "#6B6560" }}
            >
              Access your curated typefaces and exclusive releases.
            </motion.p>
          </div>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 relative w-full flex items-center justify-center p-6 md:p-12"
          style={{
            background: "linear-gradient(180deg, rgba(10,10,10,0) 0%, #090909 8%)",
          }}
        >
          {/* Mobile Back Button */}
          <Link
            to="/"
            className="md:hidden absolute top-6 left-6 flex items-center gap-3 group z-20"
          >
            <div className="w-10 h-10 border border-[#C9A355]/40 flex items-center justify-center bg-[#C9A355]/5 backdrop-blur-sm">
              <svg className="w-4 h-4 text-[#C9A355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
          </Link>

          <div className="w-full max-w-md mx-auto z-20 mt-12 md:mt-0" style={{ pointerEvents: 'auto' }}>
            <SignIn 
              routing="path" 
              path="/sign-in" 
              signUpUrl="/sign-up" 
              forceRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  card: "bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-2xl w-full mx-auto",
                  headerTitle: "font-display text-[#F4EFE6] text-2xl tracking-[0.2em] uppercase",
                  headerSubtitle: "font-sans text-[#4A4540] text-[10px] uppercase tracking-[0.2em]",
                  socialButtonsBlockButton: "border-[#2A2A2A] text-[#F4EFE6] hover:bg-white/[0.02]",
                  socialButtonsBlockButtonText: "font-sans text-xs tracking-wider",
                  dividerText: "text-[#4A4540] font-sans text-[10px] tracking-widest uppercase",
                  formFieldLabel: "text-[10px] tracking-[0.2em] uppercase text-[#6B6560]",
                  formFieldInput: "bg-transparent border-0 border-b border-[#2A2A2A] text-base text-[#F4EFE6] rounded-none focus:ring-0 focus:border-[#C9A355] px-0 pb-3 pt-2",
                  formButtonPrimary: "bg-transparent border border-[#C9A355] text-[#C9A355] hover:bg-[#C9A355] hover:text-[#0C0C0C] font-sans text-xs tracking-[0.2em] uppercase font-bold transition-all py-4",
                  footerActionText: "text-[#6B6560] font-sans text-xs",
                  footerActionLink: "text-[#C9A355] font-sans text-xs font-bold tracking-widest uppercase hover:text-white",
                  identityPreviewText: "text-[#F4EFE6]",
                  identityPreviewEditButton: "text-[#C9A355]",
                  footer: "bg-transparent border-t border-white/[0.05]"
                }
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
