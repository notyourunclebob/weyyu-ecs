"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const router = useRouter();

  async function sendLogin() {
    // set up for a spinner overlay
    setSending(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.log("Login error");
      } else {
        router.push("/dashbord");
        setSuccess(true);
        setPassword("");
        setUsername("");
      }
    } catch (error) {
      console.log("Login error");
    } finally {
      setSending(false);
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
