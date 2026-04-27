import connectDB from "@/lib/db";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/sendMail";   // ← make sure this path is correct

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 12);

    let user;

    if (existingUser && !existingUser.isEmailVerified) {
      // Update unverified user
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiresAt = otpExpiresAt;
      user = await existingUser.save();
    } else if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 });
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiresAt,
      });
    }

    await sendMail(
      email,
      "Your Ridex Email Verification OTP",
      `<h2>Your verification code is: <strong>${otp}</strong></h2><p>It expires in 10 minutes.</p>`
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { success: true, message: "OTP sent successfully", data: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}