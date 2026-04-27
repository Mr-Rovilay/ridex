/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs";
import User from "@/models/userModel";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ================= AUTH =================
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

    // ================= FORM DATA =================
    const formData = await req.formData();

    const aadhar = formData.get("aadhar") as File | null;
    const license = formData.get("license") as File | null;
    const rc = formData.get("rc") as File | null;

    if (!aadhar || !license || !rc) {
      return new Response(
        JSON.stringify({
          error: "All documents (aadhar, license, rc) are required",
        }),
        { status: 400 }
      );
    }

    // ================= UPLOAD HELPERS =================
    const uploadFile = async (file: File, name: string) => {
      const url = await uploadOnCloudinary(file);

      if (!url) {
        throw new Error(`${name} upload failed`);
      }

      return url;
    };

    // ================= UPLOAD FILES =================
    let aadharUrl, licenseUrl, rcUrl;

    try {
      aadharUrl = await uploadFile(aadhar, "Aadhar");
      licenseUrl = await uploadFile(license, "License");
      rcUrl = await uploadFile(rc, "RC");
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }

    // ================= SAVE DOCS =================
    const partnerDocs = await PartnerDocs.findOneAndUpdate(
      { owner: user._id },
      {
        owner: user._id,
        aadharUrl,
        licenseUrl,
        rcUrl,
        status: "pending",
      },
      { returnDocument: "after", upsert: true }
    );

    // ================= UPDATE USER ONBOARDING =================
    if ((user.partnerOnBoardingStep || 0) < 2) {
      user.partnerOnBoardingStep = 2;
    } else {
      user.partnerOnBoardingStep = 3;
    }
    user.partnerStatus = "pending"
    user.role = "partner";
    await user.save();

    // ================= RESPONSE =================
    return new Response(
      JSON.stringify({
        partner: partnerDocs,
        message: "Documents uploaded successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in documents onboarding:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}