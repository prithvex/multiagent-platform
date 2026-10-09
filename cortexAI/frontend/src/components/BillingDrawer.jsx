import { useState } from "react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import { varifiyPayment } from "../features/varifyPayment";
import {
  X,
  Zap,
  Check,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    amount: 0,
    credits: 50,
    validity: 30,
    description: "Ideal for trying out the multi-agent chat and canvas.",
    features: [
      "50 Swarm Agent Credits",
      "Interactive React Canvas Preview",
      "Standard Reasoning Node",
      "Community Support",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    amount: 999,
    credits: 100,
    validity: 30,
    description: "Great for light development and code generation.",
    features: [
      "100 Swarm Agent Credits",
      "Canvas Live Artifacts",
      "Code & Syntax Specialist Node",
      "Standard Web Search Agent",
      "30 Days Plan Validity",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    popular: true,
    amount: 1999,
    credits: 250,
    validity: 30,
    description: "Most popular for developers and technical creators.",
    features: [
      "250 Swarm Agent Credits",
      "Priority Agent Router",
      "PDF Vector RAG Document Indexing",
      "Vision & Image Specialist Node",
      "30 Days Plan Validity",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    amount: 4999,
    credits: 700,
    validity: 60,
    description: "High capacity for heavy multi-agent workflows.",
    features: [
      "700 High-Speed Credits",
      "LangGraph Autonomous Routing",
      "Full Vector Database Search",
      "Priority Queue Microservices",
      "60 Days Plan Validity",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    amount: 9999,
    credits: 1500,
    validity: 90,
    description: "Ultimate enterprise-grade power for teams.",
    features: [
      "1,500 Full Access Credits",
      "Unlimited Canvas Renders",
      "Dedicated Agent Swarm Nodes",
      "90 Days Extended Validity",
      "24/7 Dedicated Support",
    ],
  },
];

const BillingDrawer = ({ isOpen, onClose }) => {
  const { userData } = useSelector((state) => state.user);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const currentPlanId = userData?.plan || "free";

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSelectPlan = async (plan) => {
    if (plan.id === currentPlanId || plan.amount === 0) return;

    setLoadingPlan(plan.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // 1. Request Order ID from backend billing microservice
      const orderData = await createOrder(plan.id);

      if (!orderData || (!orderData.orderId && !orderData.id)) {
        throw new Error(
          typeof orderData === "string"
            ? orderData
            : "Failed to initialize payment gateway."
        );
      }

      const orderId = orderData.orderId || orderData.id;

      // 2. Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your network.");
      }

      // 3. Open Razorpay Checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_default",
        amount: plan.amount * 100,
        currency: "INR",
        name: "CortexAI Workspace",
        description: `Upgrade to ${plan.name} Tier (${plan.credits} Credits)`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await varifiyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setSuccessMessage(
              `Successfully upgraded to ${plan.name} plan! Credits added.`
            );
          } catch (verErr) {
            setErrorMessage(
              verErr?.response?.data?.message || "Payment verification failed on server."
            );
          }
        },
        prefill: {
          name: userData?.name || "Cortex User",
          email: userData?.email || "",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setErrorMessage(`Payment failed: ${resp.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error("Billing error:", err);
      setErrorMessage(
        err.message || "Failed to process payment. Please verify Razorpay config."
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] border border-[#2b2b2b] rounded-2xl shadow-2xl flex flex-col overflow-hidden select-none">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424] bg-[#1a1a1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="w-4 h-4 fill-indigo-400/20" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Subscription & Credits
              </h2>
              <p className="text-xs text-[#8e8e8e]">
                Scale your agent swarm orchestration and reasoning capacity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e8e8e] hover:text-white hover:bg-[#262626] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Scrollable Plans Grid */}
        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {/* User Credits Status Bar */}
          <div className="p-4 rounded-xl border border-[#262626] bg-[#1a1a1a] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#71717a] font-mono">
                Current Plan
              </span>
              <div className="text-sm font-semibold text-white capitalize mt-0.5">
                {currentPlanId} Plan
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-[#71717a] font-mono">
                  Available Credits
                </span>
                <div className="text-sm font-semibold text-indigo-400 mt-0.5">
                  {userData?.credits ?? 50} Credits
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlanId;
              const isLoading = loadingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    plan.popular
                      ? "bg-[#181818] border-indigo-500/50 shadow-lg shadow-indigo-500/5"
                      : "bg-[#171717] border-[#282828] hover:border-[#383838]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-semibold tracking-wide uppercase shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        {plan.name}
                      </h3>
                      <span className="text-[10px] font-mono text-[#8e8e8e]">
                        {plan.validity} Days
                      </span>
                    </div>

                    <p className="text-[11px] text-[#71717a] min-h-[32px] mb-3">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1 my-3 pb-3 border-b border-[#242424]">
                      <span className="text-2xl font-extrabold text-white">
                        ₹{plan.amount}
                      </span>
                      <span className="text-xs text-[#71717a]">/ cycle</span>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold mb-2">
                        {plan.credits} Reasoning Credits
                      </div>
                      <ul className="space-y-2 text-[11px] text-[#a1a1aa]">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrent || isLoading || plan.amount === 0}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                      isCurrent
                        ? "bg-[#242424] text-[#71717a] border border-[#2f2f2f] cursor-default"
                        : plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-white text-black hover:bg-[#e4e4e7]"
                    } disabled:opacity-50`}
                  >
                    {isLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    ) : isCurrent ? (
                      <span>Current Plan</span>
                    ) : (
                      <>
                        <span>Upgrade to {plan.name}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#242424] bg-[#171717] flex items-center justify-between text-[11px] text-[#71717a]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secured with 256-bit Razorpay Encryption</span>
          </div>
          <span>Cancel or switch tiers anytime</span>
        </div>
      </div>
    </div>
  );
};

export default BillingDrawer;
