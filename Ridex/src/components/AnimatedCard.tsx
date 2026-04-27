"use client";
import { motion } from "motion/react";

const AnimatedCard = ({
  title,
  icon,
  children,
  gradient = "from-white/10 to-white/5",
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group"
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10 p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
            <div className="text-amber-400">{icon}</div>
          </div>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>

        <div className="space-y-3">{children}</div>
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
