import { redirect } from "next/navigation";
import { ClaimComp } from "../../components/Claim";
import Header from "../../components/Header";
import { getServerSession } from "next-auth";
import { getClaimById } from "@/tools/ClaimManager";
import { NextResponse } from "next/server";
import { Claim } from "@/tools/claim.model";
import { authOptions } from "@/lib/auth";

export default async function ClaimPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    const isAdmin = session.user.admin;
    const { id } = await params;

    console.log(id);

    const result = await getClaimById(id);

    if ("error" in result) {
        console.log(result.error)
        redirect('/error');
    }

    const claim = result as Claim;

    console.log("claim id:", claim._id);
    console.log("session id", session.user.employeeId);
    if (!isAdmin && claim?.employeeId !== session.user.employeeId) {
        redirect('/unauthorized');
    }

    return (
        <div>
            <Header />
            <ClaimComp claim={claim} />
        </div>
    );
}