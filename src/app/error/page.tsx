import Header from "../components/Header";

export default function Unauthorized() {
  return (
    <div className="w-screen h-screen bg-yutaniGrey">
      <Header />
      <div className="text-center text-black text-xl mt-20">
        Could not complete request :(
      </div>
    </div>
  );
}
