import { getCategories } from "@/tools/CategoryManager";

export function GET() {
    return getCategories();
}