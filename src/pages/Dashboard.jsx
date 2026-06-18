import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { FONTS } from "../data/fonts";
import FontModal from "../components/FontModal";

// ─── Reusable 3D Tilt Card ────────────────────────────────────────────────────
function TiltCard({ children, className = "", style = {}, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style
      }}
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#C9A355]/0 via-[#C9A355]/40 to-[#C9A355]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[inherit]" style={{ backgroundSize: "200% 100%", animation: "marquee2 3s linear infinite", zIndex: -1 }} />
      {children}
      {/* Glare effect */}
      <motion.div
        className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]"
        style={{
          background: "radial-gradient(circle at center, rgba(201,163,85,0.15) 0%, transparent 60%)",
          left: `calc(${glareX} - 50%)`,
          top: `calc(${glareY} - 50%)`,
          width: "200%",
          height: "200%",
        }}
      />
    </motion.div>
  );
}

// ─── Number CountUp ────────────────────────────────────────────────────────
function CountUp({ to, duration = 2 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (to === "∞") {
      setCount("∞");
      return;
    }
    const target = parseInt(to, 10);
    if (isNaN(target)) {
      setCount(to);
      return;
    }
    
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      const easePercentage = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(target * easePercentage));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [to, duration]);

  return <span>{count}</span>;
}

export default function Dashboard() {
  const { session, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFont, setSelectedFont] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [licenses, setLicenses] = useState([]);
  const [profile, setProfile] = useState(null);
  
  // Global mouse tracking for background spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 400);
      mouseY.set(e.clientY - 400);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!user) return;
    
    async function fetchData() {
      // Fetch Favorites
      const { data: favs } = await supabase
        .from("user_favorites")
        .select("font_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (favs) setFavorites(favs);
      
      // Fetch Profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (prof) setProfile(prof);
      
      // Fetch Licenses
      const { data: lics } = await supabase
        .from("licenses")
        .select("*")
        .eq("user_id", user.id)
        .order("purchased_at", { ascending: false });
      if (lics) setLicenses(lics);
      
      setLoadingFavorites(false);
    }
    
    fetchData();
  }, [user]);

  if (!session && !user) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A355] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || "Foundry Member";
  const avatarUrl = user?.user_metadata?.avatar_url || "";
  const initial = firstName.charAt(0).toUpperCase();

  const libraryFonts = favorites.map(fav => {
    const fontData = FONTS.find(f => f.id === fav.font_id);
    return {
      id: fav.font_id,
      name: fontData?.name || fav.font_id,
      family: fontData?.family || "Inter",
      type: fontData?.category ? fontData.category.charAt(0).toUpperCase() + fontData.category.slice(1) : "Sans",
      weights: `${fontData?.weights?.length || 1} Weights`,
      date: new Date(fav.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      _rawFont: fontData // Pass the full font data for FontModal
    };
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "library", label: "My Library" },
    { id: "licenses", label: "Licenses" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen w-full max-w-[100vw] bg-[#050505] text-[#F4EFE6] font-sans selection:bg-[#C9A355] selection:text-[#0C0C0C] relative overflow-hidden flex">
      {/* Interactive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="grain-overlay" style={{ zIndex: 1 }} />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            x: smoothX,
            y: smoothY,
            background: "radial-gradient(circle, rgba(201,163,85,0.8) 0%, transparent 60%)",
            filter: "blur(40px)",
            willChange: "transform"
          }}
        />
        <div
          className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] rounded-full opacity-[0.015]"
          style={{
            background: "radial-gradient(circle, #ffffff 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ── Sidebar ── */}
      <aside className="w-64 md:w-80 border-r border-white/[0.04] bg-[#0A0A0A]/40 backdrop-blur-2xl p-8 flex flex-col relative z-20 hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-16 group">
          <div className="w-8 h-8 border border-[#C9A355]/40 flex items-center justify-center transition-all duration-300 group-hover:border-[#C9A355] group-hover:shadow-[0_0_15px_rgba(201,163,85,0.2)] bg-[#C9A355]/5">
            <span className="font-display font-bold text-sm text-[#C9A355]">F</span>
          </div>
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#F4EFE6]">
            The Foundry
          </span>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-4 mb-12 group cursor-default">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-12 h-12 rounded-full border border-[#C9A355]/20 object-cover shadow-[0_0_15px_rgba(201,163,85,0.1)] group-hover:border-[#C9A355]/50 transition-colors duration-300" />
          ) : (
            <div className="w-12 h-12 rounded-full border border-[#C9A355]/20 flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] shadow-[0_0_15px_rgba(201,163,85,0.1)] group-hover:border-[#C9A355]/50 transition-colors duration-300">
              <span className="text-[#C9A355] font-display text-xl">{initial}</span>
            </div>
          )}
          <div className="overflow-hidden">
            <h3 className="font-display text-lg truncate text-[#F4EFE6] group-hover:text-[#C9A355] transition-colors duration-300">
              {firstName}
            </h3>
            <p className="text-[#6B6560] text-xs font-sans truncate tracking-wider">
              MEMBER
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative text-left px-4 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 overflow-hidden group"
              style={{
                color: activeTab === tab.id ? "#0C0C0C" : "#6B6560",
              }}
            >
              <div 
                className={`absolute inset-0 transition-transform duration-300 origin-left ${activeTab === tab.id ? "scale-x-100 bg-[#C9A355]" : "scale-x-0 bg-white/5 group-hover:scale-x-100"}`} 
                style={{ zIndex: -1 }}
              />
              <span className={`relative z-10 ${activeTab === tab.id ? "" : "group-hover:text-[#F4EFE6]"}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto pt-8 border-t border-white/[0.04] flex flex-col gap-4">
          <Link
            to="/"
            className="text-[#6B6560] hover:text-[#F4EFE6] transition-colors text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 border border-transparent group-hover:border-white/20 transition-all duration-300">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            Back to Home
          </Link>
          <button
            onClick={() => signOut(() => navigate("/"))}
            className="text-[#6B6560] hover:text-[#C9A355] transition-colors text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C9A355]/10 border border-transparent group-hover:border-[#C9A355]/30 transition-all duration-300">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 max-w-full relative z-10 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 px-6 border-b border-white/[0.04] bg-[#0A0A0A]/90 backdrop-blur-2xl z-40 sticky top-0">
          <Link to="/" className="flex items-center gap-3 group">
             <div className="w-8 h-8 border border-[#C9A355]/40 flex items-center justify-center bg-[#C9A355]/5 transition-colors group-hover:border-[#C9A355]">
              <span className="font-bold text-sm text-[#C9A355]" style={{ fontFamily: "'Anton', sans-serif" }}>F</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4EFE6]" style={{ fontFamily: "'Inter', sans-serif" }}>The Foundry</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="w-8 h-8 rounded-full border border-white/[0.04] hover:border-white/20 flex items-center justify-center bg-[#0C0C0C] text-[#6B6560] hover:text-[#F4EFE6] transition-colors"
              title="Back to Home"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </Link>
            <button
              onClick={() => signOut(() => navigate("/"))}
              className="w-8 h-8 rounded-full border border-white/[0.04] hover:border-[#C9A355]/40 flex items-center justify-center bg-[#0C0C0C] text-[#6B6560] hover:text-[#C9A355] transition-colors"
              title="Sign Out"
            >
              <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
            <div className="w-8 h-8 rounded-full border border-[#C9A355]/20 flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
              <span className="text-[#C9A355] text-xs" style={{ fontFamily: "'Anton', sans-serif" }}>{initial}</span>
            </div>
          </div>
        </header>

        {/* Mobile Tabs */}
        <div className="md:hidden flex w-full justify-between items-center px-1 border-b border-white/[0.04] bg-[#0A0A0A]/95 backdrop-blur-3xl z-30 sticky top-[65px] overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 whitespace-nowrap py-4 px-2 text-[9px] sm:text-[10px] text-center font-bold tracking-[0.1em] uppercase transition-colors relative ${activeTab === tab.id ? "text-[#C9A355]" : "text-[#6B6560]"}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="mobileTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A355]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-16 xl:p-20 relative perspective-[2000px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, rotateX: 10, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, rotateX: -10, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="max-w-6xl mx-auto origin-top"
            >
              {activeTab === "overview" && <OverviewTab firstName={firstName} libraryFonts={libraryFonts} licenses={licenses} />}
              {activeTab === "library" && <LibraryTab libraryFonts={libraryFonts} loading={loadingFavorites} onSelectFont={setSelectedFont} />}
              {activeTab === "licenses" && <LicensesTab licenses={licenses} />}
              {activeTab === "settings" && <SettingsTab user={user} profile={profile} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Vault Font Modal */}
      <FontModal
        font={selectedFont}
        open={!!selectedFont}
        onClose={() => setSelectedFont(null)}
      />
    </div>
  );
}

// ─── Sub-Components for Tabs ──────────────────────────────────────────────────

function OverviewTab({ firstName, libraryFonts, licenses }) {
  const recentFonts = libraryFonts.slice(0, 3);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  // ── Export Collection → downloads a .css file with @import + CSS vars ──
  const handleExport = () => {
    if (libraryFonts.length === 0) {
      setExportMsg("Your library is empty. Save some fonts first!");
      setTimeout(() => setExportMsg(""), 3000);
      return;
    }
    const families = libraryFonts.map(f => encodeURIComponent(f.family)).join("&family=");
    const importLine = `@import url('https://fonts.googleapis.com/css2?family=${families}&display=swap');\n\n`;
    const vars = libraryFonts.map(f => {
      const key = f.family.toLowerCase().replace(/\s+/g, "-");
      return `  --font-${key}: '${f.family}', serif;`;
    }).join("\n");
    const css = `${importLine}/* Foundry — Your Curated Font Collection */\n:root {\n${vars}\n}\n`;

    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "foundry-collection.css";
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg("✓ Collection exported!");
    setTimeout(() => setExportMsg(""), 3000);
  };

  // ── Manage Sync → re-fetches favorites from cloud ──
  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    await new Promise(r => setTimeout(r, 1200)); // small delay for feel
    window.dispatchEvent(new CustomEvent("foundry:sync-vault"));
    setSyncing(false);
    setSyncMsg("✓ Library synchronized!");
    setTimeout(() => setSyncMsg(""), 3000);
  };

  const recentOrders = licenses.slice(0, 3);

  return (
    <div>
      {/* Toast notifications */}
      <AnimatePresence>
        {(exportMsg || syncMsg) && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 right-6 z-50 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
            style={{ background: "#C9A355", color: "#0C0C0C", fontFamily: "'Inter', sans-serif", boxShadow: "0 0 30px rgba(201,163,85,0.4)" }}
          >
            {exportMsg || syncMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12 md:mb-24 pt-2 md:pt-4">
        <div className="relative inline-block">
          <h1
            className="text-[3.2rem] md:text-[6rem] xl:text-[8rem] uppercase tracking-normal leading-[0.9] text-[#F4EFE6] relative z-10"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            COMMAND
            <br />
            CENTER
          </h1>
          <div className="absolute -bottom-8 md:-bottom-12 right-2 md:-right-24 z-20 pointer-events-none">
            <span
              className="text-[2.5rem] md:text-[5rem] xl:text-[6.5rem] text-[#C9A355] -rotate-6 block transform origin-right drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Kaushan Script', cursive", fontStyle: "italic" }}
            >
              the vault
            </span>
          </div>
        </div>
        <p className="text-[#8A8078] text-base md:text-2xl mt-12 md:mt-16 max-w-xl leading-relaxed" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>
          Welcome back, {firstName}. Your curated collection of master-crafted typefaces.
        </p>
      </div>

      <motion.div
        initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16"
      >
        {[
          { label: "Total Assets", value: Object.keys(FONTS).length.toString(), desc: "Available in catalog" },
          { label: "Active Licenses", value: licenses.length.toString(), desc: "Commercial" },
          { label: "Saved Styles", value: libraryFonts.length.toString(), desc: "In your Library" },
        ].map((stat, i) => (
          <motion.div key={i} variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" } } }}>
            <TiltCard className="bg-gradient-to-b from-[#151515] to-[#0A0A0A] border border-white/[0.04] p-8 rounded-2xl flex flex-col justify-between h-48 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C9A355]/5 to-transparent opacity-50" />
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[#6B6560] text-[10px] uppercase tracking-[0.2em] font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.label}</span>
                <div className="w-2 h-2 rounded-full bg-[#C9A355] shadow-[0_0_15px_#C9A355] animate-pulse" />
              </div>
              <div className="relative z-10">
                <span className="text-[3.5rem] text-[#F4EFE6] block mb-1 leading-none" style={{ fontFamily: "'Anton', sans-serif" }}><CountUp to={stat.value} duration={2.5} /></span>
                <span className="text-[#8A8078] text-[9px] uppercase tracking-[0.25em]" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.desc}</span>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-[#0C0C0C] border border-white/[0.04] p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A355]/5 rounded-full filter blur-[80px]" />
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A355] mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>Recent Activity</h3>
          {recentFonts.length > 0 ? (
            <div className="space-y-6 relative z-10">
              {recentFonts.map((f, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-[#151515] border border-white/5 flex items-center justify-center text-[#C9A355] text-xl group-hover:scale-110 group-hover:bg-[#C9A355]/10 transition-all duration-300" style={{ fontFamily: `'${f.family}', serif` }}>
                      Aa
                    </div>
                    <div>
                      <h4 className="text-[#F4EFE6] text-xl" style={{ fontFamily: `'${f.family}', serif` }}>{f.name}</h4>
                      <p className="text-[#6B6560] text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>Saved to library</p>
                    </div>
                  </div>
                  <span className="text-[#4A4540] text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>{f.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B6560] text-xs uppercase tracking-widest relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>No recent activity.</p>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <motion.button
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            onClick={handleExport}
            className="flex-1 bg-gradient-to-br from-[#151515] to-[#0A0A0A] border border-[#C9A355]/20 hover:border-[#C9A355]/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#C9A355]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-full bg-[#C9A355]/10 flex items-center justify-center text-[#C9A355] group-hover:scale-110 group-hover:bg-[#C9A355] group-hover:text-[#0C0C0C] transition-all duration-300 relative z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <span className="text-[#F4EFE6] text-xs font-bold uppercase tracking-[0.2em] relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>Export Collection</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            onClick={handleSync}
            disabled={syncing}
            className="flex-1 bg-gradient-to-br from-[#151515] to-[#0A0A0A] border border-white/[0.04] hover:border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 relative z-10">
              <svg className={`w-5 h-5 ${syncing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-[#F4EFE6] text-xs font-bold uppercase tracking-[0.2em] relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
              {syncing ? "Syncing..." : "Manage Sync"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-[#0C0C0C] border border-white/[0.04] rounded-2xl p-8 relative overflow-hidden mt-8"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#C9A355]/3 rounded-full filter blur-[80px] pointer-events-none" />
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A355]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Recent Orders
          </h3>
          <span className="text-[10px] uppercase tracking-widest text-[#3A3A3A]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {licenses.length} total
          </span>
        </div>
        {recentOrders.length > 0 ? (
          <div className="space-y-4 relative z-10">
            {recentOrders.map((lic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-[#111] border border-white/[0.03] hover:border-[#C9A355]/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#C9A355]/10 flex items-center justify-center text-[#C9A355]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#F4EFE6] text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{lic.font_name}</p>
                    <p className="text-[#6B6560] text-[10px] uppercase tracking-widest mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {lic.license_type} License · {new Date(lic.purchase_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#C9A355] font-bold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    ₹{lic.price?.toLocaleString("en-IN")}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                    {lic.status || "Active"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-4 py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#151515] border border-white/5 flex items-center justify-center text-[#3A3A3A]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-[#6B6560] text-xs uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>No orders yet.</p>
            <p className="text-[#3A3A3A] text-xs" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>Purchase a font license to see it here.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}


function LibraryTab({ libraryFonts, loading, onSelectFont }) {
  const [toastMsg, setToastMsg] = useState("");

  const handleCopy = (fontFamily) => {
    navigator.clipboard.writeText(`font-family: '${fontFamily}', serif;`);
    setToastMsg(`Copied CSS for ${fontFamily}`);
    setTimeout(() => setToastMsg(""), 2000);
  };

  const handleDownload = (fontName) => {
    setToastMsg(`Packaging ${fontName}...`);
    setTimeout(() => setToastMsg("Download Complete!"), 2000);
    setTimeout(() => setToastMsg(""), 4000);
  };

  return (
    <div>
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed bottom-10 right-10 z-50 bg-[#C9A355] text-[#0C0C0C] px-6 py-3 rounded-full font-bold text-xs tracking-widest shadow-[0_10px_30px_rgba(201,163,85,0.4)]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
        <div className="relative inline-block w-full md:w-auto mt-2 md:mt-0">
          <h2 className="text-[3.2rem] md:text-[5rem] uppercase tracking-normal mb-2 md:mb-0 leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>MY LIBRARY</h2>
          <span 
            className="absolute -top-3 right-2 md:-top-6 md:-right-8 text-[2.2rem] md:text-3xl text-[#C9A355] -rotate-6 transform origin-right drop-shadow-xl z-10"
            style={{ fontFamily: "'Kaushan Script', cursive", fontStyle: "italic" }}
          >
            collection
          </span>
          <p className="text-[#8A8078] text-base md:text-xl mt-8 md:mt-4" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>Your curated collection of premium typefaces.</p>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 bg-[#C9A355]/10 border border-[#C9A355]/30 hover:bg-[#C9A355]/20 text-[#C9A355] px-6 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,163,85,0.2)]">
          Browse Catalog <span className="text-lg leading-none">&rarr;</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <div className="w-10 h-10 border-2 border-[#C9A355] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : libraryFonts.length === 0 ? (
        <div className="bg-gradient-to-b from-[#111]/80 to-[#0A0A0A]/80 border border-white/[0.04] rounded-3xl p-8 md:p-16 text-center flex flex-col items-center backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center mb-8 text-[#C9A355] border border-[#C9A355]/20 shadow-[0_0_30px_rgba(201,163,85,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#C9A355]/10 animate-pulse" />
            <svg className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-3xl md:text-4xl uppercase mb-4 text-[#F4EFE6] tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>Your Vault is empty</h3>
          <p className="text-[#8A8078] mb-10 text-lg md:text-xl max-w-md leading-relaxed" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>The master collection awaits. Heart any typeface to add it to your personal vault.</p>
          <Link to="/explore" className="inline-flex items-center justify-center px-10 py-4 bg-[#C9A355] text-[#0C0C0C] font-bold text-[11px] uppercase tracking-[0.25em] hover:bg-[#E2C07A] hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(201,163,85,0.5)] rounded-full transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
            Explore Foundry
          </Link>
        </div>
      ) : (
        <motion.div 
          initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {libraryFonts.map((font, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" } } }}>
              <TiltCard 
                onClick={() => onSelectFont(font._rawFont)}
                className="bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/[0.06] rounded-2xl p-8 flex flex-col justify-between h-72 overflow-hidden hover:border-[#C9A355]/30 relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] cursor-pointer"
              >
                
                {/* Subtle Floating Particles inside Card */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                   <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#C9A355] rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                   <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-[#C9A355] rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                </div>

                {/* Hover Reveal Marquee */}
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 overflow-hidden flex items-center justify-center pointer-events-none mix-blend-screen bg-black" style={{ fontFamily: `'${font.family}', serif` }}>
                  <div className="whitespace-nowrap text-[#C9A355] text-6xl tracking-widest" style={{ animation: "marquee 15s linear infinite" }}>
                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 1234567890 
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl md:text-4xl mb-2 text-[#F4EFE6]" style={{ fontFamily: `'${font.family}', serif` }}>{font.name}</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-white/5 rounded text-[9px] uppercase tracking-widest text-[#A09890]" style={{ fontFamily: "'Inter', sans-serif" }}>{font.type}</span>
                      <span className="px-2 py-1 bg-white/5 rounded text-[9px] uppercase tracking-widest text-[#A09890]" style={{ fontFamily: "'Inter', sans-serif" }}>{font.weights}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCopy(font.family); }}
                    className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-[#6B6560] hover:bg-[#C9A355] hover:text-[#0C0C0C] hover:border-[#C9A355] transition-all duration-300 shadow-lg"
                    title="Copy CSS"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
                
                <div className="relative z-10 mt-auto pt-6 border-t border-white/[0.05] flex justify-between items-center">
                  <span className="text-[#6B6560] text-[10px] uppercase tracking-widest font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>Saved {font.date}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDownload(font.name); }}
                    className="text-[#C9A355] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:text-[#E2C07A] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Download Package
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>

                {/* Huge watermark */}
                <div 
                  className="absolute -bottom-12 -right-4 text-white/[0.02] text-[12rem] group-hover:text-[#C9A355]/[0.05] transition-colors duration-500 pointer-events-none select-none leading-none"
                  style={{ fontFamily: `'${font.family}', serif` }}
                >
                  Aa
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function LicensesTab({ licenses }) {
  return (
    <div>
      <div className="mb-16">
        <div className="relative inline-block mb-4 md:mb-2 w-full md:w-auto mt-2 md:mt-0">
          <h2 className="text-[3.2rem] md:text-[5rem] uppercase tracking-normal leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>DIGITAL LICENSES</h2>
          <span 
            className="absolute -bottom-6 right-0 md:-top-6 md:-right-4 text-[2.5rem] md:text-3xl text-[#C9A355] -rotate-6 transform origin-right drop-shadow-xl"
            style={{ fontFamily: "'Kaushan Script', cursive", fontStyle: "italic" }}
          >
            agreements
          </span>
        </div>
        <p className="text-[#8A8078] text-base md:text-xl mt-8 md:mt-4" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>Legally binding certificates for your commercial typeface usage.</p>
      </div>

      {licenses.length === 0 ? (
        <div className="bg-gradient-to-b from-[#111]/80 to-[#0A0A0A]/80 border border-white/[0.04] rounded-3xl p-8 md:p-16 text-center flex flex-col items-center backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center mb-8 text-[#C9A355] border border-[#C9A355]/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h3 className="text-3xl uppercase mb-4 text-[#F4EFE6]" style={{ fontFamily: "'Anton', sans-serif" }}>No Active Licenses</h3>
          <p className="text-[#8A8078] mb-10 max-w-md" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>You haven't purchased any commercial licenses yet. Start exploring the catalog to find your perfect typeface.</p>
          <Link to="/explore" className="inline-flex px-8 py-3 bg-[#C9A355] text-[#0C0C0C] font-bold text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-[#E2C07A]">
            Explore Catalog
          </Link>
        </div>
      ) : (
        <motion.div 
          initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {licenses.map((lic, i) => {
            const fontDef = FONTS.find(f => f.id === lic.font_id);
            const fontName = fontDef ? fontDef.name : lic.font_id;
            
            return (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" } } }}>
                <TiltCard className="relative w-full aspect-[1/1.4] max-w-md mx-auto rounded-xl p-8 bg-gradient-to-br from-[#EFEBE4] to-[#D5CFC4] text-[#0A0A0A] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between border-4 border-[#C9A355]/40 group">
                  {/* Certificate Border */}
                  <div className="absolute inset-3 border-[3px] border-[#C9A355] opacity-50 pointer-events-none mix-blend-multiply" />
                  <div className="absolute inset-5 border border-[#0A0A0A] opacity-20 pointer-events-none" />
                  
                  {/* Holographic Watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none group-hover:opacity-10 transition-opacity duration-500 mix-blend-color-burn">
                    <svg viewBox="0 0 100 100" className="w-80 h-80 fill-[#C9A355]"><path d="M50 0L100 25V75L50 100L0 75V25L50 0Z"/></svg>
                  </div>

                  <div className="relative z-10 text-center pt-8">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-[#6B6560] mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>Official License</span>
                    <h3 className="text-[2.2rem] sm:text-[2.5rem] leading-none mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>{fontName}</h3>
                    <div className="w-16 h-[2px] bg-[#C9A355] mx-auto mb-6" />
                    <p className="text-[#4A4540] text-[11px] sm:text-sm px-4 leading-relaxed" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>
                      This certificate grants the bearer perpetual commercial rights for the specified typeface under the terms of The Foundry standard EULA.
                    </p>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 gap-4 border-t-2 border-b-2 border-[#0A0A0A]/10 py-6 my-6">
                    <div className="text-center">
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#6B6560] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Tier</span>
                      <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>{lic.license_type}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#6B6560] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Allowance</span>
                      <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>{lic.seats} / {lic.pageviews}</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between items-end pb-4">
                    <div>
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#6B6560] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Issued</span>
                      <span className="font-bold text-[9px] sm:text-[11px] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {new Date(lic.purchased_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-right truncate max-w-[120px]">
                      <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#6B6560] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Cert ID</span>
                      <span className="font-mono text-[9px] sm:text-[11px] font-bold text-[#A6802E] tracking-widest truncate block">
                        {lic.id.split('-')[0].toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button className="bg-[#C9A355] text-[#0C0C0C] px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#E2C07A] hover:scale-105 hover:shadow-[0_0_30px_rgba(201,163,85,0.5)] transition-all mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Download PDF
                    </button>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Embedded EULA */}
      <div className="mt-24 pt-16 border-t border-[#C9A355]/20">
        <h3 className="text-3xl text-[#F4EFE6] uppercase mb-8" style={{ fontFamily: "'Anton', sans-serif" }}>Standard End User License Agreement</h3>
        <div className="prose prose-invert prose-sm max-w-none text-[#8A8078]" style={{ fontFamily: "'Inter', sans-serif" }}>
          <p className="mb-4">By downloading, installing, or using any fonts provided by Foundry / Nitesh Agarwal, you confirm that you have read and accepted the terms of this End User License Agreement (EULA).</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong>Desktop License:</strong> Use on a specified number of desktop devices for creating static images, physical products, and print materials.</li>
            <li><strong>Web License:</strong> Use via @font-face on a specified domain, up to the monthly pageview limit purchased.</li>
            <li><strong>App License:</strong> Embedding the font into a mobile application or software product.</li>
          </ul>
          <p className="mb-4"><strong>Restrictions:</strong> You may not modify, reverse engineer, decompile, or create derivative works of the Software. You may not distribute, sell, or share the font files with third parties. You may not use the fonts to train AI or machine learning models without express permission.</p>
          <p className="mb-4"><strong>Intellectual Property:</strong> The Software and its accompanying documentation, including the design of the letterforms, are the exclusive property of Foundry and are protected by copyright and intellectual property laws.</p>
          <p className="text-xs italic mt-8 text-[#6B6560]">Last updated: October 2026. If you have any questions regarding your specific use case, please contact our licensing department.</p>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ user, profile }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(profile?.first_name || user?.user_metadata?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || user?.user_metadata?.last_name || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName }
    });

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      updated_at: new Date().toISOString()
    });

    setMsg(error ? `Error: ${error.message}` : "Profile updated successfully.");
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setPwLoading(true);
    setPwMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setPwMsg(`Error: ${error.message}`);
    } else {
      setPwMsg(`✓ Password reset link sent to ${user.email}`);
    }
    setPwLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setDeleting(true);
    // Delete user data from DB tables
    await supabase.from("user_favorites").delete().eq("user_id", user.id);
    await supabase.from("licenses").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);
    // Sign out (Supabase free tier doesn't allow client-side user deletion, so we sign out and clear data)
    await signOut(() => navigate("/"));
    setDeleting(false);
  };

  return (
    <div>
      <div className="mb-12 md:mb-16">
        <div className="relative inline-block mb-4 md:mb-2 w-full md:w-auto mt-2 md:mt-0">
          <h2 className="text-[3.2rem] md:text-[5rem] uppercase tracking-normal leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>ACCOUNT SETTINGS</h2>
          <span
            className="absolute -bottom-6 right-0 md:-top-6 md:-right-6 text-[2.5rem] md:text-3xl text-[#C9A355] -rotate-6 transform origin-right drop-shadow-xl"
            style={{ fontFamily: "'Kaushan Script', cursive", fontStyle: "italic" }}
          >
            identity
          </span>
        </div>
        <p className="text-[#8A8078] text-base md:text-xl mt-8 md:mt-4" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>Manage your identity and security preferences.</p>
      </div>

      <motion.div
        initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        {/* Profile Details */}
        <motion.div variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: "spring" } } }} className="bg-gradient-to-b from-[#111] to-[#0A0A0A] border border-white/[0.04] rounded-3xl p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A355]/5 rounded-full filter blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />

          <h3 className="text-2xl uppercase text-[#F4EFE6] mb-8 relative z-10 flex items-center gap-3 tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>
            <div className="w-3 h-3 rounded-full bg-[#C9A355] shadow-[0_0_10px_#C9A355]" />
            Personal Info
          </h3>

          <form onSubmit={handleUpdateProfile} className="relative z-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6560] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F4EFE6] focus:border-[#C9A355] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6560] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F4EFE6] focus:border-[#C9A355] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6560] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-[#111] border border-white/5 rounded-lg px-4 py-3 text-sm text-[#6B6560] cursor-not-allowed"
              />
              <span className="block mt-3 text-[10px] text-[#6B6560]" style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}>Email changes require support verification.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-transparent border border-[#C9A355] text-[#C9A355] hover:bg-[#C9A355] hover:text-[#0C0C0C] hover:shadow-[0_0_20px_rgba(201,163,85,0.4)] px-6 py-4 rounded-lg text-[11px] uppercase font-bold tracking-[0.2em] transition-all duration-300 w-full md:w-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
            {msg && <p className={`text-xs mt-4 ${msg.includes('Error') ? 'text-red-400' : 'text-[#C9A355]'}`}>{msg}</p>}
          </form>
        </motion.div>

        {/* Security & Danger Zone */}
        <div className="space-y-10">
          <motion.div variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { type: "spring" } } }} className="bg-gradient-to-b from-[#111] to-[#0A0A0A] border border-white/[0.04] rounded-3xl p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h3 className="text-2xl uppercase text-[#F4EFE6] mb-6 flex items-center gap-3 tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>
              <div className="w-3 h-3 rounded-full bg-white/20" />
              Security
            </h3>
            <p className="text-[#8A8078] text-sm mb-8 leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
              We highly recommend using OAuth (Google) for secure access. If you set a password, you can update it here.
            </p>
            <button
              onClick={handleResetPassword}
              disabled={pwLoading}
              className="bg-[#1A1A1A] border border-white/10 hover:border-[#C9A355]/40 hover:text-[#C9A355] text-[#F4EFE6] px-6 py-4 rounded-lg text-[11px] uppercase font-bold tracking-[0.2em] transition-all duration-300 disabled:opacity-50"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {pwLoading ? "Sending..." : "Reset Password"}
            </button>
            {pwMsg && <p className={`text-xs mt-4 ${pwMsg.includes('Error') ? 'text-red-400' : 'text-[#C9A355]'}`}>{pwMsg}</p>}
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring" } } }} className="bg-[#110505] border border-red-900/30 rounded-3xl p-10 relative overflow-hidden group hover:border-red-500/50 transition-colors duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full filter blur-3xl pointer-events-none group-hover:bg-red-600/10 transition-colors duration-500" />
            <h3 className="text-2xl uppercase text-red-500 mb-4 flex items-center gap-3 relative z-10 tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>
              Danger Zone
            </h3>
            <p className="text-[#8A8078] text-sm mb-8 leading-relaxed relative z-10" style={{ fontFamily: "'Lora', serif" }}>
              Permanently delete your account and revoke all commercial licenses. This action cannot be undone.
            </p>
            {deleteConfirm && (
              <p className="text-red-400 text-xs mb-4 relative z-10 font-bold uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                ⚠ Are you sure? Click again to permanently delete.
              </p>
            )}
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="relative z-10 bg-transparent border border-red-900 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] px-6 py-4 rounded-lg text-[11px] uppercase font-bold tracking-[0.2em] transition-all duration-300 disabled:opacity-50"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {deleting ? "Deleting..." : deleteConfirm ? "Confirm Delete" : "Delete Account"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
