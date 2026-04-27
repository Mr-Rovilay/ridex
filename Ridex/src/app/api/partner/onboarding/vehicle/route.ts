import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import Vehicle from "@/models/vehicleModel";
import { NextRequest } from "next/server";

// Flexible validation (real-world friendly)
const VEHICLE_REGEX = /^[A-Z0-9]{5,12}$/;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const body = await req.json();
    const { type, number, vehicleModel } = body;

    if (!type || !number || !vehicleModel) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // ✅ CLEAN INPUT (VERY IMPORTANT)
    const vehicleNumber = number.replace(/\s/g, "").toUpperCase();

    // ✅ VALIDATE
    if (!VEHICLE_REGEX.test(vehicleNumber)) {
      return new Response(
        JSON.stringify({ error: "Invalid vehicle number format" }),
        { status: 400 }
      );
    }

    // ✅ CHECK DUPLICATE
    const duplicate = await Vehicle.findOne({
      number: vehicleNumber,
      owner: { $ne: user._id },
    });

    if (duplicate) {
      return new Response(
        JSON.stringify({ message: "Vehicle already registered" }),
        { status: 400 }
      );
    }

    let vehicle = await Vehicle.findOne({ owner: user._id });

    if (vehicle) {
      // UPDATE
      vehicle.type = type;
      vehicle.number = vehicleNumber;
      vehicle.vehicleModel = vehicleModel;
      vehicle.status = "pending";

      await vehicle.save();
      if (user.partnerOnboardingSteps < 2) {
        user.partnerOnboardingSteps = 2
        user.partnerStatus = "pending"
        await user.save()
      } else {
        user.partnerOnboardingSteps = 3
        user.partnerStatus = "pending"
        await user.save()
      }

      return Response.json(
        { vehicle, message: "Vehicle updated" },
        { status: 200 }
      );
    }

    // CREATE
    vehicle = await Vehicle.create({
      type,
      number: vehicleNumber,
      vehicleModel,
      owner: user._id,
      status: "pending",
    });

    // UPDATE USER
    if ((user.partnerOnboardingStep || 0) < 1) {
      user.partnerOnboardingStep = 1;
    }
    // else if (user.partnerOnboardingStep < 2){
    //   user.partnerOnboardingStep = 2;
    // }
    // else {
    //   user.partnerOnboardingStep = 3;
    // }

    user.role = "partner";
    user.partnerStatus = "pending"
    await user.save();

    return Response.json(
      { vehicle, message: "Vehicle created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST VEHICLE ERROR:", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

// =======================
// GET USER VEHICLE
// =======================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const vehicle = await Vehicle.findOne({ owner: user._id });

    if (!vehicle) {
      return new Response(JSON.stringify({ error: "Vehicle not found" }), {
        status: 404,
      });
    }

    return Response.json({ vehicle }, { status: 200 });
  } catch (error) {
    console.error("GET VEHICLE ERROR:", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
