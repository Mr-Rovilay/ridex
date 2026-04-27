"use client";
import { IVehicle } from "@/models/vehicleModel";
import axios from "axios";
import { DollarSign, ImagePlus, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type PropsType = {
  open: boolean;
  onClose: () => void;
  data: IVehicle | null;
};

const PricingModel = ({ open, onClose, data }: PropsType) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [baseFare, setBaseFare] = useState("");
  const [pricePerKm, setPricePerKm] = useState("");
  const [waitingCharge, setWaitingCharge] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setPreview(data.imageUrl || null);
      setBaseFare(data.baseFare?.toString() || "");
      setPricePerKm(data.pricePerKm?.toString() || "");
      setWaitingCharge(data.waitingCharge?.toString() || "");
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!baseFare || !pricePerKm || !waitingCharge) {
      toast.error("Please fill all pricing fields");
      return;
    }

    if (!image && !preview) {
      toast.error("Please upload a vehicle image");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("baseFare", baseFare);
      formData.append("waitingCharge", waitingCharge);
      formData.append("pricePerKm", pricePerKm);
      if (image) {
        formData.append("image", image);
      }
      const response = await axios.post(
        "/api/partner/onboarding/pricing",
        formData,
      );
      toast.success("Pricing saved successfully!");
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save pricing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl w-full max-w-2xl mx-4 border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                Pricing & Vehicle Image
              </h2>
              <button
                onClick={onClose}
                className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Vehicle Image
                </label>
                <label
                  htmlFor="imageLabel"
                  className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-amber-400/50 transition-all bg-white/5 hover:bg-white/10"
                >
                  {preview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={preview}
                        alt="Vehicle preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setPreview(null);
                          setImage(null);
                        }}
                        className="cursor-pointer absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ImagePlus className="w-10 h-10 text-gray-400" />
                      <p className="text-sm text-gray-400">
                        Click to upload vehicle image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="imageLabel"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("File size should be less than 5MB");
                          return;
                        }
                        setImage(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>

              {/* Base Fare */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">Base Fare</p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    placeholder="Enter base fare"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition"
                  />
                </div>
              </div>

              {/* Price Per KM */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">
                  Price Per Kilometer
                </p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={pricePerKm}
                    onChange={(e) => setPricePerKm(e.target.value)}
                    placeholder="Enter price per kilometer"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition"
                  />
                </div>
              </div>

              {/* Waiting Charge */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">
                  Waiting Charge (per minute)
                </p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={waitingCharge}
                    onChange={(e) => setWaitingCharge(e.target.value)}
                    placeholder="Enter waiting charge"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="cursor-pointer flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="cursor-pointer flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PricingModel;
