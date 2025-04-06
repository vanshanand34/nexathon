import Image from "next/image";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "next-themes";

export default function Home() {
  return (
    <>
      <div className="bg-white dark:bg-[#050505] min-h-screen">
        <NavBar />
      </div>
    </>
  );
}
