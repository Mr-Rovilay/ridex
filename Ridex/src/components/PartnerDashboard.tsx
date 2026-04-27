"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Lock,
  Sparkles,
  Car,
  FileText,
  Landmark,
  Eye,
  Video,
  Tag,
  ClipboardCheck,
  Rocket,
  ArrowRight,
  Trophy,
  Zap,
  Circle,
  Clock,
  CheckCircle,
  VideoIcon,
  Clock1,
} from "lucide-react";
import { useRouter } from "next/navigation";
import RejectionCard from "./RejectionCard";
import StatusCard from "./StatusCard";
import ActionCard from "./ActionCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/userSlice";
import PricingModel from "./PricingModel";
import { IVehicle } from "@/models/vehicleModel";
import PartnerChat from "./PartnerChat";

type Step = {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  route?: string;
  description: string;
  estimatedTime: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    title: "Vehicle Details",
    subtitle: "Tell us about your ride",
    icon: Car,
    route: "/partner/onboarding/vehicle",
    description: "Share vehicle make, model, and registration",
    estimatedTime: "2 mins",
  },
  {
    id: 2,
    title: "Documents",
    subtitle: "Upload verification",
    icon: FileText,
    route: "/partner/onboarding/documents",
    description: "ID proof, license, RC certificate",
    estimatedTime: "5 mins",
  },
  {
    id: 3,
    title: "Bank Setup",
    subtitle: "Get paid seamlessly",
    icon: Landmark,
    route: "/partner/onboarding/bank",
    description: "Add payout method",
    estimatedTime: "3 mins",
  },
  {
    id: 4,
    title: "Review",
    subtitle: "Double-check everything",
    icon: Eye,
    description: "Verify all information",
    estimatedTime: "2 mins",
  },
  {
    id: 5,
    title: "Video KYC",
    subtitle: "Verify your identity",
    icon: Video,
    description: "Quick video call with agent",
    estimatedTime: "10 mins",
  },
  {
    id: 6,
    title: "Set Pricing",
    subtitle: "Set your rates",
    icon: Tag,
    description: "Choose competitive pricing",
    estimatedTime: "3 mins",
  },
  {
    id: 7,
    title: "Final Review",
    subtitle: "Last look before launch",
    icon: ClipboardCheck,
    description: "Final verification",
    estimatedTime: "2 mins",
  },
  {
    id: 8,
    title: "Go Live",
    subtitle: "Start earning",
    icon: Rocket,
    description: "Your journey begins!",
    estimatedTime: "Ready!",
  },
];

const TOTAL_STEPS = STEPS.length;

const PartnerDashboard = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [baseStep, setBaseStep] = useState(1);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const dispatch = useDispatch();
  const [showPricing, setShowPricing] = useState(false);
  const [vehicleData, setVehicleData] = useState<IVehicle | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const user = userData?.user;

  // Set initial step from user data
  useEffect(() => {
    if (user) {
      setBaseStep(user.partnerOnboardingSteps || 1);
    }
  }, [user]);

  // Calculate active step based on statuses
  let activeStep = baseStep;

  // STEP 4 → admin approval (documents approved)
  if (user?.partnerStatus === "approved" && activeStep < 5) {
    activeStep = 5;
  }

  // STEP 5 → Video KYC approval moves to pricing
  if (user?.videoKycStatus === "approved" && activeStep < 6) {
    activeStep = 6;
  }

  // STEP 6 → Pricing approval moves to final review
  if (vehicleData?.status === "approved" && activeStep < 7) {
    activeStep = 7;
  }

  // STEP 7 → All complete moves to Go Live
  if (
    activeStep >= 7 &&
    vehicleData?.status === "approved" &&
    user?.videoKycStatus === "approved"
  ) {
    activeStep = 8;
  }

  // Handle rejections
  if (user?.partnerStatus === "rejected") {
    activeStep = 4;
  }

  if (user?.videoKycStatus === "rejected") {
    activeStep = 5;
  }

  if (vehicleData?.status === "rejected" && activeStep === 6) {
    activeStep = 6; // Stay on pricing step to allow resubmission
  }

  const handleGetPricing = async () => {
    try {
      const { data } = await axios.get("/api/partner/onboarding/pricing");
      setVehicleData(data);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
  };

  useEffect(() => {
    handleGetPricing();
  }, [refreshKey]);

  const isComplete = activeStep > TOTAL_STEPS;
  const progressPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100;

  const goToStep = (step: Step) => {
    if (step.id === 6) {
      if (user?.videoKycStatus === "approved") {
        setShowPricing(true);
      }
      return;
    }

    if (step.route && step.id <= activeStep) {
      router.push(step.route);
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < activeStep) return "completed";
    if (stepId === activeStep) return "active";
    return "locked";
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/me");
      dispatch(setUserData(data));
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  useEffect(() => {
    fetchUser();
    const interval = setInterval(fetchUser, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 pt-18 pb-20 relative overflow-hidden">
        {/* Organic background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-3">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs tracking-wide text-white/70 uppercase">
                Partner Dashboard
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter mb-4 text-white">
              Welcome back,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {userData?.user?.name?.split(" ")[0] || "Partner"}!
              </span>
            </h1>

            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {isComplete
                ? "You're all set! Start accepting rides and earning today."
                : user?.partnerStatus === "rejected"
                  ? "Your application needs attention. Please review the feedback below."
                  : user?.partnerStatus === "approved"
                    ? "Great news! Your documents are approved. Complete the remaining steps."
                    : "Complete these steps to get your vehicle on the road and start earning"}
            </p>
          </motion.div>

          {/* Progress Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <p className="text-3xl font-bold text-white">{activeStep - 1}</p>
              <p className="text-sm text-white/50">Completed Steps</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <p className="text-3xl font-bold text-white">
                {TOTAL_STEPS - (activeStep - 1)}
              </p>
              <p className="text-sm text-white/50">Remaining Steps</p>
            </div>
            <div className="bg-gradient-to-r from-amber-400/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-5 border border-amber-400/20">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {Math.round(progressPercentage)}%
              </p>
              <p className="text-sm text-white/50">Overall Progress</p>
            </div>
          </motion.div>

          {/* Onboarding Timeline */}
          <div className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-10">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Your Journey</h2>
                <p className="text-white/50 text-sm">
                  Track your onboarding progress
                </p>
              </div>
              {isComplete && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                  <Trophy size={16} className="text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">
                    Ready to earn!
                  </span>
                </div>
              )}
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 md:left-8 top-8 bottom-8 w-0.5 bg-white/10 rounded-full" />

              {/* Progress line */}
              <motion.div
                className="absolute left-6 md:left-8 top-8 w-0.5 rounded-full bg-gradient-to-b from-amber-400 to-orange-500"
                initial={{ height: 0 }}
                animate={{ height: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Steps */}
              <div className="space-y-8 relative">
                {STEPS.map((step, idx) => {
                  const status = getStepStatus(step.id);
                  const isHovered = hoveredStep === step.id;
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`relative flex items-start gap-4 group cursor-pointer ${
                        status === "locked" ? "opacity-60" : "opacity-100"
                      }`}
                      onMouseEnter={() => setHoveredStep(step.id)}
                      onMouseLeave={() => setHoveredStep(null)}
                      onClick={() => goToStep(step)}
                    >
                      {/* Status icon */}
                      <div className="relative z-10">
                        <div
                          className={`
                          w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center
                          transition-all duration-300
                          ${status === "completed" ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20" : ""}
                          ${status === "active" ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 animate-pulse" : ""}
                          ${status === "locked" ? "bg-white/10 border border-white/10" : ""}
                          ${isHovered && status !== "locked" ? "scale-110" : ""}
                        `}
                        >
                          {status === "completed" ? (
                            <Check size={20} className="text-white" />
                          ) : status === "locked" ? (
                            <Lock size={18} className="text-white/40" />
                          ) : (
                            <Icon size={20} className="text-white" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <h3
                            className={`font-semibold text-lg ${
                              status === "active"
                                ? "text-white"
                                : "text-white/80"
                            }`}
                          >
                            {step.title}
                          </h3>
                          {status === "active" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400">
                              In Progress
                            </span>
                          )}
                          {status === "completed" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400">
                              Completed
                            </span>
                          )}
                          <span className="text-xs text-white/30 flex items-center gap-1">
                            <Zap size={10} />
                            {step.estimatedTime}
                          </span>
                        </div>

                        <p className="text-sm text-white/50 mb-2">
                          {step.subtitle}
                        </p>

                        <p className="text-xs text-white/30">
                          {step.description}
                        </p>

                        {/* Expandable description on hover */}
                        <AnimatePresence>
                          {isHovered &&
                            status !== "locked" &&
                            status !== "completed" && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="mt-3"
                              >
                                <span className="text-xs text-amber-400 flex items-center gap-1">
                                  Click to continue
                                  <ArrowRight size={12} />
                                </span>
                              </motion.div>
                            )}
                        </AnimatePresence>
                      </div>

                      {/* Right indicator */}
                      {status === "completed" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Circle
                              size={8}
                              className="fill-emerald-400 text-emerald-400"
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Status Cards */}
              {activeStep === 4 && user?.partnerStatus === "rejected" && (
                <RejectionCard
                  title="Application Not Approved"
                  reason={
                    user?.rejectionReason ||
                    "Your application didn't meet our requirements"
                  }
                  actionLabel="Review & Resubmit"
                  onAction={() => {
                    router.push("/partner/onboarding/vehicle");
                  }}
                />
              )}

              {activeStep === 4 && user?.partnerStatus === "pending" && (
                <StatusCard
                  icon={<Clock size={22} />}
                  title="Documents Under Review"
                  desc="Our admin team is carefully reviewing your submitted documents. We'll notify you once the verification is complete."
                  variant="pending"
                />
              )}

              {activeStep === 4 && user?.partnerStatus === "approved" && (
                <StatusCard
                  icon={<CheckCircle size={22} />}
                  title="Documents Approved!"
                  desc="Great news! Your documents have been verified. Please continue with the remaining steps to complete your onboarding."
                  variant="approved"
                />
              )}

              {activeStep === 5 &&
                (user?.videoKycStatus === "approved" ? (
                  <StatusCard
                    icon={<CheckCircle size={22} />}
                    title="Video KYC Completed"
                    desc="You can now proceed to pricing setup."
                    variant="approved"
                  />
                ) : user?.videoKycStatus === "rejected" ? (
                  <RejectionCard
                    title="Video KYC rejected"
                    reason={
                      user?.rejectionReason ||
                      "Your video KYC didn't meet our requirements"
                    }
                    actionLabel={
                      requestLoading ? "Requesting..." : "Request Again"
                    }
                    onAction={async () => {
                      setRequestLoading(true);
                      await axios.get("/api/partner/video-kyc/request");
                      setRequestLoading(false);
                    }}
                  />
                ) : user?.videoKycStatus === "in_progress" &&
                  user.videoKycRoomId ? (
                  <ActionCard
                    icon={<VideoIcon size={18} />}
                    title="Admin started video KYC"
                    button="Join Call"
                    onclick={() =>
                      router.push(`/video-kyc/${user.videoKycRoomId}`)
                    }
                  />
                ) : (
                  <StatusCard
                    icon={<Clock size={20} />}
                    title="Waiting for Admin"
                    desc="Admin will initiate Video KYC shortly"
                  />
                ))}

              {activeStep === 6 && vehicleData?.status === "pending" && (
                <StatusCard
                  icon={<Clock1 size={22} />}
                  title="Pricing under review"
                  desc="Admin is reviewing your pricing configuration"
                  variant="pending"
                />
              )}

              {activeStep === 6 && vehicleData?.status === "rejected" && (
                <RejectionCard
                  title="Pricing rejected"
                  reason={
                    vehicleData?.rejectionReason ||
                    "Your pricing didn't meet our requirements"
                  }
                  actionLabel="Edit and resubmit"
                  onAction={() => setShowPricing(true)}
                />
              )}

              {activeStep === 6 && vehicleData?.status === "approved" && (
                <StatusCard
                  icon={<CheckCircle size={22} />}
                  title="Pricing Approved!"
                  desc="Your pricing has been approved. Moving to final review..."
                  variant="approved"
                />
              )}

              {activeStep === 7 && vehicleData?.status === "approved" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
                >
                  <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Rocket size={28} className="text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">
                        Final Review Complete!
                      </h3>
                      <p className="text-white/60 text-sm">
                        All checks passed! Your vehicle is ready to go live.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Refresh user data to update step to 8
                        fetchUser();
                        setRefreshKey((prev) => prev + 1);
                      }}
                      className="cursor-pointer px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-sm flex items-center gap-2 whitespace-nowrap"
                    >
                      Go Live Now
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Completion Message for Go Live */}
            {activeStep === 8 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <Rocket size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    🎉 You're Live! 🎉
                  </h3>
                </div>
                <p className="text-white/70 text-base mb-6">
                  Congratulations! Your vehicle is now ready to accept rides.
                  Start earning today!
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/partner/rides")}
                    className="cursor-pointer px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium flex items-center gap-2"
                  >
                    Go to Dashboard
                    <ArrowRight size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/")}
                    className="cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
                  >
                    Browse Rides
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-white">Pro tip</p>
                <p className="text-sm text-white/50">
                  Complete all steps to start receiving ride requests. Most
                  partners finish in under 30 minutes!
                </p>
              </div>
            </div>
          </motion.div>

          <PricingModel
            open={showPricing}
            onClose={() => {
              setShowPricing(false);
              setRefreshKey((prev) => prev + 1);
            }}
            data={vehicleData}
          />
        </div>
      </main>
      <PartnerChat />
      <Footer />
    </>
  );
};

export default PartnerDashboard;