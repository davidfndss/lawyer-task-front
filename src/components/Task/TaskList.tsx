"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import Link from "next/link";
import Task from "@/app/interfaces/Task";
import TaskCard from "@/components/Task/TaskCard";
import { Aside } from "@/components/Aside/Aside";
import { Loading } from "../Loading/Loading";
import { showError } from "@/app/utils/toast";
import { BsSearch } from "react-icons/bs";
import { TbSortAscending, TbSortDescending } from "react-icons/tb";
import { VscListOrdered } from "react-icons/vsc";
import Navbar from "../Navbar/Navbar";

export default function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

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
        showError(
          (err instanceof Error && err.message) ||
            "Houve um erro ao buscar tarefas"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          (!statusFilter || task.status === statusFilter) &&
          (!priorityFilter || task.priority === priorityFilter) &&
          (!searchTerm ||
            task.title.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortOrder === "desc") {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter, searchTerm, sortOrder]);

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
      <section className="h-full min-h-screen w-full max-w-screen flex justify-center overflow-hidden bg-b1 text-zinc-200 px-6 py-8">
        <article className="flex flex-col items-center w-full max-w-[1000px]">
          <header className="w-full max-w-[90vw] flex justify-between items-center mb-6 lg:w-full">
            <div className="flex items-center justify-center gap-2">
              <LiaBalanceScaleSolid className="text-c4 text-5xl mb-1" />
              <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
            </div>
            <Link
              href="/tasks/new"
              className="bg-c1 transition hover:bg-c2 text-white px-4 py-2 rounded-md font-semibold"
            >
              Nova Tarefa
            </Link>
          </header>

          <div className="w-full max-w-[90vw] flex flex-wrap gap-2 mb-6 lg:flex-nowrap lg:w-full">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar por título"
                className="pl-10 pr-3 py-2 rounded-md bg-zinc-900 text-zinc-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            </div>
            <div className="flex w-full lg:w-auto gap-2">
              <select
                className="px-3 py-2 rounded-lg w-full lg:w-auto bg-zinc-900 text-zinc-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status</option>
                <option value="todo">A Fazer</option>
                <option value="doing">Fazendo</option>
                <option value="done">Feita</option>
              </select>
              <select
                className="px-3 py-2 rounded-lg w-full lg:w-auto bg-zinc-900 text-zinc-200"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">Prioridade</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="px-8 py-2 rounded-lg w-full lg:w-auto bg-zinc-900 text-zinc-200 hover:bg-zinc-800 transition"
              >
                {sortOrder === "asc"
                  ? <TbSortDescending />
                  : sortOrder === "desc"
                  ? <TbSortAscending />
                  : <VscListOrdered />}
              </button>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="flex flex-col text-center">
              <p className="text-zinc-500">Nenhuma tarefa encontrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </article>
      </section>
      <Navbar />
    </main>
  );
}
