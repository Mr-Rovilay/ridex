"use client";
import { motion } from "motion/react";

const TabButton = ({
  active,
  onClick,
  count,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`cursor-pointer relative flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-medium text-sm transition-all duration-300 ${
        active
          ? "text-white bg-white/10 border-b-2 border-amber-400"
          : "text-white/50 hover:text-white/80 hover:bg-white/5"
      }`}
    >
      <span className={`${active ? "text-amber-400" : "text-white/40"}`}>
        {icon}
      </span>
      <span className="hidden sm:inline">{children}</span>

      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`ml-1.5 inline-flex items-center justify-center min-w-5 px-1.5 py-0.5 text-xs font-bold rounded-full ${
            active ? "bg-amber-400 text-black" : "bg-white/20 text-white/80"
          }`}
        >
          {count}
        </motion.span>
      )}

      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-amber-400 to-orange-500"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

export default TabButton;
