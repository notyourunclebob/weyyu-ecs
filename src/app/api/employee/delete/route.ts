import { deleteEmployee } from "@/tools/EmployeeManager";
import { NextRequest } from "next/server";


export function DELETE(request: NextRequest) {
    return deleteEmployee(request);
}