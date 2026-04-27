// app/api/partner/chat/mark-read/route.ts
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import ChatMessage from "@/models/chatModel";
import { NextResponse } from "next/server";

export async function PUT() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Mark all messages from admin to this partner as read
    await ChatMessage.updateMany(
      {
        recipient: session.user.id,
        senderRole: "admin",
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}