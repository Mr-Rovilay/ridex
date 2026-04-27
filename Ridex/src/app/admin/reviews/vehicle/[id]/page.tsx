"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  Hash,
  ImageIcon,
  Mail,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Truck,
  XCircle,
  Fuel,
  Calendar,
  User,
  IdCard,
  MapPin,
  CreditCard,
  Clock as ClockIcon,
  Gauge,
  Settings,
} from "lucide-react";
import { vehicleType } from "@/models/vehicleModel";
import { IUser } from "@/models/userModel";
import AnimatedCard from "@/components/AnimatedCard";

interface IVehicle {
  owner: IUser;
  type: vehicleType;
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKm?: number;
  waitingCharge?: number;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Page = () => {
  const [data, setData] = useState<IVehicle>();
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const result = await axios.get(`/api/admin/reviews/vehicle/${id}`);
        setData(result.data);
      } catch (error: any) {
        console.log(error.response?.data?.message ?? error);
      }
    };

    load();
  }, [id]);

  const getStatusConfig = () => {
    switch (data?.status) {
      case "approved":
        return {
          icon: <CheckCircle size={16} />,
          text: "Approved",
          color: "text-emerald-400",
          bg: "bg-emerald-400/10",
          border: "border-emerald-400/20",
        };
      case "rejected":
        return {
          icon: <XCircle size={16} />,
          text: "Rejected",
          color: "text-red-400",
          bg: "bg-red-400/10",
          border: "border-red-400/20",
        };
      default:
        return {
          icon: <Clock size={16} />,
          text: "Pending Review",
          color: "text-amber-400",
          bg: "bg-amber-400/10",
          border: "border-amber-400/20",
        };
    }
  };

  const handleApprove = async () => {
    try {
      setApproveLoading(true);
      await axios.put(`/api/admin/reviews/vehicle/${id}/approve`);
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setApproveLoading(false);
      setShowApprove(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) return;
    try {
      setRejectLoading(true);
      await axios.post(`/api/admin/reviews/vehicle/${id}/reject`, {
        reason: rejectionReason,
      });
      router.push("/admin/reviews");
    } catch (error) {
      console.error(error);
    } finally {
      setRejectLoading(false);
      setShowReject(false);
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
      {/* Organic background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition-all duration-300 group text-white"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </motion.button>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {data?.owner?.name || "Loading..."}
                </h1>
                {data && (
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                  >
                    {statusConfig.icon}
                    <span>{statusConfig.text}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <p className="text-xs md:text-sm text-white/50 flex items-center gap-1">
                  <Mail size={12} />
                  {data?.owner?.email || "-"}
                </p>
                {data?.owner?.mobileNumber && (
                  <p className="text-xs md:text-sm text-white/50 flex items-center gap-1">
                    <PhoneCall size={12} />
                    {data?.owner.mobileNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN - Vehicle Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
              {data?.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={data.vehicleModel}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center bg-white/5">
                  <ImageIcon size={48} className="text-white/20" />
                  <p className="text-white/30 mt-2 text-sm">No image available</p>
                </div>
              )}
            </div>

            {/* Additional Vehicle Info */}
            <AnimatedCard title="Vehicle Identification" icon={<IdCard />}>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <Hash size={10} />
                    Registration Number
                  </p>
                  <p className="text-white font-medium uppercase text-sm">
                    {data?.number || "-"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <Calendar size={10} />
                    Registered On
                  </p>
                  <p className="text-white text-sm">
                    {data?.createdAt
                      ? new Date(data.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>

          {/* RIGHT COLUMN - Vehicle Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <AnimatedCard title="Vehicle Details" icon={<Car />}>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <Truck size={10} />
                    Vehicle Type
                  </p>
                  <p className="text-white font-medium capitalize">
                    {data?.type || "-"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <Settings size={10} />
                    Model
                  </p>
                  <p className="text-white">{data?.vehicleModel || "-"}</p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard title="Pricing Configuration" icon={<DollarSign />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <DollarSign size={10} />
                    Base Fare
                  </p>
                  <p className="text-white font-semibold text-lg">
                    ₹{data?.baseFare || "0"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <Gauge size={10} />
                    Price Per KM
                  </p>
                  <p className="text-white font-semibold text-lg">
                    ₹{data?.pricePerKm || "0"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <ClockIcon size={10} />
                    Waiting Charge
                  </p>
                  <p className="text-white font-semibold text-lg">
                    ₹{data?.waitingCharge || "0"}
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard title="Owner Information" icon={<User />}>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/60 text-sm">Full Name</span>
                  <span className="text-white font-medium">
                    {data?.owner?.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/60 text-sm">Email Address</span>
                  <span className="text-white font-medium">
                    {data?.owner?.email || "-"}
                  </span>
                </div>
                {data?.owner?.mobileNumber && (
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/60 text-sm">Mobile Number</span>
                    <span className="text-white font-medium">
                      {data?.owner.mobileNumber}
                    </span>
                  </div>
                )}
              </div>
            </AnimatedCard>

            {/* Rejection Reason (if rejected) */}
            {data?.status === "rejected" && data?.rejectionReason && (
              <AnimatedCard title="Rejection Reason" icon={<AlertCircle />}>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">{data.rejectionReason}</p>
                </div>
              </AnimatedCard>
            )}

            {/* Admin Actions */}
            {data?.status === "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 border border-amber-400/20 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                    <ShieldCheck size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Admin Verification Required
                    </h3>
                    <p className="text-sm text-white/50">
                      Review all details before making a decision
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowApprove(true)}
                    className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm"
                  >
                    <ThumbsUp size={16} />
                    Approve Vehicle
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReject(true)}
                    className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium text-sm"
                  >
                    <ThumbsDown size={16} />
                    Reject
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* APPROVE MODAL */}
      <AnimatePresence>
        {showApprove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowApprove(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Sparkles size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Approve Vehicle?
                </h2>
                <p className="text-white/50 mt-2">
                  This will activate {data?.owner?.name?.split(" ")[0] || "the partner"}'s
                  vehicle and allow them to start accepting rides.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApprove(false)}
                  className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approveLoading}
                  className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {approveLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Yes, Approve
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REJECT MODAL */}
      <AnimatePresence>
        {showReject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowReject(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
            >
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white text-center">
                  Reject Vehicle?
                </h2>
                <p className="text-white/50 mt-2 text-center">
                  Please provide a reason for rejection. This will be shared
                  with the partner.
                </p>
              </div>

              <textarea
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-red-400/50 transition resize-none"
                rows={4}
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReject(false)}
                  className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectLoading || !rejectionReason}
                  className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {rejectLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Confirm Rejection
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;