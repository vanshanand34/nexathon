import Image from "next/image";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import Review from "./Review";

export default function Home() {
  return (
    <>
      <div className="bg-white dark:bg-[#050505] min-h-screen">
        <NavBar />
        <div className="p-2">
            <Review />
        </div>
      </div>
    </>
  );
}
