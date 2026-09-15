"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  {
    icon: House,
    label: "Painel de controle",
    href: "/",
    habilitado: true,
  },
  {
    icon: Stethoscope,
    label: "Atendimento clínico",
    href: "/atendimentos",
    habilitado: false,
  },
  {
    icon: Users,
    label: "Clientes",
    href: "/clientes",
    habilitado: true,
  },
  {
    icon: PawPrint,
    label: "Pacientes",
    href: "/pacientes",
    habilitado: false,
  },
  {
    icon: CalendarDays,
    label: "Agenda",
    href: "/agenda",
    habilitado: false,
  },
  {
    icon: HeartPulse,
    label: "Internação",
    href: "/internacao",
    habilitado: false,
  },
  {
    icon: Syringe,
    label: "Vacinas e produtos",
    href: "/vacinas",
    habilitado: false,
  },
  {
    icon: Box,
    label: "Estoque e serviços",
    href: "/estoque",
    habilitado: false,
  },
  {
    icon: ShoppingCart,
    label: "Vendas",
    href: "/vendas",
    habilitado: false,
  },
  {
    icon: ChartNoAxesCombined,
    label: "Financeiro",
    href: "/financeiro",
    habilitado: false,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-[#D9E1DE] bg-[#FBFCFA]">
      <div className="flex h-[74px] items-center justify-between border-b border-[#E3E9E6] px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6EFEB] text-[#174A5B]">
            <PawPrint size={26} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-[#174A5B]">
              MRA Vet
            </h1>

            <p className="text-[11px] font-medium text-[#6F817F]">
              Gestão Veterinária Inteligente
            </p>
          </div>
        </div>

        <Menu size={20} className="text-[#617875]" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const ativo =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          if (!item.habilitado) {
            return (
              <button
                key={item.label}
                type="button"
                disabled
                className="mb-1 flex w-full cursor-not-allowed items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#AAB7B4]"
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`mb-1 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                ativo
                  ? "bg-[#174A5B] text-white shadow-sm"
                  : "text-[#3D5554] hover:bg-[#EAF1EE] hover:text-[#174A5B]"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}

        <div className="my-3 border-t border-[#E0E7E4]" />

        <button
          type="button"
          disabled
          className="mb-1 flex w-full cursor-not-allowed items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#AAB7B4]"
        >
          <FileText size={19} />
          Relatórios
        </button>

        <button
          type="button"
          disabled
          className="mb-1 flex w-full cursor-not-allowed items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#AAB7B4]"
        >
          <Sparkles size={19} />
          MRA Vet IA
        </button>

        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#AAB7B4]"
        >
          <Settings size={19} />
          Configurações
        </button>
      </nav>

      <div className="m-4 rounded-2xl border border-[#DDE6E2] bg-[#F3EFE8] p-4">
        <p className="font-bold leading-6 text-[#294D4C]">
          Cuidando de quem cuida sempre.
        </p>

        <div className="mt-4 text-center text-4xl">
          🐶 🐱
        </div>
      </div>
    </aside>
  );
}