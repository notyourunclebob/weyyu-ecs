import { User } from "@/tools/user.model"
import Link from "next/link"

// { user }: { user: User }
export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-200 p-7">
            <div className="bg-black rounded-2xl p-8 min-h-[calc(100vh-130px)]">
                <div className="text-yutaniGrey text-4xl font-light mb-6">
                    Welcome to your dashboard User.
                </div>
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

                <div className="my-6">
                    <div className="flex flex-col md:flex-row md:justify-around">
                        <div>
                            <div className="text-yutaniGrey text-2xl font-light mb-4">
                                Pending Claims
                            </div>
                            <div className="bg-yutaniGrey rounded h-80 w-150">
                                {/* pending claims go here */}
                            </div>
                        </div>

                        <div>
                            <div className="text-yutaniGrey text-2xl font-light mb-4">
                                Approved Claims
                            </div>
                            <div className="bg-yutaniGrey rounded h-80 w-150">
                                {/* pending claims go here */}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button className="bg-yutaniYellow text-black px-8 py-3 font-semibold rounded hover:bg-yellow-500">
                            Submit a Claim
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}