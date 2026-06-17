import { useState, useEffect } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate("/");
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (strategy) => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
    } catch (err) {
      setError("Failed to initialize social sign up.");
    }
  };

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
          top: "-15%", left: "-15%",
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
          bottom: "-10%", right: "-10%",
          opacity: 0.3,
        }}
      />

      {/* Massive Background Typography */}
      <div className="absolute inset-0 flex flex-col justify-center overflow-hidden pointer-events-none opacity-[0.03] select-none z-0">
        <h1 className="text-[20vw] leading-none font-display uppercase whitespace-nowrap ml-[5%] tracking-tighter">CREATE</h1>
        <h1 className="text-[20vw] leading-none font-serif italic whitespace-nowrap -ml-[5%] tracking-tighter">Legacy</h1>
      </div>

      <div className="grain-overlay" style={{ zIndex: 1 }} />

      {/* ════════════════════════════════════
          MOBILE/TABLET LAYOUT  (hidden on xl+)
      ════════════════════════════════════ */}
      <div className="xl:hidden flex flex-col min-h-screen relative z-10">
        
        {/* Mobile Hero Top Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative flex flex-col justify-end overflow-hidden px-8 pt-16 pb-10"
          style={{ minHeight: "42vh" }}
        >
          {/* Back button */}
          <Link
            to="/"
            className="absolute top-12 left-6 flex items-center gap-2 group"
          >
            <div className="w-8 h-8 border border-[#C9A355]/30 flex items-center justify-center group-hover:border-[#C9A355] group-hover:shadow-[0_0_12px_rgba(201,163,85,0.3)] transition-all duration-300">
              <svg className="w-3.5 h-3.5 text-[#C9A355] transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-[#6B6560] text-[10px] tracking-[0.2em] uppercase font-semibold group-hover:text-[#C9A355] transition-colors duration-300">
              The Foundry
            </span>
          </Link>

          {/* Giant background F watermark */}
          <div
            className="absolute right-0 top-0 select-none pointer-events-none"
            style={{
              fontSize: "52vw",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontStyle: "italic",
              color: "rgba(201,163,85,0.04)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            F
          </div>

          {/* Thin gold rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-12 h-[2px] mb-5 origin-left"
            style={{ background: "linear-gradient(90deg, #C9A355, transparent)" }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#F4EFE6] uppercase tracking-tighter leading-[0.85] mb-3"
            style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(3.2rem, 16vw, 5rem)" }}
          >
            Join
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Kaushan Script', cursive",
              fontSize: "clamp(2.8rem, 14vw, 4.5rem)",
              color: "#C9A355",
              lineHeight: 1,
            }}
          >
            The Few
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-4 text-sm leading-relaxed max-w-[260px]"
            style={{ fontFamily: "'Lora', serif", fontStyle: "italic", color: "#6B6560" }}
          >
            Unlock master-crafted typefaces and exclusive foundry releases.
          </motion.p>
        </motion.div>

        {/* Mobile Form Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 relative"
          style={{
            background: "linear-gradient(180deg, rgba(10,10,10,0) 0%, #090909 8%)",
          }}
        >
          {/* Divider line */}
          <div className="w-full h-[1px] mb-0" style={{ background: "linear-gradient(90deg, transparent, rgba(201,163,85,0.15) 50%, transparent)" }} />

          <div className="px-6 pt-8 pb-12">
            <div className="mb-8">
              <h2 className="font-display text-[#F4EFE6] text-2xl tracking-[0.3em] uppercase mb-1">Sign Up</h2>
              <p className="font-sans text-[#4A4540] text-[10px] uppercase tracking-[0.2em]">
                {pendingVerification ? "Enter your verification code" : "Establish your presence"}
              </p>
            </div>

            {!pendingVerification ? (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                  <div className="relative">
                    <input
                      type="email"
                      id="mob-signup-email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      required
                      className="block px-0 pb-3 pt-6 w-full text-base text-[#F4EFE6] bg-transparent border-0 border-b appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                      style={{ borderBottomColor: "#2A2A2A" }}
                      placeholder=" "
                    />
                    <label
                      htmlFor="mob-signup-email"
                      className="absolute text-[10px] tracking-[0.2em] uppercase text-[#6B6560] duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#C9A355]"
                    >
                      Email Address
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      id="mob-signup-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block px-0 pb-3 pt-6 w-full text-base text-[#F4EFE6] bg-transparent border-0 border-b appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                      style={{ borderBottomColor: "#2A2A2A" }}
                      placeholder=" "
                    />
                    <label
                      htmlFor="mob-signup-password"
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
                        className="text-red-400 text-xs tracking-wide m-0"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative overflow-hidden h-[56px] w-full font-bold uppercase tracking-[0.2em] text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 group"
                    style={{ background: "#C9A355", color: "#080808" }}
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative">{loading ? "Initializing..." : "Create Account"}</span>
                    {!loading && (
                      <svg className="w-4 h-4 relative transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 text-[#3A3A3A] text-[9px] tracking-[0.2em] uppercase" style={{ background: "#090909" }}>
                    Or continue with
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSocialSignUp("oauth_google")}
                    className="w-full flex items-center justify-center gap-3 h-12 transition-all group"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-[#A09890] text-[10px] font-semibold tracking-[0.2em] uppercase">Continue with Google</span>
                  </button>
                </div>

                <p className="mt-6 text-center text-[10px] tracking-[0.15em] uppercase" style={{ color: "#3A3A3A" }}>
                  Already have an account?{" "}
                  <Link to="/sign-in" className="font-bold underline underline-offset-4 transition-colors" style={{ color: "#C9A355" }}>
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleVerify} 
                className="flex flex-col gap-8"
              >
                <div className="relative">
                  <input 
                    type="text"
                    id="mob-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="block px-0 pb-3 pt-6 w-full text-xl tracking-[0.5em] text-center text-[#F4EFE6] bg-transparent border-0 border-b appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                    style={{ borderBottomColor: "#2A2A2A" }}
                    placeholder=" "
                  />
                  <label 
                    htmlFor="mob-code" 
                    className="absolute left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase text-[#6B6560] duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-center peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#C9A355]"
                  >
                    Verification Code
                  </label>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-xs tracking-wide m-0 text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="relative overflow-hidden h-[56px] w-full font-bold uppercase tracking-[0.2em] text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 group"
                    style={{ background: "#C9A355", color: "#080808" }}
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative">{loading ? "Verifying..." : "Verify & Join"}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPendingVerification(false)}
                    className="h-12 flex items-center justify-center text-[#6B6560] hover:text-[#C9A355] text-[10px] tracking-[0.2em] uppercase transition-colors group"
                  >
                    <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Sign Up
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════════
          DESKTOP LAYOUT  (hidden on tablet/mobile)
      ════════════════════════════════════ */}
      <div className="hidden xl:flex min-h-screen items-center justify-center relative z-10">
        <div className="w-full max-w-7xl mx-auto flex flex-row-reverse items-center justify-between p-16">

          {/* Right Editorial Section */}
          <div className="w-1/2 flex flex-col justify-center pl-20 items-end text-right">
            <Link to="/" className="inline-block group mb-12 w-fit">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 border flex items-center justify-center border-[#C9A355]/40 backdrop-blur-sm transition-all duration-500 group-hover:border-[#C9A355] group-hover:shadow-[0_0_30px_rgba(201,163,85,0.3)]"
              >
                <span className="font-serif italic font-bold text-3xl text-[#C9A355]">F</span>
              </motion.div>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-7xl leading-[0.85] tracking-tighter text-[#F4EFE6] uppercase mb-6">
                Join <br />
                <span className="font-serif italic text-[#C9A355] capitalize tracking-normal text-8xl">The Few</span>
              </h2>
              <div className="w-20 h-[1px] bg-[#C9A355]/50 mb-8 ml-auto" />
              <p className="font-serif italic text-[#A09890] text-2xl max-w-md leading-relaxed ml-auto">
                Unlock the full collection of master-crafted typefaces and exclusive foundry releases.
              </p>
            </motion.div>
          </div>

          {/* Left Form Section (Glassmorphism Card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-[480px] relative group"
          >
            <div className="absolute -inset-[1px] bg-gradient-to-b from-[#C9A355]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
            
            <div className="relative bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/[0.05] p-12 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
              <div className="mb-10 text-left">
                <h3 className="font-display text-[#F4EFE6] text-3xl tracking-widest uppercase mb-2">Sign Up</h3>
                <p className="font-sans text-[#6B6560] text-xs uppercase tracking-widest leading-relaxed">
                  {pendingVerification ? "Enter your verification code" : "Establish your presence"}
                </p>
              </div>

              {!pendingVerification ? (
                <>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="relative">
                      <input 
                        type="email"
                        id="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="block px-0 pb-2 pt-6 w-full text-sm text-[#F4EFE6] bg-transparent border-0 border-b border-[#333] appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                        placeholder=" "
                      />
                      <label 
                        htmlFor="email" 
                        className="absolute text-xs tracking-widest uppercase text-[#6B6560] duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#C9A355]"
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
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="block px-0 pb-2 pt-6 w-full text-sm text-[#F4EFE6] bg-transparent border-0 border-b border-[#333] appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                        placeholder=" "
                      />
                      <label 
                        htmlFor="password" 
                        className="absolute text-xs tracking-widest uppercase text-[#6B6560] duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#C9A355]"
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
                          className="text-red-400 text-xs font-sans tracking-wide m-0"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="relative overflow-hidden bg-[#C9A355] text-[#080808] h-14 font-bold uppercase tracking-widest mt-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      <span className="relative flex items-center justify-center gap-3">
                        {loading ? "Initializing..." : "Create Account"}
                        {!loading && (
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="mt-10 pt-8 border-t border-white/5 relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0A0A0A] px-4 text-[#6B6560] font-sans text-[10px] tracking-widest uppercase">
                      Or Continue With
                    </span>
                    <button 
                      type="button"
                      onClick={() => handleSocialSignUp("oauth_google")}
                      className="w-full flex items-center justify-center gap-3 border border-white/10 bg-white/5 hover:bg-white/10 text-[#F4EFE6] h-12 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="font-sans text-[10px] font-semibold tracking-widest uppercase relative z-10">Google</span>
                    </button>
                  </div>

                  <p className="mt-8 text-center text-[#6B6560] font-sans text-xs tracking-widest uppercase">
                    Already have an account? <Link to="/sign-in" className="text-[#C9A355] hover:text-[#F0D48A] font-bold transition-colors underline underline-offset-4">Sign in</Link>
                  </p>
                </>
              ) : (
                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleVerify} 
                  className="flex flex-col gap-8"
                >
                  <div className="relative">
                    <input 
                      type="text"
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onFocus={() => setFocusedInput('code')}
                      onBlur={() => setFocusedInput(null)}
                      required
                      className="block px-0 pb-2 pt-6 w-full text-xl tracking-[0.5em] text-center text-[#F4EFE6] bg-transparent border-0 border-b border-[#333] appearance-none focus:outline-none focus:ring-0 focus:border-[#C9A355] transition-colors peer"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="code" 
                      className="absolute left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase text-[#6B6560] duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-center peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#C9A355]"
                    >
                      Verification Code
                    </label>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-400 text-xs font-sans tracking-wide m-0 text-center"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-3">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="relative overflow-hidden bg-[#C9A355] text-[#080808] h-14 font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      <span className="relative flex items-center justify-center gap-3">
                        {loading ? "Verifying..." : "Verify & Join"}
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPendingVerification(false)}
                      className="h-14 flex items-center justify-center text-[#6B6560] hover:text-[#C9A355] font-sans text-xs tracking-widest uppercase transition-colors group"
                    >
                      <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Sign Up
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
}
