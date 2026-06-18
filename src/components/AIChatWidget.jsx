import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { chatWithConcierge } from "../lib/groq";

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello. I am the Foundry Concierge. How may I assist you with typography today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const chatHistory = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    const reply = await chatWithConcierge(chatHistory);
    
    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-50 transition-colors"
            style={{
              background: "#C9A355",
              color: "#0C0C0C",
              boxShadow: "0 10px 30px -10px rgba(201,163,85,0.6)"
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[340px] h-[500px] flex flex-col z-50 shadow-2xl overflow-hidden"
            style={{
              background: "#111",
              border: "1px solid rgba(201,163,85,0.2)",
              borderRadius: "16px",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]" style={{ background: "#0C0C0C" }}>
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: "#C9A355" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#F4EFE6", letterSpacing: "0.15em" }}>
                  Concierge
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#6B6560] hover:text-[#F4EFE6] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar" style={{ background: "#080808" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className="max-w-[85%] px-4 py-3 text-sm leading-relaxed"
                    style={{
                      borderRadius: "12px",
                      borderBottomRightRadius: msg.role === "user" ? "2px" : "12px",
                      borderBottomLeftRadius: msg.role === "assistant" ? "2px" : "12px",
                      background: msg.role === "user" ? "#C9A355" : "#1A1A1A",
                      color: msg.role === "user" ? "#0C0C0C" : "#D4CFC8",
                      border: msg.role === "assistant" ? "1px solid #222" : "none"
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-4 py-3 text-sm rounded-xl rounded-bl-sm" style={{ background: "#1A1A1A", border: "1px solid #222" }}>
                    <div className="flex gap-1">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-[#6B6560]" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#6B6560]" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#6B6560]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#222]" style={{ background: "#0C0C0C" }}>
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about fonts, pairings..."
                  className="w-full bg-[#1A1A1A] text-[#F4EFE6] text-sm px-4 py-3 pr-12 outline-none rounded-xl"
                  style={{ border: "1px solid #222" }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-1.5 text-[#C9A355] hover:text-[#E2C07A] disabled:opacity-50 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
