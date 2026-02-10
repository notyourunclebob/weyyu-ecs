import Header from "../components/Header";

export default function Unauthorized() {
  return (
    <div className="w-screen h-screen bg-gray-400">
      <Header />
      <div className="text-center text-yutaniGrey text-xl mt-20">
        You are not authorized to view this page!
      </div>
    </div>
  );
}
