"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/app/utils/toast";
import ClientSelector from "@/components/Clients/ClientsSelector";
import OptionSelector from "@/components/Selector/OptionSelector";
import { Aside } from "@/components/Aside/Aside";
import { Loading } from "@/components/Loading/Loading";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  status: z.enum(["todo", "doing", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z
    .string("Data de entrega deve ser uma String")
    .min(1, "Data de entrega obrigatória"),
  clientId: z.number("Selecione um cliente").min(1, "Cliente obrigatório"),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface Client {
  id: string;
  name: string;
}

export default function TaskNewPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "todo",
      priority: "low",
    },
  });

  const status = watch("status");
  const priority = watch("priority");

  useEffect(() => {
    const token = localStorage.getItem("atk");
    if (!token) return router.replace("/login");
  }, [router]);

  const onSubmit = async (data: TaskFormData) => {
    const token = localStorage.getItem("atk");
    if (!token) return;

    try {
      setFormError(null);
      const res = await fetch("https://lawyertaskapi.vercel.app/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Erro ao criar tarefa");
      }

      showSuccess("Tarefa criada com sucesso!");
      router.push("/tasks");
    } catch (err: any) {
      showError(err.message);
      setFormError(err.message);
    }
  };

  return (
    <main className="flex">
      <Aside />

      <section className="h-full min-h-screen w-full max-w-screen flex flex-col items-center bg-b1 text-zinc-200 px-6 py-8 overflow-hidden">
        <article className="flex flex-col items-center justify-center w-full max-w-[1000px]">
          <header className="w-full flex flex-col items-start justify-center gap-1 my-4 px-6">
            <h1 className="text-3xl font-bold">Nova Tarefa</h1>
            <p className="text-zinc-400">
              Preencha os campos abaixo para registrar uma nova tarefa jurídica
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-6 bg-b2 rounded-lg flex flex-col gap-4"
          >
            <div>
              <label className="text-sm text-zinc-300">Título</label>
              <input
                {...register("title")}
                placeholder="Ex: Elaborar Contrato"
                className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-md px-3 py-2 mt-1"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-zinc-300">Descrição</label>
              <textarea
                {...register("description")}
                placeholder="Detalhe os objetivos ou pontos importantes"
                className="w-full h-28 bg-zinc-900 text-white border border-zinc-800 rounded-md px-3 py-2 mt-1 resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <OptionSelector
                label="Status"
                options={["todo", "doing", "done"] as const}
                value={status}
                onChange={(val) => setValue("status", val)}
                error={errors.status?.message}
                activeClass="bg-c4 text-white border-c4 transition hover:bg-c5 hover:border-c5"
                inactiveClass="bg-zinc-800 text-zinc-300 border-zinc-700 opacity-30 hover:opacity-100 transition hover:bg-c5 hover:border-c5"
                getLabel={(val) =>
                  val === "todo"
                    ? "A FAZER"
                    : val === "doing"
                    ? "FAZENDO"
                    : "CONCLUÍDO"
                }
              />

              <OptionSelector
                label="Prioridade"
                options={["low", "medium", "high"] as const}
                value={priority}
                onChange={(val) => setValue("priority", val)}
                error={errors.priority?.message}
                activeClass="bg-c1 text-white border-c1 transition hover:bg-c3 hover:border-c3"
                inactiveClass="bg-zinc-800 text-zinc-300 border-zinc-700 transition hover:bg-c3 hover:border-c3"
                getLabel={(val) =>
                  val === "low" ? "BAIXA" : val === "medium" ? "MÉDIA" : "ALTA"
                }
              />
            </div>

            <div className="grid grid-cols-1 items-stretch md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-300">Data de entrega</label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="w-full bg-zinc-900 h-full max-h-14 text-white border border-zinc-800 rounded-md px-3 py-2 mt-1"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-zinc-300">Cliente</label>
                <Controller
                  name="clientId"
                  control={control}
                  rules={{ required: "Selecione um cliente" }}
                  render={({ field }) => (
                    <ClientSelector
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.clientId?.message}
                    />
                  )}
                />
              </div>
            </div>

            {formError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {formError}
              </p>
            )}

            <div className="w-full flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-c1 hover:bg-c2 text-white font-semibold py-2 px-6 rounded-md mt-4 transition lg:max-w-[300px]"
              >
                {isSubmitting ? <Loading /> : "Adicionar"}
              </button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}
