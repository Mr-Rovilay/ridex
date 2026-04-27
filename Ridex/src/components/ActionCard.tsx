"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  button: string;
  onclick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "info";
  badge?: string;
  disabled?: boolean;
  loading?: boolean;
}

const variantStyles = {
  primary: {
    gradient: "from-amber-400 to-orange-500",
    border: "border-amber-400/20",
    bgHover: "hover:bg-amber-400/5",
    iconBg: "bg-gradient-to-br from-amber-400/20 to-orange-500/20",
    buttonBg: "bg-gradient-to-r from-amber-400 to-orange-500",
    buttonText: "text-black",
    glow: "shadow-amber-400/25",
  },
  secondary: {
    gradient: "from-blue-400 to-cyan-500",
    border: "border-blue-400/20",
    bgHover: "hover:bg-blue-400/5",
    iconBg: "bg-gradient-to-br from-blue-400/20 to-cyan-500/20",
    buttonBg: "bg-gradient-to-r from-blue-400 to-cyan-500",
    buttonText: "text-white",
    glow: "shadow-blue-400/25",
  },
  success: {
    gradient: "from-emerald-400 to-teal-500",
    border: "border-emerald-400/20",
    bgHover: "hover:bg-emerald-400/5",
    iconBg: "bg-gradient-to-br from-emerald-400/20 to-teal-500/20",
    buttonBg: "bg-gradient-to-r from-emerald-400 to-teal-500",
    buttonText: "text-white",
    glow: "shadow-emerald-400/25",
  },
  warning: {
    gradient: "from-rose-400 to-pink-500",
    border: "border-rose-400/20",
    bgHover: "hover:bg-rose-400/5",
    iconBg: "bg-gradient-to-br from-rose-400/20 to-pink-500/20",
    buttonBg: "bg-gradient-to-r from-rose-400 to-pink-500",
    buttonText: "text-white",
    glow: "shadow-rose-400/25",
  },
  info: {
    gradient: "from-purple-400 to-violet-500",
    border: "border-purple-400/20",
    bgHover: "hover:bg-purple-400/5",
    iconBg: "bg-gradient-to-br from-purple-400/20 to-violet-500/20",
    buttonBg: "bg-gradient-to-r from-purple-400 to-violet-500",
    buttonText: "text-white",
    glow: "shadow-purple-400/25",
  },
};

const ActionCard = ({
  icon,
  title,
  description,
  button,
  onclick,
  variant = "primary",
  badge,
  disabled = false,
  loading = false,
}: ActionCardProps) => {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative group rounded-2xl bg-white/5 backdrop-blur-sm border ${styles.border} p-6 transition-all duration-300 ${styles.bgHover} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={disabled ? undefined : onclick}
    >
      {/* Animated gradient border on hover */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${styles.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`}
      />

      {/* Decorative sparkle */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles size={16} className="text-amber-400" />
      </div>

      <div className="relative z-10">
        {/* Icon Section */}
        <div
          className={`w-14 h-14 rounded-xl ${styles.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>

        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 border border-white/10 mb-3">
            <span className="text-[10px] text-white/60 uppercase tracking-wider">
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className={`text-xl font-bold text-white mb-2 tracking-tight ${disabled ? "text-white/40" : ""}`}
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p
            className={`text-sm ${disabled ? "text-white/30" : "text-white/50"} mb-5 leading-relaxed`}
          >
            {description}
          </p>
        )}

        {/* Button */}
        <motion.button
          whileHover={!disabled && !loading ? { scale: 1.02, x: 4 } : {}}
          whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
          disabled={disabled || loading}
          onClick={(e) => {
            e.stopPropagation();
            onclick?.();
          }}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            disabled || loading
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : `cursor-pointer ${styles.buttonBg} ${styles.buttonText} shadow-lg hover:shadow-xl ${styles.glow}`
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{button}</span>
              <ArrowRight
                size={14}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ActionCard;
