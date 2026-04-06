import { getServerSession } from "next-auth";
import Header from "../components/Header";
import MakeClaim from "../components/MakeClaim";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getJSONData } from "@/tools/Toolkit";
import { CategoryBase } from "@/tools/categoryBase.model";
import { Employee } from "@/tools/employee.model";


export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    let categories: CategoryBase[] = [];

    const data = await getJSONData(`${process.env.NEXTAUTH_URL}/api/category/getAll`, 0);
    categories = data.categories;

    let employees: Employee[] = [];
    if (session.user.admin) {
        const data = await getJSONData(`${process.env.NEXTAUTH_URL}/api/employee/get`, 0);
        employees = data.employees;
    }

    return (
        <div className="w-screen h-screen bg-yutaniGrey">
            <Header />
            <MakeClaim categories={{ categories: categories }} employees={employees} />
        </div>
    );
}