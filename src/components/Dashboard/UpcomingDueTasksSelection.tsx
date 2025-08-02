"use client";

import Task from "@/app/interfaces/Task";
import TaskCard from "@/components/Task/TaskCard";

interface UpcomingDueTasksSectionProps {
  tasks: Task[];
  limit?: number;
}

// proximas a vencer:
// remove as tarefas já concluídas)
// converte a data de entrega para Date
// filtra tarefas com dueDate válido e futuro (>= hoje)
// ordena da mais próxima à mais distante

export function UpcomingDueTasksSection({ tasks, limit = 3 }: UpcomingDueTasksSectionProps) {
  const now = new Date();

  const upcomingTasks = tasks
    .filter((task) => task.status !== "done")
    .map((task) => ({
      task,
      due: new Date(task.dueDate),
    }))
    .filter(
      ({ due }) =>
        !isNaN(due.getTime()) && due.getTime() >= now.getTime()
    )
    .sort((a, b) => a.due.getTime() - b.due.getTime()) 
    .slice(0, limit)
    .map((entry) => entry.task);

  if (upcomingTasks.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 mt-6">
      <h2 className="text-2xl font-[100] mb-2 text-white">Próximas Tarefas a Vencer</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {upcomingTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
