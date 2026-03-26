import { createEmployee } from "@/tools/EmployeeManager";
import { NextRequest } from "next/server";

export function POST(request: NextRequest) {
    return createEmployee(request);
}