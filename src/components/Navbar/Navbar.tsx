"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { AiOutlineDollar } from "react-icons/ai"
import { MdOutlineEventNote } from "react-icons/md"
import { IoGridOutline } from "react-icons/io5"
import { GrGroup, GrTask } from "react-icons/gr"
import { TbLogout } from "react-icons/tb"
import { BiPlusCircle } from "react-icons/bi"

export default function Navbar() {
  const router = useRouter()

  return (
    <nav className="w-full min-w-screen flex justify-center fixed bottom-0 items-start font-intert tracking-tight bg-b1 z-20 md:hidden">
        <div className="w-full flex items-center justify-center">
            <article className="w-full gap-2 flex justify-evenly px-10 py-1">

              <nav className="text-zinc-600 font-[500] flex items-center gap-2 cursor-pointer transition py-2 px-2 hover:text-c1" onClick={() => router.push("/dashboard")}>
                <span className="text-3xl">
                  <IoGridOutline />
                </span>
              </nav>
              
              <nav className="text-zinc-600 font-[500] flex items-center gap-2 cursor-pointer transition py-2 px-2 hover:text-c1" onClick={() => router.push("/tasks")}>
                <span className="text-3xl">
                  <GrTask />
                </span>
              </nav>

              <nav className="text-zinc-600 font-[500] flex items-center gap-2 cursor-pointer transition py-1 px-2 hover:text-c1" onClick={() => router.push("/logout")}>
                <span className="text-3xl">
                  <TbLogout />
                </span>
              </nav>

              <nav className="text-zinc-600 font-[500] flex items-center gap-2 cursor-pointer transition py-1 px-2 hover:text-c1" onClick={() => router.push("/tasks/new")}>
                <span className="text-3xl">
                  <BiPlusCircle />
                </span>
              </nav>
            </article>
        </div>
        
    </nav>
  )  
}