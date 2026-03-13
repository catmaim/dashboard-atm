import { ReactNode } from 'react';

type DashboardCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
};

export function DashboardCard({ title, value, description, icon }: DashboardCardProps) {
  return (
    <div className="card p-5 shadow-glow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-2 text-cyan-200">{icon}</div>
      </div>
      <p className="mt-4 text-sm text-slate-300">{description}</p>
    </div>
  );
}
