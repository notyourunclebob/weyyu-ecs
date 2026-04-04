import { acknowledgeClaims } from "@/tools/ClaimManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.employeeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.admin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    if (!Array.isArray(body.claimIds) || body.claimIds.length === 0) {
        return NextResponse.json({ error: "No claim IDs provided" }, { status: 400 });
    }

    return await acknowledgeClaims(body.claimIds);
}