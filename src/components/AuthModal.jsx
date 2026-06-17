import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      onClose(); // Success! Close modal.
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-md p-8 md:p-12 overflow-hidden"
        style={{
          background: "#080808",
          border: "1px solid rgba(201,163,85,0.15)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 0 40px rgba(201,163,85,0.03)",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #C9A355, transparent)", opacity: 0.5 }} />

        <h2 className="mb-2 text-center" style={{ fontFamily: "'Anton', sans-serif", fontSize: "2rem", color: "#F4EFE6", letterSpacing: "0.04em" }}>
          {isLogin ? "WELCOME BACK" : "JOIN THE FOUNDRY"}
        </h2>
        <p className="mb-8 text-center text-sm" style={{ fontFamily: "'Lora', serif", fontStyle: "italic", color: "#A09890" }}>
          {isLogin ? "Log in to access your saved typefaces." : "Create an account to save and sync your favorite fonts."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent px-4 py-3 outline-none transition-colors"
            style={{ border: "1px solid rgba(244,239,230,0.1)", color: "#F4EFE6", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent px-4 py-3 outline-none transition-colors"
            style={{ border: "1px solid rgba(244,239,230,0.1)", color: "#F4EFE6", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
          />

          {status === "error" && (
            <p style={{ color: "#e11d48", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", marginTop: "-4px" }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 mt-4 text-xs font-bold tracking-widest uppercase transition-all"
            style={{ background: status === "loading" ? "rgba(201,163,85,0.5)" : "#C9A355", color: "#0C0C0C", fontFamily: "'Inter', sans-serif" }}
          >
            {status === "loading" ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
            className="text-xs uppercase hover:text-[#C9A355] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em", color: "#6B6560" }}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
