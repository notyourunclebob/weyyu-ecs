"use client";
import { PdfExport } from "@/tools/PdfExport";
import { Report, ReportCategory } from "@/tools/repot.model";
import { ExpenseBarchart, CategoryBarChart } from "./BarChart";
import PieChart from "./PieChart";
import { PieSlice } from "@/tools/PieChartGen";

export default function ReportPdf({ reportData }: { reportData: Report }) {
  const timestamp = new Date(reportData.timestamp).toISOString();

  const { ref, exportPdf } = PdfExport<HTMLDivElement>({
    filename: `report-${timestamp}.pdf`,
    scale: 2,
    orientation: "portrait",
  });

  return (
    <div>
      <button
        onClick={exportPdf}
        className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800 transition-colors"
      >
        Export PDF
      </button>
      <div className="flex justify-center">
        <div ref={ref} className="w-300 h-fit p-10 bg-white">
          <div className="pb-2">ECS Report: {timestamp}</div>
          <div className="p-2 bg-black text-yutaniGrey text-xl">
            Expense Summary
          </div>
          <table className="table w-full mb-5">
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

          <ExpenseBarchart data={reportData} />
          <div className="p-2 bg-black text-yutaniGrey text-xl mt-5">
            Category Breakdown
          </div>
          <table className="table w-full mb-5">
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
                  <tr key={index}>
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
                      {reportCategory.approvedExpense.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          <CategoryBarChart data={reportData.categoryData} />
          <PieChart data={pieData} size={300} />
        </div>
      </div>
    </div>
  );
}
