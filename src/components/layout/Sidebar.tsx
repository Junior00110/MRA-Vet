"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  X,
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
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuAberto) {
      return;
    }

    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuAberto(false);
      }
    };

    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [menuAberto]);

  return (
    <>
      {/* BOTÃO PARA ABRIR O MENU EM TELAS MENORES */}
      <button
        type="button"
        onClick={() => setMenuAberto(true)}
        aria-label="Abrir menu de navegação"
        aria-expanded={menuAberto}
        className="fixed left-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-[#D9E1DE] bg-white text-[#174A5B] shadow-md transition hover:bg-[#F3F7F5] xl:hidden"
      >
        <Menu size={21} />
      </button>

      {/* FUNDO ESCURO ATRÁS DO MENU */}
      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu de navegação"
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] xl:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#D9E1DE] bg-[#FBFCFA] shadow-xl transition-transform duration-200 ease-out xl:z-30 xl:translate-x-0 xl:shadow-none ${
          menuAberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* CABEÇALHO DA SIDEBAR */}
        <div className="flex h-[74px] shrink-0 items-center justify-between border-b border-[#E3E9E6] px-5 xl:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EFEB] text-[#174A5B]">
              <PawPrint size={26} />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-extrabold text-[#174A5B]">
                MRA Vet
              </h1>

              <p className="text-[11px] font-medium text-[#6F817F]">
                Gestão Veterinária Inteligente
              </p>
            </div>
          </div>

          {/* FECHAR MENU EM TELAS MENORES */}
          <button
            type="button"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu de navegação"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#617875] transition hover:bg-[#EAF1EE] xl:hidden"
          >
            <X size={20} />
          </button>

          {/* ÍCONE DECORATIVO NO DESKTOP */}
          <Menu
            size={20}
            className="hidden shrink-0 text-[#617875] xl:block"
          />
        </div>

        {/* NAVEGAÇÃO */}
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
                onClick={() => setMenuAberto(false)}
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

          {/* RELATÓRIOS */}
          <button
            type="button"
            disabled
            className="mb-1 flex w-full cursor-not-allowed items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#AAB7B4]"
          >
            <FileText size={19} />

            Relatórios
          </button>

          {/* MRA VET IA */}
          <button
            type="button"
            disabled
            className="mb-1 flex w-full cursor-not-allowed items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#AAB7B4]"
          >
            <Sparkles size={19} />

            MRA Vet IA
          </button>

          {/* CONFIGURAÇÕES */}
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#AAB7B4]"
          >
            <Settings size={19} />

            Configurações
          </button>
        </nav>

        {/* RODAPÉ */}
        <div className="m-4 shrink-0 rounded-2xl border border-[#DDE6E2] bg-[#F3EFE8] p-4">
          <p className="font-bold leading-6 text-[#294D4C]">
            Cuidando de quem cuida sempre.
          </p>

          <div className="mt-4 text-center text-4xl">
            🐶 🐱
          </div>
        </div>
      </aside>
    </>
  );
}