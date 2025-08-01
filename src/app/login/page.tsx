"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import RedirectButton from "@/components/Button/RedirectButton";
import { showError } from "../utils/toast";
import MockSignupButton from "@/components/Button/MockSignupButton";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const onSubmit = async (data: LoginData) => {
    try {
      setFormError(null);
      const res = await fetch("https://lawyertaskapi.vercel.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 401) {
        throw new Error("Email ou senha incorretos");
      }

      if (res.status === 404) {
        throw new Error("Email ou senha incorretos");
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Erro ao fazer login");
      }

      localStorage.setItem("atk", result.atk);
      router.push("/tasks");
    } catch (err: any) {


      showError("Houve um erro ao fazer login");
      console.error(err);
      setFormError(err.message);
    }
  };

  return (
    <main className="w-full h-full min-h-screen flex items-center justify-center bg-b1">
      <section className="w-full max-w-[450px] py-10 px-6 rounded-xl flex flex-col items-center justify-center bg-b2 border border-zinc-900">
        <div className="flex flex-col items-center">
          <LiaBalanceScaleSolid className="text-c4 text-6xl mb-1" />
          <h1 className="text-zinc-300 text-3xl font-[700] tracking-tight">LawyerTask</h1>
        </div>
        
        <p className="text-zinc-400 mt-2 text-sm text-center">
          Entre na sua conta para gerenciar suas tarefas jurídicas
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-6 flex flex-col">
          <div>
            <label htmlFor="email" className="text-zinc-300 text-sm block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              {...register("email")}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-800 transition focus:outline-none focus:ring-2 focus:ring-c1"
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="text-zinc-300 text-sm block mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              required
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-800 transition focus:outline-none focus:ring-2 focus:ring-c1"
            />
            {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
          </div>

          {formError && <p className="text-red-500 text-sm text-center mt-2 -mb-2">{formError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-c1 hover:bg-c2 text-white font-semibold py-2 rounded-lg transition mt-8"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <RedirectButton
          route="/signup"
          className="w-full hover:text-zinc-300 text-zinc-500 font-[100] text-sm py-1 rounded-lg mt-4 transition"
        >
          Não tem uma conta? Cadastre-se
        </RedirectButton>
      </section>
      <MockSignupButton />
    </main>
  );
}