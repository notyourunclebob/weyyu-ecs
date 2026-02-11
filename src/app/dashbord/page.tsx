"use client";

import Header from "../components/Header";
import AdminTest from "../components/AdminTest";
import UserTest from "../components/UserTest";
import { useSession } from "next-auth/react";

export default function Dashbord() {
  // the session data from login can be used for conditional rendering
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen h-screen bg-gray-400">
      <Header />
      {session.user.admin === true ? <AdminTest /> : <UserTest />}
    </div>
  );
}
