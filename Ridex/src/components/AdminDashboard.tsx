// app/admin/page.tsx (updated)
"use client";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  Settings,
  Truck,
  User,
  Users,
  Video,
  X,
  LayoutDashboard,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Kpi from "./Kpi";
import TabButton from "./TabButton";
import { AnimatePresence } from "motion/react";
import ContentList from "./ContentList";
import { motion } from "motion/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import ChatPanel from "@/components/ChatPanel";

type Stats = {
  totalApprovedPartners: number;
  totalPartners: number;
  totalPendingPartners: number;
  totalRejectedPartners: number;
};

type Tab = "partner" | "kyc" | "vehicle";

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("partner");
  const [partnerReviews, setPartnerReviews] = useState<any[]>([]);
  const [pendingKyc, setPendingKyc] = useState<any[]>([]);
  const [vehicleReviews, setVehicleReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleGetData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/dashboard");
      setStats(data.stats);
      setPartnerReviews(data.pendingPartnersReviews || []);
      setVehicleReviews(data.pendingVehicles || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPendingKYC = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/video-kyc/pending");
      setPendingKyc(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetPendingKYC();
    handleGetData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
      {/* Admin Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto h-16 px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <LayoutDashboard size={16} className="text-black" />
              </div>
              <div className="text-xl font-bold tracking-tighter">
                <span className="text-white">Ridex</span>
                <span className="text-amber-400 text-xs ml-1">Admin</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition">
              <Search size={18} className="text-white/60" />
            </button>
            {/* <NotificationBell /> */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                <User size={14} className="text-black" />
              </div>
              <span className="text-sm text-white/70 hidden sm:inline">
                Admin
              </span>

              <button
                onClick={handleLogout}
                className="cursor-pointer ml-3 px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-white/50 mt-1">
            Manage partners, verify KYC, and review vehicles
          </p>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <Kpi
            label="Total Partners"
            value={stats?.totalPartners || 0}
            icon={<User size={20} />}
            variant="totalPartners"
            trend="+12%"
          />
          <Kpi
            label="Approved Partners"
            value={stats?.totalApprovedPartners || 0}
            icon={<CheckCircle size={20} />}
            variant="approved"
            trend="+8%"
          />
          <Kpi
            label="Pending Partners"
            value={stats?.totalPendingPartners || 0}
            icon={<Clock size={20} />}
            variant="pending"
          />
          <Kpi
            label="Rejected Partners"
            value={stats?.totalRejectedPartners || 0}
            icon={<X size={20} />}
            variant="rejected"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 mb-6">
          <TabButton
            active={activeTab === "partner"}
            onClick={() => setActiveTab("partner")}
            count={partnerReviews?.length || 0}
            icon={<Users size={16} />}
          >
            Partner Reviews
          </TabButton>
          <TabButton
            active={activeTab === "kyc"}
            onClick={() => setActiveTab("kyc")}
            count={pendingKyc?.length || 0}
            icon={<Video size={16} />}
          >
            Video KYC
          </TabButton>
          <TabButton
            active={activeTab === "vehicle"}
            onClick={() => setActiveTab("vehicle")}
            count={vehicleReviews?.length || 0}
            icon={<Truck size={16} />}
          >
            Vehicle Reviews
          </TabButton>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "partner" && (
              <ContentList
                data={partnerReviews ?? []}
                type="partner"
                loading={loading}
              />
            )}
            {activeTab === "kyc" && (
              <ContentList
                data={pendingKyc ?? []}
                type="kyc"
                loading={loading}
              />
            )}
            {activeTab === "vehicle" && (
              <ContentList
                data={vehicleReviews ?? []}
                type="vehicle"
                loading={loading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Chat Panel */}
      <ChatPanel />
    </div>
  );
};

export default AdminDashboard;