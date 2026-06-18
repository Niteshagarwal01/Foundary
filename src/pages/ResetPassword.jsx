import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/vault"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-sans flex flex-col justify-center items-center">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A355]/10 rounded-full filter blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0A0A0A] rounded-full filter blur-[150px] pointer-events-none transform -translate-x-1/4 translate-y-1/4" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-10 bg-gradient-to-b from-[#111] to-[#0A0A0A] border border-white/[0.04] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <h2 className="text-3xl uppercase tracking-normal mb-2 text-[#F4EFE6]" style={{ fontFamily: "'Anton', sans-serif" }}>Set New Password</h2>
        <p className="text-[#8A8078] text-sm mb-8" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>
          Please enter your new password below.
        </p>

        {success ? (
          <div className="bg-[#C9A355]/10 border border-[#C9A355]/30 rounded-lg p-4 text-center">
            <p className="text-[#C9A355] text-sm font-semibold tracking-wider uppercase mb-2">Password Updated</p>
            <p className="text-[#8A8078] text-xs">Redirecting to Vault...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6560] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>New Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F4EFE6] focus:border-[#C9A355] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#C9A355] text-[#0C0C0C] hover:bg-[#F0D48A] px-6 py-4 rounded-lg text-[11px] uppercase font-bold tracking-[0.2em] transition-all duration-300"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
