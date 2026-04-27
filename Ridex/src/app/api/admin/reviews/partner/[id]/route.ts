import { auth } from "@/auth";
import connectDB from "@/lib/db";
import PartnerBank from "@/models/partnerBank";
import PartnerDocs from "@/models/partnerDocs";
import User from "@/models/userModel";
import Vehicle from "@/models/vehicleModel";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: {params:Promise<{ id: string }>}) {

    try {
        const session = await auth();
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response("Unauthorized", { status: 401 });
        }
        await connectDB();
        const partnerId = (await context.params).id;
        const partner = await User.findById(partnerId);
        if (!partner || partner.role !== "partner") {
            return new Response("Partner not found", { status: 404 });
        }
        const vehicle = await Vehicle.findOne({ owner: partnerId });
        const documents = await PartnerDocs.findOne({ owner: partnerId });
        const bank = await PartnerBank.findOne({ owner: partnerId });
        
        return Response.json({
            partner,
            vehicle:vehicle || null,
            documents:documents || null,
            bank:bank || null
        },{ status: 200 });
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
  
}   