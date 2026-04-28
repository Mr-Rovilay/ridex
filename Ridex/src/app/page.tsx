import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import GeoUpdater from "@/components/GeoUpdater";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";
import connectDB from "@/lib/db";
import User from "@/models/userModel";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const user = await User.findOne({ email: session?.user?.email });

  if (!session) return <PublicHome />;

  switch (user?.role) {
    case "admin":
      return <AdminDashboard />;

    case "partner":
      return (
        <>
          <GeoUpdater userId={user._id.toString()} />
          <PartnerDashboard />
        </>
      );

    default:
      return (
        <>
          <GeoUpdater userId={user._id.toString()} />
          <PublicHome />
        </>
      );
  }
}