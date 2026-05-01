"use client";
import type { vehicleType } from "@/models/vehicleModel";
import axios from "axios";
import {
  ArrowLeft,
  Bike,
  Car,
  CarIcon,
  CheckCircle,
  ChevronRight,
  Clock,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Truck,
  Loader2,
  Shield,
  CreditCard,
  Headphones,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const VEHICLES = [
  {
    id: "bike",
    label: "Bike",
    Icon: Bike,
    desc: "Quick & affordable",
    price: "₹49/km",
  },
  {
    id: "auto",
    label: "Auto",
    Icon: Car,
    desc: "Best for city rides",
    price: "₹39/km",
  },
  {
    id: "car",
    label: "Car",
    Icon: CarIcon,
    desc: "Comfortable & spacious",
    price: "₹79/km",
  },
  {
    id: "loading",
    label: "Loading",
    Icon: Truck,
    desc: "For heavy goods",
    price: "₹99/km",
  },
  {
    id: "truck",
    label: "Truck",
    Icon: Truck,
    desc: "Large capacity",
    price: "₹129/km",
  },
];

type Place = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode: string;
  lat: number;
  lng: number;
};

const Page = () => {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<vehicleType>();
  const [mobile, setMobile] = useState("");
  const [pickUp, setPickUp] = useState("");
  const [drop, setDrop] = useState("");
  const [pickUpCountry, setPickUpCountry] = useState("");
  const [pickUpLat, setPickUpLat] = useState<number>();
  const [pickUpLon, setPickUpLon] = useState<number>();
  const [dropCountry, setDropCountry] = useState("");
  const [dropLat, setDropLat] = useState<number>();
  const [dropLon, setDropLon] = useState<number>();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [pickUpSuggestions, setPickUpSuggestions] = useState<Place[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<Place[]>([]);

  const canContinue = !!(
    vehicle &&
    mobile.length === 10 &&
    pickUp &&
    drop &&
    pickUpLat &&
    pickUpLon &&
    dropLat &&
    dropLon
  );
  const progress = [!!vehicle, mobile.length === 10, !!pickUp, !!drop].filter(
    Boolean,
  ).length;

  const searchAddress = async (
    q: string,
    setResults: (r: Place[]) => void,
    restrict?: string | null,
  ) => {
    try {
      if (!q || q.trim().length < 3) {
        setResults([]);
        return;
      }
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}&limit=8&lang=en`,
      );

      let results: Place[] = (data.features ?? []).map((f: any) => ({
        id: String(f.properties.osm_id),
        name: f.properties.name,
        city: f.properties.city,
        state: f.properties.state,
        country: f.properties.country,
        countryCode: f.properties.countrycode,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }));

      if (restrict) {
        results = results.filter((r) => r.country === restrict);
      }
      setResults(results);
    } catch (error) {
      console.log(error);
      setResults([]);
    }
  };

  const suggestion = (p: Place) =>
    [p.name, p.city, p.state, p.country].filter(Boolean).join(", ");

  const getIPLocation = async () => {
    try {
      const { data } = await axios.get("https://ipapi.co/json/");
      setPickUp(`${data.city}, ${data.country_name}`);
      setPickUpCountry(data.country_name);
    } catch (err) {
      console.log(err);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      getIPLocation();
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { data } = await axios.get(
            `https://photon.komoot.io/reverse?lon=${coords.longitude}&lat=${coords.latitude}`,
          );

          if (data.features.length) {
            const p = data.features[0].properties;

            const address = [p.name, p.street, p.city, p.state, p.country]
              .filter(Boolean)
              .join(", ");

            setPickUp(address);
            setPickUpCountry(p.country);
            setPickUpLat(coords.latitude);
            setPickUpLon(coords.longitude);
            setPickUpSuggestions([]);
          }
        } catch (error) {
          console.log("Reverse failed → fallback to IP");
          getIPLocation();
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.log("GPS failed → fallback to IP", error);
        getIPLocation();
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      },
    );
  };

  const handleContinue = () => {
    if (!vehicle) return toast.error("Select a vehicle");
    if (mobile.length !== 10) return toast.error("Enter valid mobile");
    if (!pickUpLat) return toast.error("Select pickup from suggestion or GPS");
    if (!dropLat) return toast.error("Select drop from suggestion");

   router.push(
  `/user/search?pickup=${encodeURIComponent(pickUp)}&drop=${encodeURIComponent(drop)}&vehicle=${vehicle}&mobile=${mobile}&pickuplat=${pickUpLat}&pickuplon=${pickUpLon}&droplat=${dropLat}&droplon=${dropLon}`
);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-800 via-black to-zinc-950">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-0 h-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-500 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      </div>
      {/* Header - Matching Admin Dashboard Style */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10 ">
        <div className="max-w-7xl mx-auto h-16 px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-ember-500 rounded-xl flex items-center justify-center">
                <ArrowLeft size={16} className="text-white" />
              </div>
              <div className="text-xl font-bold tracking-tighter">
                <span className="text-white">Ridex</span>
                <span className="text-amber-400 text-xs ml-1">Book</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-white/40 text-sm">
                <Shield size={14} />
                <span>Secure Booking</span>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Headphones size={14} />
                <span className="hidden sm:inline">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Book a ride
          </h1>
          <p className="text-white/50 mt-1">
            Fill in the details below to book your ride
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex gap-2 mb-8">
          {[
            { step: 1, label: "Vehicle" },
            { step: 2, label: "Mobile" },
            { step: 3, label: "Route" },
            { step: 4, label: "Confirm" },
          ].map((item, idx) => (
            <div key={idx} className="flex-1">
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx < progress
                    ? "bg-gradient-to-r from-blue-400 to-purple-500"
                    : "bg-white/10"
                }`}
              />
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                    idx < progress
                      ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {item.step}
                </div>
                <span
                  className={`text-xs ${
                    idx < progress ? "text-white/70" : "text-white/30"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Choose Vehicle */}
        <motion.div
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">1</span>
            </div>
            <p className="font-semibold text-white">Choose Vehicle</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {VEHICLES.map((v, i) => {
              const active = vehicle === v.id;
              return (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setVehicle(v.id as vehicleType)}
                  key={i}
                  className={`cursor-pointer rounded-xl p-3 transition-all ${
                    active
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50"
                      : "bg-white/5 border border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <v.Icon
                      className={`w-6 h-6 ${active ? "text-blue-400" : "text-white/60"}`}
                    />
                    {active && (
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-sm ${active ? "text-white" : "text-white/80"}`}
                    >
                      {v.label}
                    </p>
                    <p className="text-xs text-white/40 mt-1">{v.desc}</p>
                    <p className="text-xs text-blue-400 mt-2">{v.price}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Step 2: Mobile Number */}
        <motion.div
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">2</span>
            </div>
            <p className="font-semibold text-white">Mobile Number</p>
          </div>

          <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-3 focus-within:border-blue-400/50 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all bg-white/5">
            <Phone className="w-5 h-5 text-white/40" />
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter your mobile number"
              className="flex-1 outline-none bg-transparent text-white placeholder:text-white/30"
              maxLength={10}
            />
            <AnimatePresence>
              {mobile.length === 10 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-white/30 mt-2 flex items-center gap-1">
            <Clock size={10} />
            Ride updates will be sent to this number
          </p>
        </motion.div>

        {/* Step 3: Route Details */}
        <motion.div
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">3</span>
            </div>
            <p className="font-semibold text-white">Route Details</p>
          </div>

          {/* Pickup Location */}
          <div className="relative mb-4">
            <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-3 focus-within:border-blue-400/50 transition-all bg-white/5">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="w-px h-8 bg-white/10 my-1" />
              </div>
              <input
                onChange={(e) => {
                  setPickUp(e.target.value);
    //               setPickUpLat(undefined); 
    // setPickUpLon(undefined);
                  searchAddress(e.target.value, setPickUpSuggestions, null);
                }}
                value={pickUp}
                type="text"
                placeholder="Pickup location"
                className="flex-1 outline-none bg-transparent text-white placeholder:text-white/30"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={useCurrentLocation}
                disabled={isLoadingLocation}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                {isLoadingLocation ? (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                ) : (
                  <LocateFixed className="w-5 h-5 text-white/60 hover:text-white transition" />
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {pickUpSuggestions?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-xl shadow-2xl border border-white/10 z-20 max-h-64 overflow-y-auto"
                >
                  {pickUpSuggestions.map((p, i) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      onClick={() => {
                        setPickUp(suggestion(p));
                        setPickUpCountry(p.country ?? "");
                        setPickUpLat(p.lat);
                        setPickUpLon(p.lng);
                        setPickUpSuggestions([]);
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-white/5 last:border-0"
                    >
                      <MapPin className="w-4 h-4 text-white/40" />
                      <span className="flex-1 text-sm text-white/80">
                        {suggestion(p)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Drop Location */}
          <div className="relative">
            <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-3 focus-within:border-blue-400/50 transition-all bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <input
                onChange={(e) => {
                  setDrop(e.target.value);
                  searchAddress(
                    e.target.value,
                    setDropSuggestions,
                    pickUpCountry,
                  );
                }}
                disabled={!pickUpCountry}
                value={drop}
                type="text"
                placeholder={
                  pickUpCountry
                    ? "Drop location"
                    : "Select pickup location first"
                }
                className="flex-1 outline-none bg-transparent text-white placeholder:text-white/30 disabled:opacity-50"
              />
              <Navigation className="w-5 h-5 text-white/40" />
            </div>

            <AnimatePresence>
              {dropSuggestions?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-xl shadow-2xl border border-white/10 z-20 max-h-64 overflow-y-auto"
                >
                  {dropSuggestions.map((p, i) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      onClick={() => {
                        setDrop(suggestion(p));
                        setDropCountry(p.country ?? "");
                        setDropLat(p.lat);
                        setDropLon(p.lng);
                        setDropSuggestions([]);
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-white/5 last:border-0"
                    >
                      <MapPin className="w-4 h-4 text-white/40" />
                      <span className="flex-1 text-sm text-white/80">
                        {suggestion(p)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Fare Estimate (Optional) */}
        {vehicle && pickUp && drop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20 p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Estimated Fare</p>
                <p className="text-2xl font-bold text-white">
                  ₹{Math.floor(Math.random() * 500) + 100}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">Distance</p>
                <p className="text-white">
                  ~{Math.floor(Math.random() * 30) + 5} km
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: canContinue ? 1.02 : 1 }}
            whileTap={{ scale: canContinue ? 0.98 : 1 }}
            disabled={!canContinue}
            onClick={handleContinue}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              canContinue
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                : "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
            }`}
          >
            {canContinue ? (
              <>
                Continue
                <ChevronRight size={18} />
              </>
            ) : (
              "Complete all fields to continue"
            )}
          </motion.button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10"
        >
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Shield size={12} />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <CreditCard size={12} />
            <span>No Cancellation Fee</span>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Headphones size={12} />
            <span>24/7 Support</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Page;
