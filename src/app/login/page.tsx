import Header from "../components/Header";
import Login from "../components/Login";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-gray-400">
      <Header />
      <Login />
    </div>
  );
}