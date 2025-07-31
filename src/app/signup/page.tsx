"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignupData) => {
    try {
      setFormError(null);

      const res = await fetch("https://lawyertaskapi.vercel.app/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Erro ao criar conta");
      }

      localStorage.setItem("token", result.atk);
      router.push("/tasks");
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <main className="w-full h-full min-h-screen flex items-center justify-center bg-b1">
      <section className="w-full max-w-[400px] py-10 px-6 rounded-xl flex flex-col items-center justify-center bg-b2 border border-zinc-900">
        <h1 className="text-3xl font-bold text-zinc-100">Criar Conta</h1>
        <p className="text-zinc-400 mt-2 text-sm text-center">
          Cadastre-se para começar a gerenciar suas tarefas jurídicas
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-6 space-y-4 flex flex-col">
          <div>
            <label htmlFor="email" className="text-zinc-300 text-sm block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 rounded-md bg-zinc-900 text-zinc-100 border border-zinc-800 transition focus:outline-none focus:ring-2 focus:ring-c1"
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="text-zinc-300 text-sm block mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 rounded-md bg-zinc-900 text-zinc-100 border border-zinc-800 transition focus:outline-none focus:ring-2 focus:ring-c1"
            />
            {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
          </div>

          {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-c1 hover:bg-c2 text-white font-semibold py-2 rounded-md transition"
          >
            {isSubmitting ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>
      </section>
    </main>
  );
}