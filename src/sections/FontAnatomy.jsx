import { motion } from "framer-motion";

export default function FontAnatomy() {
  return (
    <section id="anatomy" className="relative py-16 px-8 md:px-16 overflow-hidden" style={{ background: "#F4EFE6" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(#0C0C0C05 1px, transparent 1px), linear-gradient(90deg, #0C0C0C05 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold uppercase tracking-widest block mb-4" style={{ color: "#C9A355", letterSpacing: "0.3em", fontFamily: "'Inter', sans-serif" }}>
            The Architecture
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 6vw, 5rem)", color: "#0C0C0C", lineHeight: 1 }}>
            Anatomy of Type
          </h2>
        </motion.div>

        <div className="relative w-full max-w-4xl" style={{ height: "400px" }}>
          {/* Guidelines */}
          <div className="absolute left-0 right-0 border-t border-dashed border-[#C9A355] opacity-50" style={{ top: "10%" }}>
            <span className="absolute -top-5 left-0 text-[10px] uppercase tracking-widest" style={{ color: "#C9A355" }}>Ascender Line</span>
          </div>
          <div className="absolute left-0 right-0 border-t border-dashed border-[#0C0C0C] opacity-20" style={{ top: "30%" }}>
            <span className="absolute -top-5 left-0 text-[10px] uppercase tracking-widest" style={{ color: "#0C0C0C" }}>Cap Height</span>
          </div>
          <div className="absolute left-0 right-0 border-t border-dashed border-[#0C0C0C] opacity-20" style={{ top: "50%" }}>
            <span className="absolute -top-5 left-0 text-[10px] uppercase tracking-widest" style={{ color: "#0C0C0C" }}>X-Height / Meanline</span>
          </div>
          <div className="absolute left-0 right-0 border-t border-solid border-[#C9A355]" style={{ top: "80%" }}>
            <span className="absolute mt-1 left-0 text-[10px] uppercase tracking-widest" style={{ color: "#C9A355" }}>Baseline</span>
          </div>
          <div className="absolute left-0 right-0 border-t border-dashed border-[#C9A355] opacity-50" style={{ top: "100%" }}>
            <span className="absolute mt-1 left-0 text-[10px] uppercase tracking-widest" style={{ color: "#C9A355" }}>Descender Line</span>
          </div>

          {/* Letters */}
          <div className="absolute inset-0 flex items-baseline justify-center gap-2 md:gap-8" style={{ paddingBottom: "20%" }}>
            {/* H */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(12rem, 20vw, 24rem)", lineHeight: 0.72, color: "#0C0C0C" }}>
                H
              </span>
              <div className="absolute w-2 h-2 bg-[#C9A355] rounded-full top-[10%] left-[20%]" />
              <span className="absolute top-[2%] left-[30%] text-[10px] uppercase tracking-widest" style={{ color: "#C9A355" }}>Serif</span>
            </motion.div>
            
            {/* x */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative">
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(12rem, 20vw, 24rem)", lineHeight: 0.72, color: "#0C0C0C" }}>
                x
              </span>
            </motion.div>
            
            {/* p */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative">
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(12rem, 20vw, 24rem)", lineHeight: 0.72, color: "#0C0C0C" }}>
                p
              </span>
              <div className="absolute w-2 h-2 bg-[#C9A355] rounded-full bottom-[-10%] left-[25%]" />
              <span className="absolute bottom-[-18%] left-[35%] text-[10px] uppercase tracking-widest" style={{ color: "#C9A355" }}>Descender</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
