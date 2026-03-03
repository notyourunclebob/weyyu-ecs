import { changeClaimStatus } from "@/tools/ClaimManager";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, {params}: {params: Promise<{id:string}>}) {
    const { id } = await params;
    return changeClaimStatus(request, id);
}