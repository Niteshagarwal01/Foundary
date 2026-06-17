import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col relative overflow-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Decorative background glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(201,163,85,0.06) 0%, transparent 60%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        {/* Back / Logo Area */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <Link to="/" className="inline-block group mb-6">
            <div className="w-12 h-12 border mx-auto flex items-center justify-center border-[#C9A355]/40 transition-all duration-300 group-hover:border-[#C9A355] group-hover:shadow-[0_0_20px_rgba(201,163,85,0.4)]">
              <span className="font-serif italic font-bold text-2xl text-[#C9A355]">F</span>
            </div>
          </Link>
        </motion.div>

        {/* Clerk Component with custom appearance matching Foundry */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 30 }}
        >
          <SignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                logoPlacement: "none",
              },
              elements: {
                card: "bg-transparent border border-[#C9A355]/20 shadow-2xl rounded-none w-full max-w-md p-8 backdrop-blur-md relative",
                headerTitle: "font-display text-[#F4EFE6] text-3xl tracking-widest uppercase mb-2",
                headerSubtitle: "font-serif italic text-[#A09890] text-lg mb-6",
                socialButtonsBlockButton: "border border-[#C9A355]/30 text-[#F4EFE6] bg-[#0A0A0A] hover:bg-[#C9A355]/10 rounded-none h-12 font-sans tracking-widest text-xs uppercase transition-all",
                socialButtonsBlockButtonText: "font-semibold tracking-widest text-xs",
                dividerLine: "bg-[#C9A355]/20",
                dividerText: "text-[#6B6560] font-sans text-xs tracking-widest uppercase",
                formFieldLabel: "text-[#A09890] uppercase tracking-widest text-xs font-semibold mb-2",
                formFieldInput: "bg-[#0A0A0A] border border-[#C9A355]/20 text-[#F4EFE6] rounded-none h-12 px-4 focus:border-[#C9A355] focus:ring-1 focus:ring-[#C9A355] transition-all font-sans",
                formButtonPrimary: "bg-[#C9A355] hover:bg-[#F0D48A] text-[#080808] rounded-none h-14 font-bold uppercase tracking-widest mt-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,163,85,0.4)]",
                footerActionText: "text-[#6B6560] font-sans",
                footerActionLink: "text-[#C9A355] hover:text-[#F0D48A] font-bold transition-colors",
                identityPreviewText: "text-[#F4EFE6]",
                identityPreviewEditButton: "text-[#C9A355]",
                formFieldSuccessText: "text-[#C9A355]",
                formFieldErrorText: "text-red-400",
              }
            }}
          />
        </motion.div>

      </div>
    </div>
  );
}
