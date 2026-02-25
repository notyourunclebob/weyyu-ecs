import { getEmployees } from "@/tools/EmployeeManager";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
    return(getEmployees());
}