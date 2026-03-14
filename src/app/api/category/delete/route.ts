import { deleteCategory } from "@/tools/CategoryManager";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
    return deleteCategory(request);
}