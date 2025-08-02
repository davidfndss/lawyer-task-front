"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/app/utils/toast";
import { Aside } from "@/components/Aside/Aside";
import { Loading } from "@/components/Loading/Loading";
import Navbar from "@/components/Navbar/Navbar";

export const clientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function CreateClientForm() {
  const router = useRouter();

  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    const token = localStorage.getItem("atk");
    if (!token) return router.replace("/login");
  }, []);

  const onSubmit = async (data: ClientFormData) => {
    const token = localStorage.getItem("atk");
    if (!token) return;

    try {
      setFormError(null);

      const res = await fetch("https://lawyertaskapi.vercel.app/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Erro ao criar cliente");
      }

      showSuccess("Cliente criado com sucesso!");
      router.push("/clients");
    } catch (err: any) {
      showError(err.message);
      setFormError(err.message);
    }
  };

  return (
    <main className="flex">
      <Aside />

      <section className="h-full min-h-screen w-full max-w-screen flex flex-col items-center bg-b1 text-zinc-200 px-6 pt-8 pb-16">
        <article className="flex flex-col items-center justify-center w-full max-w-[600px]">
          <header className="w-full flex flex-col items-start gap-1 my-4 px-6">
            <h1 className="text-3xl font-bold">Novo Cliente</h1>
            <p className="text-zinc-400">
              Preencha os campos abaixo para adicionar um novo cliente
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-6 bg-b2 rounded-lg flex flex-col gap-4"
          >
            <div>
              <label className="text-sm text-zinc-300">Nome</label>
              <input
                {...register("name")}
                placeholder="Ex: João Silva"
                className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-md px-3 py-2 mt-1"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm text-zinc-300">E-mail</label>
              <input
                type="email"
                {...register("email")}
                placeholder="exemplo@email.com"
                className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-md px-3 py-2 mt-1"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            {formError && (
              <p className="text-red-500 text-sm text-center mt-2">{formError}</p>
            )}

            <div className="w-full flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-c4 hover:bg-c2 text-white font-semibold py-2 px-6 rounded-md mt-4 transition"
              >
                {isSubmitting ? <Loading /> : "Adicionar"}
              </button>
            </div>
          </form>
        </article>
      </section>

      <Navbar />
    </main>
  );
}