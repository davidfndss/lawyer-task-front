"use client";

import { showError } from "@/app/utils/toast";
import { GrTestDesktop } from "react-icons/gr";

export default function MockSignupButton() {
    async function mockSignup() {
        try {
            const res = await fetch("https://lawyertaskapi.vercel.app/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "tester@" + Math.random().toString(36).substring(7) + ".com",
                    password: "tester123456@@@@"
                })
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.message || data.error || "Erro ao criar conta de teste");
            }

            localStorage.setItem("atk", data.atk);
            window.location.href = "/tasks";
        } catch (error) {
            console.error("Erro ao criar conta de teste:", error);
            showError("Houve um erro ao criar a conta de teste.");
        }
    }

    return (
        <button
            className="bg-c1 text-white rounded-xl transition p-1 flex items-center justify-center absolute bottom-10 right-10 z-20 hover:bg-c5"
            onClick={mockSignup}
        >
            <div className="bg-b1 text-white flex pr-2 pl-4 py-2 rounded-lg gap-3 items-center">
                <GrTestDesktop className="text-3xl text-zinc-300" />
                <div className="flex flex-col justify-center">
                    <span className="text-zinc-500">Testando a aplicação?</span>
                    <span className="text-zinc-200">Entre como tester</span>
                </div>
                <i className="bi bi-chevron-right text-2xl"></i>
            </div>
        </button>
    );
}