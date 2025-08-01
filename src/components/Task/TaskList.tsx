"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import Link from "next/link";
import Task from "@/app/interfaces/Task";
import TaskCard from "@/components/Task/TaskCard";
import { Aside } from "@/components/Aside/Aside";

export default function TasksList() {
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
    <main className="flex">
      <Aside />
      <section className="h-full min-h-screen w-full max-w-screen flex justify-center overflow-hidden bg-b1 text-zinc-200 px-6 py-8">
        <article className="flex flex-col items-center w-full max-w-[1000px]">
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
            <div className="flex flex-col">
              <p className="text-zinc-500">Seja bem-vindo ao <span className="font-bold text-c2">LawyerTask</span></p>
              <p className="text-zinc-500">Adicione uma nova tarefa para começar</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
