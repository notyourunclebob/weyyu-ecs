import { authOptions } from "@/lib/auth";
import { getJSONData } from "@/tools/Toolkit";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Header from "../components/Header";
import PieChart from "../components/PieChart";
import { CategoryBarChart, ExpenseBarchart } from "../components/BarChart";

import { Report, ReportCategory } from "@/tools/repot.model";
import ExportPdf from "../components/ExportPdf";
import { PieSlice } from "@/tools/PieChartGen";

export default async function getFullReoprt() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const data = await getJSONData(
    `${process.env.NEXTAUTH_URL}/api/report/full`,
    0,
  );

  if (data.error) {
    return <div>{data.error}</div>;
  } else if (!data) {
    return <div>Failed to connect to database.</div>;
  } else {
    const reportData: Report = data.report;
    const timestamp = new Date(reportData.timestamp).toISOString();

    // colours for pie chart generation
    const CATEGORY_COLORS = [
      "#6366f1",
      "#22d3ee",
      "#f59e0b",
      "#10b981",
      "#f43f5e",
      "#8b5cf6",
      "#ec4899",
    ];

    // mapping report data for piechart generation
    const pieData: PieSlice[] = reportData.categoryData.map((category, i) => ({
      label: category.name,
      percentage: category.categoryPercent,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));

    return (
      <main>
        <Header />
        <div>
          <div id="full-report" className="w-full h-fit p-10">
            <div>ECS Report: {timestamp}</div>
            <div>Total Claims</div>
            <table>
              <thead>
                <tr>
                  <th>Total</th>
                  <th>Pending</th>
                  <th>Approved</th>
                  <th>Pending Expenses</th>
                  <th>Approved Expenses</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-mono bg-gray-200">
                  <td>{reportData.totalClaims}</td>
                  <td>{reportData.totalPending}</td>
                  <td>{reportData.totalApproved}</td>
                  <td>
                    $
                    {reportData.totalPendingExpense.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    $
                    {reportData.totalApprovedExpense.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>

            <div>Per Claim Category</div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total</th>
                  <th>Pending</th>
                  <th>Approved</th>
                  <th>Pending Expenses</th>
                  <th>Approved Expenses</th>
                </tr>
              </thead>
              <tbody>
                {reportData.categoryData.map(
                  (reportCategory: ReportCategory, index) => (
                    <tr
                      key={index}
                      className={`font-mono ${index % 2 === 0 ? "bg-gray-200" : "bg-gray-300"}`}
                    >
                      <td>{reportCategory.name}</td>
                      <td>{reportCategory.total}</td>
                      <td>{reportCategory.pending}</td>
                      <td>{reportCategory.approved}</td>
                      <td>
                        $
                        {reportCategory.pendingExpense.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        $
                        {reportCategory.approvedExpense.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            <div className="flex">
              <ExpenseBarchart data={reportData} />
              <PieChart data={pieData} size={300} />
            </div>
            <CategoryBarChart data={reportData.categoryData} />
          </div>
          <ExportPdf
            targetId="full-report"
            filename={`ECS-report-${timestamp}.pdf`}
          />
        </div>
      </main>
    );
  }
}
