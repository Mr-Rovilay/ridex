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

  if (!session) return <PublicHome />;

  const user = await User.findOne({ email: session.user.email });
  if (!user) return <PublicHome />; // handle case where user not in DB

  const userId = user.id;

  switch (user.role) {
    case "admin":
      return (  // <-- return the JSX, no semicolon here
        <>
          <GeoUpdater userId={userId} />
          <AdminDashboard />
        </>
      );

    case "partner":
      return (
        <>
          <GeoUpdater userId={userId} />
          <PartnerDashboard />
        </>
      );

    default:
      return (
        <>
          <GeoUpdater userId={userId} />
          <PublicHome />
        </>
      );
  }
}