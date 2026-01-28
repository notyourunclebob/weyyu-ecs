import { NextRequest } from "next/server";
import { employeeLogin } from "@/tools/EmployeeManager";

export function POST(request:NextRequest) {

    console.log(request);
    return employeeLogin(request);
}