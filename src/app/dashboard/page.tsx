export const dynamic = 'force-dynamic';

import Header from "../components/Header";
import { Claim } from "@/tools/claim.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getJSONData, sendJSONData } from "@/tools/Toolkit";
import Dashboard from "../components/Dashboard";
import { redirect } from "next/navigation";
import { CategoryBase } from "@/tools/categoryBase.model";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let claims: Claim[] = [];
  if (session.user.admin) {
    const data = await getJSONData(`${process.env.NEXTAUTH_URL}/api/claim/getAll`, false);
    claims = data.claims;
  } else {
    const employeeData = { employeeId: session.user.employeeId };
    const data = await sendJSONData(`${process.env.NEXTAUTH_URL}/api/claim/getByEmployee`, employeeData);
    claims = data?.data.claims;
  }

  let categories: CategoryBase[] = [];
  const categoryData = await getJSONData(`${process.env.NEXTAUTH_URL}/api/category/getAll`, 0);
  categories = categoryData.categories;

  let unacknowledgedClaims: Claim[] = [];
  if (!session.user.admin) {
    unacknowledgedClaims = (claims ?? []).filter(
      (claim: Claim) => !claim.acknowledged && claim.status !== "pending"
    );
  }

  return (
    <div>
      <Header />
      <Dashboard claims={claims} categories={categories} unacknowledgedClaims={unacknowledgedClaims} />
    </div>
  );
}