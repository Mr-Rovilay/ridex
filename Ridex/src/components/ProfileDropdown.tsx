"use client";

import { Bike, Car, ChevronRight, LogOut, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

type Props = {
  userName: string;
  userRole: string;
  onLogout: () => void;
  isMobile?: boolean;
  onClose?: () => void;
};

const ProfileDropdown = ({
  userName,
  userRole,
  onLogout,
  isMobile = false,
  onClose,
}: Props) => {
  const router = useRouter(); // ✅ FIXED (inside component)

  const handleBecomePartner = () => {
    onClose?.();
    setTimeout(() => {
      router.push("/partner/onboarding/vehicle");
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className={`${
        isMobile ? "relative w-full mt-3" : "absolute right-0 mt-3 w-72"
      } bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50`}
    >
      <div className="p-5 border-b border-white/10">
        <p className="font-semibold text-white">{userName}</p>
        <p className="text-sm text-gray-400 capitalize">{userRole}</p>
      </div>

      {userRole !== "partner" && (
        <div
          className="p-5 border-b border-white/10 flex items-center gap-4 text-white cursor-pointer hover:bg-white/5 transition"
          onClick={handleBecomePartner} // ✅ CLEAN
        >
          <div className="flex -space-x-2">
            <Bike className="w-6 h-6" />
            <Car className="w-6 h-6" />
            <Truck className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <p className="font-medium">Become a Partner</p>
            <p className="text-xs text-gray-400">
              Earn by listing your vehicles
            </p>
          </div>

          <ChevronRight className="w-4 h-4" />
        </div>
      )}

      <div className="p-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-xl transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileDropdown;
