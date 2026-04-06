"use client";

import { Report, ReportCategory } from "@/tools/repot.model";
import ExportPdf from "./ExportPdf";

export default function FullReport({ reportData }: { reportData: Report }) {
  const timestamp = new Date(reportData.timestamp).toISOString();

  return (
    <div>
      <div id="full-report" className="w-full p-10 pdf-safe">
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
                    {reportCategory.approvedExpense.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <ExportPdf
        targetId="full-report"
        filename={`ECS-report-${timestamp}.pdf`}
      />
    </div>
  );
}
