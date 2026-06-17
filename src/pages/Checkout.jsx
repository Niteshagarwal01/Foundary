import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [font, setFont] = useState(null);
  const [tier, setTier] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    company: "",
    country: "IN",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!location.state?.font || !location.state?.tier) {
      navigate("/explore");
    } else {
      setFont(location.state.font);
      setTier(location.state.tier);
    }
    if (!user) {
      navigate("/sign-in");
    }
  }, [location, navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompletePurchase = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");

    try {
      // 1. Create Order via Backend API
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: tier.amount * 100, // paise
          currency: "INR",
          receipt: `rcpt_${user.id.slice(0,8)}_${Date.now()}`
        })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use env var
        amount: orderData.amount,
        currency: orderData.currency,
        name: "The Foundry",
        description: `${tier.name} License for ${font.name}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment Signature via Backend API
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            // 4. Issue License
            const { error: dbError } = await supabase.from("licenses").insert({
              user_id: user.id,
              font_id: font.id,
              license_type: tier.type,
              seats: tier.seats,
              pageviews: tier.pageviews
            });

            if (dbError) throw dbError;

            // Success! Redirect to Dashboard
            navigate("/dashboard");

          } catch (err) {
            console.error("Verification error:", err);
            setErrorMsg("Payment succeeded but verification failed. Contact support.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
        },
        theme: {
          color: "#C9A355"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response){
        setIsProcessing(false);
        setErrorMsg(`Payment failed: ${response.error.description}`);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  if (!font || !tier) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4EFE6] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Link to="/explore" className="text-[#8A8078] hover:text-[#C9A355] text-xs uppercase tracking-widest font-bold mb-8 inline-flex items-center gap-2 transition-colors">
            &larr; Back to Library
          </Link>
          <h1 className="text-4xl md:text-5xl uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column - Billing Details */}
          <div className="flex-1">
            <h2 className="text-xl text-[#C9A355] mb-6 font-bold uppercase tracking-widest border-b border-white/10 pb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Billing Details</h2>
            
            {errorMsg && (
              <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-200 text-sm rounded-md">
                {errorMsg}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleCompletePurchase}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] text-[#8A8078] uppercase tracking-widest mb-2 font-bold">First Name *</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-sm focus:border-[#C9A355] focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8A8078] uppercase tracking-widest mb-2 font-bold">Last Name *</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-sm focus:border-[#C9A355] focus:outline-none transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] text-[#8A8078] uppercase tracking-widest mb-2 font-bold">Email Address *</label>
                <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-sm focus:border-[#C9A355] focus:outline-none transition-colors text-white/50" readOnly />
              </div>

              <div>
                <label className="block text-[10px] text-[#8A8078] uppercase tracking-widest mb-2 font-bold">Company / Studio (Optional)</label>
                <input name="company" value={formData.company} onChange={handleInputChange} type="text" className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-sm focus:border-[#C9A355] focus:outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] text-[#8A8078] uppercase tracking-widest mb-2 font-bold">Country *</label>
                <select required name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-sm focus:border-[#C9A355] focus:outline-none transition-colors appearance-none">
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="EU">European Union</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="pt-8">
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#C9A355] text-[#0C0C0C] font-bold py-5 text-xs uppercase tracking-[0.2em] hover:bg-[#E2C07A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(201,163,85,0.2)]"
                >
                  {isProcessing ? "INITIALIZING SECURE GATEWAY..." : "COMPLETE PURCHASE"}
                </button>
                <div className="flex justify-center items-center gap-2 mt-4 text-[#8A8078]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  <span className="text-[9px] uppercase tracking-widest font-bold">Encrypted & Secured by Razorpay</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-[#111] border border-white/5 p-8 sticky top-32">
              <h2 className="text-xl text-[#F4EFE6] mb-6 font-bold uppercase tracking-widest border-b border-white/10 pb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Order Summary</h2>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl mb-1 text-[#C9A355]" style={{ fontFamily: `'${font.family}', serif` }}>{font.name}</h3>
                  <p className="text-[10px] text-[#8A8078] uppercase tracking-widest font-bold">{tier.name} License</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl" style={{ fontFamily: "'Anton', sans-serif" }}>{tier.price}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8078]">Subtotal</span>
                  <span>{tier.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8078]">Tax (Calculated at checkout)</span>
                  <span>—</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                <span className="text-[#8A8078] uppercase tracking-widest text-[10px] font-bold">Total Due</span>
                <span className="text-4xl text-[#C9A355]" style={{ fontFamily: "'Anton', sans-serif" }}>{tier.price}</span>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[10px] text-[#6B6560] leading-relaxed uppercase tracking-wider">
                  By completing this purchase, you agree to our standard End User License Agreement (EULA) and Terms of Service.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
