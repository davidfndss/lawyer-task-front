interface StatCardProps {
  title: string;
  count: number;
  color: string;
}

export default function StatCard({ title, count, color }: StatCardProps) {
  return (
    <div className={`rounded-xl p-4 shadow-md ${color} text-white flex flex-col max-w-[90vw] justify-center`}>
      <span className="text-sm uppercase tracking-wide">{title}</span>
      <span className="text-3xl font-bold">{count}</span>
    </div>
  );
}
