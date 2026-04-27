"use client";

import axios from "axios";
import {
  ArrowLeft,
  Bike,
  Car,
  Truck,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const VEHICLES = [
  {
    id: "bike",
    label: "Two Wheeler",
    icon: Bike,
    desc: "Zip through traffic, deliver faster",
    tag: "Popular",
    color: "from-orange-500 to-red-500",
    features: ["₹500/day avg", "Low maintenance", "Great mileage"],
  },
  {
    id: "auto",
    label: "Three Wheeler",
    icon: Car,
    desc: "Best for city moves & small cargo",
    tag: "Efficient",
    color: "from-amber-500 to-yellow-500",
    features: ["₹800/day avg", "Perfect for last mile", "Easy parking"],
  },
  {
    id: "car",
    label: "Four Wheeler",
    icon: Car,
    desc: "Comfort for passengers, premium rides",
    tag: "Comfort",
    color: "from-emerald-500 to-teal-500",
    features: ["₹1500/day avg", "AC guarantee", "5 seats"],
  },
  {
    id: "van",
    label: "Mini Van",
    icon: Truck,
    desc: "Family trips & group getaways",
    tag: "Spacious",
    color: "from-purple-500 to-violet-500",
    features: ["₹2000/day avg", "7 seats", "Extra luggage"],
  },
  {
    id: "truck",
    label: "Heavy Duty",
    icon: Truck,
    desc: "Moving houses or shifting cargo",
    tag: "Power",
    color: "from-slate-500 to-zinc-500",
    features: ["₹3500/day avg", "1-5 ton capacity", "24/7 support"],
  },
];

const Page = () => {
  const router = useRouter();

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isValid = vehicleType && vehicleNumber && vehicleModel;

  const selectedVehicle = VEHICLES.find((v) => v.id === vehicleType);

  const handleVehicle = async () => {
    if (!isValid || loading) return;

    try {
      setLoading(true);

      // ✅ CLEAN INPUT BEFORE SEND
      const payload = {
        type: vehicleType,
        number: vehicleNumber.replace(/\s/g, "").toUpperCase(),
        vehicleModel,
      };

      const res = await axios.post("/api/partner/onboarding/vehicle", payload);

      if (res?.data?.vehicle) {
        toast.success("Vehicle saved successfully");
        router.push("/partner/onboarding/documents");
      }
    } catch (error: any) {
      console.log(error);

      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetVehicle = async () => {
      try {
        const { data } = await axios.get("/api/partner/onboarding/vehicle");

        if (data?.vehicle) {
          const { type, number, vehicleModel } = data.vehicle;
          setVehicleType(type);
          setVehicleNumber(number);
          setVehicleModel(vehicleModel);
        }
      } catch (error) {
        console.log("Error fetching vehicle:", error);
      }
    };

    handleGetVehicle();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white pb-24 relative overflow-hidden">
      {/* Organic background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8 relative z-10">
        {/* Header with personality */}
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
                STEP 1 OF 3
              </span>
              <div className="flex gap-1">
                <div className="w-12 h-0.5 bg-white rounded-full" />
                <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                <div className="w-4 h-0.5 bg-white/20 rounded-full" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter leading-tight">
              List your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                first vehicle
              </span>
            </h1>
            <p className="text-white/60 mt-3 text-lg">
              Tell us what you're putting on the road
            </p>
          </div>
        </div>

        {/* Vehicle Type Selection - Gallery style */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <label className="text-sm font-medium text-white/80">
              Choose your ride
            </label>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition"
            >
              <HelpCircle size={14} />
              <span>Why this matters</span>
            </button>
          </div>

          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-4 bg-amber-400/5 border border-amber-400/20 rounded-2xl text-sm text-white/60"
              >
                <AlertCircle size={16} className="inline mr-2 text-amber-400" />
                Different vehicles have different earning potential. Pick the
                one that matches your lifestyle.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VEHICLES.map((v, idx) => {
              const isActive = vehicleType === v.id;
              const Icon = v.icon;

              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setVehicleType(v.id)}
                  className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-white/15 to-white/5 border-white/30 shadow-xl"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  } border backdrop-blur-sm`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeVehicle"
                      className="absolute -top-px -right-px w-12 h-12"
                    >
                      <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? `bg-gradient-to-br ${v.color} shadow-lg`
                          : "bg-white/10"
                      }`}
                    >
                      <Icon
                        size={28}
                        className={isActive ? "text-white" : "text-white/70"}
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-xl tracking-tight">
                          {v.label}
                        </h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {v.tag}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mb-2">{v.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {v.features.map((feature, i) => (
                          <span key={i} className="text-[10px] text-white/40">
                            {i > 0 && "•"} {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar for active */}
                  {isActive && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${v.color} rounded-full`}
                      style={{ width: "100%" }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Details Form */}
        <AnimatePresence mode="wait">
          {vehicleType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Selected vehicle badge */}
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-sm text-white/60">
                  You're listing a{" "}
                  <span className="text-white font-medium">
                    {selectedVehicle?.label}
                  </span>
                </span>
              </div>

              {/* Vehicle Number */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Registration number
                </label>
                <div
                  className={`relative transition-all duration-300 ${
                    focusedField === "number" ? "scale-[1.01]" : ""
                  }`}
                >
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) =>
                      setVehicleNumber(e.target.value.toUpperCase())
                    }
                    onFocus={() => setFocusedField("number")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="MH 01 AB 1234"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all text-lg tracking-wider"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">
                    Plate number
                  </div>
                </div>
                <p className="text-xs text-white/40 mt-2">
                  We'll verify this with RTO records
                </p>
              </div>

              {/* Vehicle Model */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Make & Model
                </label>
                <div
                  className={`relative transition-all duration-300 ${
                    focusedField === "model" ? "scale-[1.01]" : ""
                  }`}
                >
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    onFocus={() => setFocusedField("model")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={
                      selectedVehicle?.id === "bike"
                        ? "e.g., Honda Activa 6G"
                        : "e.g., Toyota Innova Crysta"
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all"
                  />
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={isValid ? { scale: 1.02, y: -2 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
                onClick={handleVehicle}
                disabled={!isValid || loading}
                className={`mt-8 w-full py-4 cursor-pointer rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 group ${
                  isValid
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg hover:shadow-amber-400/25"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                {loading ? "Saving..." : "Continue"}
                {isValid && (
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      repeatDelay: 2,
                    }}
                  >
                    →
                  </motion.span>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust signals */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-xs text-white/30">
          <span className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            Your data is secure
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            Free listing
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            24/7 partner support
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;
