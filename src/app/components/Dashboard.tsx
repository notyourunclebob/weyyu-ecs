"use client";

import { Claim } from "@/tools/claim.model";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function Dashboard(claims: { claims: Claim[] }) {
    // the session data from login can be used for conditional rendering
    const { data: session } = useSession();
    const [claimData, setClaimData] = useState<Claim[]>(claims.claims)
    console.log(claimData);

    if (!session) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-screen h-screen bg-yutaniGrey">
            <div className="min-h-screen bg-yutaniGrey p-7">
                <div className="bg-black rounded-2xl p-8 min-h-[calc(100vh-130px)]">
                    <div className="text-yutaniGrey text-4xl font-light mb-6">
                        Welcome to your dashboard {session.user.firstName}.
                    </div>
                    {session.user.admin === true ?
                        <div className="flex flex-col md:flex-row justify-around text-yutaniGrey">
                            <Link href="/addUser">
                                Add User
                            </Link>
                            <Link href="/editCategories">
                                Edit Categories
                            </Link>
                            <Link href="/viewReport">
                                View Report
                            </Link>
                        </div>
                        : <div className="hidden"></div>}

                    <div className="my-6">
                        <div className="flex flex-col md:flex-row md:justify-around">
                            <div>
                                <div className="text-yutaniGrey text-2xl font-light mb-4">
                                    Pending Claims
                                </div>
                                <div className="bg-yutaniGrey rounded h-80 w-150">
                                    {/* pending claims go here */}
                                    {claimData.filter((claim: Claim) => claim.status === "open").map((claim: Claim) => (
                                        <div key={claim._id.toString()}>
                                            <Link href={`/claim/${claim._id}`}>
                                                {claim.description} - {claim.amount}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-yutaniGrey text-2xl font-light mb-4">
                                    Approved Claims
                                </div>
                                <div className="bg-yutaniGrey rounded h-80 w-150">
                                    {/* approved claims go here */}
                                    {claimData.filter((claim: Claim) => claim.status === "approved").map((claim: Claim) => (
                                        <div key={claim._id.toString()}>
                                            <div>
                                                {claim.description} - {claim.amount}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <Link href="/submitClaim" className="bg-yutaniYellow text-black px-8 py-3 font-semibold rounded hover:bg-yellow-500">
                                Submit a Claim
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}