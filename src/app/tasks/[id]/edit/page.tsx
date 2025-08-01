"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import { Aside } from "@/components/Aside/Aside";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { showError, showSuccess } from "@/app/utils/toast";
import ClientSelector from "@/components/Clients/ClientsSelector";
import OptionSelector from "@/components/Selector/OptionSelector";
import { FaRegEdit } from "react-icons/fa";
import Error404Component from "@/components/Error/404Error";
import Task from "@/app/interfaces/Task";
import { Loading } from "@/components/Loading/Loading";

const schema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
  status: z.enum(["todo", "doing", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string("Data de entrega deve ser uma String").min(1, "Data obrigatória"),
  clientId: z.number("Selecione um cliente").min(1, "Cliente obrigatório"),
});

type TaskData = z.infer<typeof schema>;

export default function TaskEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [task, setTask] = useState<Task | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskData>({
    resolver: zodResolver(schema),
  });

  const status = watch("status");
  const priority = watch("priority");

  const fetchData = async () => {
    const token = localStorage.getItem("atk");
    if (!token) return router.replace("/login");

    try {
      const taskRes = await fetch(
        `https://lawyertaskapi.vercel.app/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!taskRes.ok) throw new Error("not-found");
      const taskData = await taskRes.json();
      setTask(taskData);

      const clientRes = await fetch(
        `https://lawyertaskapi.vercel.app/api/clients/${taskData.clientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!clientRes.ok) throw new Error("not-found");
      const clientData = await clientRes.json();
      setClient(clientData);


      setValue("title", taskData.title);
      setValue("description", taskData.description);
      setValue("status", taskData.status);
      setValue("priority", taskData.priority);
      setValue("dueDate", taskData.dueDate.slice(0, 10));
      setValue("clientId", taskData.clientId);
    } catch (err: any) {
      console.error(err);
      if (err.message === "not-found") {
        setError("not-found");
      } else {
        setError("Erro ao carregar dados");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const onSubmit = async (data: TaskData) => {
    const token = localStorage.getItem("atk");
    try {
      const res = await fetch(
        `https://lawyertaskapi.vercel.app/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Erro ao atualizar tarefa");
      showSuccess("Tarefa atualizada com sucesso");
      router.push("/tasks");
    } catch (err) {
      console.error(err);
      showError("Erro ao atualizar tarefa");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-screen justify-center items-center w-full bg-b1">
        <Loading />
      </div>
    );
  }

  if (!loading && error === "not-found") {
    return <Error404Component />;
  }

  return (
    <main className="flex">
      <Aside />
      <section className="min-h-screen w-full bg-b1 text-zinc-200 px-6 py-8 flex justify-center">
        <article className="w-full max-w-[700px]">
          <header className="flex items-center gap-2 my-8">
            <FaRegEdit className="text-c4 text-4xl" />
            <h1 className="text-2xl font-bold">Editar Tarefa</h1>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              {...register("title")}
              placeholder="Título"
              className="text-zinc-300 text-xl font-bold bg-zinc-900 border border-zinc-800 break-words transition p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-c1"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}

            <textarea
              {...register("description")}
              placeholder="Descrição"
              className="bg-zinc-900 border border-zinc-800 px-2 py-4 text-zinc-300 transition rounded-md focus:outline-none focus:ring-2 focus:ring-c1 focus:h-28"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}

            <div className="flex flex-col gap-4">
              <OptionSelector
                label=""
                options={["todo", "doing", "done"] as const}
                value={status}
                onChange={(val) => setValue("status", val)}
                error={errors.status?.message}
                activeClass="bg-c4 text-white border-c4"
                inactiveClass="bg-zinc-800 text-zinc-300 border-zinc-700 opacity-30 hover:opacity-100"
                getLabel={(val) =>
                  val === "todo"
                    ? "A FAZER"
                    : val === "doing"
                    ? "FAZENDO"
                    : "CONCLUÍDO"
                }
              />

              <OptionSelector
                label=""
                options={["low", "medium", "high"] as const}
                value={priority}
                onChange={(val) => setValue("priority", val)}
                error={errors.priority?.message}
                activeClass="bg-c3 text-white border-c3"
                inactiveClass="bg-zinc-800 text-zinc-300 border-zinc-700 opacity-30 hover:opacity-100"
                getLabel={(val) =>
                  val === "low" ? "BAIXA" : val === "medium" ? "MÉDIA" : "ALTA"
                }
              />
            </div>

            <input
              type="date"
              {...register("dueDate")}
              className="w-full text-zinc-300 bg-zinc-900 border border-zinc-800 mt-1 transition p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-c1 focus:px-2"
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
            )}

            <div>
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

            <div className="flex justify-between gap-4 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-c1 hover:bg-c2 text-white py-2 px-4 rounded-md font-semibold"
              >
                {isSubmitting ? <Loading /> : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}
