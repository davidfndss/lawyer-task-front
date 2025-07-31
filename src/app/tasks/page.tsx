"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

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
    <main className="min-h-screen w-full bg-b1 text-zinc-200 px-6 py-8">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <LiaBalanceScaleSolid className="text-c4 text-4xl" />
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

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Link
            href={`/tasks/${task.id}`}
            key={task.id}
            className="bg-b2 border border-zinc-800 p-4 rounded-lg hover:border-c1 transition cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">
              {task.title}
            </h2>
            <p className="text-sm text-zinc-400 line-clamp-2 mb-2">
              {task.description}
            </p>
            <div className="flex justify-between text-xs text-zinc-500">
              <span className="capitalize">Status: {task.status}</span>
              <span className="capitalize">Prioridade: {task.priority}</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}