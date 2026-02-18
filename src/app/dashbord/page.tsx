import Header from "../components/Header";
import { Claim } from "@/tools/claim.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getJSONData } from "@/tools/Toolkit";
import Dashboard from "../components/Dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let claims: Claim[] = [];
  if (session.user.admin) {
    const data = await getJSONData("/api/claim/getAll");
    claims = data.claims;
  }

  return (
    <div>
      <Header />
      <Dashboard claims={claims} />
    </div>
  );
}