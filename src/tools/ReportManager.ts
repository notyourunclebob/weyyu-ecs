import { MongoClient } from "mongodb";
import { Report, ReportCategory } from "./repot.model";
import { Claim } from "./claim.model";
import { NextResponse } from "next/server";

const URL: string = process.env.DB_URL || "mongodb://mongo:27017/";
const DB_NAME: string = "ecsdb";
const COLLECTION_CLAIMS: string = "claims";

/** 
 * Generates a report of claims total expenses and statuses ommiting denied claims. Also generates reports per claim category.
*/
export async function getFullReport() {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        const collection = await mongoClient.db(DB_NAME).collection<Claim>(COLLECTION_CLAIMS);

        const pipeline = [
        // Stage 1: Group by category
        {
            $group: {
            _id: "$category.name",
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            approved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
            denied: { $sum: { $cond: [{ $eq: ["$status", "denied"] }, 1, 0] } },
            pendingExpense: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] } },
            approvedExpense: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, "$amount", 0] } },
            },
        },

        // Stage 2: Per-category percentages
        {
            $addFields: {
            pendingPercent: {
                $cond: [
                { $eq: ["$total", 0] },
                0,
                { $round: [{ $multiply: [{ $divide: ["$pending", "$total"] }, 100] }, 0] },
                ],
            },
            approvedPercent: {
                $cond: [
                { $eq: ["$total", 0] },
                0,
                { $round: [{ $multiply: [{ $divide: ["$approved", "$total"] }, 100] }, 0] },
                ],
            },
            deniedPercent: {
                $cond: [
                { $eq: ["$total", 0] },
                0,
                { $round: [{ $multiply: [{ $divide: ["$denied", "$total"] }, 100] }, 0] },
                ],
            },
            },
        },

        // Stage 3: Roll up into single document
        {
            $group: {
            _id: null,
            totalClaims:         { $sum: "$total" },
            totalPending:        { $sum: "$pending" },
            totalApproved:       { $sum: "$approved" },
            totalDenied:         { $sum: "$denied" },
            totalPendingExpense:  { $sum: "$pendingExpense" },
            totalApprovedExpense: { $sum: "$approvedExpense" },
            categoryData: {
                $push: {
                name:            "$_id",
                total:           "$total",
                pending:         "$pending",
                approved:        "$approved",
                denied:          "$denied",
                pendingExpense:  "$pendingExpense",
                approvedExpense: "$approvedExpense",
                pendingPercent:  "$pendingPercent",
                approvedPercent: "$approvedPercent",
                deniedPercent:   "$deniedPercent",
                },
            },
            },
        },

        // Stage 4: Compute categoryPercent and add report generation timestamp
        {
            $addFields: {
            timestamp: "$$NOW",
            categoryData: {
                $map: {
                input: "$categoryData",
                as: "cat",
                in: {
                    $mergeObjects: [
                    "$$cat",
                    {
                        categoryPercent: {
                        $cond: [
                            { $eq: ["$totalClaims", 0] },
                            0,
                            { $round: [{ $multiply: [{ $divide: ["$$cat.total", "$totalClaims"] }, 100] }, 0] },
                        ],
                        },
                    },
                    ],
                },
                },
            },
            },
        },

        // Stage 5: Top-level percentages and clean up
        {
            $project: {
            _id: 0,
            totalClaims:   1,
            totalPending:  1,
            totalApproved: 1,
            totalDenied:   1,
            totalPendingExpense:  1,
            totalApprovedExpense: 1,
            totalPendingPercent: {
                $cond: [
                    { $eq: ["$totalClaims", 0] },
                    0,
                    { $round: [{ $multiply: [{ $divide: ["$totalPending", "$totalClaims"] }, 100] }, 0] },
                ],
            },
            totalApprovedPercent: {
                $cond: [
                    { $eq: ["$totalClaims", 0] },
                    0,
                    { $round: [{ $multiply: [{ $divide: ["$totalApproved", "$totalClaims"] }, 100] }, 0] },
                ],
            },
            totalDeniedPercent: {
                $cond: [
                    { $eq: ["$totalClaims", 0] },
                    0,
                    { $round: [{ $multiply: [{ $divide: ["$totalDenied", "$totalClaims"] }, 100] }, 0] },
                ],
            },
            timestamp:    1,
            categoryData: 1,
            },
        },
        ];

        const [report]: Report[] = await collection.aggregate<Report>(pipeline).toArray();

        if (!report) {
            let error = "Failed to generate Report"
            return NextResponse.json(
                { error: error },
                { status: 404, statusText: error }
            );
        } else {
            return NextResponse.json(
                { 
                    message: "Report generated",
                    report: report, 
                }
            );

        }

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    } finally {
        mongoClient.close();
    }
}