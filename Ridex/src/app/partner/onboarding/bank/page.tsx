"use client";

import axios from "axios";
import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  Landmark,
  Phone,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Building2,
  Wallet,
  Lock,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { toast } from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    mobileNumber: "",
    upi: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<{
    bankName: string;
    branch: string;
  } | null>(null);
  const [isVerifyingIFSC, setIsVerifyingIFSC] = useState(false);

  const [loading, setLoading] = useState(false);

  // Validate IFSC and fetch bank info
  useEffect(() => {
    const validateIFSC = async () => {
      if (
        formData.ifsc.length === 11 &&
        /^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)
      ) {
        setIsVerifyingIFSC(true);
        // Simulate API call to verify IFSC
        setTimeout(() => {
          setBankInfo({
            bankName: "HDFC Bank Ltd",
            branch: "Andheri East, Mumbai",
          });
          setIsVerifyingIFSC(false);
          setErrors((prev) => ({ ...prev, ifsc: "" }));
        }, 500);
      } else if (formData.ifsc.length > 0) {
        setBankInfo(null);
        if (touched.ifsc && formData.ifsc.length > 0) {
          setErrors((prev) => ({ ...prev, ifsc: "Invalid IFSC code format" }));
        }
      } else {
        setBankInfo(null);
      }
    };
    validateIFSC();
  }, [formData.ifsc, touched.ifsc]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "accountHolder":
        if (value.length < 3) return "Name should be at least 3 characters";
        if (!/^[a-zA-Z\s\.]+$/.test(value))
          return "Only letters and spaces allowed";
        return "";
      case "accountNumber":
        if (value.length < 9 || value.length > 18)
          return "Account number should be 9-18 digits";
        if (!/^\d+$/.test(value)) return "Only numbers allowed";
        return "";
      case "ifsc":
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
          return "Invalid IFSC code format (e.g., HDFC0001234)";
        return "";
      case "mobileNumber":
        if (!/^\d{10}$/.test(value))
          return "Enter valid 10-digit mobile number";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "accountNumber") {
      processedValue = value.replace(/\D/g, "");
    }
    if (name === "ifsc") {
      processedValue = value.toUpperCase();
    }
    if (name === "mobileNumber") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({ ...formData, [name]: processedValue });

    if (touched[name]) {
      const error = validateField(name, processedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    return (
      formData.accountHolder.length >= 3 &&
      formData.accountNumber.length >= 9 &&
      /^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc) &&
      /^\d{10}$/.test(formData.mobileNumber)
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      setIsSubmitting(true);

      const promise = axios.post("/api/partner/onboarding/bank", formData);

      toast.promise(promise, {
        loading: "Saving bank details...",
        success: "Bank details saved successfully 🎉",
        error: (err) =>
          err?.response?.data?.message || "Failed to save bank details",
      });

      const { data } = await promise;

      setShowSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleGetBank = async () => {
      try {
        const { data } = await axios.get("/api/partner/onboarding/bank");

        if (data?.partnerBank) {
          setFormData({
            accountHolder: data.partnerBank.accountHolder || "",
            accountNumber: data.partnerBank.accountNumber || "",
            ifsc: data.partnerBank.ifsc || "",
            mobileNumber: data.mobileNumber || "",
            upi: data.partnerBank.upi || "",
          });
        }
      } catch (error) {
        console.log("Error fetching bank:", error);
      }
    };

    handleGetBank();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white pb-24 relative overflow-hidden">
      {/* Organic background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8 relative z-10">
        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-3xl border border-white/20 text-center max-w-md mx-4"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={40} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">All Set!</h3>
                <p className="text-white/60">
                  Your partner account has been created successfully
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="cursor-pointer p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 group mt-1"
          >
            <ArrowLeft
              size={22}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </motion.button>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-xs tracking-[3px] text-amber-400/80 font-medium bg-amber-400/10 px-3 py-1 rounded-full">
                FINAL STEP
              </span>
              <div className="flex gap-1">
                <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                <div className="w-12 h-0.5 bg-white rounded-full" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter leading-tight">
              Get paid
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                seamlessly
              </span>
            </h1>
            <p className="text-white/60 mt-3 text-lg">
              Set up your payout method to start earning
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Account Holder Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Account Holder Name
            </label>
            <div
              className={`relative transition-all duration-300 ${focusedField === "holder" ? "scale-[1.01]" : ""}`}
            >
              <div className="flex items-center bg-white/5 border rounded-xl px-5 py-4 transition-all focus-within:border-amber-400/50">
                <BadgeCheck
                  size={20}
                  className="text-white/40 mr-3 flex-shrink-0"
                />
                <input
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("holder")}
                  onBlur={() => {
                    setFocusedField(null);
                    handleBlur("accountHolder");
                  }}
                  placeholder="As per bank records"
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30"
                />
              </div>
            </div>
            <AnimatePresence>
              {touched.accountHolder && errors.accountHolder && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 mt-1 flex items-center gap-1"
                >
                  <AlertCircle size={10} />
                  {errors.accountHolder}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Bank Account Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Account Number
            </label>
            <div
              className={`relative transition-all duration-300 ${focusedField === "account" ? "scale-[1.01]" : ""}`}
            >
              <div className="flex items-center bg-white/5 border rounded-xl px-5 py-4 transition-all focus-within:border-amber-400/50">
                <CreditCard
                  size={20}
                  className="text-white/40 mr-3 flex-shrink-0"
                />
                <input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("account")}
                  onBlur={() => {
                    setFocusedField(null);
                    handleBlur("accountNumber");
                  }}
                  placeholder="Enter account number"
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 font-mono tracking-wide"
                />
              </div>
            </div>
            <AnimatePresence>
              {touched.accountNumber && errors.accountNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 mt-1 flex items-center gap-1"
                >
                  <AlertCircle size={10} />
                  {errors.accountNumber}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* IFSC Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-sm font-medium text-white/80 mb-2 block">
              IFSC Code
            </label>
            <div
              className={`relative transition-all duration-300 ${focusedField === "ifsc" ? "scale-[1.01]" : ""}`}
            >
              <div className="flex items-center bg-white/5 border rounded-xl px-5 py-4 transition-all focus-within:border-amber-400/50">
                <Landmark
                  size={20}
                  className="text-white/40 mr-3 flex-shrink-0"
                />
                <input
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("ifsc")}
                  onBlur={() => {
                    setFocusedField(null);
                    handleBlur("ifsc");
                  }}
                  placeholder="e.g., HDFC0001234"
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 font-mono uppercase tracking-wide"
                />
                {isVerifyingIFSC && (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-amber-400 rounded-full animate-spin" />
                )}
              </div>
            </div>

            {/* Bank info preview */}
            {bankInfo && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-emerald-400" />
                  <span className="text-sm text-emerald-400">
                    {bankInfo.bankName}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-1">{bankInfo.branch}</p>
              </motion.div>
            )}

            <AnimatePresence>
              {touched.ifsc && errors.ifsc && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 mt-1 flex items-center gap-1"
                >
                  <AlertCircle size={10} />
                  {errors.ifsc}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Mobile Number
            </label>
            <div
              className={`relative transition-all duration-300 ${focusedField === "mobile" ? "scale-[1.01]" : ""}`}
            >
              <div className="flex items-center bg-white/5 border rounded-xl px-5 py-4 transition-all focus-within:border-amber-400/50">
                <Phone size={20} className="text-white/40 mr-3 flex-shrink-0" />
                <span className="text-white/60 mr-2">+91</span>
                <input
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("mobileNumber")}
                  onBlur={() => {
                    setFocusedField(null);
                    handleBlur("mobileNumber");
                  }}
                  placeholder="9876543210"
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 font-mono"
                />
              </div>
            </div>
            <AnimatePresence>
              {touched.mobileNumber && errors.mobileNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 mt-1 flex items-center gap-1"
                >
                  <AlertCircle size={10} />
                  {errors.mobileNumber}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* UPI ID (Optional) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-sm font-medium text-white/80 mb-2 block">
              UPI ID <span className="text-white/30 text-xs">(Optional)</span>
            </label>
            <div className="flex items-center bg-white/5 border border-white/15 rounded-xl px-5 py-4 transition-all focus-within:border-amber-400/50">
              <Wallet size={20} className="text-white/40 mr-3 flex-shrink-0" />
              <input
                name="upi"
                value={formData.upi}
                onChange={handleChange}
                placeholder="yourname@okhdfcbank"
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30"
              />
            </div>
            <p className="text-xs text-white/30 mt-2">
              Faster payouts with UPI. You can add this later too.
            </p>
          </motion.div>
        </div>

        {/* Verification Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
              <Lock size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-sm">
                We verify before your first payout
              </p>
              <p className="text-sm text-white/50 mt-1">
                Bank details are verified within{" "}
                <span className="text-amber-400">24-48 hours</span>. You'll
                receive a confirmation once verified.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={
            isFormValid() && !isSubmitting ? { scale: 1.02, y: -2 } : {}
          }
          whileTap={isFormValid() && !isSubmitting ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={!isFormValid() || isSubmitting}
          className={`mt-8 w-full py-4 rounded-xl cursor-pointer font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 group ${
            isFormValid() && !isSubmitting
              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg hover:shadow-amber-400/25"
              : "bg-white/10 text-white/40 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>Setting up your account...</span>
            </>
          ) : (
            <>
              <span>Complete Partner Setup</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </motion.button>

        {/* Completion percentage */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Sparkles size={12} className="text-amber-400" />
            <span>
              {Object.values(formData).filter((v) => v && v.length > 0).length}{" "}
              of 5 fields completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
