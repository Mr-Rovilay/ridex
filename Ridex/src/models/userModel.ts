import mongoose, { Document } from "mongoose";

// Fixed: Removed the incorrect curly braces for the string literal union
type VideoKycStatus =
  | "not_required"
  | "pending"
  | "in_progress"
  | "approved"
  | "rejected";

// Fixed: Document is now properly imported from mongoose
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin" | "partner";
  isEmailVerified: boolean; 
  otp?: string;
  otpExpiresAt?: Date;
  mobileNumber?: string;
  partnerOnboardingSteps: number;
  partnerStatus: "pending" | "approved" | "rejected";
  videoKycStatus: VideoKycStatus;
  videoKycRoomId: string;
  videoKycRejectionReason: string;
  rejectionReason?: string;
  socketId: string;
  location?:{
    type:"Point",
    coordinates:[number, number]
  },
  isOnline:boolean; 
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin", "partner"], default: "user" },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String
    },
    otpExpiresAt: {
      type: Date
    },
    mobileNumber: {
      type: String
    },
    partnerOnboardingSteps: {
      type: Number,
      min: 0,
      max: 8,
      default: 0
    },
    partnerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    rejectionReason: {
      type: String
    },
    videoKycStatus: {
      type: String,
      enum: [
        "not_required",
        "pending",
        "in_progress",
        "approved",
        "rejected"
      ],
      default: "not_required"
    },
    videoKycRoomId: {
      type: String
    },
    videoKycRejectionReason: {
      type: String
    },
    socketId: {
      type: String,
      default: null
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: [Number]     
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

userSchema.index({location:"2dsphere"})
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;