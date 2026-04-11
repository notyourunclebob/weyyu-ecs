import { authOptions } from "@/lib/auth";
import { getJSONData } from "@/tools/Toolkit";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Header from "../components/Header";
import GetReport from "../components/GetReport";

import { Report } from "@/tools/repot.model";
import { PieSlice } from "@/tools/PieChartGen";

export default async function getFullReoprt() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <Header />
      <GetReport />
    </main>
  );
}
