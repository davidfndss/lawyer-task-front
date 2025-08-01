import Task from "@/app/interfaces/Task";
import Link from "next/link";

export default function TaskCard({ task }: { task: Task }) {
    return (
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
    )
}