"use client";

import Task from "@/app/interfaces/Task";
import TaskCard from "@/components/Task/TaskCard";

interface UrgentTasksSectionProps {
  tasks: Task[];
  limit?: number;
}

// calculo de score: 
//  priority
//    - high → peso 3
//    - medium → peso 2
//    - low → peso 1
//
//  status
//    - todo → multiplicador 1
//    - doing → multiplicador 0.75
//    - done → multiplicador 0 (não entra no ranking)
//
//  dueDate 
//    - Calculado em dias até a data de entrega
//
//    score = (prioridade * status) / dueDate

export function UrgentTasksSection({ tasks, limit = 2 }: UrgentTasksSectionProps) {
  const now = new Date();

  const priorityWeight: Record<Task["priority"], number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const statusMultiplier: Record<Task["status"], number> = {
    todo: 1,
    doing: 0.75,
    done: 0,
  };

  const scored = tasks.map((task) => {
    const due = new Date(task.dueDate);
    const daysUntilDue = Math.max(
      0.5,
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const priorityScore = priorityWeight[task.priority];
    const statusScore = statusMultiplier[task.status];

    const score = (priorityScore * statusScore) / daysUntilDue;

    return { task, score };
  });

  const urgentTasks = scored
    .filter((entry) => entry.score > 0) 
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.task);

  if (urgentTasks.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-2xl font-[100] mb-2 text-white">Tarefas Mais Urgentes</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {urgentTasks.length > 0 ? (
          urgentTasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p className="text-zinc-400">Nenhuma tarefa urgente no momento.</p>
        )}
      </div>
    </div>
  );
}
