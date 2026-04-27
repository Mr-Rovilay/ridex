import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/userModel";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();

    const partner = await User.find({
      role: "partner",
      // partnerOnboardingSteps: 4,
      videoKycStatus: { $in: ["pending", "in_progress"] },
    });

    return Response.json(partner, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `partner kyc error: ${error}` },
      { status: 500 }
    );
  }
}