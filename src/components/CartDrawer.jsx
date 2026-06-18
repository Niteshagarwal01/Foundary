import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const TIERS = [
  {
    name: "Desktop",
    price: "₹299",
    amount: 299,
    desc: "Static images, logos. Up to 3 devices.",
    type: "Desktop",
    seats: "3",
    pageviews: "N/A"
  },
  {
    name: "Web",
    price: "₹499",
    amount: 499,
    desc: "Website embedding. Up to 10k pageviews/mo.",
    type: "Web",
    seats: "1",
    pageviews: "10k/mo"
  },
  {
    name: "App / Broadcast",
    price: "₹1,499",
    amount: 1499,
    desc: "Mobile apps, games, or broadcasting.",
    type: "App",
    seats: "Unlimited",
    pageviews: "Unlimited"
  }
];

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, removeFromCart, updateCartItemTier } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0 && cartOpen) {
    return (
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="fixed inset-0 z-[100] bg-black/40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0C0C0C] z-[110] border-l border-[#C9A355]/20 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-[#C9A355]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.2em] text-[#C9A355] uppercase font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Your Cart
                  </span>
                  <h2 className="text-3xl text-[#F4EFE6] mt-2" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}>
                    Empty
                  </h2>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center p-6">
                <span className="text-[#6B6560] text-sm uppercase tracking-widest font-bold">No fonts in cart.</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (!cartOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + TIERS[item.tierIndex].amount, 0);

  const handleCheckout = async () => {
    if (!user) {
      setCartOpen(false);
      navigate("/sign-in");
      return;
    }
    setCartOpen(false);
    navigate("/checkout", { state: { cartItems } });
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={() => !isProcessing && setCartOpen(false)}
          />

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
                  Your Cart
                </span>
                <h2 className="text-3xl text-[#F4EFE6] mt-2" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}>
                  {cartItems.length} {cartItems.length === 1 ? "Font" : "Fonts"}
                </h2>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                disabled={isProcessing}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.map((item, idx) => {
                const tier = TIERS[item.tierIndex];
                return (
                  <div key={item.font.id} className="border border-white/10 bg-white/[0.02] p-5 rounded-sm relative group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl text-[#C9A355]" style={{ fontFamily: `'${item.font.family}', serif` }}>
                        {item.font.name}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.font.id)}
                        className="text-[#6B6560] hover:text-[#C9A355] transition-colors text-xs"
                        title="Remove from cart"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#6B6560] font-bold">License Tier</label>
                      <select 
                        value={item.tierIndex}
                        onChange={(e) => updateCartItemTier(item.font.id, parseInt(e.target.value))}
                        className="bg-black border border-white/20 text-[#F4EFE6] p-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#C9A355] transition-colors"
                      >
                        {TIERS.map((t, i) => (
                          <option key={i} value={i}>{t.name} — {t.price}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[#8A857E] mt-1 leading-relaxed">
                        {tier.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#C9A355]/20 bg-black">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase tracking-widest text-[#6B6560] font-bold">Total Due</span>
                <span className="text-2xl text-[#C9A355] font-serif italic">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-[#C9A355] text-[#0C0C0C] font-bold py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-[#E2C07A] transition-colors flex justify-center items-center gap-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {isProcessing ? "PROCESSING..." : "PROCEED TO CHECKOUT \u2192"}
              </button>
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
