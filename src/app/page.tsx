"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/login")
  })

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-b1"></div>
  );
}
