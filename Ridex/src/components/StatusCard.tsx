"use client";
import { motion } from "motion/react";
import React from "react";
import { Clock, CheckCircle, Loader2, Hourglass } from "lucide-react";

const StatusCard = ({ icon, title, desc, variant = "pending" }: any) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "approved":
        return {
          bg: "from-emerald-500/10 to-teal-500/10",
          border: "border-emerald-500/20",
          iconBg: "from-emerald-500 to-teal-500",
          iconColor: "text-white",
          titleColor: "text-white",
          descColor: "text-white/50",
        };
      case "rejected":
        return {
          bg: "from-red-500/10 to-rose-500/10",
          border: "border-red-500/20",
          iconBg: "from-red-500 to-rose-500",
          iconColor: "text-white",
          titleColor: "text-white",
          descColor: "text-white/50",
        };
      default:
        return {
          bg: "from-amber-400/10 to-orange-500/10",
          border: "border-amber-400/20",
          iconBg: "from-amber-400 to-orange-500",
          iconColor: "text-black",
          titleColor: "text-white",
          descColor: "text-white/50",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`mt-6 p-6 rounded-2xl bg-gradient-to-br ${styles.bg} border ${styles.border} backdrop-blur-sm`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl" />
          <div
            className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${styles.iconBg} flex items-center justify-center shadow-lg shadow-amber-500/20`}
          >
            {icon || <Clock size={22} className={styles.iconColor} />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`font-bold text-lg ${styles.titleColor}`}>
              {title}
            </h3>
            {variant === "pending" && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400">
                  In Progress
                </span>
              </div>
            )}
          </div>

          <p className={`text-sm ${styles.descColor} leading-relaxed`}>
            {desc || "Your documents are being reviewed by our admin team"}
          </p>

          {/* Progress indicator for pending state */}
          {variant === "pending" && (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "45%" }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Loader2 size={12} className="text-amber-400 animate-spin" />
                <span className="text-xs text-white/40">Processing</span>
              </div>
            </div>
          )}

          {/* Estimated time */}
          {variant === "pending" && (
            <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
              <Hourglass size={12} />
              <span>Estimated review time: 24-48 hours</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;
