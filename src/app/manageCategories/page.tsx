export const dynamic = 'force-dynamic';

import { authOptions } from "@/lib/auth";
import { getJSONData } from "@/tools/Toolkit";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "../components/Header";
import ManageCategories from "../components/ManageCategories";
import { CategoryBase } from "@/tools/categoryBase.model";



export default async function manageUsers() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    let categories: CategoryBase[] = [];

    const data = await getJSONData(`${process.env.NEXTAUTH_URL}/api/category/getAll`, 0);
    categories = data.categories;

    return (
        <div>
            <Header />
            <ManageCategories categories={{ categories: categories }} />
        </div>
    )
}