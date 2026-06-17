import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
      });

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
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

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
    <div className="min-h-screen bg-[#080808] flex relative overflow-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" style={{ zIndex: 0 }} />

      {/* Left Side: Editorial Typography */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 border-r border-[#C9A355]/10 z-10">
        <div
          className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(201,163,85,0.06) 0%, transparent 60%)",
            top: "20%",
            left: "-10%",
          }}
        />
        
        <Link to="/" className="inline-block group relative z-10 w-fit">
          <div className="w-12 h-12 border flex items-center justify-center border-[#C9A355]/40 transition-all duration-300 group-hover:border-[#C9A355] group-hover:shadow-[0_0_20px_rgba(201,163,85,0.4)]">
            <span className="font-serif italic font-bold text-2xl text-[#C9A355]">F</span>
          </div>
        </Link>

        <div className="relative z-10 mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-[5rem] leading-[0.9] tracking-tighter text-[#F4EFE6] uppercase"
          >
            Join the <br />
            <span className="font-serif italic text-[#C9A355] capitalize tracking-normal text-[5.5rem]">Foundry</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif italic text-[#A09890] mt-8 text-xl max-w-md"
          >
            Unlock the full collection of typefaces, exclusive releases, and save your favorites.
          </motion.p>
        </div>

        <div className="relative z-10">
          <p className="font-sans text-xs tracking-widest uppercase text-[#6B6560]">
            © {new Date().getFullYear()} The Foundry Gazette. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-16 relative z-10">
        
        {/* Mobile Logo */}
        <Link to="/" className="lg:hidden inline-block group mb-10 mt-8">
          <div className="w-12 h-12 border mx-auto flex items-center justify-center border-[#C9A355]/40 transition-all duration-300 group-hover:border-[#C9A355] group-hover:shadow-[0_0_20px_rgba(201,163,85,0.4)]">
            <span className="font-serif italic font-bold text-2xl text-[#C9A355]">F</span>
          </div>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 30 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-display text-[#F4EFE6] text-4xl tracking-widest uppercase mb-3">Sign Up</h2>
            <p className="font-serif italic text-[#A09890] text-lg">
              {pendingVerification ? "Enter the verification code sent to your email." : "Create your account to save fonts."}
            </p>
          </div>

          {!pendingVerification ? (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[#A09890] uppercase tracking-widest text-[10px] font-semibold">Email Address</label>
                  <input 
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                    className="bg-[#0A0A0A] border border-[#C9A355]/20 text-[#F4EFE6] h-12 px-4 focus:outline-none focus:border-[#C9A355] focus:ring-1 focus:ring-[#C9A355] transition-all font-sans"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[#A09890] uppercase tracking-widest text-[10px] font-semibold">Password</label>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#0A0A0A] border border-[#C9A355]/20 text-[#F4EFE6] h-12 px-4 focus:outline-none focus:border-[#C9A355] focus:ring-1 focus:ring-[#C9A355] transition-all font-sans"
                    placeholder="Create a password"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs font-sans tracking-wide">{error}</p>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#C9A355] hover:bg-[#F0D48A] text-[#080808] h-14 font-bold uppercase tracking-widest mt-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Continue"}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-[#C9A355]/10">
                <p className="text-[#6B6560] font-sans text-center text-xs tracking-widest uppercase mb-4">Or continue with</p>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => handleSocialSignUp("oauth_google")}
                    className="flex-1 flex items-center justify-center gap-3 border border-[#C9A355]/20 bg-[#0A0A0A] hover:bg-[#C9A355]/10 text-[#F4EFE6] h-12 transition-all group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="font-sans text-[10px] font-semibold tracking-widest uppercase">Google</span>
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-[#6B6560] font-sans text-sm">
                Already have an account? <Link to="/sign-in" className="text-[#C9A355] hover:text-[#F0D48A] font-bold transition-colors">Sign in</Link>
              </p>
            </>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#A09890] uppercase tracking-widest text-[10px] font-semibold">Verification Code</label>
                <input 
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="bg-[#0A0A0A] border border-[#C9A355]/20 text-[#F4EFE6] h-12 px-4 focus:outline-none focus:border-[#C9A355] focus:ring-1 focus:ring-[#C9A355] transition-all font-sans text-center tracking-[0.5em] text-xl"
                  placeholder="000000"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs font-sans tracking-wide">{error}</p>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="bg-[#C9A355] hover:bg-[#F0D48A] text-[#080808] h-14 font-bold uppercase tracking-widest mt-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Join"}
              </button>
              
              <button
                type="button"
                onClick={() => setPendingVerification(false)}
                className="mt-4 text-[#C9A355] hover:text-[#F0D48A] font-sans text-xs tracking-widest uppercase transition-colors"
              >
                Back to Sign Up
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
