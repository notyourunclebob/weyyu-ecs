import { editCategory } from "@/tools/CategoryManager";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, {params}: {params: Promise<{id:string}>}) {
    const { id } = await params;
    return editCategory(request, id);
}