import { createCategory } from "@/tools/CategoryManager";
import { NextRequest } from "next/server";

export function POST(request: NextRequest) {
    return createCategory(request);
}