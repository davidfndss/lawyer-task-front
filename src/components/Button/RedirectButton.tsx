"use client"

import { useRouter } from "next/navigation"

export default function RedirectButton(props: { route: string, className?: string}): React.JSX.Element {
    const router = useRouter()

    return (
        <button className={props.className} onClick={() => router.push(props.route)}>
            Entrar
        </button>
    )
}