import { useState, useEffect } from "react";

interface FilterProps {
  onFilterChange: (filters: {
    searchTerm: string;
    status: string;
    priority: string;
    clientId: string;
    sortOrder: "asc" | "desc" | "";
  }) => void;
}

export function TasksFilterBar({ onFilterChange }: FilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [clientId, setClientId] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  useEffect(() => {
    onFilterChange({ searchTerm, status, priority, clientId, sortOrder });
  }, [searchTerm, status, priority, clientId, sortOrder, onFilterChange]);

  return (
    <div className="w-full flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Buscar por título"
        className="px-3 py-2 rounded-md bg-zinc-800 text-white w-full md:w-auto"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="px-3 py-2 rounded-md bg-zinc-800 text-white"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Status</option>
        <option value="todo">A Fazer</option>
        <option value="doing">Fazendo</option>
        <option value="done">Feita</option>
      </select>
      <select
        className="px-3 py-2 rounded-md bg-zinc-800 text-white"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="">Prioridade</option>
        <option value="low">Baixa</option>
        <option value="medium">Média</option>
        <option value="high">Alta</option>
      </select>
      <input
        type="text"
        placeholder="ID do cliente"
        className="px-3 py-2 rounded-md bg-zinc-800 text-white w-full md:w-auto"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
      />
      <select
        className="px-3 py-2 rounded-md bg-zinc-800 text-white"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "")}
      >
        <option value="">Ordenar por data</option>
        <option value="asc">Mais antiga</option>
        <option value="desc">Mais recente</option>
      </select>
    </div>
  );
}
