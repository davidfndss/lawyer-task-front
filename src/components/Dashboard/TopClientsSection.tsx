"use client";

import Task from "@/app/interfaces/Task";
import truncateStringWithEllipsis from "@/app/utils/truncateStringWithElipsis";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

interface Props {
  tasks: Task[];
  limit?: number;
}

// clientes com mais projetos:
// conta quantas tarefas estão associadas a cada cliente pelo id
// associa a contagem de tarefas a cada cliente
// ordena os clientes

export function TopClientsSection({ tasks, limit = 3 }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("atk");
    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    async function fetchTopClients() {
      try {
        const res = await fetch(
          `https://lawyertaskapi.vercel.app/api/clients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao buscar clientes");

        setClients(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchTopClients();
  }, [limit]);

  const clientsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((task) => {
      counts[task.clientId] = (counts[task.clientId] || 0) + 1;
    });

    return clients
      .map((client) => ({
        ...client,
        projectsCount: counts[client.id] || 0,
      }))
      .filter((client) => client.projectsCount > 0)
      .sort((a, b) => b.projectsCount - a.projectsCount)
      .slice(0, limit);
  }, [tasks, clients, limit]);

  if (clientsWithCounts.length === 0)
    return (
      <p className="text-zinc-400">Nenhum cliente com projetos encontrados.</p>
    );

  return (
    <section className="w-full mt-6">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-[100]">Clientes com mais projetos</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientsWithCounts.map(({ id, name, projectsCount }) => (
          <Link
                href={`/clients`}
                key={id}
                className="bg-zinc-900 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="p-2 py-1 rounded-t-lg text-xl flex justify-between items-center bg-zinc-900 mr-1">
                    <span className="text-c1">{projectsCount}</span>
                    <i className="bi bi-circle-fill text-zinc-800"></i>
                </div>
                <div className="p-2 rounded-b-lg bg-zinc-950 overflow-hidden">
                  <div className="text-white rounded flex justify-between gap-1 py-1 mb-2">
                    <div className="flex items-center gap-4 text-lg py-1">
                      <FaUserCircle className="text-3xl text-c3" />
                      <span>{truncateStringWithEllipsis(name, 60)}</span>
                    </div>


                    <button>
                        <i className="bi bi-chevron-right text-2xl text-zinc-700"></i>
                    </button>
                  </div>
                </div>
              </Link>
        ))}
      </div>
    </section>
  );
}
