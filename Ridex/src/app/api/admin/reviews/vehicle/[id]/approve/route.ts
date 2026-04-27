import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import Vehicle from "@/models/vehicleModel";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }
    
    await connectDB();
    const vehicleId = (await context.params).id;
    const vehicle = await Vehicle.findById(vehicleId).populate("owner");
    
    if (!vehicle) {
      return new Response("Vehicle not found", { status: 404 });
    }
    
    // Update vehicle status
    vehicle.status = "approved";
    vehicle.rejectionReason = undefined;
    await vehicle.save();

    // Update partner's onboarding step
    const partner = await User.findById(vehicle.owner);
    if (!partner) {
      return Response.json({ message: "Partner not found" }, { status: 404 });
    }
    
    // Move to step 7 (Final Review) after pricing approval
    if (partner.partnerOnboardingSteps < 7) {
      partner.partnerOnboardingSteps = 7;
      await partner.save();
    }
    
    return Response.json(
      { 
        message: "Vehicle approved successfully",
        vehicle,
        partner: { onboardingStep: partner.partnerOnboardingSteps }
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving vehicle:", error);
    return Response.json(
      { message: `Vehicle review approval error: ${error}` }, 
      { status: 500 }
    );
  }
}