import { getClaimsEmployee } from "@/tools/ClaimManager";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return getClaimsEmployee(request);
}