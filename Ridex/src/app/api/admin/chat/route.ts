// app/api/admin/chat/route.ts
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import ChatMessage from "@/models/chatModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // Get messages with specific partner
      const messages = await ChatMessage.find({
        $or: [
          { sender: session.user.id, recipient: userId },
          { sender: userId, recipient: session.user.id },
        ],
      }).sort({ createdAt: 1 });

      // Mark messages as read
      await ChatMessage.updateMany(
        { sender: userId, recipient: session.user.id, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return NextResponse.json({ messages });
    } else {
      // Get all chat conversations with partners
      const partners = await User.find({
        role: "partner",
        $or: [
          { partnerStatus: "approved" },
          { partnerStatus: "pending" },
          { partnerStatus: "rejected" },
        ],
      }).select("name email partnerStatus videoKycStatus");

      const conversations = await Promise.all(
        partners.map(async (partner) => {
          const lastMessage = await ChatMessage.findOne({
            $or: [
              { sender: session.user.id, recipient: partner._id },
              { sender: partner._id, recipient: session.user.id },
            ],
          }).sort({ createdAt: -1 });

          const unreadCount = await ChatMessage.countDocuments({
            sender: partner._id,
            recipient: session.user.id,
            isRead: false,
          });

          return {
            partner,
            lastMessage,
            unreadCount,
          };
        })
      );

      return NextResponse.json({ conversations });
    }
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { recipientId, message, attachments } = await req.json();

    const chatMessage = await ChatMessage.create({
      sender: session.user.id,
      senderRole: "admin",
      recipient: recipientId,
      recipientRole: "partner",
      message,
      attachments: attachments || [],
    });

    return NextResponse.json({ message: chatMessage });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}