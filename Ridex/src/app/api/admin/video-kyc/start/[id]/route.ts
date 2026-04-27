import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    // ======================
    // AUTH CHECK
    // ======================
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    // ======================
    // GET PARTNER
    // ======================
    const partnerId = (await context.params).id;

    const partner = await User.findById(partnerId);
    if (!partner || partner.role !== "partner") {
      return new NextResponse("Partner not found", { status: 404 });
    }


    // FIXED: Date.now needed parentheses to execute the function
    const roomId = `kyc-${partner.id}-${Date.now()}`;

    partner.videoKycRoomId = roomId;
    partner.videoKycStatus = "in_progress";

    // FIXED: Capitalization typo. Schema uses "partnerOnboardingSteps" (lowercase 'b')
    partner.partnerOnboardingSteps = 4;

    await partner.save();

    return NextResponse.json({ roomId }, { status: 200 });

  } catch (error) {
    // FIXED: Populated the empty catch block to prevent silent failures
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: `Failed to initiate KYC room: ${errorMessage}` },
      { status: 500 }
    );
  }
}