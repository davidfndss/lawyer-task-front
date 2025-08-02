"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LiaChartBarSolid } from "react-icons/lia";
import Task from "@/app/interfaces/Task";
import { Aside } from "@/components/Aside/Aside";
import { Loading } from "@/components/Loading/Loading";
import { UrgentTasksSection } from "@/components/Dashboard/UrgentTaskSection";
import StatCard from "@/components/Dashboard/StatCard";
import { TopClientsSection } from "@/components/Dashboard/TopClientsSection";
import { UpcomingDueTasksSection } from "@/components/Dashboard/UpcomingDueTasksSelection";
import { showError } from "../utils/toast";

export default function Dashboard() {
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          showError("Houve um erro");
          console.error(err.message);
          setError(err.message)
        } else {
          console.error(err);
          showError("Houve um erro inesperado");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  const countByStatus = (status: Task["status"]) =>
    tasks.filter((task) => task.status === status).length;

  if (loading) {
    return (
      <div className="flex h-full min-h-screen justify-center items-center w-full bg-b1">
        <Loading />
      </div>
    );
  }

  return (
    <main className="flex">
      <Aside />
      <section className="h-full min-h-screen w-full max-w-screen bg-b1 text-zinc-200 px-6 py-8 flex justify-center">
        <article className="flex flex-col items-center w-full max-w-[1000px]">
          <header className="w-full flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <LiaChartBarSolid className="text-c4 text-5xl" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
          </header>

          {error && <p className="text-red-400">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-10">
            <StatCard
              title="Total de Tarefas"
              count={tasks.length}
              color="bg-c1"
            />
            <StatCard
              title="A Fazer"
              count={countByStatus("todo")}
              color="bg-c5"
            />
            <StatCard
              title="Em Andamento"
              count={countByStatus("doing")}
              color="bg-c4"
            />
            <StatCard
              title="Concluídas"
              count={countByStatus("done")}
              color="bg-c3"
            />
          </div>

          <UrgentTasksSection tasks={tasks} limit={3} />

          <TopClientsSection tasks={tasks} limit={3} />

          <UpcomingDueTasksSection tasks={tasks} limit={3} />
        </article>
      </section>
    </main>
  );
}
