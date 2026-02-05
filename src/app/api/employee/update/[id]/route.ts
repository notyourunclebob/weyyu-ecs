import { NextRequest } from "next/server";
import { updateEmployee } from "@/tools/EmployeeManager";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id:string }>}) {
    const { id } = await params;
    return updateEmployee(request, id);
}