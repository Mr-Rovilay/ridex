"use client";

import AnimatedCard from "@/components/AnimatedCard";
import DocPreview from "@/components/DocPreview";
import { IPartnerBank } from "@/models/partnerBank";
import { IPartnerDocs } from "@/models/partnerDocs";
import { IUser } from "@/models/userModel";
import { IVehicle } from "@/models/vehicleModel";
import axios from "axios";
import {
  ArrowLeft,
  Car,
  CheckCircle,
  Clock,
  FileText,
  Landmark,
  ShieldCheck,
  XCircle,
  CircleDashed,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Building2,
  CreditCard,
  Smartphone,
  Truck,
  Hash,
  IdCard,
  FileCheck,
  Award,
  Star,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-hot-toast";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<IUser | null>(null);
  const [vehicleDetails, setVehicleDetails] = useState<IVehicle | null>(null);
  const [partnerDocs, setPartnerDocs] = useState<IPartnerDocs | null>(null);
  const [partnerBank, setPartnerBank] = useState<IPartnerBank | null>(null);

  const [loading, setLoading] = useState(true);

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  // ======================
  // FETCH DATA
  // ======================
  const handleGetPartner = async () => {
    try {
      const res = await axios.get(`/api/admin/reviews/partner/${id}`);
      setData(res.data.partner);
      setVehicleDetails(res.data.vehicle);
      setPartnerDocs(res.data.documents);
      setPartnerBank(res.data.bank);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) handleGetPartner();
  }, [id]);

  const getStatusConfig = () => {
    switch (data?.partnerStatus) {
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

  const statusConfig = getStatusConfig();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading partner details...</p>
        </div>
      </div>
    );
  }

  // ======================
  // APPROVE
  // ======================
  const handleApprove = async () => {
    try {
      setApproveLoading(true);
      await axios.put(`/api/admin/reviews/partner/${id}/approve`);
      router.push("/");
      // Force refresh
      // window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setApproveLoading(false);
    }
  };

  // ======================
  // REJECT
  // ======================
  const handleReject = async () => {
    if (!rejectionReason) return;
    try {
      setRejectLoading(true);
      await axios.post(`/api/admin/reviews/partner/${id}/reject`, {
        rejectionReason,
      });
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setRejectLoading(false);
    }
  };

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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
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
                <h1 className="text-2xl font-bold text-white">{data?.name}</h1>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                >
                  {statusConfig.icon}
                  <span>{statusConfig.text}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <p className="text-sm text-white/50 flex items-center gap-1">
                  <Mail size={12} />
                  {data?.email}
                </p>
                {data?.mobileNumber && (
                  <p className="text-sm text-white/50 flex items-center gap-1">
                    <Phone size={12} />
                    {data?.mobileNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Vehicle Details */}
            <AnimatedCard
              title="Vehicle Information"
              icon={<Car size={20} />}
              gradient="from-blue-400/10 to-cyan-500/10"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <Truck size={10} />
                    Vehicle Type
                  </p>
                  <p className="text-white font-medium capitalize">
                    {vehicleDetails?.type || "-"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <Hash size={10} />
                    Registration Number
                  </p>
                  <p className="text-white font-medium uppercase">
                    {vehicleDetails?.number || "-"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2">
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1">
                    <Car size={10} />
                    Model
                  </p>
                  <p className="text-white">
                    {vehicleDetails?.vehicleModel || "-"}
                  </p>
                </div>
              </div>
            </AnimatedCard>

            {/* Documents */}
            <AnimatedCard
              title="Verification Documents"
              icon={<FileText size={20} />}
              gradient="from-amber-400/10 to-orange-500/10"
            >
              <div className="space-y-4">
                <DocPreview
                  label="Aadhaar Card"
                  url={partnerDocs?.aadharUrl}
                  icon={<IdCard size={14} />}
                />
                <DocPreview
                  label="RC Certificate"
                  url={partnerDocs?.rcUrl}
                  icon={<FileCheck size={14} />}
                />
                <DocPreview
                  label="Driving License"
                  url={partnerDocs?.licenseUrl}
                  icon={<IdCard size={14} />}
                />
              </div>
            </AnimatedCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Bank Details */}
            <AnimatedCard
              title="Payout Information"
              icon={<Landmark size={20} />}
              gradient="from-emerald-400/10 to-teal-500/10"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Building2
                    size={16}
                    className="text-white/40 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs text-white/40">Account Holder</p>
                    <p className="text-white">
                      {partnerBank?.accountHolder || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <CreditCard
                    size={16}
                    className="text-white/40 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs text-white/40">Account Number</p>
                    <p className="text-white font-mono">
                      {partnerBank?.accountNumber || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Hash
                    size={16}
                    className="text-white/40 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs text-white/40">IFSC Code</p>
                    <p className="text-white font-mono uppercase">
                      {partnerBank?.ifsc || "-"}
                    </p>
                  </div>
                </div>
                {partnerBank?.upi && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <Smartphone
                      size={16}
                      className="text-white/40 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs text-white/40">UPI ID</p>
                      <p className="text-white">{partnerBank?.upi}</p>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedCard>

            {/* Admin Actions */}
            {data?.partnerStatus === "pending" && (
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
                    Approve Partner
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

            {/* Completion Status */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-amber-400" />
                <h4 className="text-sm font-medium text-white">
                  Onboarding Status
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Vehicle Details</span>
                  {vehicleDetails?.type ? (
                    <CheckCircle size={14} className="text-emerald-400" />
                  ) : (
                    <XCircle size={14} className="text-red-400" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Documents Uploaded</span>
                  {partnerDocs?.aadharUrl ? (
                    <CheckCircle size={14} className="text-emerald-400" />
                  ) : (
                    <XCircle size={14} className="text-red-400" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Bank Details</span>
                  {partnerBank?.accountNumber ? (
                    <CheckCircle size={14} className="text-emerald-400" />
                  ) : (
                    <XCircle size={14} className="text-red-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
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
                  Approve Partner?
                </h2>
                <p className="text-white/50 mt-2">
                  This will activate {data?.name}'s account and allow them to
                  start accepting rides.
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
                  Reject Partner
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
