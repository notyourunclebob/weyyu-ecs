import { createClaim } from "@/tools/ClaimManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.employeeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { onBehalfOf, ...rest } = body;

    const syntheticRequest = new NextRequest(request.url, {
        method: 'POST',
        body: JSON.stringify(rest),
        headers: { 'Content-Type': 'application/json' },
    });

    if (onBehalfOf) {
        if (!session.user.admin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return await createClaim(syntheticRequest, onBehalfOf);
    }

    return await createClaim(syntheticRequest, session.user.employeeId);
}