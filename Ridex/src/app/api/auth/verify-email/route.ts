import connectDB from "@/lib/db";
import User from "@/models/userModel";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return Response.json({ success: false, message: "Email and OTP are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

    if (user.isEmailVerified) {
      return Response.json({ success: false, message: "Email already verified" }, { status: 400 });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return Response.json({ success: false, message: "OTP has expired" }, { status: 400 });
    }

    if (user.otp !== otp) {
      return Response.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return Response.json({ success: true, message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}