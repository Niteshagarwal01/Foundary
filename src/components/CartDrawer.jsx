import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/AppContext";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartFont } = useCart();

  if (!cartFont && cartOpen) return null;

  const tiers = [
    {
      name: "Desktop",
      price: "$29",
      desc: "For static images, logos, and physical products. Up to 3 devices.",
    },
    {
      name: "Web",
      price: "$49",
      desc: "For website embedding via @font-face. Up to 10k pageviews/mo.",
    },
    {
      name: "App / Broadcast",
      price: "$199",
      desc: "For embedding in mobile apps, games, or broadcasting.",
    }
  ];

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
            onClick={() => setCartOpen(false)}
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
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {tiers.map((tier, idx) => (
                <div key={idx} className="border border-white/10 p-5 hover:border-[#C9A355]/40 transition-colors group cursor-pointer relative overflow-hidden bg-white/[0.02]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[rgba(201,163,85,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <h3 className="text-[#F4EFE6] font-bold tracking-widest text-sm uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>{tier.name}</h3>
                    <span className="text-[#C9A355] font-serif italic text-xl">{tier.price}</span>
                  </div>
                  <p className="text-[#6B6560] text-xs leading-relaxed relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#C9A355]/20 bg-black">
              <button 
                className="w-full py-4 bg-[#C9A355] text-[#0C0C0C] font-bold text-xs uppercase tracking-widest hover:bg-[#F0D48A] transition-colors relative overflow-hidden group"
              >
                <span className="relative z-10">Proceed to Checkout →</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              <p className="text-center text-[10px] text-[#6B6560] mt-4 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                Checkout Integration Coming Soon
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
