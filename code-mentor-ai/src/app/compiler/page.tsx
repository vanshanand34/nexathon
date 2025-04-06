import Image from "next/image";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import Compiler from "./Compiler";

export default function Home() {
  return (
    <>
      <div className="bg-white dark:bg-[#050505] min-h-screen">
        <NavBar />
        <div>
          <Compiler/>
        </div>
      </div>
    </>
  );
}
