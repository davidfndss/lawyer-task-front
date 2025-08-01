"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import { Aside } from "@/components/Aside/Aside";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { showError, showSuccess } from "@/app/utils/toast";
import ClientSelector from "@/components/Clients/ClientsSelector";
import OptionSelector from "@/components/Selector/OptionSelector";
import { FaRegEdit, FaUserCircle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { formatToDayMonth } from "@/app/utils/formatDate";
import Error404Component from "@/components/Error/404Error";
import Task from "@/app/interfaces/Task";
import ViewTask from "@/components/Task/ViewTask";
import { BiTrash } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";
import { Loading } from "@/components/Loading/Loading";
import Navbar from "@/components/Navbar/Navbar";

export default function TaskViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [task, setTask] = useState<Task | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem("atk");
    if (!token) return router.replace("/login");

    try {
      const taskRes = await fetch(
        `https://lawyertaskapi.vercel.app/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!taskRes.ok) throw new Error("not-found");
      const taskData = await taskRes.json();
      setTask(taskData);

      const clientRes = await fetch(
        `https://lawyertaskapi.vercel.app/api/clients/${taskData.clientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!clientRes.ok) throw new Error("not-found");
      const clientData = await clientRes.json();
      setClient(clientData);
    } catch (err: any) {
      console.error(err);
      if (err.message === "not-found") {
        setError("not-found");
      } else {
        setError("Erro ao carregar dados");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full min-h-screen justify-center items-center w-full bg-b1">
        <Loading />
      </div>
    );
  }

  const deleteTask = async () => {
    const token = localStorage.getItem("atk");
    try {
      const res = await fetch(
        `https://lawyertaskapi.vercel.app/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao deletar tarefa");
      showSuccess("Tarefa excluída");
      router.push("/tasks");
    } catch (err) {
      console.error(err);
      showError("Erro ao deletar tarefa");
    }
  };

  if (!loading && error === "not-found") {
    return <Error404Component />;
  }

  return (
    <main className="flex">
      <Aside />
      <section className="min-h-screen w-full bg-b1 text-zinc-200 px-6 py-8 flex justify-center">
        <article className="w-full max-w-[700px]">
          {task && client && <ViewTask task={task} client={client} />}
          <div className="flex justify-between gap-4 mt-4">
          <button
            type="button"
            onClick={deleteTask}
            className="bg-c3 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition flex gap-1 items-center"
          >
            <BsFillTrashFill className="text-lg" />
            <span>Excluir Tarefa</span>
          </button>

          <button
            type="button"
            onClick={() => router.push(`/tasks/${id}/edit`)}
            className="bg-c1 hover:bg-c2 text-white py-2 px-4 rounded-md  transition font-semibold"
          >
            Editar Tarefa
          </button>
        </div>
        </article>
      </section>
      <Navbar />
    </main>
  );
}
