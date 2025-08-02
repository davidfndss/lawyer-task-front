"use client"
import React from "react"
import { useRouter } from "next/navigation"
import {  IoGridOutline } from "react-icons/io5"
import { GrGroup, GrTask } from "react-icons/gr"
import { TbLogout } from "react-icons/tb"
import { BiPlusCircle } from "react-icons/bi"

function Aside() {
  const router = useRouter()

  return (
    <aside className="w-[40vw] max-w-[400px] min-h-[100vh] justify-center items-start pt-10 font-intert tracking-tight z-20 hidden md:flex bg-b1">
        <div className="w-full flex flex-col items-center">
            <button className="flex items-center cursor-pointer transition z-10 hover:opacity-70" onClick={() => router.push("/")}>
                <h1 className="w-[100px] mt-2 md:mt-0">LawyerTask</h1>
            </button>
            <div className="w-full flex justify-end -mt-[33px]">
                <button className="flex items-center cursor-pointer text-zinc-900 z-10" onClick={() => router.back()}>
                <i className="bi bi-chevron-left text-xl bg-zinc-900 text-white py-1 px-2 rounded-full transition hover:bg-zinc-800"></i>
                </button>
            </div>
            <article className="w-[200px] mt-8 gap-4 flex flex-col">

              <nav className="text-zinc-500 font-[500] flex items-center gap-2 cursor-pointer transition py-2 px-2 -sm hover:text-c4 hover:bg-b2" onClick={() => router.push("/dashboard")}>
                <span className="text-xl">
                  <IoGridOutline />
                </span>

                <nav>Dashboard</nav>
              </nav>

              <nav className="text-zinc-500 font-[500] flex items-center gap-2 cursor-pointer transition py-2 px-2 -sm hover:text-c4 hover:bg-b2" onClick={() => router.push("/tasks")}>
                <span className="text-xl">
                  <GrTask />
                </span>

                <nav>Tarefas</nav>
              </nav>

              <nav className="text-zinc-500 font-[500] flex items-center gap-2 cursor-pointer transition py-2 px-2 -sm hover:text-c4 hover:bg-b2" onClick={() => router.push("/tasks/new")}>
                <span className="text-xl">
                  <BiPlusCircle />
                </span>

                <nav>Nova Tarefa</nav>
              </nav>

              <nav className="text-zinc-500 font-[500] flex items-center gap-2 cursor-pointer transition py-1 px-2 -sm hover:text-c4 hover:bg-b2" onClick={() => router.push("/clients")}>
                <span className="text-xl">
                  <GrGroup />
                </span>
            
                <nav>Clientes</nav>
              </nav>

              <nav className="text-zinc-500 font-[500] flex items-center gap-2 cursor-pointer transition py-1 px-2 -sm hover:text-c4 hover:bg-b2" onClick={() => router.push("/logout")}>
                <span className="text-xl">
                  <TbLogout />
                </span>
            
                <nav>Sair</nav>
              </nav>
            </article>
        </div>
        
    </aside>
  )  
}

export { Aside }