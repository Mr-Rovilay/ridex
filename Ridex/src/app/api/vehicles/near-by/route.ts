import connectDB from "@/lib/db";
import User from "@/models/userModel";
import Vehicle from "@/models/vehicleModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { latitude, longitude, vehicleType } = await req.json()

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number" ||
            isNaN(latitude) ||
            isNaN(longitude)
        ) {
            return NextResponse.json(
                { message: "Valid coordinates are required" },
                { status: 400 }
            );
        }

        // 2. Find nearby online/approved partners
        const partners = await User.find({
            role: "partner",
            isOnline: true,
            partnerStatus: "approved",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude] // MongoDB uses [lng, lat]
                    },
                    $maxDistance: 10000 // 10km radius
                }
            }
        });

        // if (partners.length === 0) {
        //     return NextResponse.json({ vehicles: [] }, { status: 200 });
        // }

        const partnerIds = partners.map(p => p._id);

        if (partnerIds.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // 3. Find matching vehicles for those partners
        const vehicles = await Vehicle.find({
            owner: { $in: partnerIds },
            ...(vehicleType && { type: vehicleType }), // only filter if exists
            status: "approved",
            isActive: true
        }).populate("owner", "name mobileNumber").lean(); // Populate owner details for the UI

        return NextResponse.json({ vehicles }, { status: 200 });

    } catch (error: any) {
        console.error("Fetch Vehicles Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}