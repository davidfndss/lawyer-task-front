"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Aside } from "@/components/Aside/Aside";
import ClientCard from "./ClientCard";
import { showError } from "@/app/utils/toast";
import { Loading } from "../Loading/Loading";
import Client from "@/app/interfaces/Client";
import { GrGroup } from "react-icons/gr";
import Navbar from "../Navbar/Navbar";

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
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
      } catch (err: unknown) {
        showError(err instanceof Error && err.message || "Houve um erro ao buscar clientes");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [router]);

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
      <section className="h-full min-h-screen w-full max-w-screen flex justify-center overflow-hidden bg-b1 text-zinc-200 px-6 pt-8 pb-20">
        <article className="flex flex-col items-center w-full max-w-[1000px]">
          <header className="w-full max-w-[90vw] flex justify-between items-center mb-6 lg:w-full">
            <div className="flex items-center justify-center gap-2">
              <GrGroup className="text-c1 text-4xl mb-1" />
              <h1 className="text-2xl font-bold">Clientes</h1>
            </div>
            <Link
              href="/clients/new"
              className="bg-c5 hover:bg-c3 transition text-white px-4 py-2 rounded-md font-semibold"
            >
              Novo Cliente
            </Link>
          </header>

          {!loading && clients.length === 0 && (
            <div className="flex flex-col">
              <p className="text-zinc-500">Nenhum cliente encontrado.</p>
              <p className="text-zinc-500">
                Adicione um novo cliente para começar.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-[90vw] lg:max-w-full">
            {clients.map((client) => (
              <ClientCard key={client.id} {...client} onDelete={handleDelete} />
            ))}
          </div>
        </article>
      </section>
      <Navbar />
    </main>
  );
}
