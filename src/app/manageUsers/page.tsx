import { authOptions } from "@/lib/auth";
import { Employee } from "@/tools/employee.model";
import { getJSONData } from "@/tools/Toolkit";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "../components/Header";
import ManageUsers from "../components/ManageUsers";


export default async function manageUsers() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    let employees: Employee[] = [];
    if (session.user.admin) {
        const data = await getJSONData(`${process.env.NEXTAUTH_URL}/api/employee/get`, false);
        employees = data.employees;
    }

    return (
        <div>
            <Header />
            <ManageUsers />
        </div>
    )
}