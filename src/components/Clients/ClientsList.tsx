"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import Link from "next/link";
import { Aside } from "@/components/Aside/Aside";
import ClientCard from "./ClientCard";

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = (id: string) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("atk");
    if (!token) return router.replace("/login");

    const fetchClients = async () => {
      try {
        const res = await fetch(
          "https://lawyertaskapi.vercel.app/api/clients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Erro ao buscar clientes");

        setClients(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [router]);

  return (
    <main className="flex">
      <Aside />
      <section className="h-full min-h-screen w-full max-w-screen flex justify-center overflow-hidden bg-b1 text-zinc-200 px-6 py-8">
        <article className="flex flex-col items-center w-full max-w-[1000px]">
          <header className="w-full flex justify-between items-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <LiaBalanceScaleSolid className="text-c1 text-5xl" />
              <h1 className="text-2xl font-bold">Clientes</h1>
            </div>
            <Link
              href="/clients/new"
              className="bg-c5 hover:bg-c3 transition text-white px-4 py-2 rounded-md font-semibold"
            >
              Novo Cliente
            </Link>
          </header>

          {loading && <p className="text-zinc-400">Carregando clientes...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && clients.length === 0 && (
            <div className="flex flex-col">
              <p className="text-zinc-500">Nenhum cliente encontrado.</p>
              <p className="text-zinc-500">
                Adicione um novo cliente para começar.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
            {clients.map((client) => (
              <ClientCard key={client.id} {...client} onDelete={handleDelete} />
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
