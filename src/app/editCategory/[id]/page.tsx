import { redirect } from "next/navigation";
import Header from "../../components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCategoryById } from "@/tools/CategoryManager";
import { CategoryBase } from "@/tools/categoryBase.model";
import { Category } from "@/tools/claim.model";
import EditCategory from "@/app/components/EditCategory";

export default async function ClaimPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    const isAdmin = session.user.admin;
    const { id } = await params;

    if (!isAdmin) {
        redirect('/login');
    }

    const response = await getCategoryById(id);
    const result = await response.json();

    if ("error" in result) {
        redirect('/error');
    }

    const category = result.categories as CategoryBase;

    return (
        <div>
            <Header />
            <EditCategory category={category} />

        </div>
    );
}