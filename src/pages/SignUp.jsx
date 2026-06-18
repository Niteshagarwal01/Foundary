import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * -40);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * -40);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Use Supabase signup with user metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // If auto-confirm is enabled in Supabase, they log in immediately
      // If email verification is required, they need to check their email
      if (data?.session) {
        navigate("/vault");
      } else {
        setError("Please check your email to verify your account.");
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/vault`
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-sans">
      {/* ── Parallax background orbs ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          width: "700px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,163,85,0.35) 0%, transparent 70%)",
          filter: "blur(100px)",
          top: "-15%", right: "-15%",
          opacity: 0.5,
        }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(140,110,50,0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
          bottom: "-10%", right: "-10%",
          opacity: 0.3,
        }}
      />

      {/* Massive Background Typography */}
      <div className="absolute inset-0 flex flex-col justify-center overflow-hidden pointer-events-none opacity-[0.08] select-none z-0">
        <h1 className="text-[25vw] md:text-[20vw] leading-none font-display uppercase whitespace-nowrap -ml-[10%] tracking-tighter">THE FOUNDRY</h1>
        <h1 className="text-[25vw] md:text-[20vw] leading-none font-serif italic whitespace-nowrap ml-[10%] tracking-tighter">Est. 2026</h1>
      </div>

      <div className="grain-overlay" style={{ zIndex: 1 }} />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        
        {/* Left Typography Panel */}
        <motion.div
          className="flex w-full md:w-[45%] lg:w-[50%] flex-col justify-center px-8 pt-32 pb-10 md:pt-16 md:px-16 lg:px-24 xl:px-32 relative"
        >
          <Link
            to="/"
            className="absolute top-6 left-6 md:top-16 md:left-12 flex items-center gap-3 group z-20"
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

          <div className="relative z-10 w-full max-w-sm md:max-w-xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-12 h-[2px] mb-5 origin-center"
              style={{ background: "linear-gradient(90deg, transparent, #C9A355, transparent)" }}
            />

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#F4EFE6] uppercase tracking-tighter leading-[0.85] mb-2 md:mb-5 text-center"
              style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(3rem, 10vw, 6.5rem)" }}
            >
              Establish
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
              style={{
                fontFamily: "'Kaushan Script', cursive",
                fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
                color: "#C9A355",
                lineHeight: 1,
              }}
            >
              Your Presence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-4 md:mt-6 text-sm md:text-lg leading-relaxed max-w-[260px] md:max-w-md text-center"
              style={{ fontFamily: "'Lora', serif", fontStyle: "italic", color: "#6B6560" }}
            >
              Unlock master-crafted typefaces and exclusive foundry releases.
            </motion.p>
          </div>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 relative w-full flex items-center justify-center p-6 md:p-12 pb-20"
        >
          <Link
            to="/"
            className="md:hidden absolute top-6 left-6 flex items-center gap-3 group z-20 opacity-0 pointer-events-none"
          >
            {/* Hidden on mobile */}
            <div className="w-10 h-10 border border-[#C9A355]/40 flex items-center justify-center bg-[#C9A355]/5 backdrop-blur-sm">
              <svg className="w-4 h-4 text-[#C9A355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
          </Link>

          <div className="w-full max-w-md mx-auto z-20 mt-12 md:mt-0 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-2xl p-8 md:p-10" style={{ pointerEvents: 'auto' }}>
            
            <div className="mb-8">
              <h2 className="font-display text-[#F4EFE6] text-2xl tracking-[0.2em] uppercase mb-1">Create Account</h2>
              <p className="font-sans text-[#4A4540] text-[10px] uppercase tracking-[0.2em]">Join the foundry</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="block px-0 pb-3 pt-4 w-full text-sm text-[#F4EFE6] bg-transparent border-0 border-b appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                    style={{ borderBottomColor: "#2A2A2A" }}
                    placeholder=" "
                  />
                  <label
                    htmlFor="firstName"
                    className="absolute text-[10px] tracking-[0.2em] uppercase text-[#6B6560] duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#C9A355]"
                  >
                    First Name
                  </label>
                </div>

                <div className="relative flex-1">
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="block px-0 pb-3 pt-4 w-full text-sm text-[#F4EFE6] bg-transparent border-0 border-b appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                    style={{ borderBottomColor: "#2A2A2A" }}
                    placeholder=" "
                  />
                  <label
                    htmlFor="lastName"
                    className="absolute text-[10px] tracking-[0.2em] uppercase text-[#6B6560] duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#C9A355]"
                  >
                    Last Name
                  </label>
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block px-0 pb-3 pt-4 w-full text-sm text-[#F4EFE6] bg-transparent border-0 border-b appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                  style={{ borderBottomColor: "#2A2A2A" }}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute text-[10px] tracking-[0.2em] uppercase text-[#6B6560] duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#C9A355]"
                >
                  Email Address
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="block px-0 pb-3 pt-4 w-full text-sm text-[#F4EFE6] bg-transparent border-0 border-b appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                  style={{ borderBottomColor: "#2A2A2A" }}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute text-[10px] tracking-[0.2em] uppercase text-[#6B6560] duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#C9A355]"
                >
                  Password
                </label>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`text-xs tracking-wider uppercase font-medium ${error.includes('check your email') ? 'text-[#C9A355]' : 'text-red-500'}`}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden px-5 py-4 flex items-center justify-center disabled:opacity-50 mt-2"
                style={{
                  background: "transparent",
                  border: "1px solid #C9A355",
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 z-0 bg-[#C9A355]"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="relative z-10 text-[#C9A355] group-hover:text-[#0C0C0C] font-sans text-xs tracking-[0.2em] uppercase font-bold transition-colors duration-300">
                  {loading ? "Creating Account..." : "Enter Vault"}
                </span>
              </motion.button>
            </form>

            {/* OAuth Separator */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-[#2A2A2A]"></div>
              <span className="text-[#4A4540] text-[10px] tracking-widest uppercase">Or</span>
              <div className="h-[1px] flex-1 bg-[#2A2A2A]"></div>
            </div>

            {/* Google OAuth Button */}
            <motion.button
              onClick={handleGoogleSignIn}
              className="mt-8 w-full flex items-center justify-center gap-3 py-3 border border-[#2A2A2A] hover:border-[#C9A355] transition-colors bg-white/[0.01] hover:bg-[#C9A355]/5"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-[#F4EFE6] text-xs font-sans tracking-wider uppercase">Continue with Google</span>
            </motion.button>
            
            <div className="mt-8 pt-6 border-t border-[#2A2A2A] text-center flex items-center justify-between">
              <span className="text-[#6B6560] text-[10px] uppercase tracking-widest font-sans">Already have an account?</span>
              <Link to="/sign-in" className="text-[#C9A355] text-xs font-bold tracking-[0.2em] uppercase hover:text-white transition-colors">
                Sign In
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
