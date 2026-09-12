import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  color: "blue" | "green" | "purple" | "red" | "yellow" | "emerald";
};

export default function MetricCard({
  title,
  value,
  detail,
  icon,
  color,
}: MetricCardProps) {
  const styles = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    red: "border-rose-200 bg-rose-50 text-rose-700",
    yellow: "border-amber-200 bg-amber-50 text-amber-700",
    emerald: "border-teal-200 bg-teal-50 text-teal-700",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[color]}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white/70 p-2">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold">{title}</p>

          <p className="mt-1 text-3xl font-extrabold">
            {value}
          </p>

          <p className="mt-2 text-[10px] font-medium">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}