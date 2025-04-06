'use client';
import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react'; // you can also use emoji or heroicons
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
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`${geistRegular.className} bg-white dark:bg-[#0e0e0e] dark:shadow-gray-950 text-black dark:text-white w-[100vw] flex justify-between shadow-lg shadow-black gap-2 p-1 pt-2`}
    >
      <div className="font-bold uppercase text-2xl flex items-center p-2 cursor-pointer dark:hover:text-gray-300">
        Code-Mentor
      </div>

      <div className="flex items-center gap-4 lg:gap-12 pr-12 py-2">
        <Link href={"/"}>
          <NavBarComponent componentText="Home" />
        </Link>
        <Link href={"/"}>
          <NavBarComponent componentText="About" />
        </Link>
        <Link href={"/"}>
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

function NavBarComponent({ componentText, page }: { componentText: string, page?: string }) {
  return (
    <div className="p-2 px-3 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200 dark:hover:text-black">
      {componentText}
    </div>
  );
}
