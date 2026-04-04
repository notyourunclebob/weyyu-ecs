"use client";

import { Claim } from "@/tools/claim.model";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { CategoryBase } from "@/tools/categoryBase.model";

export default function Dashboard({
    claims,
    categories,
    unacknowledgedClaims,
}: {
    claims: Claim[];
    categories: CategoryBase[];
    unacknowledgedClaims: Claim[];
}) {
    const { data: session } = useSession();
    const [claimData, setClaimData] = useState<Claim[]>(claims);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [pendingAck, setPendingAck] = useState<Claim[]>(unacknowledgedClaims);
    const [isAcknowledging, setIsAcknowledging] = useState(false);

    if (!session) {
        return <div>Loading...</div>;
    }

    const handleAcknowledge = async () => {
        setIsAcknowledging(true);
        try {
            const ids = pendingAck.map((c) => c._id.toString());
            await fetch("/api/claim/acknowledge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ claimIds: ids }),
            });
            setPendingAck([]);
        } catch (err) {
            console.error("Acknowledge failed:", err);
        } finally {
            setIsAcknowledging(false);
        }
    };

    const filteredClaims =
        selectedCategory === "all"
            ? claimData
            : claimData.filter(
                (claim: Claim) => claim.category?.toString() === selectedCategory
            );

    return (
        <div className="w-screen h-screen bg-yutaniGrey">

            {/* Unacknowledged claims popup */}
            {pendingAck.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-black border-2 border-yutaniYellow rounded-2xl p-8 w-full max-w-lg mx-4">
                        <h2 className="text-yutaniYellow text-2xl font-light tracking-wider mb-2 text-center">
                            Claims Updated
                        </h2>
                        <p className="text-yutaniGrey text-sm text-center mb-6 font-light">
                            The following claims have been reviewed since your last visit.
                        </p>

                        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto mb-6 pr-1">
                            {pendingAck.map((claim) => (
                                <div
                                    key={claim._id.toString()}
                                    className="bg-yutaniGrey rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-black text-sm font-semibold truncate max-w-[60%]">
                                            {claim.description.length > 30
                                                ? `${claim.description.slice(0, 30)}...`
                                                : claim.description}
                                        </span>
                                        <span
                                            className={`text-xs font-bold px-2 py-1 rounded ${claim.status === "approved"
                                                    ? "bg-green-200 text-green-800"
                                                    : "bg-red-200 text-red-800"
                                                }`}
                                        >
                                            {claim.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-black text-xs">
                                        ${claim.amount.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </div>
                                    {claim.comment && (
                                        <div className="text-black text-xs mt-1 italic opacity-70">
                                            "{claim.comment}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleAcknowledge}
                                disabled={isAcknowledging}
                                className="px-12 py-3 bg-yellow-400 border-2 border-yellow-300 text-black font-bold rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAcknowledging ? "Acknowledging…" : "Acknowledge"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rest of dashboard unchanged */}
            <div className="min-h-screen bg-yutaniGrey p-7">
                <div className="bg-black rounded-2xl p-8 min-h-[calc(100vh-130px)]">
                    <div className="text-yutaniGrey text-4xl font-light mb-6 flex justify-center">
                        Welcome to your dashboard {session.user.firstName}
                    </div>
                    {session.user.admin === true ? (
                        <div className="flex flex-col md:flex-row justify-around text-yutaniGrey">
                            <Link href="/manageUsers" className="bg-yutaniYellow text-black px-8 py-3 font-semibold rounded hover:bg-yellow-500">
                                Manage Users
                            </Link>
                            <Link href="/manageCategories" className="bg-yutaniYellow text-black px-8 py-3 font-semibold rounded hover:bg-yellow-500">
                                Manage Categories
                            </Link>
                            <Link href="/viewReport" className="bg-yutaniYellow text-black px-8 py-3 font-semibold rounded hover:bg-yellow-500">
                                View Reports
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden"></div>
                    )}

                    <div className="mb-6 mt-2">
                        <div className="flex justify-center mb-4">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-yutaniGrey text-black px-4 py-2 rounded font-semibold"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category: CategoryBase) => (
                                    <option key={category._id.toString()} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col md:flex-row md:justify-around">
                            <div>
                                <div className="text-yutaniGrey text-2xl font-light mb-4 flex justify-center">
                                    Pending Claims
                                </div>
                                <div className="bg-yutaniGrey rounded h-80 w-100 overflow-y-auto">
                                    {filteredClaims?.filter((claim: Claim) => claim.status === "pending").map((claim: Claim) => (
                                        <div key={claim._id.toString()} className="pl-2 pt-2">
                                            {claim.description.length > 10 ? `${claim.description.slice(0, 10)}...` : claim.description} - ${claim.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            <Link href={`/claim/${claim._id}`} className="text-black rounded px-2 py-1 ml-2 underline hover:opacity-70">
                                                View Claim
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-yutaniGrey text-2xl font-light mb-4 flex justify-center">
                                    Approved Claims
                                </div>
                                <div className="bg-yutaniGrey rounded h-80 w-100 overflow-y-auto">
                                    {filteredClaims?.filter((claim: Claim) => claim.status === "approved").map((claim: Claim) => (
                                        <div key={claim._id.toString()} className="pl-1">
                                            {claim.description.length > 10 ? `${claim.description.slice(0, 10)}...` : claim.description} - ${claim.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            <Link href={`/claim/${claim._id}`} className="text-black rounded px-2 py-1 ml-2 underline hover:opacity-70">
                                                View Claim
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-yutaniGrey text-2xl font-light mb-4 flex justify-center">
                                    Denied Claims
                                </div>
                                <div className="bg-yutaniGrey rounded h-80 w-100 overflow-y-auto">
                                    {filteredClaims?.filter((claim: Claim) => claim.status === "denied").map((claim: Claim) => (
                                        <div key={claim._id.toString()} className="pl-1">
                                            {claim.description.length > 10 ? `${claim.description.slice(0, 10)}...` : claim.description} - ${claim.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            <Link href={`/claim/${claim._id}`} className="text-black rounded px-2 py-1 ml-2 underline hover:opacity-70">
                                                View Claim
                                            </Link>
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