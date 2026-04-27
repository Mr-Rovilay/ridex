import { auth } from "@/auth";
import connectDB from "@/lib/db";
import PartnerBank from "@/models/partnerBank";
import User from "@/models/userModel";
import { NextRequest } from "next/server";

// =======================
// CREATE BANK DETAILS
// =======================
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

    const { accountHolder, accountNumber, upi, ifsc, mobileNumber } =
      await req.json();

    if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const partnerBank = await PartnerBank.findOneAndUpdate(
      { owner: user._id },
      {
        owner: user._id,
        accountHolder,
        accountNumber,
        upi,
        ifsc,
        status: "added",
      },
      { new: true, upsert: true },
    );

    user.mobileNumber = mobileNumber;

    if ((user.partnerOnboardingSteps || 0) < 3) {
      user.partnerOnboardingSteps = 3;
    }
    // if ((user.partnerOnboardingSteps || 0) < 4) {
    // user.partnerOnboardingSteps = 3;
    // }

    user.partnerStatus = "pending";

    await user.save();

    return Response.json(
      {
        partnerBank,
        message: "Bank details added successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST BANK ERROR:", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

// =======================
// GET BANK DETAILS
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

    const partnerBank = await PartnerBank.findOne({ owner: user._id });

    if (!partnerBank) {
      return new Response(JSON.stringify({ error: "Bank details not found" }), {
        status: 404,
      });
    }
    return Response.json(
      { partnerBank, mobileNumber: user.mobileNumber },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET BANK ERROR:", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

// =======================
// UPDATE BANK DETAILS
// =======================
export async function PUT(req: NextRequest) {
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

    const { accountHolder, accountNumber, upi, ifsc, mobileNumber } =
      await req.json();

    if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const partnerBank = await PartnerBank.findOneAndUpdate(
      { owner: user._id },
      {
        accountHolder,
        accountNumber,
        upi,
        ifsc,
        status: "updated",
      },
      { new: true },
    );

    if (!partnerBank) {
      return new Response(JSON.stringify({ error: "Bank details not found" }), {
        status: 404,
      });
    }

    user.mobileNumber = mobileNumber;
    await user.save();

    return Response.json(
      {
        partnerBank,
        message: "Bank details updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT BANK ERROR:", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
