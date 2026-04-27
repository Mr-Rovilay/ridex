"use client";

import axios from "axios";
import {
  ArrowRight,
  CheckCircle2,
  User,
  Clock,
  Video,
  Truck,
  Eye,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ContentList = ({ data, type, loading }: any) => {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const handleStartVideoKyc = async (id: string) => {
    try {
      const result = await axios.get(`/api/admin/video-kyc/start/${id}`);
      const roomId = result.data.roomId;

      if (roomId) {
        router.push(`/video-kyc/${roomId}`);
      } else {
        console.error("No roomId returned from server");
      }
    } catch (error) {
      console.error("Failed to start KYC:", error);
    }
  };

  // =====================
  // LOADING STATE
  // =====================
  if (loading) {
    return (
      <div className="rounded-2xl py-16 text-center">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-amber-400 rounded-full animate-spin" />
        </div>
        <p className="text-white/40 mt-4">Loading...</p>
      </div>
    );
  }

  // =====================
  // EMPTY STATE
  // =====================
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl py-16 text-center border border-dashed border-white/10 bg-white/5 backdrop-blur-sm"
      >
        <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-400" />
        </div>
        <p className="text-white font-medium">All caught up! ✨</p>
        <p className="text-white/40 text-sm mt-1">
          No pending {type} items right now
        </p>
      </motion.div>
    );
  }

  // =====================
  // TYPE CONFIG
  // =====================
  const getTypeConfig = () => {
    switch (type) {
      case "partner":
        return {
          title: "Partner Review Queue",
          icon: <Users size={20} className="text-amber-400" />,
          border: "border-amber-400/20",
        };
      case "kyc":
        return {
          title: "Pending Video KYC",
          icon: <Video size={20} className="text-blue-400" />,
          border: "border-blue-400/20",
        };
      case "vehicle":
        return {
          title: "Vehicle Review Queue",
          icon: <Truck size={20} className="text-purple-400" />,
          border: "border-purple-400/20",
        };
      default:
        return {
          title: "Review Queue",
          icon: <Eye size={20} className="text-white" />,
          border: "border-white/10",
        };
    }
  };

  const config = getTypeConfig();

  // =====================
  // NAVIGATION HANDLER
  // =====================
  const handleReview = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();

    if (type === "partner") {
      router.push(`/admin/reviews/partner/${item.id}`);
    } else if (type === "vehicle") {
      router.push(`/admin/reviews/vehicle/${item._id}`);
    } else if (type === "kyc") {
      router.push(`/admin/reviews/kyc/${item.id}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5">{config.icon}</div>
          <div>
            <p className="text-white font-semibold">{config.title}</p>
            <p className="text-white/40 text-sm">{data.length} pending items</p>
          </div>
        </div>
      </div>

      {/* LIST */}
      <AnimatePresence>
        {data.map((item: any, index: number) => {
          const itemKey = item.id || index;
          const name =
            item.name || item.partnerName || item.owner.name || "Unknown";
          const email = item.email || item.partnerEmail || item.owner.email;
          const isExpanded = expandedId === itemKey;

          return (
            <motion.div
              key={itemKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className={`rounded-2xl bg-white/5 backdrop-blur-sm border ${config.border} p-5 transition-all duration-300 cursor-pointer`}
              onClick={() => setExpandedId(isExpanded ? null : itemKey)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* AVATAR */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center shrink-0 text-white">
                    {name ? (
                      name.charAt(0).toUpperCase()
                    ) : (
                      <User size={20} className="text-white/60" />
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-white">{name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400">
                        Pending Review
                      </span>
                    </div>

                    <div className="space-y-1">
                      {email && (
                        <p className="text-sm text-white/40 flex items-center gap-2">
                          <Mail size={12} />
                          {email}
                        </p>
                      )}

                      {item.mobileNumber && (
                        <p className="text-sm text-white/40 flex items-center gap-2">
                          <Phone size={12} />
                          {item.mobileNumber}
                        </p>
                      )}

                      {item.vehicleType && (
                        <p className="text-sm text-white/40 flex items-center gap-2">
                          <Truck size={12} />
                          {item.vehicleType}
                        </p>
                      )}

                      {item.submittedAt && (
                        <p className="text-xs text-white/30 flex items-center gap-2">
                          <Clock size={10} />
                          Submitted{" "}
                          {new Date(item.submittedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* EXPANDED */}
                    <AnimatePresence>
                      {isExpanded && item.details && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(item.details).map(([key, val]) => (
                              <div key={key} className="text-sm">
                                <p className="text-white/30 capitalize">
                                  {key}
                                </p>
                                <p className="text-white/70">{String(val)}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="">
                  {item.videoKycStatus === "pending" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-amber-400/25 transition-all cursor-pointer"
                      onClick={() => handleStartVideoKyc(item._id)}
                    >
                      Start video KYC
                      <ArrowRight size={14} />
                    </motion.button>
                  ) : item.videoKycStatus === "in_progress" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-amber-400/25 transition-all cursor-pointer"
                      onClick={() =>
                        router.push(`/video-kyc/${item.videoKycRoomId}`)
                      }
                    >
                      Join call
                      <ArrowRight size={14} />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-amber-400/25 transition-all cursor-pointer"
                      onClick={(e) => handleReview(e, item)}
                    >
                      Review
                      <ArrowRight size={14} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ContentList;
