import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // ======================
    // AUTH CHECK
    // ======================
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // ======================
    // BODY
    // ======================
    const { roomId, action, reason } = await req.json();

    if (!roomId) {
      return NextResponse.json(
        { message: "Room ID is required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(action)) {
      return new NextResponse("Invalid action", { status: 400 });
    }

    // ======================
    // FIND PARTNER
    // ======================
    const partner = await User.findOne({
      videoKycRoomId: roomId,
      role: "partner",
    });

    if (!partner) {
      return new NextResponse("Partner not found", { status: 404 });
    }

    // ======================
    // HANDLE ACTION
    // ======================
    if (action === "approved") {
      partner.videoKycStatus = "approved";
      partner.rejectionReason = undefined;

      // move to next step (Set Pricing)
      partner.partnerOnboardingSteps = 6;
    }

    if (action === "rejected") {
      if (!reason || reason.trim() === "") {
        return NextResponse.json(
          { message: "Rejection reason required" },
          { status: 400 }
        );
      }

      partner.videoKycStatus = "rejected";
      partner.rejectionReason = reason.trim();

      // stay on KYC step
      partner.partnerOnboardingSteps = 5;
    }

    await partner.save();

    // ======================
    // RESPONSE
    // ======================
    return NextResponse.json(
      {
        status: partner.videoKycStatus,
        step: partner.partnerOnboardingSteps,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("KYC COMPLETE ERROR:", error);

    return NextResponse.json(
      { message: `KYC complete error: ${error.message}` },
      { status: 500 }
    );
  }
}