import Header from "../components/Header";
import AdminDashboard from "../components/AdminDashboard";

export default function Home() {
    return (
        <div className="w-screen h-screen bg-gray-400">
            <Header />
            <AdminDashboard />
        </div>
    );
}