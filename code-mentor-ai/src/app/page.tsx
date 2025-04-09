import Image from "next/image";
import NavBar from "@/components/navbar";

export default function Home() {
  return (
      <div className="dark:bg-[#050505] bg-white min-h-screen">
        <NavBar />
      </div>
  );
}
