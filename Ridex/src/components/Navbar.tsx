"use client";
import React from "react";
import {
  Bike,
  Car,
  ChevronRight,
  LogOut,
  MenuIcon,
  Truck,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, lazy, Suspense } from "react";
import AuthModel from "./AuthModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { signOut } from "next-auth/react";
import { setUserData } from "@/redux/userSlice";

// Dynamically import ProfileDropdown to avoid hydration issues
const ProfileDropdown = lazy(() => import("./ProfileDropdown"));

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Bookings", href: "/bookings" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Add this

  const reduxUser = useSelector(
    (state: RootState) => state.user?.userData?.user,
  );
  const dispatch = useDispatch<AppDispatch>();

  // Fix hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = !!reduxUser?.email;
  const userName = reduxUser?.name || "User";
  const userRole = reduxUser?.role || "user";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setProfileOpen(false);
    setMobileProfileOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    dispatch(setUserData(null));
    setProfileOpen(false);
    setMobileProfileOpen(false);
    closeMenu();
    window.location.reload(); // Force reload to reset state and avoid hydration issues
  };

  // Don't render interactive elements until mounted on client
  if (!mounted) {
    return (
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-xl md:text-3xl font-bold text-white tracking-tighter">
              Ridex
            </div>
          </Link>
        </div>
      </motion.nav>
    );
  }

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={closeMenu}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-xl font-bold text-white tracking-tighter"
            >
              Ridex
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-sm font-medium group"
                >
                  <span
                    className={`transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1 h-[2px] w-full bg-white rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop User / Login Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/10 px-4 py-2 rounded-full transition-all"
                >
                  <span className="text-white text-sm font-medium">
                    Hi, {userName.split(" ")[0]}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold border border-white/30">
                    {userName[0]?.toUpperCase()}
                  </div>
                </button>

                {/* Desktop Profile Dropdown - Wrapped in Suspense */}
                <AnimatePresence>
                  {profileOpen && (
                    <Suspense fallback={null}>
                      <ProfileDropdown
                        userName={userName}
                        userRole={userRole}
                        onLogout={handleLogout}
                        onClose={() => setProfileOpen(false)}
                      />
                    </Suspense>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAuthOpen(true)}
                className="px-6 py-2.5 bg-white/10 backdrop-blur-md border cursor-pointer border-white/30 hover:border-white/50 text-white font-medium rounded-full transition-all"
              >
                Log in
              </motion.button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 -mr-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="md:hidden bg-zinc-950 border-t border-white/10 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-4">
                {/* Navigation Items */}
                {NAV_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`block py-2 transition-colors ${
                        pathname === item.href
                          ? "text-white font-semibold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile User Section */}
                {isLoggedIn ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <button
                      onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                      className="w-full flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                          {userName[0]?.toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="text-white font-medium">{userName}</p>
                          <p className="text-xs text-gray-400 capitalize">
                            {userRole}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          mobileProfileOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile Profile Dropdown */}
                    <AnimatePresence>
                      {mobileProfileOpen && (
                        <Suspense fallback={null}>
                          <ProfileDropdown
                            userName={userName}
                            userRole={userRole}
                            onLogout={handleLogout}
                            isMobile={true}
                            onClose={() => setMobileProfileOpen(false)}
                          />
                        </Suspense>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      closeMenu();
                      setAuthOpen(true);
                    }}
                    className="mt-4 w-full py-4 bg-white cursor-pointer text-black font-semibold rounded-full text-base transition-all"
                  >
                    Log in
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModel open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
