"use client";

import {
  Bike,
  Bus,
  Car,
  Truck,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

const vehicles = [
  { Icon: Bike, label: "Moto", color: "from-orange-500 to-red-500", delay: 0 },
  {
    Icon: Car,
    label: "Sedan",
    color: "from-emerald-500 to-teal-500",
    delay: 0.1,
  },
  {
    Icon: Bus,
    label: "Van",
    color: "from-amber-500 to-yellow-500",
    delay: 0.2,
  },
  {
    Icon: Truck,
    label: "Hauler",
    color: "from-slate-500 to-gray-600",
    delay: 0.3,
  },
];

const HeroSection = ({ onAuthRequired }: { onAuthRequired?: () => void }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Animated gradient background instead of static image */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-500 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 text-center max-w-6xl mx-auto pt-20">
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span className="text-xs tracking-wide text-white/70 uppercase">
            Nigeria's most loved fleet
          </span>
          <div className="flex items-center gap-0.5 ml-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>
        </motion.div>

        {/* Main headline with character */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Get behind
            </span>
            <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                any wheel
              </span>
              {/* Hand-drawn underline */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                style={{ width: "calc(100% + 10px)" }}
              />
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            From quick errands to cross-country adventures —
            <span className="text-white font-medium"> we've got the keys</span>
          </p>
        </motion.div>

        {/* Quick stats - organic layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <MapPin size={16} className="text-amber-400" />
            <span className="text-sm text-white/80">50+ cities</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <Users size={16} className="text-emerald-400" />
            <span className="text-sm text-white/80">100k+ riders</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <Calendar size={16} className="text-blue-400" />
            <span className="text-sm text-white/80">Book 24/7</span>
          </div>
        </motion.div>

        {/* Vehicle Icons - handcrafted feel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-6 sm:gap-10 mb-14"
        >
          {vehicles.map(({ Icon, label, color, delay }, index) => (
            <motion.div
              key={label}
              custom={index}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.5 + delay,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="group relative cursor-pointer"
            >
              {/* Glow effect on hover */}
              <motion.div
                whileHover={{ opacity: 1 }}
                className={`absolute -inset-4 bg-gradient-to-r ${color} opacity-0 rounded-full blur-xl transition-opacity duration-300 group-hover:opacity-20`}
              />

              <div className="relative">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all backdrop-blur-sm`}
                >
                  <Icon
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-white/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section with personality */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAuthRequired}
            className="cursor-pointer group relative px-8 py-4 bg-white text-black font-semibold text-lg rounded-full shadow-xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Book Now
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
            <motion.div
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"
            />
          </motion.button>

          <div className="flex items-center gap-2 text-sm text-white/50">
            <div className="w-px h-6 bg-white/20 hidden sm:block" />
            <span>No deposit required</span>
            <span className="text-white/30">•</span>
            <span>Free cancellation</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/40 tracking-wider">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-5 border-l border-b border-white/30 rotate-45"
          />
        </motion.div>
      </div>

      {/* Subtle gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
};

export default HeroSection;
