// models/notificationModel.ts
import mongoose from "mongoose";

export interface INotification {
  recipient: mongoose.Types.ObjectId;
  recipientRole: "admin" | "partner" | "user";
  type: "partner_approved" | "partner_rejected" | "kyc_approved" | "kyc_rejected" | "vehicle_approved" | "vehicle_rejected" | "pricing_approved" | "pricing_rejected" | "message";
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipientRole: { type: String, enum: ["admin", "partner", "user"], required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);