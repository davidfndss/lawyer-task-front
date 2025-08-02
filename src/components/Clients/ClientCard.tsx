"use client";

import truncateStringWithEllipsis from "@/app/utils/truncateStringWithElipsis";
import Link from "next/link";
import { BsFillTrashFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { showError, showSuccess } from "@/app/utils/toast";
import { useRouter } from "next/navigation";
import { formatToDayMonthYear } from "@/app/utils/formatDate";

interface Props extends Client {
  onDelete?: (id: string) => void;
}

export default function ClientCard(props: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const token = localStorage.getItem("atk");
    if (!token) return showError("Token não encontrado. Faça login novamente.");

    try {
      const res = await fetch(`https://lawyertaskapi.vercel.app/api/clients/${props.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro ao excluir cliente");

      showSuccess("Cliente excluído com sucesso!");

      if (props.onDelete) props.onDelete(props.id); 
      else router.refresh(); 
    } catch (err: any) {
      showError(err.message || "Erro desconhecido ao excluir cliente");
    }
  };

  return (
    <div
      key={props.id}
      className="bg-zinc-900 rounded-xl shadow hover:shadow-lg transition"
    >
      <div className="p-2 rounded-t-lg flex justify-between items-center bg-zinc-900 mr-1">
        <span className="text-zinc-500">CLIENTE</span>
        <button onClick={handleDelete}>
          <i className="bi bi-x-circle-fill text-2xl text-c2 opacity-30 transition hover:opacity-100 hover:text-c3"></i>
        </button>
      </div>
      <div className="pt-2 px-2 rounded-b-lg bg-zinc-950 overflow-hidden">
        <div className="text-white rounded flex flex-col gap-1 py-1 mb-2">
          <div className="flex items-center gap-4 text-lg py-1">
            <FaUserCircle className="text-3xl text-c2" />
            <span>{truncateStringWithEllipsis(props.name, 60)}</span>
          </div>
          <div className="gap-4 text-lg py-1">
            <div className="flex gap-4">
              <MdOutlineMail className="text-3xl text-c2" />
              <p className="break-words">{props.email}</p>
            </div>
          </div>
          <p className="text-zinc-800 text-xs">Adicionado desde {formatToDayMonthYear(props.createdAt!)}</p>
        </div>
      </div>
    </div>
  );
}