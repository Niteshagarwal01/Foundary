import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FontLibrary from "../components/FontLibrary";
import FontModal from "../components/FontModal";

export default function ExplorePage() {
  const [selectedFont, setSelectedFont] = useState(null);

  return (
    <div className="min-h-screen w-full bg-[#080808] text-[#F4EFE6] font-sans selection:bg-[#C9A355] selection:text-[#0C0C0C] relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-6 md:px-14 py-8 flex items-center justify-between relative z-50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-[#C9A355]/40 flex items-center justify-center transition-all duration-300 group-hover:border-[#C9A355] group-hover:shadow-[0_0_15px_rgba(201,163,85,0.2)] bg-[#C9A355]/5">
            <span className="font-display font-bold text-sm text-[#C9A355]">F</span>
          </div>
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#F4EFE6]">
            The Foundry
          </span>
        </Link>
        <Link 
          to="/" 
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B6560] hover:text-[#C9A355] transition-colors duration-300"
        >
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full pt-12">
        <div className="px-6 md:px-14 mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-[#F4EFE6]"
          >
            The <span style={{ fontStyle: "italic", color: "#C9A355" }}>Full</span> Archives
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl text-[#8A8580] leading-relaxed"
          >
            Explore our complete collection of curated typefaces. Use the search and filters to find the perfect font for your next masterpiece.
          </motion.p>
        </div>

        {/* The FontLibrary with previewMode false (meaning full infinite scroll) */}
        <FontLibrary onSelectFont={setSelectedFont} previewMode={false} />
      </main>

      {/* Modal */}
      <FontModal
        font={selectedFont}
        open={!!selectedFont}
        onClose={() => setSelectedFont(null)}
      />
    </div>
  );
}
