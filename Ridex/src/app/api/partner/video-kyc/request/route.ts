import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const partner = await User.findOne({ email: session.user.email });

    if (!partner || partner.role !== "partner") {
      return NextResponse.json({ message: "Not a partner" }, { status: 403 });
    }

    if (partner.videoKycStatus !== "rejected") {
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 400 }
      );
    }

    partner.videoKycStatus = "pending";
    partner.videoKycRejectionReason = undefined;
    partner.videoKycRoomId = undefined
    partner.partnerOnboardingSteps = 5;

    await partner.save();

    return NextResponse.json({ message: "KYC re-requested" }, { status: 200 });

  } catch (error: any) {
    console.error("RESET KYC ERROR:", error);

    return NextResponse.json(
      { message: `Error resetting KYC: ${error.message}` },
      { status: 500 }
    );
  }
}