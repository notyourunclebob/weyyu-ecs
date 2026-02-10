import Header from "../components/Header";

export default function Unauthorized() {
  return (
    <div className="w-screen h-screen bg-gray-400">
      <Header />
      <div className="text-center text-black text-xl mt-20">Welcome User</div>
    </div>
  );
}
