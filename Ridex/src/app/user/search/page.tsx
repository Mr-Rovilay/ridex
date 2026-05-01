"use client";
import SearchMap from "@/components/SearchMap";
import { IVehicle } from "@/models/vehicleModel";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  Shield,
  ChevronRight,
  CreditCard,
  Headphones,
  Car,
  Bike,
  Truck,
  Zap,
  Search,
  RefreshCcw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

  const VEHICLE_META: any= {
    bike:{label: "Bike", Icon: Bike},
    auto:{label: "Bike", Icon: Car},
    car:{label: "Bike", Icon: Bike},
    loading:{label: "Bike", Icon: Truck},
    truck:{label: "Bike", Icon: Truck}
  }

const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [pickUp, setPickUp] = useState(params.get("pickup") || "");
  const [drop, setDrop] = useState(params.get("drop") || "");
  const [km, setKm] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const mobile = params.get("mobile");
  const pickUpLat = Number(params.get("pickupLat"));
  const pickUpLon = Number(params.get("pickupLon"));
  const dropLat = Number(params.get("droplat"));
  const dropLon = Number(params.get("droplon"));
  const vehicle = params.get("vehicle") || ""
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(false)
  const meta = VEHICLE_META[vehicle]

  // Get vehicle icon
  const getVehicleIcon = () => {
    switch (vehicle) {
      case "bike":
        return <Bike className="w-5 h-5" />;
      case "auto":
        return <Car className="w-5 h-5" />;
      case "car":
        return <Car className="w-5 h-5" />;
      case "truck":
        return <Truck className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };



const getNearByVehicles = async (
  latitude: number,
  longitude: number,
  vehicleType: string | null
) => {
  if (!latitude || !longitude) return;

  setLoading(true);
  try {
    const { data } = await axios.post("/api/vehicles/near-by", {
      latitude,
      longitude,
      vehicleType,
    });
console.log(data)
    setVehicles(data);
  } catch (error: any) {
    console.log("ERROR:", error?.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!pickUpLat || !pickUpLon) return;

    const fetchVehicles = async () => {
      await getNearByVehicles(pickUpLat, pickUpLon, vehicle);
    };

    void fetchVehicles();
  }, [pickUpLat, pickUpLon, pickUp]);

  // Calculate fare based on vehicle type and distance
  const getFare = () => {
    const rates: Record<string, number> = {
      bike: 49,
      auto: 39,
      car: 79,
      loading: 99,
      truck: 129,
    };
    const rate = rates[vehicle || "car"] || 79;
    return Math.floor(km * rate);
  };

  const fare = getFare();
  const estimatedTime = Math.max(3, Math.round((km / 25) * 60));

  const handleConfirmBooking = () => {
    router.push(
      `/payment?pickup=${encodeURIComponent(pickUp)}&drop=${encodeURIComponent(drop)}&vehicle=${vehicle}&mobile=${mobile}&km=${km}&fare=${fare}&duration=${estimatedTime}`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Light version */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <ArrowLeft size={16} className="text-white" />
              </div>
              <div className="text-xl font-bold tracking-tighter">
                <span className="text-gray-900">Ridex</span>
                <span className="text-blue-600 text-xs ml-1">Trip</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Shield size={14} />
              <span className="hidden sm:inline">Secure Trip</span>
            </div>
          </div>
        </div>
      </div>

      <main className="relative">
        {/* Map Container - Clean, no dark overlay */}
        <div className="h-[55vh] md:h-[65vh] w-full relative">
          <SearchMap
            pickUp={pickUp}
            drop={drop}
            pickUpLat={pickUpLat}
            pickUpLon={pickUpLon}
            dropLat={dropLat}
            dropLon={dropLon}
            onChange={(p, d) => {
              setPickUp(p);
              setDrop(d);
            }}
            onDistance={(dist, dur) => {
              setKm(dist);
              setDuration(dur);
            }}
          />
        </div>
        <div className="">
          <div className="">
            <h2 className="tracking-tight font-black text-lg">
              {
                loading? "finding vehicles": vehicles.length>0?"available": "no nearby vehicles available"
              }
            </h2>
            {
              meta && <div className="">
                {meta.label} rides near your pickup
              </div>
            }
          </div>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div className="" key={searching}>
                <span className="">

                Searching....
                </span>
              </motion.div>
            )  : vehicles.length> 0 ?(
              <motion.div className="" key={"live"}>
                <Zap/>
                <span className="">live</span>
              </motion.div>
            ): null}


          </AnimatePresence>
        </div>
          <AnimatePresence>
            {!loading && vehicles.length == 0 &&(
              <motion.div className="">
                <div className="">
                  <Search/>
                </div>
                <p className="">Vehicles not found</p>
                <p className="">{meta.label || "Vehicle"} drivers are available near your pick up right now</p>
                <motion.button onClick={()=>getNearByVehicles(pickUpLat, pickUpLon,vehicle)}>
                  <RefreshCcw /> retry search
                </motion.button>
              </motion.div>
            ) }
          </AnimatePresence>
          <div className="">
            {
              vehicles.map((v,i)=>(
                <motion.div className="" key={i}>
                  

                </motion.div>
              ))
            }
          </div>

        {/* Trip Details Card - White/Light Design */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent pt-8 pb-6"
        >
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            {/* Location Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-4">
              {/* Pickup */}
              <div className="flex gap-3 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 shadow-sm" />
                  <div
                    className="w-px flex-1 bg-gray-300 my-2"
                    style={{ minHeight: 20 }}
                  />
                  <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 shadow-sm" />
                </div>
                <div className="flex-1 min-w-0 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Pickup Location
                    </p>
                    <p className="text-gray-900 font-medium">{pickUp || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Dropoff Location
                    </p>
                    <p className="text-gray-900 font-medium">{drop || "-"}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-17">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <Navigation className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </div>

            {/* Trip Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <Navigation className="w-3 h-3" />
                  <span className="text-xs font-medium">Distance</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {km || 0} <span className="text-sm text-gray-500">km</span>
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">Duration</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {duration || 0}{" "}
                  <span className="text-sm text-gray-500">min</span>
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                  <DollarSign className="w-3 h-3" />
                  <span className="text-xs font-medium">Est. Fare</span>
                </div>
                <p className="text-xl font-bold text-gray-900">₹{fare || 0}</p>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getVehicleIcon()}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">
                      Selected Vehicle
                    </p>
                    <p className="text-gray-900 font-semibold capitalize text-lg mt-1">
                      {vehicle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs uppercase tracking-wider">
                    Contact Number
                  </p>
                  <p className="text-gray-900 font-semibold">+91 {mobile}</p>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmBooking}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
            >
              Confirm & Proceed to Payment
              <ChevronRight size={18} />
            </motion.button>

            {/* Trust Badges - Light version */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <CreditCard size={12} />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Headphones size={12} />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Shield size={12} />
                <span>Safe Ride</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Page;
