"use client";

import { useState } from "react";
import { sendJSONData } from "@/tools/Toolkit";
import { PdfExport } from "@/tools/PdfExport";
import { useRouter } from "next/navigation";

import { Report, ReportCategory } from "@/tools/repot.model";
import { PieSlice } from "@/tools/PieChartGen";

import { ExpenseBarchart, CategoryBarChart } from "./BarChart";
import PieChart from "./PieChart";

export default function GetReport() {
  const router = useRouter();
  // pie chart porps
  const CATEGORY_COLORS = [
    "#6366f1",
    "#22d3ee",
    "#f59e0b",
    "#10b981",
    "#f43f5e",
    "#8b5cf6",
    "#ec4899",
  ];
  const [pieData, setPieData] = useState<PieSlice[]>();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("");
  const [invalid, setInvalid] = useState<string>("");

  const [reportData, setReportData] = useState<Report>();
  const [timestamp, setTimestamp] = useState<string>();
  const [reportOk, setReportOk] = useState<boolean>();

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  // pdf export ref
  const { ref, exportPdf } = PdfExport<HTMLDivElement>({
    filename: `report-${timestamp}.pdf`,
    scale: 2,
    orientation: "portrait",
  });

  // setting start and end dates
  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    if (endDate && value > endDate) {
      setInvalid("Start date cannot be after end date");
    } else {
      setInvalid("");
    }
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);
    if (startDate && value < startDate) {
      setInvalid("End date cannot be before start date");
    } else {
      setInvalid("");
    }
  };

  // getting the report with or without date filter
  const getReport = async () => {
    try {
      const result = await sendJSONData(`/api/report/full`, {
        start: startDate || undefined,
        end: endDate || undefined,
      });

      if (!result) {
        setStatus("error");
        setMessage("No response from server");
        setReportOk(false);
        return;
      } else if (result === null) {
        setStatus("error");
        setMessage("An error occored generating the report");
        setReportOk(false);
        return;
      }

      if (result.status === 200) {
        const data: Report = result.data.report;
        const pie: PieSlice[] = data.categoryData.map((category, i) => ({
          label: category.name,
          percentage: category.categoryPercent,
          color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        }));

        setReportData(data);
        setTimestamp(new Date(data.timestamp).toISOString());
        setPieData(pie);

        setDateRange(
          `Showing ${
            startDate && endDate
              ? `data from ${startDate} to ${endDate}`
              : startDate && !endDate
                ? `data from ${startDate} to now`
                : !startDate && endDate
                  ? `data up to ${endDate}`
                  : "all data"
          }`,
        );

        setReportOk(true);
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error);
      setReportOk(false);
    }
  };

  return (
    <div className="min-h-screen bg-yutaniGrey p-7">
      <div className="bg-black rounded-2xl p-6 min-h-[calc(100vh-130px)]">
        <div>
          <div className="flex flex-col items-center">
            <div className="p-2 text-yutaniGrey text-xl text-center">
              Filter by date
            </div>
            <div className=" p-4 bg-yutaniGrey rounded">
              <div className="flex gap-4">
                <div>
                  <div>Start Date</div>
                  <input
                    type="date"
                    value={startDate}
                    className="bg-white p-2 rounded"
                    onChange={handleStartDate}
                  />
                </div>
                <div>
                  <div>End Date</div>
                  <input
                    type="date"
                    value={endDate}
                    className="bg-white p-2 rounded"
                    onChange={handleEndDate}
                  />
                </div>
              </div>
              <div className="text-red-700">{invalid}</div>
            </div>
            <div className="flex justify-between gap-4 p-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-12 py-3 bg-gray-300 border-2 border-gray-300 text-black font-light rounded hover:bg-gray-400 transition disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                className="px-12 py-3 bg-yellow-400 border-2 border-yellow-300 text-black font-bold rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={getReport}
                disabled={invalid !== ""}
              >
                Get Report
              </button>
            </div>
          </div>
        </div>
        {reportOk === true ? (
          <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center">
              <div ref={ref} className="w-300 h-fit p-10 bg-white">
                <div className="flex justify-between">
                  <div className="pb-2">ECS Report: {timestamp}</div>
                  <div>{dateRange}</div>
                </div>
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
                      <td>{reportData!.totalClaims}</td>
                      <td>{reportData!.totalPending}</td>
                      <td>{reportData!.totalApproved}</td>
                      <td>
                        $
                        {reportData!.totalPendingExpense.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}
                      </td>
                      <td>
                        $
                        {reportData!.totalApprovedExpense.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <ExpenseBarchart data={reportData!} />
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
                    {reportData!.categoryData.map(
                      (reportCategory: ReportCategory, index) => (
                        <tr key={index}>
                          <td>{reportCategory.name}</td>
                          <td>{reportCategory.total}</td>
                          <td>{reportCategory.pending}</td>
                          <td>{reportCategory.approved}</td>
                          <td>
                            $
                            {reportCategory.pendingExpense.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                              },
                            )}
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

                <CategoryBarChart data={reportData!.categoryData} />
                <PieChart data={pieData!} size={300} />
              </div>
            </div>
            <button
              onClick={exportPdf}
              className="px-12 py-3 m-4 w-fit bg-gray-300 border-2 border-gray-300 text-black font-light rounded hover:bg-gray-400 transition disabled:opacity-50"
            >
              Export PDF
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
