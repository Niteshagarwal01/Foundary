import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FontLibrary from "../components/FontLibrary";
import FontModal from "../components/FontModal";
import SmoothScroll from "../components/SmoothScroll";
import Navbar from "../components/Navbar";
import PreviewBar from "../components/PreviewBar";
import { ThemeProvider } from "../context/ThemeContext";
import { PreviewProvider } from "../context/AppContext";

export default function ExplorePage() {
  const [selectedFont, setSelectedFont] = useState(null);

  return (
    <ThemeProvider>
      <PreviewProvider>
        <SmoothScroll>
          <div className="min-h-screen w-full bg-[#080808] text-[#F4EFE6] font-sans selection:bg-[#C9A355] selection:text-[#0C0C0C] relative overflow-hidden flex flex-col">
          
          <Navbar activeSection="library" />
          <PreviewBar />

          {/* Main Content */}
          <main className="flex-1 w-full pt-32">
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
        </SmoothScroll>
      </PreviewProvider>
    </ThemeProvider>
  );
}
