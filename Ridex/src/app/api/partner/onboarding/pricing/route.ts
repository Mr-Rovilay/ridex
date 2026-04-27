import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import Vehicle from "@/models/vehicleModel";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const partner = await User.findOne({ email: session.user.email });
    if (!partner) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const vehicle = await Vehicle.findOne({ owner: partner._id });
    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const image = formData.get("image") as File | null;
    const baseFare = formData.get("baseFare");
    const pricePerKm = formData.get("pricePerKm");
    const waitingCharge = formData.get("waitingCharge");

    let updated = false;

    // Upload image
    if (image && image.size > 0) {
      const imageUrl = await uploadOnCloudinary(image);
      vehicle.imageUrl = imageUrl;
      updated = true;
    }

    // Pricing fields
    if (baseFare !== null) {
      vehicle.baseFare = Number(baseFare);
      updated = true;
    }

    if (pricePerKm !== null) {
      vehicle.pricePerKm = Number(pricePerKm);
      updated = true;
    }

    if (waitingCharge !== null) {
      vehicle.waitingCharge = Number(waitingCharge);
      updated = true;
    }

    if (!updated) {
      return Response.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    // Reset status for admin review
    vehicle.status = "pending";
    vehicle.rejectReason = undefined;

    await vehicle.save();

    // ✅ Correct field name
    if ((partner.partnerOnboardingSteps || 0) < 6) {
      partner.partnerOnboardingSteps = 6;
    }

    await partner.save();

    return Response.json(
      {
        message: "Pricing updated successfully",
        step: 6,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("PRICING ERROR:", error);

    return Response.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const partner = await User.findOne({ email: session.user.email });
    if (!partner) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const vehicle = await Vehicle.findOne({ owner: partner._id });
    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 404 });
    }
    return Response.json(vehicle,
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}