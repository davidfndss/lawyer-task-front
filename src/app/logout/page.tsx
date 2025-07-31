"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorComponent from "@/components/Error/Error";

export default function LogoutPage() {
    // const router = useRouter();

    // useEffect(() => {     
    //     localStorage.removeItem("token");

    //     router.replace("/login");
    // }, []);

    // return (
    //     <main className="w-full h-screen flex items-center justify-center bg-b1 text-zinc-300">
    //     <p>Saindo...</p>
    //     </main>
    // );

    return (
        <ErrorComponent
            errorMessage="Você não está logado."
            button={true}
            buttonInnerText="Entrar"
            buttonCallback={() => window.location.href = "/login"}
        />
    )
}
