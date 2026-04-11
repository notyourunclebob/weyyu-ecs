import { NextRequest } from "next/server";

import { getFullReport } from "@/tools/ReportManager";

export function POST(request: NextRequest) {
    return getFullReport(request);
}