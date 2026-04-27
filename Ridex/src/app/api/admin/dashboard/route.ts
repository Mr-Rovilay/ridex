import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import Vehicle from "@/models/vehicleModel";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();

    // 🔐 AUTH CHECK
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // 📊 COUNTS
    const totalPartners = await User.countDocuments({ role: "partner" });

    const totalApprovedPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "approved",
    });

    const totalRejectedPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "rejected",
    });

    const totalPendingPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "pending",
    });

    // 👥 GET PENDING PARTNERS (IMPORTANT: await added)
    const pendingPartnerUsers = await User.find({
      role: "partner",
      partnerStatus: "pending",
      // partnerOnboardingSteps: {$gte: 4}, 

    });

    // 🆔 EXTRACT IDS
    const partnerIds = pendingPartnerUsers.map((p) => p._id);

    // 🚗 FETCH VEHICLES
    const partnerVehicles = await Vehicle.find({
      owner: { $in: partnerIds },
    }).populate("owner", "name email mobileNumber");

    // 🧠 MAP VEHICLE TYPE (FIXED populate bug)
    const vehicleTypeMap = new Map(
      partnerVehicles.map((v) => [
        String((v.owner as any)._id), // ✅ FIX: access _id from populated owner
        v.type,
      ])
    );

    // 📦 FINAL RESPONSE DATA
    const pendingPartnersReviews = pendingPartnerUsers.map((p) => ({
      id: p._id,
      name: p.name,
      email: p.email,
      mobileNumber: p.mobileNumber,
      vehicleType: vehicleTypeMap.get(String(p._id)) || "N/A",
    }));

    const pendingVehicles = await Vehicle.find({
      status: "pending",
      baseFare: { $exists: true },
      pricePerKm: { $exists: true }
    }).populate("owner")

    return Response.json({
      pendingVehicles,
      stats: {
        totalPartners,
        totalApprovedPartners,
        totalRejectedPartners,
        totalPendingPartners,
      },
      pendingPartnersReviews,
    },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET DASHBOARD ERROR:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}