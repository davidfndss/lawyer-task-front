"use client";

import { useEffect, useRef, useState } from "react";
import { showError, showSuccess } from "@/app/utils/toast";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronUpDown } from "react-icons/hi2";
import { FiSearch } from "react-icons/fi";
import truncateStringWithEllipsis from "@/app/utils/truncateStringWithElipsis";
import { clientSchema } from "@/app/clients/new/page";

interface ClientSelectorProps {
  value: number;
  onChange: (clientId: string) => void;
  error?: string;
}

export default function ClientSelector({ value, onChange, error }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const token = typeof window !== "undefined" ? localStorage.getItem("atk") : null;

  const fetchClients = async () => {
    try {
      const res = await fetch("https://lawyertaskapi.vercel.app/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClients(data);
    } catch {
      showError("Erro ao carregar clientes");
    }
  };

  useEffect(() => {
    if (token) fetchClients();
  }, [token]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  const handleCreateClient = async () => {
    const result = clientSchema.safeParse({
      name: newClientName,
      email: newClientEmail,
    });

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      if (errorMessages.name) showError(errorMessages.name[0]);
      else if (errorMessages.email) showError(errorMessages.email[0]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://lawyertaskapi.vercel.app/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error("Erro ao criar cliente");

      const newClient = await res.json();
      showSuccess("Cliente criado com sucesso!");
      setNewClientName("");
      setNewClientEmail("");
      setIsModalOpen(false);
      setClients((prev) => [...prev, newClient]);
      onChange(newClient.id);
    } catch (err: any) {
      showError(err.message || "Houve um erro ao adicionar cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full max-h-14">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-zinc-900 h-full max-h-12 text-white flex justify-between items-center border border-zinc-800 rounded-md px-3 py-2 text-left"
      >
        <span>
          {truncateStringWithEllipsis(clients.find((c) => c.id == value)?.name || "Selecionar cliente", 60)}
        </span>
        <div className="text-2xl">
          <HiChevronUpDown className="inline text-zinc-400" />
        </div>
      </button>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleOverlayClick}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                ref={modalRef}
                className="bg-b2 rounded-lg w-[90vw] max-w-[800px] p-6 z-50 relative lg:w-full"
              >
                <div className="flex gap-2 items-center mb-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      type="button"
                      className="text-3xl rounded-lg text-zinc-400 h-full px-2  transition cursor-pointer hover:bg-zinc-900"
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>

                    <h2 className="text-2xl w-full text-center font-semibold text-white">
                        Selecionar ou Adicionar Cliente
                    </h2>

                     <button
                      type="button"
                      className="text-3xl rounded-lg h-full px-2 bg-transparent text-transparent"
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                </div>

                <div className="relative w-full mb-4">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <FiSearch />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-full bg-zinc-900 text-white border border-zinc-800"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredClients.length === 0 && (
                    <p className="text-zinc-400 text-sm">
                      Nenhum cliente encontrado.
                    </p>
                  )}
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => {
                        onChange(client.id);
                        setIsModalOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-zinc-800 hover:bg-c5 text-white rounded-md transition"
                    >
                      {truncateStringWithEllipsis(client.name, 60)}
                    </button>
                  ))}
                </div>

                <div className="mt-6 border-t border-zinc-700 pt-4">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Adicionar novo cliente
                  </h3>

                  <div className="w-full flex flex-col justify-center items-center gap-1 md:flex-row md:items-stretch">
                    <input
                      type="text"
                      placeholder="Nome do cliente"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="E-mail do cliente"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 mb-2"
                    />
                     <button
                      onClick={handleCreateClient}
                      type="button"
                      disabled={loading}
                      className="w-full px-8 py-2 rounded-md bg-c1 text-white hover:bg-c2 disabled:opacity-50 mb-2 md:max-w-[150px]"
                    >
                      {loading ? "Criando..." : "Adicionar"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
