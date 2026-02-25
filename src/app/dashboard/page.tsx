import Header from "../components/Header";
import { Claim } from "@/tools/claim.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getJSONData, sendJSONData } from "@/tools/Toolkit";
import Dashboard from "../components/Dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let claims: Claim[] = [];
  if (session.user.admin) {
    const data = await getJSONData(`${process.env.NEXTAUTH_URL}/api/claim/getAll`);
    claims = data.claims;
  } else {
    const employeeData = { employeeId: session.user.employeeId }
    const data = await sendJSONData(`${process.env.NEXTAUTH_URL}/api/claim/getByEmployee`, employeeData)
    claims = data?.data.claims;
  }

  return (
    <div>
      <Header />
      <Dashboard claims={claims} />
    </div>
  );
}