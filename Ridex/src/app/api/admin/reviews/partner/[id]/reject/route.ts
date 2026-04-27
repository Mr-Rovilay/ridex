import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest } from "next/server";

export async function POST(
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
    // GET BODY
    // ======================
    const { rejectionReason } = await req.json();

    if (!rejectionReason || rejectionReason.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Rejection reason is required" }),
        { status: 400 }
      );
    }

    // ======================
    // GET PARTNER
    // ======================
    const { id } = await context.params;

    const partner = await User.findById(id);
    if (!partner || partner.role !== "partner") {
      return new Response("Partner not found", { status: 404 });
    }

    // ======================
    // PREVENT DOUBLE REJECTION
    // ======================
    if (partner.partnerStatus === "rejected") {
      return new Response(
        JSON.stringify({ message: "Partner already rejected" }),
        { status: 400 }
      );
    }
    if (partner.partnerStatus === "approved") {
  return new Response(
    JSON.stringify({ message: "Cannot reject an approved partner" }),
    { status: 400 }
  );
}

    // ======================
    // REJECT PARTNER
    // ======================
    partner.partnerStatus = "rejected";
    partner.rejectionReason = rejectionReason;

    await partner.save();

    // ======================
    // RESPONSE
    // ======================
    return Response.json(
      { message: "Partner rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("REJECT PARTNER ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}