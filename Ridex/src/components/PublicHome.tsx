"use client";

import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import VehicleSlider from "./vehicleSlider";
import Footer from "./Footer";
import AuthModal from "./AuthModel";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

const PublicHome = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();
  const reduxUser = useSelector(
    (state: RootState) => state.user?.userData?.user,
  );

  const handleAuthOpen = () => {
    if (reduxUser?.email) {
      router.push("/user/book");
      return;
    }
    setAuthOpen(true);
  };

  return (
    <>
      {/* Only ONE Navbar - This is the one we want */}
      <Navbar />

      <HeroSection onAuthRequired={handleAuthOpen} />
      <VehicleSlider />
      <Footer />

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default PublicHome;
