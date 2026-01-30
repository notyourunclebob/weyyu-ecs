"use client";
import { useState } from "react";
// import { hashPass } from "@/tools/PassTools";
import { sendJSONData } from "@/tools/Toolkit";
import { User } from "@/tools/user.model";

export default function Login() {
  let sendUrl: string = "/api/employee/login";
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  async function sendLogin() {
    // let hashedPass = hashPass(password);

    let data = { employeeId: username, password: password };

    // for testing
    // console.log("front end:" + data.employeeId + ", " + data.password);

    // changed this to parse data
    let response = await sendJSONData(sendUrl, data);

    // error checking
    if (!response) {
      console.log("Error>>> 404: No response from DB");
      setSuccess(false);
    } else if (response?.status !== 200) {
      let returnData = response.data;
      console.log(returnData.error);
      setSuccess(false);
    } else {
      // parses data from the response: returnData.message is the message returndata.user is the user data. I also added user.model for types
      let returnData = response.data;

      // this holds the user data
      const user: User = returnData.user;

      // log for testing
      console.log(`${returnData.message}:\n admin?: ${user.admin}`);

      setSuccess(true);


      setPassword("");
      setUsername("");
    }
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
            <input
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
              type="text"
              className="w-full px-4 py-3 bg-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Password */}
          <div className="w-full max-w-sm">
            <label className="block text-yutaniGrey text-xl mb-3 text-center">
              Enter Password:
            </label>
            <input
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-3 bg-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Login Button */}
          <button
            className="mt-6 px-12 py-3 bg-yellow-400 text-black text-2xl font-semibold rounded hover:bg-yellow-500 transition-colors"
            onClick={sendLogin}
          >
            Login
          </button>

          {success && (
            <div className="p-4 bg-green-100 border border-green-400 rounded">
              Success
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
