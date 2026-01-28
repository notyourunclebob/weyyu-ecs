"use client";
import { useState } from "react";
// import { hashPass } from "@/tools/PassTools";
import { sendJSONData } from "@/tools/Toolkit";

export default function Login() {
    let sendUrl: string = "/api/employee/login";
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    async function sendLogin() {
        // let hashedPass = hashPass(password);

        let data = { employeeId: username, password: password };

        let returnData = sendJSONData(sendUrl, data);

        console.log(returnData);

        setPassword("")
        setUsername("")

    }
    return (
        <div className="flex items-center justify-center h-[calc(100vh-100px)] px-6">
            <div className="bg-black w-full max-w-2xl rounded-3xl p-16 shadow-2xl">
                <div className="flex flex-col items-center space-y-8">
                    {/* Username */}
                    <div className="w-full max-w-sm">
                        <label className="block text-yutaniGrey text-xl mb-3 text-center">
                            Enter Username:
                        </label>
                        <input type="text"
                            className="w-full px-4 py-3 bg-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    {/* Password */}
                    <div className="w-full max-w-sm">
                        <label className="block text-yutaniGrey text-xl mb-3 text-center">
                            Enter Password:
                        </label>
                        <input type="password"
                            className="w-full px-4 py-3 bg-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    {/* Login Button */}
                    <button className="mt-6 px-12 py-3 bg-yellow-400 text-black text-2xl font-semibold rounded hover:bg-yellow-500 transition-colors" onClick={sendLogin}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    )
}