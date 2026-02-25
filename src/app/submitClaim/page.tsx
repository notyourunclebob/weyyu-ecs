import Header from "../components/Header";
import MakeClaim from "../components/MakeClaim";


export default function Home() {
    return (
        <div className="w-screen h-screen bg-yutaniGrey">
            <Header />
            <MakeClaim />
        </div>
    );
}