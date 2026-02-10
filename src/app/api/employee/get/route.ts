import { getEmployees } from "@/tools/EmployeeManager";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
    // if (request.admin === true) {
        
    // }

    return(getEmployees());
}