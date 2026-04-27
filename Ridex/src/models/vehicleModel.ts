import mongoose from "mongoose";

export type vehicleType = "bike" | "car" | "loading" | "truck" | "auto";

export interface IVehicle {
  owner: mongoose.Types.ObjectId;
  type: vehicleType;
  vehicleModel: string;
  number: string; // ✅ FIXED
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

const vehicleSchema = new mongoose.Schema<IVehicle>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["bike", "car", "loading", "truck", "auto"],
      required: true,
    },
    vehicleModel: { type: String, required: true },

    // ✅ FIXED HERE
    number: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    imageUrl: { type: String },
    baseFare: { type: Number },
    pricePerKm: { type: Number, 
      // required: true 
    },
    waitingCharge: { type: Number, 
      // required: true 
    },

    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Vehicle =
  mongoose.models.Vehicle ||
  mongoose.model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;