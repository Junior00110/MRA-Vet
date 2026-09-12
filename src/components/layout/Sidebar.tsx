"use client";

import {
  Box,
  CalendarDays,
  ChartNoAxesCombined,
  FileText,
  HeartPulse,
  House,
  Menu,
  PawPrint,
  Settings,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Syringe,
  Users,
} from "lucide-react";

const menuItems = [
  { icon: House, label: "Painel de controle" },
  { icon: Stethoscope, label: "Atendimento clínico" },
  { icon: Users, label: "Clientes" },
  { icon: PawPrint, label: "Pacientes" },
  { icon: CalendarDays, label: "Agenda" },
  { icon: HeartPulse, label: "Internação" },
  { icon: Syringe, label: "Vacinas e produtos" },
  { icon: Box, label: "Estoque e serviços" },
  { icon: ShoppingCart, label: "Vendas" },
  { icon: ChartNoAxesCombined, label: "Financeiro" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

      {/* LOGO */}
      <div className="flex h-[74px] items-center justify-between border-b border-slate-100 px-6">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <PawPrint size={27} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-blue-700">
              MRA Vet
            </h1>

            <p className="text-[11px] text-slate-500">
              Gestão Veterinária Inteligente
            </p>
          </div>
        </div>

        <Menu size={20} className="text-slate-600" />
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">

        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`mb-1 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                index === 0
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          );
        })}

        <div className="my-3 border-t border-slate-200" />

        <button className="mb-1 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
          <FileText size={19} />
          Relatórios
        </button>

        <button className="mb-1 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-700">
          <Sparkles size={19} />
          MRA Vet IA
        </button>

        <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
          <Settings size={19} />
          Configurações
        </button>

      </nav>

      {/* BLOCO INFERIOR */}
      <div className="m-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">

        <p className="font-bold leading-6 text-blue-900">
          Cuidando de quem cuida sempre.
        </p>

        <div className="mt-4 text-center text-5xl">
          🐶 🐱
        </div>

      </div>

    </aside>
  );
}