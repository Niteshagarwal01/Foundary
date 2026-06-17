import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("library");

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A355] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is somehow null but route is protected, this shouldn't happen, but just in case
  if (!user) {
    navigate("/sign-in");
    return null;
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "library", label: "My Library" },
    { id: "licenses", label: "Licenses" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-[#F4EFE6] font-sans selection:bg-[#C9A355] selection:text-[#0C0C0C] relative overflow-hidden flex">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="grain-overlay" style={{ zIndex: 1 }} />
        <div
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #C9A355 0%, transparent 70%)",
            filter: "blur(120px)",
            transform: "translate(-30%, -30%)",
          }}
        />
      </div>

      {/* ── Sidebar ── */}
      <aside className="w-64 md:w-80 border-r border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-3xl p-8 flex flex-col relative z-20 hidden md:flex">
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
        <div className="flex items-center gap-4 mb-12">
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-12 h-12 rounded-full border border-white/10"
          />
          <div className="overflow-hidden">
            <h3 className="font-display text-lg truncate">
              {user.firstName || user.username || "Foundry Member"}
            </h3>
            <p className="text-[#6B6560] text-xs font-sans truncate">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative text-left px-4 py-3 text-sm font-semibold tracking-wider uppercase transition-colors"
              style={{
                color: activeTab === tab.id ? "#C9A355" : "#6B6560",
              }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C9A355] shadow-[0_0_10px_rgba(201,163,85,0.5)]"
                />
              )}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto pt-8 border-t border-white/[0.06]">
          <button
            onClick={() => signOut(() => navigate("/"))}
            className="text-[#6B6560] hover:text-[#e11d48] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 relative z-10 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl z-30 relative">
          <Link to="/" className="flex items-center gap-3">
             <div className="w-8 h-8 border border-[#C9A355]/40 flex items-center justify-center bg-[#C9A355]/5">
              <span className="font-display font-bold text-sm text-[#C9A355]">F</span>
            </div>
          </Link>
          <img src={user.imageUrl} className="w-8 h-8 rounded-full border border-white/10" alt="Profile" />
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-16 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              {activeTab === "overview" && <OverviewTab user={user} />}
              {activeTab === "library" && <LibraryTab />}
              {activeTab === "licenses" && <LicensesTab />}
              {activeTab === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-Components for Tabs ──────────────────────────────────────────────────

function OverviewTab({ user }) {
  return (
    <div>
      <h1 className="text-5xl font-display mb-2 uppercase tracking-tight">The Vault</h1>
      <p className="text-[#8A8078] font-serif italic mb-12 text-lg">
        Welcome back, {user.firstName || "designer"}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#111] border border-white/[0.05] p-6 rounded-xl flex flex-col justify-between h-40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A355]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <span className="text-[#6B6560] text-xs uppercase tracking-widest font-semibold relative z-10">Total Assets</span>
          <span className="text-4xl font-display text-[#C9A355] relative z-10">14</span>
        </div>
        <div className="bg-[#111] border border-white/[0.05] p-6 rounded-xl flex flex-col justify-between h-40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A355]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <span className="text-[#6B6560] text-xs uppercase tracking-widest font-semibold relative z-10">Active Licenses</span>
          <span className="text-4xl font-display text-[#C9A355] relative z-10">3</span>
        </div>
        <div className="bg-[#111] border border-white/[0.05] p-6 rounded-xl flex flex-col justify-between h-40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A355]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <span className="text-[#6B6560] text-xs uppercase tracking-widest font-semibold relative z-10">Saved Styles</span>
          <span className="text-4xl font-display text-[#C9A355] relative z-10">8</span>
        </div>
      </div>
    </div>
  );
}

function LibraryTab() {
  // Mock data for purchased/downloaded fonts
  const libraryFonts = [
    { name: "Foundry Display", type: "Serif", weights: "8 Weights", date: "Oct 12, 2025" },
    { name: "Grotesk Pro", type: "Sans", weights: "14 Weights", date: "Sep 04, 2025" },
    { name: "Editorial Italic", type: "Serif", weights: "1 Weight", date: "Aug 22, 2025" },
    { name: "Mono Code", type: "Monospace", weights: "4 Weights", date: "Jul 10, 2025" },
  ];

  return (
    <div>
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-display uppercase tracking-widest mb-2">My Library</h2>
          <p className="text-[#8A8078] font-serif italic">Your personal collection of master-crafted typefaces.</p>
        </div>
        <Link to="/" className="text-[#C9A355] text-xs uppercase tracking-widest font-semibold hover:underline underline-offset-4 hidden md:block">
          Browse Catalog &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {libraryFonts.map((font, i) => (
          <div key={i} className="group bg-[#0A0A0A] border border-white/[0.08] hover:border-[#C9A355]/40 transition-colors rounded-xl p-8 flex flex-col justify-between h-64 relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-display mb-1">{font.name}</h3>
                <p className="text-[#6B6560] text-xs uppercase tracking-widest">{font.type} · {font.weights}</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-[#C9A355] group-hover:bg-[#C9A355] group-hover:text-[#0C0C0C] transition-colors shadow-[0_0_15px_rgba(201,163,85,0.1)] group-hover:shadow-[0_0_20px_rgba(201,163,85,0.4)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
            
            <div className="relative z-10 mt-auto pt-6 border-t border-white/[0.05] flex justify-between items-center">
              <span className="text-[#4A4540] text-[10px] uppercase tracking-widest">Added {font.date}</span>
              <span className="text-[#C9A355] text-[10px] uppercase tracking-widest group-hover:underline underline-offset-4 cursor-pointer">Download Package</span>
            </div>

            {/* Huge watermark inside card */}
            <div className="absolute -bottom-8 -right-8 text-[#111] font-display text-9xl group-hover:text-[#151515] transition-colors pointer-events-none select-none">
              Aa
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LicensesTab() {
  return (
    <div>
      <h2 className="text-3xl font-display uppercase tracking-widest mb-2">Licenses</h2>
      <p className="text-[#8A8078] font-serif italic mb-12">Manage your active licensing agreements.</p>

      <div className="bg-[#0A0A0A] border border-white/[0.05] rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/[0.05] bg-[#111]">
                <th className="p-6 text-[#6B6560] text-[10px] uppercase tracking-[0.2em] font-semibold">Typeface</th>
                <th className="p-6 text-[#6B6560] text-[10px] uppercase tracking-[0.2em] font-semibold">License Type</th>
                <th className="p-6 text-[#6B6560] text-[10px] uppercase tracking-[0.2em] font-semibold">Seats / Pageviews</th>
                <th className="p-6 text-[#6B6560] text-[10px] uppercase tracking-[0.2em] font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { font: "Foundry Display", type: "Desktop + Web", metric: "5 Seats / 100k PV", status: "Active" },
                { font: "Grotesk Pro", type: "App License", metric: "1 Application", status: "Active" },
              ].map((lic, i) => (
                <tr key={i} className="border-b border-white/[0.02] hover:bg-[#111]/50 transition-colors">
                  <td className="p-6 font-display text-lg text-[#F4EFE6]">{lic.font}</td>
                  <td className="p-6 text-sm text-[#A09890]">{lic.type}</td>
                  <td className="p-6 text-sm text-[#6B6560]">{lic.metric}</td>
                  <td className="p-6 text-right">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A355]/10 border border-[#C9A355]/20 text-[#C9A355] text-[10px] font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A355] animate-pulse"></span>
                      {lic.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <h2 className="text-3xl font-display uppercase tracking-widest mb-2">Settings</h2>
      <p className="text-[#8A8078] font-serif italic mb-12">Manage your account and preferences.</p>

      <div className="max-w-2xl bg-[#0A0A0A] border border-white/[0.05] rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A355]/5 rounded-full filter blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        
        <p className="text-[#A09890] text-sm mb-8 leading-relaxed relative z-10">
          Your account security and identity management are securely handled by Clerk's infrastructure. Click below to manage your connected accounts, passwords, and active sessions.
        </p>
        
        <button className="relative z-10 flex items-center justify-center gap-3 bg-transparent border border-[#C9A355]/40 text-[#C9A355] px-8 py-4 text-xs uppercase font-bold tracking-[0.2em] hover:bg-[#C9A355]/10 hover:border-[#C9A355] transition-all duration-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Manage Account via Clerk
        </button>
      </div>
    </div>
  );
}
