import { FaUserCircle } from "react-icons/fa";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import { MdOutlineMail } from "react-icons/md";
import { getPriorityClass, getPriorityLabel, getStatusClass, getStatusLabel } from "./TaskCard";
import { formatToDayMonthYear } from "@/app/utils/formatDate";
import Task from "@/app/interfaces/Task";
import { BiCalendar } from "react-icons/bi";
import truncateStringWithEllipsis from "@/app/utils/truncateStringWithElipsis";
import Client from "@/app/interfaces/Client";

type ViewTaskProps = {
    task: Task;
    client: Client
}

export default function TaskView(props: ViewTaskProps) {

  const statusClasses = getStatusClass(props.task.status);
  const priorityClasses = getPriorityClass(props.task.priority);
  return (
    <>
      <header className="flex items-center gap-1 mb-8">
        <LiaBalanceScaleSolid className="text-c4 text-5xl" />
        <h1 className="text-3xl font-bold">Tarefa</h1>
      </header>

      <div className="flex flex-col">
        <div className="flex gap-4 items-center text-xs text-zinc-500 mt-2 justify-start mb-2">
          <div className={priorityClasses.wrapper}>
            <i className={priorityClasses.icon}></i>
            <span>{getPriorityLabel(props.task.priority)}</span>
          </div>

          <div className={statusClasses.wrapper}>
            <i className={statusClasses.icon}></i>
            <span>{getStatusLabel(props.task.status)}</span>
          </div>
        </div>

        <h3 className="text-zinc-300 text-3xl font-bold bg-transparent break-words transition py-2">
          {props.task.title}
        </h3>

        <p className="bg-transparent text-lg text-zinc-500 resize-none transition py-2 rounded-lg break-words">
          {props.task.description}
        </p>

        <div className="flex justify-between my- items-center">
            <h6 className="text-2xl">Prazo Final:</h6>
            <div className="py-1 text-xl pr-8 pl-7 font-bold flex items-center gap-2 bg-zinc-950 rounded">
                <BiCalendar className="text-c3" />
                <span className="text-zinc-200">{formatToDayMonthYear(props.task.dueDate)}</span>
            </div>
        </div>

        <div className="mt-4">
          <div className="p-2 rounded-t-lg bg-zinc-900">
            <span className="text-zinc-500">CLIENTE</span>
          </div>
          <div className="p-2 rounded-b-lg bg-zinc-950 overflow-hidden">
            <div className="text-white rounded flex flex-col gap-1 py-1 mb-2">
              <div className="flex items-center gap-4 text-lg py-1">
                <FaUserCircle className="text-3xl text-c2" />
                <span>{truncateStringWithEllipsis(props.client.name, 60)}</span>
              </div>
              <div className="flex items-center gap-4 text-lg py-1">
                <MdOutlineMail className="text-3xl text-c2" />
                <span>{props.client.email}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-zinc-500 mb-2 my-6">Tarefa Adcionada em: {formatToDayMonthYear(props.task.createdAt)}{props.task.updatedAt !== props.task.createdAt && `, Atualizada pela ultima vez em: ${formatToDayMonthYear(props.task.updatedAt)}`}</p>

      </div>
    </>
  );
}
