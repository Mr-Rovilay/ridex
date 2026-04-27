"use client";
import {
  AlertTriangle,
  ArrowRight,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";

const RejectionCard = ({ title, reason, actionLabel, onAction }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 backdrop-blur-sm"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <AlertTriangle size={22} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-bold text-lg text-white">{title}</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
              Needs Attention
            </span>
          </div>

          <div className="mt-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <XCircle
                size={16}
                className="text-red-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm text-white/70 mb-1">Rejection Reason:</p>
                <p className="text-white font-medium">
                  {reason || "No reason provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-white/50">
            <AlertCircle size={14} />
            <p>
              Please review the feedback above and resubmit your application
            </p>
          </div>

          {onAction && (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAction}
              className="cursor-pointer mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-medium text-sm hover:shadow-lg hover:shadow-amber-400/25 transition-all"
            >
              <RefreshCw size={14} />
              {actionLabel || "Review & Resubmit"}
              <ArrowRight size={14} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RejectionCard;
