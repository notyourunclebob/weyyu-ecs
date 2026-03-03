import { createClaim } from "@/tools/ClaimManager";
import { NextRequest } from "next/server";

export function POST(request: NextRequest) {
    return createClaim(request);
}