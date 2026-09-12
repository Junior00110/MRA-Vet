import type { ReactNode } from "react";

type DashboardBoxProps = {
  title: string;
  headerColor: string;
  children: ReactNode;
};

export default function DashboardBox({
  title,
  headerColor,
  children,
}: DashboardBoxProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className={`flex items-center justify-between px-4 py-3 text-sm font-bold text-white ${headerColor}`}
      >
        <span>{title}</span>

        <button
          type="button"
          className="text-xs font-semibold transition hover:opacity-80"
        >
          Ver todos →
        </button>
      </div>

      {children}
    </div>
  );
}