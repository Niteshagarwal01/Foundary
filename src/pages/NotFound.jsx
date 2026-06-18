import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,163,85,0.05)_0%,transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-4"
      >
        <h1 className="text-[8rem] md:text-[12rem] text-[#F4EFE6] font-display leading-none tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>
          4<span className="text-[#C9A355] italic" style={{ fontFamily: "'Kaushan Script', cursive" }}>0</span>4
        </h1>
        <p className="text-[#8A8580] text-xl md:text-2xl mt-4 font-display italic">
          This page does not exist in our archives.
        </p>
        
        <Link to="/">
          <motion.button 
            className="mt-12 px-8 py-4 bg-transparent border border-[#C9A355] text-[#C9A355] uppercase tracking-[0.2em] font-bold text-xs hover:bg-[#C9A355] hover:text-[#0C0C0C] transition-colors duration-300 shadow-[0_0_15px_rgba(201,163,85,0.2)] hover:shadow-[0_0_30px_rgba(201,163,85,0.4)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
