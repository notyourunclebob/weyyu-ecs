import Header from "../components/Header";
export default function Home() {

  return (
    <div>
      <Header />
      <div className="bg-black w-full h-screen m-6 rounded-lg">
        <div className="flex text-2xl justify-center">
          Login
        </div>
      </div>
    </div>
  );

}