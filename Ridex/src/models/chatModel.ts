// models/chatModel.ts
import mongoose from "mongoose";

export interface IChatMessage {
  sender: mongoose.Types.ObjectId;
  senderRole: "admin" | "partner" | "user";
  recipient: mongoose.Types.ObjectId;
  recipientRole: "admin" | "partner" | "user";
  message: string;
  attachments?: string[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const chatMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["admin", "partner", "user"], required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipientRole: { type: String, enum: ["admin", "partner", "user"], required: true },
  message: { type: String, required: true },
  attachments: [{ type: String }],
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);