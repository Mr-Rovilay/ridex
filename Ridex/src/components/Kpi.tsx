"use client";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";

const KPI_CONFIG: Record<
  string,
  {
    iconBg: string;
    iconColor: string;
    cardBg: string;
    borderColor: string;
    valueColor: string;
  }
> = {
  totalPartners: {
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    cardBg: "bg-white/5",
    borderColor: "border-blue-500/20",
    valueColor: "text-blue-400",
  },
  approved: {
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    cardBg: "bg-white/5",
    borderColor: "border-emerald-500/20",
    valueColor: "text-emerald-400",
  },
  pending: {
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    cardBg: "bg-white/5",
    borderColor: "border-amber-500/20",
    valueColor: "text-amber-400",
  },
  rejected: {
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    cardBg: "bg-white/5",
    borderColor: "border-red-500/20",
    valueColor: "text-red-400",
  },
};

const Kpi = ({ label, value, icon, variant, trend }: any) => {
  const cfg = KPI_CONFIG[variant] || KPI_CONFIG.totalPartners;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl ${cfg.cardBg} backdrop-blur-sm border ${cfg.borderColor} p-6 transition-all duration-300 group cursor-pointer`}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center`}
          >
            <div className={cfg.iconColor}>{icon}</div>
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
              <TrendingUp size={12} />
              <span>{trend}</span>
            </div>
          )}
        </div>

        <p className="text-white/50 text-sm font-medium mb-1">{label}</p>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`text-3xl font-bold ${cfg.valueColor}`}
        >
          {value}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Kpi;
