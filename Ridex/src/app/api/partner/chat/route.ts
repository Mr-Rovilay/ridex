// app/api/partner/chat/route.ts
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import ChatMessage from "@/models/chatModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Fetch messages between partner and admin
    const messages = await ChatMessage.find({
      $or: [
        { sender: session.user.id, recipientRole: "admin" },
        { recipient: session.user.id, senderRole: "admin" },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { message } = await req.json();

    // Find admin user (you can have a specific admin ID or fetch first admin)
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const chatMessage = await ChatMessage.create({
      sender: session.user.id,
      senderRole: "partner",
      recipient: admin._id,
      recipientRole: "admin",
      message,
    });

    return NextResponse.json({ message: chatMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}