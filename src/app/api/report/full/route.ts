import { getFullReport } from "@/tools/ReportManager";

export function POST() {
    return getFullReport();
}