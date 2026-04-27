import { auth } from "@/auth";
import connectDB from "@/lib/db";
import PartnerBank from "@/models/partnerBank";
import PartnerDocs from "@/models/partnerDocs";
import User from "@/models/userModel";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ======================
    // AUTH CHECK
    // ======================
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();

    // ======================
    // GET PARTNER
    // ======================
    const { id } = await context.params;

    const partner = await User.findById(id);
    if (!partner || partner.role !== "partner") {
      return new Response("Partner not found", { status: 404 });
    }

    // ======================
    // ALREADY APPROVED CHECK
    // ======================
    if (partner.partnerStatus === "approved") {
      return Response.json(
        { message: "Partner already approved" },
        { status: 400 }
      );
    }

    // ======================
    // FETCH RELATED DATA
    // ======================
    const partnerDocs = await PartnerDocs.findOne({
      owner: partner._id,
    });

    const partnerBank = await PartnerBank.findOne({
      owner: partner._id,
    });

    // ======================
    // VALIDATE ONBOARDING
    // ======================
    if (!partnerDocs || !partnerBank) {
      return Response.json(
        { message: "Partner has not completed onboarding steps" },
        { status: 400 }
      );
    }

    // ======================
    // APPROVE PARTNER
    // ======================
    partner.partnerStatus = "approved";
    partner.videoKycStatus = "pending";
    partner.partnerOnboardingSteps = 4; // move to next step

    await partner.save();

    // Update docs
    partnerDocs.status = "approved";
    await partnerDocs.save();

    // Update bank
    partnerBank.status = "verified";
    await partnerBank.save();

    // ======================
    // RESPONSE
    // ======================
    return Response.json(
      { message: "Partner approved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("APPROVE PARTNER ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}