import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Vehicle from "@/models/vehicleModel";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    try {
        const session = await auth();
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response("Unauthorized", { status: 401 });
        }
        await connectDB();
        const vehicleId = (await context.params).id;
        if (!vehicleId || vehicleId === "undefined") {
            return new Response("Invalid vehicle ID", { status: 400 });
        }
        const vehicle = await Vehicle.findById(vehicleId).populate("owner");
        if (!vehicle) {
            return new Response("vehicle not found", { status: 404 });
        }
        return Response.json(vehicle, { status: 200 },)
    } catch (error) {
        return Response.json({ message: `vehicle review get error ${error}` }, { status: 500 });
    }
}