import Task from "@/app/interfaces/Task";
import { formatToDayMonth } from "@/app/utils/formatDate";
import truncateStringWithEllipsis from "@/app/utils/truncateStringWithElipsis";
import Link from "next/link";

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "todo":
      return "A FAZER";
    case "doing":
      return "FAZENDO";
    case "done":
      return "FEITO";
    default:
      return status.toUpperCase();
  }
};

export const getStatusClass = (status: string) => {
  const baseClass =
    "pr-4 pl-3 py-[2px] rounded-full text-xs border transition flex gap-2 items-center";
  const iconClass = "bi bi-circle-fill text-[9px] mt-[2px]";
  const statusStyles: Record<string, string> = {
    todo: "bg-c1 text-zinc-300 border-c1",
    doing: "bg-c4 text-white border-c4",
    done: "bg-green-700 text-white border-green-700",
  };

  return {
    wrapper: `${baseClass} ${statusStyles[status] || ""}`,
    icon: iconClass,
  };
};

export const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "low":
      return "BAIXA";
    case "medium":
      return "MÉDIA";
    case "high":
      return "ALTA";
    default:
      return priority.toUpperCase();
  }
};

export const getPriorityClass = (priority: string) => {
  const baseClass =
    "pr-4 pl-3 py-[2px] rounded-full text-xs border transition flex gap-2 items-center";
  const iconClass = "bi bi-flag-fill text-[9px] mt-[2px]";
  const priorityStyles: Record<string, string> = {
    low: "bg-c5 text-zinc-300 border-c5",
    medium: "bg-yellow-600 text-white border-yellow-600",
    high: "bg-c3 text-white border-c3",
  };

  return {
    wrapper: `${baseClass} ${priorityStyles[priority] || ""}`,
    icon: iconClass,
  };
};

export default function TaskCard({ task }: { task: Task }) {
  const statusClasses = getStatusClass(task.status);
  const priorityClasses = getPriorityClass(task.priority);

  return (
    <Link
      href={`/tasks/${task.id}`}
      key={task.id}
      className="flex flex-col justify-between w-full max-w-[90vw] bg-b2 border border-zinc-800 p-4 rounded-lg hover:border-c1 transition cursor-pointer overflow-hidden"
    >
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold break-words line-clamp-2 text-zinc-100 mb-1">
          {truncateStringWithEllipsis(task.title, 90)}
        </h2>
        <p className="text-sm text-zinc-400 break-words line-clamp-2 mb-2">
          {truncateStringWithEllipsis(task.description, 200)}
        </p>
      </div>

      <div className="flex justify-end gap-4 items-center text-xs text-zinc-500 mt-2 lg:justify-between">
        <div className={statusClasses.wrapper}>
          <i className={statusClasses.icon}></i>
          <span>{getStatusLabel(task.status)}</span>
        </div>

        <div className={priorityClasses.wrapper}>
          <i className={priorityClasses.icon}></i>
          <span>{getPriorityLabel(task.priority)}</span>
        </div>

        <div className="text-zinc-500">
          <i className="bi bi-event"></i>
          <span>{formatToDayMonth(task.dueDate)}</span>
        </div>

        <button className="text-zinc-300 text-xl">
            <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </Link>
  );
}
