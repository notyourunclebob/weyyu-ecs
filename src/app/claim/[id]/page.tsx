import { Claim } from "../../components/Claim";
import Header from "../../components/Header";
import { getServerSession } from "next-auth";

export default async function ClaimPage({ params }: { params: { id: string } }) {
    const session = await getServerSession();

    const claim = await db.claims.findOne({ _id: params.id });

    if (!claim || claim.userId !== session?.user?.id) {
        redirect('/unauthorized');
    }

    return (
        <div>
            <Header />
            <Claim />
        </div>
    );
}