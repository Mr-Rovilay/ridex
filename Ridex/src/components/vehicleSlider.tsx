"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Bike,
  Bus,
  Car,
  Sparkles,
  Truck,
  Zap,
  Shield,
  Coffee,
  Wifi,
} from "lucide-react";
import { useState, useRef } from "react";

const VEHICLE_CATEGORIES = [
  {
    title: "Two Wheels",
    desc: "Zip through traffic, beat the clock",
    Icon: Bike,
    features: ["₹9/km", "Fastest delivery", "Eco-friendly"],
    price: "₹49",
    unit: "ride",
    gradient: "from-amber-500 to-orange-600",
    bgPattern:
      "radial-gradient(circle at 100% 0%, rgba(245,158,11,0.15) 0%, transparent 50%)",
  },
  {
    title: "Sedan",
    desc: "Your daily commute, now comfortable",
    Icon: Car,
    features: ["₹15/km", "AC guarantee", "5 seats"],
    price: "₹99",
    unit: "ride",
    gradient: "from-emerald-500 to-teal-600",
    bgPattern:
      "radial-gradient(circle at 0% 100%, rgba(16,185,129,0.15) 0%, transparent 50%)",
  },
  {
    title: "SUV",
    desc: "Space for everyone, style for every trip",
    Icon: Car,
    features: ["₹22/km", "Premium audio", "7 seats"],
    price: "₹199",
    unit: "ride",
    gradient: "from-violet-500 to-purple-600",
    bgPattern:
      "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 50%)",
  },
  {
    title: "Minivan",
    desc: "Family adventures start here",
    Icon: Bus,
    features: ["₹28/km", "Extra luggage", "6 seats"],
    price: "₹299",
    unit: "ride",
    gradient: "from-rose-500 to-pink-600",
    bgPattern:
      "radial-gradient(circle at 100% 100%, rgba(244,114,182,0.12) 0%, transparent 50%)",
  },
  {
    title: "Pickup",
    desc: "Heavy lifting? We've got you",
    Icon: Truck,
    features: ["₹35/km", "1 ton capacity", "Open bed"],
    price: "₹399",
    unit: "hour",
    gradient: "from-slate-500 to-gray-600",
    bgPattern:
      "radial-gradient(circle at 0% 50%, rgba(100,116,139,0.15) 0%, transparent 50%)",
  },
  {
    title: "Luxury",
    desc: "Arrive like you've already made it",
    Icon: Sparkles,
    features: ["₹45/km", "Chauffeur", "Premium interior"],
    price: "₹499",
    unit: "ride",
    gradient: "from-cyan-500 to-blue-600",
    bgPattern:
      "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.12) 0%, transparent 50%)",
  },
];

const VehicleSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    const card = document.getElementById(`vehicle-card-${index}`);
    card?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  return (
    <section className="py-24 bg-gradient-to-b from-zinc-900 to-black relative overflow-hidden">
      {/* Organic Background Texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header with personality */}
        <div className="text-center md:text-left md:flex md:items-end md:justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
              <Zap size={14} className="text-amber-400" />
              <span className="text-xs tracking-wide text-white/70 uppercase">
                Choose your weapon
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Ride your way
              </span>
              <br />
              <span className="text-white/40 text-4xl md:text-6xl mt-2 block">
                we've got options
              </span>
            </h2>
          </div>

          {/* Hand-drawn style badge */}
          <div className="hidden md:block relative mt-6 md:mt-0">
            <div className="relative inline-block">
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/50" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/50" />
              <div className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <p className="text-sm text-white/70">over 2,000+</p>
                <p className="text-lg font-semibold text-white">happy riders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal scrollable grid */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {VEHICLE_CATEGORIES.map((category, idx) => {
            const {
              title,
              desc,
              Icon,
              features,
              price,
              unit,
              gradient,
              bgPattern,
            } = category;
            const isActive = activeIndex === idx;
            const isHovered = hoveredCard === idx;

            return (
              <motion.div
                id={`vehicle-card-${idx}`}
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.08, type: "spring", damping: 20 }}
                onHoverStart={() => setHoveredCard(idx)}
                onHoverEnd={() => setHoveredCard(null)}
                className="snap-center min-w-[300px] md:min-w-[380px] relative"
              >
                <motion.div
                  animate={{
                    y: isHovered ? -8 : 0,
                    scale: isActive ? 1.02 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 group cursor-pointer"
                  style={{
                    backgroundImage: bgPattern,
                  }}
                >
                  {/* Animated gradient border */}
                  <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 rounded-3xl -z-10 blur-xl transition-opacity duration-500`}
                  />

                  {/* Top accent bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

                  <div className="p-7">
                    {/* Header with icon and price */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: isHovered ? [0, -5, 5, 0] : 0 }}
                          transition={{ duration: 0.5 }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
                        >
                          <Icon
                            className="w-8 h-8 text-white"
                            strokeWidth={1.5}
                          />
                        </motion.div>
                        {idx === 2 && (
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                              POPULAR
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <motion.p
                          animate={{ scale: isHovered ? 1.1 : 1 }}
                          className="text-3xl font-bold text-white"
                        >
                          {price}
                        </motion.p>
                        <p className="text-xs text-white/50">
                          starting from /{unit}
                        </p>
                      </div>
                    </div>

                    {/* Title and description */}
                    <div className="mb-5">
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                        {title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Features list - organic styling */}
                    <div className="space-y-2 mb-6">
                      {features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className={`w-1 h-1 rounded-full bg-gradient-to-r ${gradient}`}
                          />
                          <span className="text-white/50">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA button - unique styling */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Book now</span>
                      <motion.div
                        animate={{ x: isHovered ? 4 : 0 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </motion.button>
                  </div>

                  {/* Bottom decorative element */}
                  <div
                    className={`h-px w-full bg-gradient-to-r ${gradient} opacity-20`}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom scroll indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {VEHICLE_CATEGORIES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              aria-label={`Go to ${VEHICLE_CATEGORIES[idx].title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Bottom CTA with personality */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-white/5 to-transparent border border-white/10">
          <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-emerald-400" />
              <span className="text-sm text-white/70">24/7 support</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee size={18} className="text-amber-400" />
              <span className="text-sm text-white/70">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={18} className="text-blue-400" />
              <span className="text-sm text-white/70">
                Free WiFi in all cars
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-white text-black rounded-full font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2 group"
          >
            Compare all rides
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition"
            />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default VehicleSlider;
