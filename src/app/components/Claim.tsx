"use client";

import { Claim } from "@/tools/claim.model";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { sendJSONData } from "@/tools/Toolkit";
import { useState } from "react";

export function ClaimComp({ claim }: { claim: Claim }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [comment, setComment] = useState("");

    const onApprove = async () => {
        const result = await sendJSONData(`/api/claim/updateStatus/${claim._id}`, { status: "approved", comment }, "PUT")
        if (result === null) return;

        const { status } = result;
        if (status === 200) router.push('/dashboard');
    }

    const onDeny = async () => {
        const result = await sendJSONData(`/api/claim/updateStatus/${claim._id}`, { status: "denied", comment }, "PUT")
        if (result === null) return;

        const { status } = result;
        if (status === 200) router.push('/dashboard');
    }

    return (
        <div>
            <div className="min-h-screen bg-yutaniGrey p-7">
                <div className="bg-black rounded-2xl p-8 min-h-[calc(100vh-130px)]">
                    <h2 className="text-yutaniGrey text-3xl font-light tracking-wider text-center mb-8">
                        Claim Information
                    </h2>

                    <div className="flex flex-row gap-8 w-full">
                        {/* Left Column */}
                        <div className="space-y-6 flex-1">
                            <div>
                                <label className="block text-yutaniGrey text-sm mb-2 font-light">Date:</label>
                                <input
                                    type="text"
                                    value={claim.date.toString()}
                                    disabled
                                    className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                                />
                            </div>

                            <div>
                                <label className="block text-yutaniGrey text-sm mb-2 font-light">Category:</label>
                                <input
                                    type="text"
                                    value={claim.category.toString()}
                                    disabled
                                    className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                                />
                            </div>

                            {claim.category.toString() === 'Medical' && (
                                <div className="text-white flex flex-row pl-2">
                                    <input
                                        type="checkbox"
                                        id="medCheckbox"
                                        checked={claim.facehugger}
                                        className="select-none ms-2 text-sm font-medium text-fg-disabled"
                                        disabled
                                    />
                                    <label className="pl-2">Facehugger exposure?</label>
                                </div>
                            )}

                            {claim.category.toString() === 'Travel' && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <label className="block text-yutaniGrey text-sm mb-2 font-light">Starting Location</label>
                                        <input
                                            type="text"
                                            name="startLocation"
                                            className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                                            value={claim.locationStart}
                                            disabled
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="block text-yutaniGrey text-sm mb-2 font-light">Final Location</label>
                                        <input
                                            type="text"
                                            name="endLocation"
                                            className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                                            value={claim.locationEnd}
                                            disabled
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="block text-yutaniGrey text-sm mb-2 font-light">Distance</label>
                                        <input
                                            type="text"
                                            name="mileage"
                                            className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                                            value={claim.mileage}
                                            disabled
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-yutaniGrey text-sm mb-2 font-light">Amount:</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={claim.amount}
                                    disabled
                                    className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                                />
                            </div>

                            <div>
                                <label className="block text-yutaniGrey text-sm mb-2 font-light">Description:</label>
                                <textarea
                                    name="description"
                                    value={claim.description}
                                    disabled
                                    rows={6}
                                    className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow resize-none"
                                />
                            </div>

                            {(claim.status === "approved" || claim.status === "denied") && claim.comment && (
                                <div>
                                    <label className="block text-yutaniGrey text-sm mb-2 font-light">Reviewer Comment:</label>
                                    <textarea
                                        value={claim.comment}
                                        disabled
                                        rows={4}
                                        className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow resize-none"
                                    />
                                </div>
                            )}

                            {/* Admin Comment Field */}
                            {session?.user?.admin && claim.status === "pending" && (
                                <div>
                                    <label className="block text-yutaniGrey text-sm mb-2 font-light">
                                        Comment: <span className="text-yutaniGrey opacity-50">(optional)</span>
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value.slice(0, 255))}
                                        rows={4}
                                        maxLength={255}
                                        placeholder="Add a comment to your review..."
                                        className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-gray-500 focus:outline-none focus:border-yutaniYellow resize-none"
                                    />
                                    <p className={`text-xs mt-1 text-right ${comment.length >= 255 ? 'text-red-400' : 'text-yutaniGrey opacity-50'}`}>
                                        {comment.length}/255
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Receipt */}
                        <div className="flex-1">
                            <div className="flex flex-col">
                                <div className="text-center">
                                    <div className="text-yutaniGrey text-sm font-light">Receipt image:</div>
                                </div>
                                <div className="flex justify-center">
                                    <Image src={claim.receipt} alt="receipt photo" height={700} width={500} className="object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-8 justify-center">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard')}
                            className="px-12 py-3 bg-gray-300 border-2 border-gray-300 text-black font-light rounded hover:bg-gray-400 transition"
                        >
                            Back
                        </button>
                        {session?.user?.admin && claim.status === "pending" && (
                            <div>
                                <button
                                    type="submit"
                                    onClick={onApprove}
                                    className="px-12 py-3 bg-yellow-400 border-2 border-yellow-300 text-black font-bold rounded hover:bg-yellow-500 transition"
                                >
                                    Approve
                                </button>
                                <button
                                    type="submit"
                                    onClick={onDeny}
                                    className="px-12 py-3 bg-yellow-400 border-2 border-yellow-300 text-black font-bold rounded hover:bg-yellow-500 transition ml-2"
                                >
                                    Deny
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}