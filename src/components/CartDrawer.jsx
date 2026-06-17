import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartFont } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedTier, setSelectedTier] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!cartFont && cartOpen) return null;

  const tiers = [
    {
      name: "Desktop",
      price: "₹299",
      amount: 299,
      desc: "For static images, logos, and physical products. Up to 3 devices.",
      type: "Desktop",
      seats: "3",
      pageviews: "N/A"
    },
    {
      name: "Web",
      price: "₹499",
      amount: 499,
      desc: "For website embedding via @font-face. Up to 10k pageviews/mo.",
      type: "Web",
      seats: "1",
      pageviews: "10k/mo"
    },
    {
      name: "App / Broadcast",
      price: "₹1,499",
      amount: 1499,
      desc: "For embedding in mobile apps, games, or broadcasting.",
      type: "App",
      seats: "Unlimited",
      pageviews: "Unlimited"
    }
  ];

  const handleCheckout = async () => {
    if (!user) {
      setCartOpen(false);
      navigate("/sign-in");
      return;
    }

    const tier = tiers[selectedTier];
    setCartOpen(false);
    navigate("/checkout", { state: { font: cartFont, tier: tier } });
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={() => !isProcessing && !success && setCartOpen(false)}
          />

          {/* Slide-out Cart */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0C0C0C] z-[110] border-l border-[#C9A355]/20 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#C9A355]/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-[0.2em] text-[#C9A355] uppercase font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                  License Selection
                </span>
                <h2 className="text-3xl text-[#F4EFE6] mt-2" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}>
                  {cartFont?.name || "Font"}
                </h2>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                disabled={isProcessing || success}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {tiers.map((tier, idx) => {
                const isSelected = selectedTier === idx;
                return (
                  <div 
                    key={idx} 
                    onClick={() => !isProcessing && !success && setSelectedTier(idx)}
                    className={`border p-5 transition-all group cursor-pointer relative overflow-hidden ${isSelected ? 'border-[#C9A355] bg-[#C9A355]/5 shadow-[0_0_15px_rgba(201,163,85,0.1)]' : 'border-white/10 hover:border-[#C9A355]/40 bg-white/[0.02]'}`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-8 h-8 bg-[#C9A355] flex items-center justify-center rounded-bl-lg">
                        <span className="text-[#0C0C0C] text-xs font-bold">✓</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(201,163,85,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <h3 className={`font-bold tracking-widest text-sm uppercase transition-colors ${isSelected ? 'text-[#C9A355]' : 'text-[#F4EFE6]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>{tier.name}</h3>
                      <span className="text-[#C9A355] font-serif italic text-xl">{tier.price}</span>
                    </div>
                    <p className={`text-xs leading-relaxed relative z-10 transition-colors ${isSelected ? 'text-[#F4EFE6]' : 'text-[#6B6560]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                      {tier.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#C9A355]/20 bg-black">
              {success ? (
                <button 
                  disabled
                  className="w-full py-4 bg-green-600 text-white font-bold text-xs uppercase tracking-widest relative overflow-hidden"
                >
                  Payment Successful! Redirecting...
                </button>
              ) : (
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-[#C9A355] text-[#0C0C0C] font-bold py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-[#E2C07A] transition-colors mt-6 flex justify-center items-center gap-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {isProcessing ? "PROCESSING..." : "PROCEED TO CHECKOUT \u2192"}
                </button>
              )}
                <div className="text-center mt-4">
                  <span className="text-[8px] tracking-widest text-[#6B6560] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                    SECURE CHECKOUT
                  </span>
                </div>
              </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
