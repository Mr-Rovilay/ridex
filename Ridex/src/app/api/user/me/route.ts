import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/userModel";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json({ user: user, success: true });
  } catch (error) {
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
