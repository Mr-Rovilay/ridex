"use client";

import axios from "axios";
import { CircleDashed, Lock, Mail, User, X, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

type PropType = {
  open: boolean;
  onClose: () => void;
};

type StepType = "login" | "signup" | "otp";

const AuthModal = ({ open, onClose }: PropType) => {
  const [step, setStep] = useState<StepType>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setStep("login");
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setOtp(["", "", "", "", "", ""]);
    setShowPassword(false);
    onClose();
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Enter full 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/auth/verify-email", {
        email,
        otp: otpCode,
      });

      toast.success("Account created successfully 🎉");
      setStep("login");
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back 👋");
        handleClose();
        window.location.reload(); // Force reload to update session and avoid hydration issues
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google");
    handleClose();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-black">
              Ridex
            </h1>
            <p className="text-sm text-gray-500">Premium vehicle booking</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-black cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 py-3.5 rounded-2xl font-semibold text-sm transition cursor-pointer"
          >
            <Image src="/google.png" alt="Google" width={24} height={24} />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <AnimatePresence mode="wait">
            {/* ==================== LOGIN STEP ==================== */}
            {step === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-semibold mb-6">Welcome back</h2>
                {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>} */}

                <div className="space-y-4">
                  <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-3">
                    <Mail className="text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="flex-1 outline-none text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password Field with Eye Toggle */}
                  <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-3">
                    <Lock className="text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="flex-1 outline-none text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full h-12 bg-black text-white font-semibold rounded-2xl hover:bg-gray-900 transition flex items-center justify-center cursor-pointer"
                  >
                    {loading ? (
                      <CircleDashed className="animate-spin" size={20} />
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Don't have an account?{" "}
                  <span
                    onClick={() => {
                      setStep("signup");
                      setError("");
                      setPassword("");
                    }}
                    className="text-black font-medium cursor-pointer hover:underline"
                  >
                    Sign up
                  </span>
                </p>
              </motion.div>
            )}

            {/* ==================== SIGNUP STEP ==================== */}
            {step === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-semibold mb-6">Create Account</h2>
                {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>} */}

                <div className="space-y-4">
                  <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-3">
                    <User className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full name"
                      className="flex-1 outline-none text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-3">
                    <Mail className="text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="flex-1 outline-none text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password Field with Eye Toggle */}
                  <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-3">
                    <Lock className="text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="flex-1 outline-none text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full h-12 bg-black text-white font-semibold rounded-2xl hover:bg-gray-900 transition flex items-center justify-center cursor-pointer"
                  >
                    {loading ? (
                      <CircleDashed className="animate-spin" size={20} />
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setStep("login");
                      setError("");
                      setPassword("");
                    }}
                    className="text-black font-medium cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </p>
              </motion.div>
            )}

            {/* ==================== OTP STEP ==================== */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-semibold mb-2">
                  Verify your email
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  We sent a 6-digit code to {email}
                </p>

                {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>} */}

                <div className="flex justify-between gap-3 mb-8">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-2xl focus:border-black focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyEmail}
                  disabled={loading}
                  className="w-full h-12 bg-black text-white font-semibold rounded-2xl hover:bg-gray-900 transition flex items-center justify-center cursor-pointer"
                >
                  {loading ? (
                    <CircleDashed className="animate-spin" size={20} />
                  ) : (
                    "Verify & Create Account"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
