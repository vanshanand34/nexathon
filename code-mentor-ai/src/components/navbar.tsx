import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeToggleButton } from "./ThemeToggle";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistRegular = Geist({
  variable: "--font-geist-regular",
  subsets: ["latin"],
});

export default function NavBar() {

  return (
    <div
      className={`${geistRegular.className} z-10 bg-white dark:bg-[#0e0e0e] dark:shadow-gray-700 text-black dark:text-white w-[100vw] flex justify-between shadow fixed shadow-gray-400 gap-2 p-1 pt-2`}
    >
      <div className="font-bold uppercase text-2xl flex items-center p-2 px-4 cursor-pointer font-sans text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
        Code-Mentor
      </div>

      <div className="flex items-center gap-4 lg:gap-12 pr-12 py-2">
        <Link href={"/"}>
          <NavBarComponent componentText="Home" />
        </Link>
        <Link href={"/"}>
          <NavBarComponent componentText="About" />
        </Link>
        <Link href={"/code-review"}>
          <NavBarComponent componentText="Code Review" />
        </Link>
        <Link href={"/compiler"}>
          <NavBarComponent componentText="Compiler" />
        </Link>

        {/* Toggle icon */}
        <ThemeToggleButton />
      </div>
    </div>
  );
}

function NavBarComponent({ componentText }: { componentText: string }) {
  return (
    <div className="p-2 px-3 border border-gray-300 dark:border-[#fff6] rounded-md text-sm cursor-pointer hover:bg-gray-200 dark:hover:text-black text-nowrap">
      {componentText}
    </div>
  );
}
