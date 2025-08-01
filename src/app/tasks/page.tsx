"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import Link from "next/link";
import Task from "../interfaces/Task";
import TaskCard from "@/components/Task/TaskCard";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("atk");
    if (!token) return router.replace("/login");

    const fetchTasks = async () => {
      try {
        const res = await fetch("https://lawyertaskapi.vercel.app/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Erro ao buscar tarefas");
        setTasks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  return (
    // <main className="h-full min-h-screen w-full flex flex-col items-center bg-b1 text-zinc-200 px-6 py-8">
    //   <section className="flex flex-col items-center justify-center w-full max-w-[1000px]">
    //     <header className="w-full flex flex-col items-start justify-center gap-1 my-4 px-6">
    //       <h1 className="text-3xl font-bold">Criar Nova Tarefa</h1>
    //       <p className="text-zinc-400">
    //         Preencha os campos abaixo para registrar uma nova tarefa jurídica
    //       </p>
    //     </header>

    //     <form
    //       className="w-full p-6 bg-b2 rounded-lg flex flex-col gap-4"
    //     ></form>

    <main className="h-full min-h-screen w-full max-w-screen flex justify-center overflow-hidden bg-b1 text-zinc-200 px-6 py-8">
      <section className="flex flex-col items-center w-full max-w-[1000px]">
        <header className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <LiaBalanceScaleSolid className="text-c4 text-5xl" />
            <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
          </div>
          <Link
            href="/tasks/new"
            className="bg-c1 hover:bg-c2 text-white px-4 py-2 rounded-md font-semibold"
          >
            Nova Tarefa
          </Link>
        </header>

        {loading && <p className="text-zinc-400">Carregando tarefas...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p className="text-zinc-500">Nenhuma tarefa encontrada.</p>
        )}

        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </article>
      </section>
    </main>
  );
}
