"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white px-7">

      {/* BUSCA */}
      <div className="flex h-11 w-[540px] items-center gap-3 rounded-xl bg-slate-100 px-4">
        <Search size={20} className="text-slate-500" />

        <input
          type="text"
          placeholder="Buscar cliente, paciente ou atendimento..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <span className="whitespace-nowrap rounded-lg bg-white px-2 py-1 text-xs text-slate-500 shadow-sm">
          Ctrl + K
        </span>
      </div>

      {/* USUÁRIO */}
      <div className="flex items-center gap-5">

        {/* NOTIFICAÇÕES */}
        <button
          type="button"
          className="relative rounded-xl p-2 transition hover:bg-slate-100"
          aria-label="Notificações"
        >
          <Bell size={21} className="text-slate-700" />

          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
        </button>

        {/* PERFIL */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl p-1.5 pr-3 text-left transition hover:bg-slate-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            WA
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              Clínica MRA Vet
            </p>

            <p className="text-xs font-medium text-blue-600">
              Waldson Andrade
            </p>
          </div>
        </button>

      </div>
    </header>
  );
}