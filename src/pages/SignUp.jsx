import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignUpPage() {
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
          <SignUp 
            routing="path" 
            path="/sign-up" 
            signInUrl="/sign-in"
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                logoPlacement: "none",
              },
              elements: {
                card: "bg-transparent shadow-none w-full p-0",
                headerTitle: "font-display text-[#F4EFE6] text-3xl tracking-widest uppercase mb-2",
                headerSubtitle: "font-serif italic text-[#A09890] text-lg mb-8",
                socialButtonsBlockButton: "border border-[#C9A355]/30 text-[#F4EFE6] bg-[#0A0A0A] hover:bg-[#C9A355]/10 rounded-none h-12 font-sans tracking-widest text-xs uppercase transition-all",
                socialButtonsBlockButtonText: "font-semibold tracking-widest text-xs",
                dividerLine: "bg-[#C9A355]/20",
                dividerText: "text-[#6B6560] font-sans text-xs tracking-widest uppercase",
                formFieldLabel: "text-[#A09890] uppercase tracking-widest text-[10px] font-semibold mb-2",
                formFieldInput: "bg-[#0A0A0A] border border-[#C9A355]/20 text-[#F4EFE6] rounded-none h-12 px-4 focus:border-[#C9A355] focus:ring-1 focus:ring-[#C9A355] transition-all font-sans",
                formButtonPrimary: "bg-[#C9A355] hover:bg-[#F0D48A] text-[#080808] rounded-none h-14 font-bold uppercase tracking-widest mt-6 transition-all duration-300",
                footerActionText: "text-[#6B6560] font-sans",
                footerActionLink: "text-[#C9A355] hover:text-[#F0D48A] font-bold transition-colors",
                identityPreviewText: "text-[#F4EFE6]",
                identityPreviewEditButton: "text-[#C9A355]",
                formFieldSuccessText: "text-[#C9A355]",
                formFieldErrorText: "text-red-400",
                rootBox: "w-full",
              }
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
