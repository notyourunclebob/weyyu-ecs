import { getEmployees } from "@/tools/EmployeeManager";

export function GET() {
    return(getEmployees());
}