import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { id: "hero",     label: "Home"    },
  { id: "showcase", label: "Explore" },
  { id: "compare",  label: "Compare" },
  { id: "playground", label: "Variable" },
  { id: "library",  label: "Library" },
  { id: "timeline", label: "Timeline" },
  { id: "brand-tryon", label: "Try On" },
  { id: "mood",     label: "Mood" },
  { id: "lookbook", label: "Lookbook" },
  { id: "anatomy",  label: "Anatomy" },
];

function getFavCount() {
  try {
    return JSON.parse(localStorage.getItem("foundry-favorites") || "[]").length;
  } catch {
    return 0;
  }
}

export default function Navbar({ activeSection }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [hoveredId,  setHoveredId]  = useState(null);
  const [favCount,   setFavCount]   = useState(() => getFavCount());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { session, user, signOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const isSignedIn = !!session;
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || "User";
  const initial = firstName.charAt(0).toUpperCase();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Handle click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Listen for favorites changes dispatched by FontLibrary
  useEffect(() => {
    const handler = (e) => setFavCount(e.detail.count);
    window.addEventListener("foundry:favorites-update", handler);
    return () => window.removeEventListener("foundry:favorites-update", handler);
  }, []);

  const location = useLocation();

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      setMobileMenuOpen(false);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="flex items-center justify-between px-8 py-4 transition-all duration-500 relative z-50"
        style={{
          borderBottom:   scrolled ? "1px solid rgba(201,163,85,0.15)" : "1px solid transparent",
          background:     scrolled ? "rgba(10,10,10,0.94)"             : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(1.6)"        : "none",
          boxShadow:      scrolled ? "0 4px 30px rgba(0,0,0,0.4)"      : "none",
        }}
      >
        {/* ── Logo ── */}
        <motion.button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.div
            className="w-7 h-7 border flex items-center justify-center"
            style={{ borderColor: "#C9A355" }}
            whileHover={{
              boxShadow: "0 0 14px rgba(201,163,85,0.5), inset 0 0 14px rgba(201,163,85,0.1)",
              borderColor: "#F0D48A",
            }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="font-display font-bold text-sm"
              style={{ color: "#C9A355", lineHeight: 1 }}
            >
              F
            </span>
          </motion.div>
          <span
            className="font-sans text-xs font-semibold uppercase transition-colors duration-300 group-hover:text-[#C9A355]"
            style={{ color: "#F4EFE6", letterSpacing: "0.25em" }}
          >
            Foundry
          </span>
        </motion.button>

        {/* ── Desktop Nav ── */}
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
          }}
          className="hidden xl:flex items-center gap-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {navItems.map((item) => {
            const isActive  = activeSection === item.id;
            const isHovered = hoveredId === item.id;
            const isLibrary = item.id === "library";

            return (
              <motion.button
                key={item.id}
                variants={{
                  hidden:  { opacity: 0, y: -12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative font-sans text-xs font-medium tracking-widest uppercase transition-all duration-300"
                style={{
                  color: isActive ? "#C9A355" : isHovered ? "#F4EFE6" : "#6B6560",
                  letterSpacing: "0.2em",
                  textShadow: isActive
                    ? "0 0 16px rgba(201,163,85,0.6)"
                    : isHovered
                    ? "0 0 10px rgba(244,239,230,0.3)"
                    : "none",
                  paddingBottom: "4px",
                }}
              >
                {/* Pulsing dot for active */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                    style={{ background: "#C9A355", boxShadow: "0 0 6px rgba(201,163,85,0.8)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}

                {item.label}

                {/* Favorites badge on Library */}
                {isLibrary && favCount > 0 && (
                  <AnimatePresence>
                    <motion.span
                      key="fav-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-16px",
                        background: "#C9A355",
                        color: "#0C0C0C",
                        borderRadius: "100px",
                        fontSize: "7px",
                        fontWeight: 800,
                        fontFamily: "'Inter', sans-serif",
                        minWidth: "15px",
                        height: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 4px",
                        letterSpacing: "0",
                        boxShadow: "0 0 8px rgba(201,163,85,0.6)",
                        lineHeight: 1,
                      }}
                    >
                      {favCount}
                    </motion.span>
                  </AnimatePresence>
                )}

                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px"
                  animate={{
                    width:      isActive ? "100%" : isHovered ? "60%" : "0%",
                    background: isActive ? "#C9A355" : "rgba(201,163,85,0.4)",
                    boxShadow:  isActive ? "0 0 6px rgba(201,163,85,0.6)" : "none",
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.button>
            );
          })}
        </motion.nav>

        {/* ── Right: tagline + CTA ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 md:gap-5"
        >

          {isSignedIn ? (
            <div className="hidden sm:flex items-center gap-4 relative" ref={dropdownRef}>
              <Link to="/vault">
                <motion.button
                  className="shimmer-border px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase"
                  style={{
                    background: "rgba(201,163,85,0.1)",
                    border: "1px solid #C9A355",
                    color: "#C9A355",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  whileHover={{
                    scale: 1.04,
                    background: "#C9A355",
                    color: "#0C0C0C",
                    boxShadow: "0 0 20px rgba(201,163,85,0.4)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  The Vault
                </motion.button>
              </Link>
              
              {/* Custom User Avatar/Dropdown trigger */}
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full border flex items-center justify-center transition-all bg-[#0A0A0A] hover:bg-[#1A1A1A]"
                style={{ borderColor: dropdownOpen ? "#C9A355" : "rgba(255,255,255,0.2)" }}
              >
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-[#F4EFE6] text-[10px] font-bold font-sans">{initial}</span>
                )}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-[#F4EFE6] text-sm font-medium truncate">{firstName}</p>
                      <p className="text-[#6B6560] text-xs truncate mt-0.5">{user?.email}</p>
                    </div>
                    <Link 
                      to="/vault" 
                      onClick={() => setDropdownOpen(false)}
                      className="px-4 py-2.5 text-xs text-[#A09890] hover:text-[#C9A355] hover:bg-white/5 transition-colors flex items-center gap-2 uppercase tracking-widest font-semibold"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center gap-2 uppercase tracking-widest font-semibold text-left border-t border-white/5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ) : (
            <Link to="/sign-up">
              <motion.button
                className="hidden sm:block shimmer-border px-5 py-2 text-xs font-semibold tracking-widest uppercase"
                style={{
                  border: "1px solid #C9A355",
                  color: "#C9A355",
                  letterSpacing: "0.18em",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.3s ease",
                }}
                whileHover={{
                  scale: 1.04,
                  background: "#C9A355",
                  color: "#0C0C0C",
                  boxShadow: "0 0 20px rgba(201,163,85,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                Try Free
              </motion.button>
            </Link>
          )}

          <button
            className="xl:hidden flex items-center justify-center p-2 text-[#C9A355] relative z-[110]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </motion.div>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#0C0C0C]/95 pt-20 px-8 pb-32 xl:hidden overflow-y-auto"
          >
            <div className="flex-1 flex flex-col mt-4 max-w-sm mx-auto w-full">
              {navItems.map((item, i) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => scrollTo(item.id)}
                    className="text-left py-4 flex items-center justify-between group relative overflow-hidden"
                    style={{ borderBottom: "1px solid rgba(201,163,85,0.15)" }}
                  >
                    <span
                      className="font-display text-3xl transition-colors duration-300 relative z-10"
                      style={{ 
                        color: isActive ? "#C9A355" : "#F4EFE6",
                        fontStyle: isActive ? "italic" : "normal",
                      }}
                    >
                      {item.label}
                    </span>
                    <motion.svg 
                      className="transition-transform duration-500 group-hover:translate-x-2 relative z-10"
                      style={{ opacity: isActive ? 1 : 0.4, color: "#C9A355" }}
                      width="20" height="20" viewBox="0 0 24 24" fill="none"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                    
                    {/* Hover gold shimmer fill */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(201,163,85,0.1)] to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </motion.button>
                );
              })}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-12 pt-8 text-center flex flex-col items-center gap-6 w-full max-w-sm mx-auto"
              style={{ borderTop: "1px solid rgba(201,163,85,0.15)" }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border border-[#C9A355] flex items-center justify-center mb-2">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "#C9A355" }}>F</span>
                </div>
                <span className="font-display italic text-[#C9A355] text-xl">code that works. design that sells.</span>
              </div>

              {isSignedIn ? (
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-center justify-between bg-[#C9A355]/5 px-6 py-4 border border-[#C9A355]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-[#C9A355] flex items-center justify-center bg-[#0A0A0A]">
                        {user?.user_metadata?.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-[#F4EFE6] text-[10px] font-bold font-sans">{initial}</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#F4EFE6]">{firstName}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/vault");
                    }} 
                    className="w-full flex items-center justify-center gap-3 bg-[#C9A355] hover:bg-[#F0D48A] text-[#080808] transition-colors py-4 text-xs font-bold tracking-widest uppercase"
                  >
                    The Vault
                  </button>

                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 bg-transparent border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 transition-colors py-4 text-xs font-bold tracking-widest uppercase">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/sign-in");
                  }} 
                  className="w-full flex items-center justify-center gap-3 bg-[#C9A355] hover:bg-[#F0D48A] text-[#080808] transition-colors py-4 text-xs font-bold tracking-widest uppercase"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Sign In
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
