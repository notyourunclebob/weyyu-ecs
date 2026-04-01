"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";


export default function ManageUsers() {
    return (
        <div className="min-h-screen bg-yutaniGrey p-7">
            <div className="bg-black rounded-2xl p-6 min-h-[calc(100vh-130px)]">
                <div className="text-yutaniGrey text-3xl font-light tracking-wider text-center mb-8">
                    Manage Employees
                </div>
                <div className="flex justify-around">
                    <div className="max-w-1/2">
                        <div className="text-yutaniGrey text-xl font-light tracking-wider text-center mb-8">
                            Create an employee
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col">
                                <label className="flex justify-center text-yutaniGrey text-sm mb-2 font-light">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="w-full px-2 py-2 bg-yutaniGrey border-2 rounded text-black placeholder-yutaniGrey focus:outline-none transition border-yutaniGrey focus:border-yutaniYellow mb-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="flex justify-center text-yutaniGrey text-sm mb-2 font-light">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="w-full px-2 py-2 bg-yutaniGrey border-2 rounded text-black placeholder-yutaniGrey focus:outline-none transition border-yutaniGrey focus:border-yutaniYellow mb-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="flex justify-center text-yutaniGrey text-sm mb-2 font-light">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="w-full px-2 py-2 bg-yutaniGrey border-2 rounded text-black placeholder-yutaniGrey focus:outline-none transition border-yutaniGrey focus:border-yutaniYellow mb-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="flex justify-center text-yutaniGrey text-sm mb-2 font-light">Password</label>
                                <input
                                    type="text"
                                    name="password"
                                    className="w-full px-2 py-2 bg-yutaniGrey border-2 rounded text-black placeholder-yutaniGrey focus:outline-none transition border-yutaniGrey focus:border-yutaniYellow mb-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="flex justify-center text-yutaniGrey text-sm mb-2 font-light">Confirm Password</label>
                                <input
                                    type="text"
                                    name="confirmPassword"
                                    className="w-full px-2 py-2 bg-yutaniGrey border-2 rounded text-black placeholder-yutaniGrey focus:outline-none transition border-yutaniGrey focus:border-yutaniYellow mb-2"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8 justify-center mb-2">
                            <button
                                type="button"
                                // onClick={handleCancel}
                                // disabled={isSubmitting}
                                className="px-12 py-3 bg-gray-300 border-2 border-gray-300 text-black font-light rounded hover:bg-gray-400 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                // onClick={handleSubmit}
                                // disabled={isSubmitting}
                                className="px-12 py-3 bg-yellow-400 border-2 border-yellow-300 text-black font-bold rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* {isSubmitting ? 'Submitting…' : 'Submit'} */}Submit
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="text-yutaniGrey text-xl font-light tracking-wider text-center mb-8">
                            Users
                        </div>
                        <div className="bg-yutaniGrey rounded h-3/5 w-100">
                            {/* pending claims go here */}
                            {/* {claimData.filter((claim: Claim) => claim.status === "open").map((claim: Claim) => (
                                <div key={claim._id.toString()} className="pl-1">
                                    <Link href={`/claim/${claim._id}`}>
                                        {claim.description} - {claim.amount}
                                    </Link>
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}