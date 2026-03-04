"use client";

import { Claim } from "@/tools/claim.model";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ClaimComp({ claim }: { claim: Claim }) {
    const router = useRouter();
    return (
        <div>
            <div className="min-h-screen bg-yutaniGrey p-7">
                <div className="bg-black rounded-2xl p-8 min-h-[calc(100vh-130px)]">
                    {/* Claim Information Title */}
                    <h2 className="text-yutaniGrey text-3xl font-light tracking-wider text-center mb-8">
                        Claim Information
                    </h2>

                    <div className="flex flex-row gap-8 w-full">
                        {/* Left Column */}
                        <div className="space-y-6 flex-1">
                            {/* Date Field */}
                            <div>
                                <label className="block text-yutaniGrey text-sm mb-2 font-light">Date:</label>
                                <input
                                    type="text"
                                    value={claim.date.toString()}
                                    disabled
                                    className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                                />
                            </div>

                            {/* Category Field */}
                            <div>
                                <label className="block text-yutaniGrey text-sm mb-2 font-light">Category:</label>
                                <input
                                    type="text"
                                    value={claim.category.toString()}
                                    disabled
                                    className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                                />
                            </div>

                            {/* Amount Field */}
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

                            {/* Description Field */}
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
                        </div>
                        <div className="flex-1">


                            {/* Right Column - Receipt Upload */}
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
                        <button
                            type="submit"
                            onClick={() => router.push('/dashboard')}
                            className="px-12 py-3 bg-yellow-400 border-2 border-yellow-300 text-black font-bold rounded hover:bg-yellow-500 transition"
                        >
                            Submit
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}