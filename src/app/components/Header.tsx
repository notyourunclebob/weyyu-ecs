import Image from "next/image"

export default function Header() {
    return (
        <header className="bg-black">
            <div className="relative flex flex-col md:flex-row items-center justify-center py-4">
                <Image src={"/images/weylandYutani.png"} alt={"company logo"} height={80} width={160} className="md:absolute md:left-4" />
                <div className="text-yutaniGrey text-2xl py-2">
                    Employee Claims System
                </div>
            </div>
        </header>
    )
}