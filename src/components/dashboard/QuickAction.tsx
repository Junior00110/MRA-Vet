import type { ReactNode } from "react";

type QuickActionProps = {
  icon: ReactNode;
  text: string;
  purple?: boolean;
};

export default function QuickAction({
  icon,
  text,
  purple = false,
}: QuickActionProps) {
  return (
    <button
      type="button"
      className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${
        purple
          ? "border-purple-200 bg-purple-100 text-purple-700"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50"
      }`}
    >
      {icon}

      <span>{text}</span>
    </button>
  );
}