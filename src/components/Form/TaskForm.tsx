"use client";


// imports
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { showError, showSuccess } from "@/app/utils/toast";
import ClientSelector from "@/components/Clients/ClientsSelector";
import OptionSelector from "@/components/Selector/OptionSelector";
import { Aside } from "@/components/Aside/Aside";
import { Loading } from "@/components/Loading/Loading";
import Error404Component from "@/components/Error/404Error";
import Navbar from "../Navbar/Navbar";


// ZodSchema, para validação dos dados
const taskSchema = z.object({
  title: z.string("Título inválido").min(1, "Título é obrigatório"),
  description: z.string("Descrição inválida").min(1, "Descrição é obrigatória"),
  status: z.enum(["todo", "doing", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string("Data de entrega inválida").min(1, "Data de entrega obrigatória"),
  clientId: z.number("Selecione um cliente para continuar").min(1, "Selecionar um cliente é obrigatório"),
});

type TaskFormData = z.infer<typeof taskSchema>;


// Formulário que suporta criação e edição de tarefas, com base na preseça do ID ou não
export default function TaskForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const router = useRouter();

  // Estados
  const [loading, setLoading] = useState(isEditMode);
  const [formError, setFormError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Chamada do hook principal do React Hook Form, para gerenciar o formulário
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
    // Redireciona pro login se o usuário não estiver logado
    const token = localStorage.getItem("atk");
    if (!token) return router.replace("/login");

    // Puxa os dados da tarefa para edição
    if (isEditMode) {
      const fetchTask = async () => {
        try {
          const taskRes = await fetch(`https://lawyertaskapi.vercel.app/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!taskRes.ok) throw new Error("not-found");
          const taskData = await taskRes.json();

          setValue("title", taskData.title);
          setValue("description", taskData.description);
          setValue("status", taskData.status);
          setValue("priority", taskData.priority);
          setValue("dueDate", taskData.dueDate.slice(0, 10));
          setValue("clientId", taskData.clientId);
        } catch (err: unknown) {
          setError(err instanceof Error && err.message === "not-found" ? "not-found" : "Erro ao carregar tarefa");
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id]);

  // Envia os dados do formulário
  const onSubmit = async (data: TaskFormData) => {
    const token = localStorage.getItem("atk");
    if (!token) return;

    try {
      setFormError(null);
      const res = await fetch(
        `https://lawyertaskapi.vercel.app/api/tasks${isEditMode ? `/${id}` : ""}`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Erro ao salvar tarefa");
      }

      showSuccess(isEditMode ? "Tarefa atualizada com sucesso!" : "Tarefa criada com sucesso!");
      router.push("/tasks");
    } catch (err: unknown) {
      showError(err instanceof Error && err.message || "Houve um erro ao salvar a tarefa");
      setFormError(err instanceof Error && err.message || "Houve um erro ao salvar a tarefa");
    }
  };

  // Tela de loading
  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-b1">
        <Loading />
      </div>
    );
  }

  // Tela de erro 404
  if (error === "not-found") {
    return <Error404Component />;
  }

  return (
    <main className="flex">
      <Aside />

      <section className="h-full min-h-screen w-full max-w-screen flex flex-col items-center bg-b1 text-zinc-200 px-6 pt-8 pb-16">
        <article className="flex flex-col items-center justify-center w-full max-w-[1000px]">
          <header className="w-full flex flex-col items-start gap-1 my-4 px-6">
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Editar Tarefa" : "Nova Tarefa"}
            </h1>
            <p className="text-zinc-400">
              {isEditMode
                ? "Atualize os campos da tarefa abaixo"
                : "Preencha os campos para criar uma nova tarefa jurídica"}
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
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="text-sm text-zinc-300">Descrição</label>
              <textarea
                {...register("description")}
                placeholder="Detalhe os objetivos ou pontos importantes"
                className="w-full h-28 bg-zinc-900 text-white border border-zinc-800 rounded-md px-3 py-2 mt-1 resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <OptionSelector
                label="Status"
                options={["todo", "doing", "done"] as const}
                value={status}
                onChange={(val) => setValue("status", val)}
                error={errors.status?.message}
                activeClass="bg-c4 text-white border-c4"
                inactiveClass="bg-zinc-800 text-zinc-300 border-zinc-700 opacity-30 hover:opacity-100"
                getLabel={(val) =>
                  val === "todo" ? "A FAZER" : val === "doing" ? "FAZENDO" : "CONCLUÍDO"
                }
              />

              <OptionSelector
                label="Prioridade"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-300">Data de entrega</label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-md px-3 py-2 h-full max-h-12"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-xs">{errors.dueDate.message}</p>
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
              <p className="text-red-500 text-sm text-center mt-2">{formError}</p>
            )}

            <div className="w-full flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-c1 hover:bg-c2 text-white font-semibold py-2 px-6 rounded-md mt-4 transition lg:max-w-[300px]"
              >
                {isSubmitting ? <Loading /> : isEditMode ? "Salvar Alterações" : "Adicionar"}
              </button>
            </div>
          </form>
        </article>
      </section>
      <Navbar />
    </main>
  );
}