"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {     
        localStorage.removeItem("atk");

        router.replace("/login");
    }, []);

    return (
        <main className="w-full h-screen flex items-center justify-center bg-b1 text-zinc-300">
        <p>Saindo...</p>
        </main>
    );
}
