export default interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}