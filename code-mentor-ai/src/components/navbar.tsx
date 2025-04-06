import React from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

const geistRegular = Geist({
    variable: "--font-geist-regular",
    subsets: ["latin"], 
})

export default function NavBar () {

    return (
        <div className={`${geistRegular.className} dark:bg-[#0e0e0e] dark:shadow-gray-950 dark:text-white w-[100vw] flex justify-between shadow shadow-gray-300 gap-2 p-1 pt-2`}>

            <div className="font-bold uppercase text-2xl flex items-center p-2 cursor-pointer dark:hover:text-gray-300">
                Code-Mentor
            </div>

            <div className="flex items-center gap-4 lg:gap-12 pr-12 py-2">
                <div className="p-2 px-3 border border-gray-300 rounded-md cursor-pointer text-sm hover:bg-gray-200 dark:hover:text-black">
                    Home
                </div>
                <div className="p-2 px-3 border border-gray-300 rounded-md  cursor-pointer text-sm hover:bg-gray-200 dark:hover:text-black">
                    About
                </div>
                <div className="p-2 px-3 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200 dark:hover:text-black">
                    Contact
                </div>
            </div>

        </div>
    )
}