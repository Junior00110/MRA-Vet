"use client";

import {
  Activity,
  CalendarDays,
  ChartNoAxesCombined,
  FileText,
  Package,
  PawPrint,
  Sparkles,
  Stethoscope,
  Syringe,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import DashboardBox from "@/components/dashboard/DashboardBox";
import QuickAction from "@/components/dashboard/QuickAction";

const atendimentos = [
  ["🐶", "Tobby", "Irllen", "09/09 20:01", "Concluído"],
  ["🐕", "Thor", "Adalberto", "09/09 18:58", "Concluído"],
  ["🐶", "Nino", "Gisete", "09/09 16:24", "Em atendimento"],
  ["🐕", "Maya", "Leandro", "09/09 10:35", "Concluído"],
  ["🐶", "Mel", "Roseanne", "09/09 09:58", "Concluído"],
];

const animais = [
  ["🐈‍⬛", "Pantera", "Elisabeth", "08/09 11:42", "Gato"],
  ["🐶", "Mel", "Aline", "04/09 16:59", "Cão"],
  ["🐕", "Koda", "Letícia", "03/09 17:08", "Cão"],
  ["🐶", "Lucy", "Miriam", "02/09 15:11", "Cão"],
  ["🐈", "Pipa", "Roseanne", "31/08 15:30", "Gato"],
];

const vacinas = [
  ["Anti-rábica", 6],
  ["ProHeart", 4],
  ["Vacina Múltipla – Cães", 5],
  ["Vacina Múltipla – Gatos", 3],
  ["Gripe Anual", 3],
  ["Vacina Gi...", 2],
];

const agenda = [
  ["09:00", "Luna (Carla)", "Consulta", "Confirmado"],
  ["10:00", "Thor (Adalberto)", "Retorno", "Confirmado"],
  ["11:00", "Nina (Paulo)", "Vacinação", "Pendente"],
  ["14:00", "Apolo (Fernanda)", "Consulta", "Confirmado"],
  ["15:30", "Mel (Aline)", "Exames", "Confirmado"],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7faff] text-slate-900">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <Header />

        <div className="p-7">
          {/* BOAS-VINDAS */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-extrabold">
                Bom dia, Waldson! 👋
              </h2>

              <p className="mt-1 text-slate-500">
                Aqui está o resumo da sua clínica hoje, 09 de setembro de 2026.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold shadow-sm">
                📅 09 de setembro de 2026
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm shadow-sm">
                ☀️ <b>26°C</b>

                <span className="ml-2 text-xs text-slate-500">
                  Aracaju - SE
                </span>
              </div>
            </div>
          </section>

          {/* INDICADORES */}
          <section className="grid grid-cols-6 gap-4">
            <MetricCard
              title="Atendimentos hoje"
              value="5"
              detail="↑ +25% em relação a ontem"
              icon={<Users />}
              color="blue"
            />

            <MetricCard
              title="Pacientes cadastrados"
              value="428"
              detail="↑ +12% este mês"
              icon={<PawPrint />}
              color="green"
            />

            <MetricCard
              title="Agendamentos hoje"
              value="8"
              detail="3 pendentes de confirmação"
              icon={<CalendarDays />}
              color="purple"
            />

            <MetricCard
              title="Pacientes internados"
              value="4"
              detail="2 em estado crítico"
              icon={<Activity />}
              color="red"
            />

            <MetricCard
              title="Vacinas pendentes"
              value="23"
              detail="Para os próximos 20 dias"
              icon={<Syringe />}
              color="yellow"
            />

            <MetricCard
              title="Receita do mês"
              value="R$ 14.230"
              detail="↑ +18% em relação ao mês anterior"
              icon={<WalletCards />}
              color="emerald"
            />
          </section>

          {/* CONTEÚDO PRINCIPAL */}
          <section className="mt-5 grid grid-cols-[1.1fr_1.05fr_.9fr] gap-4">
            <DashboardBox
              title="Últimos atendimentos (24h)"
              headerColor="bg-blue-600"
            >
              {atendimentos.map((item) => (
                <div
                  key={`${item[1]}-${item[3]}`}
                  className="grid grid-cols-[45px_1fr_115px_120px] items-center border-b border-slate-100 px-4 py-2 last:border-0"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl">
                    {item[0]}
                  </div>

                  <div>
                    <p className="text-sm font-bold">{item[1]}</p>
                    <p className="text-xs text-slate-500">{item[2]}</p>
                  </div>

                  <p className="text-sm text-slate-500">{item[3]}</p>

                  <span
                    className={`rounded-lg px-2 py-1 text-center text-xs font-semibold ${
                      item[4] === "Concluído"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item[4]}
                  </span>
                </div>
              ))}
            </DashboardBox>

            <DashboardBox
              title="Últimos animais cadastrados"
              headerColor="bg-emerald-600"
            >
              {animais.map((item) => (
                <div
                  key={`${item[1]}-${item[3]}`}
                  className="grid grid-cols-[45px_1fr_110px_65px] items-center border-b border-slate-100 px-4 py-2 last:border-0"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl">
                    {item[0]}
                  </div>

                  <div>
                    <p className="text-sm font-bold">{item[1]}</p>
                    <p className="text-xs text-slate-500">{item[2]}</p>
                  </div>

                  <p className="text-xs text-slate-500">{item[3]}</p>

                  <span
                    className={`rounded-lg px-2 py-1 text-center text-xs font-semibold ${
                      item[4] === "Gato"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item[4]}
                  </span>
                </div>
              ))}
            </DashboardBox>

            <DashboardBox
              title="Vacinas e produtos pendentes"
              headerColor="bg-rose-500"
            >
              {vacinas.map(([nome, quantidade]) => (
                <div
                  key={nome}
                  className="flex items-center justify-between border-b border-slate-100 px-4 py-[11px] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                      <Syringe size={16} />
                    </div>

                    <span className="text-sm font-medium">{nome}</span>
                  </div>

                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                    {quantidade}
                  </span>
                </div>
              ))}
            </DashboardBox>
          </section>

          {/* PARTE INFERIOR */}
          <section className="mt-5 grid grid-cols-[1.1fr_.95fr_.9fr] gap-4">
            <DashboardBox
              title="Agenda de hoje"
              headerColor="bg-blue-600"
            >
              {agenda.map((item) => (
                <div
                  key={item[0]}
                  className="grid grid-cols-[65px_1fr_100px_105px] items-center border-b border-slate-100 px-4 py-2.5 last:border-0"
                >
                  <span className="text-sm text-slate-500">{item[0]}</span>

                  <span className="text-sm font-semibold">{item[1]}</span>

                  <span className="text-sm text-slate-500">{item[2]}</span>

                  <span
                    className={`rounded-lg px-2 py-1 text-center text-xs font-semibold ${
                      item[3] === "Confirmado"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item[3]}
                  </span>
                </div>
              ))}
            </DashboardBox>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold">
                  📊 Resumo financeiro (Setembro)
                </h3>

                <span className="text-xs font-semibold text-blue-600">
                  Ver detalhes →
                </span>
              </div>

              <div className="relative h-32 overflow-hidden rounded-xl bg-gradient-to-t from-emerald-50 to-white">
                <svg
                  viewBox="0 0 400 120"
                  className="absolute inset-0 h-full w-full"
                >
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points="0,100 30,88 60,91 90,82 120,79 150,69 180,62 210,66 240,53 270,56 300,42 330,45 365,29 400,20"
                  />
                </svg>
              </div>

              <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200">
                <div>
                  <p className="text-xs text-slate-500">Receita</p>
                  <p className="text-xl font-extrabold text-emerald-600">
                    R$ 14.230
                  </p>
                </div>

                <div className="pl-4">
                  <p className="text-xs text-slate-500">Despesas</p>
                  <p className="text-xl font-extrabold text-red-600">
                    R$ 6.420
                  </p>
                </div>

                <div className="pl-4">
                  <p className="text-xs text-slate-500">Resultado</p>
                  <p className="text-xl font-extrabold text-blue-600">
                    R$ 7.810
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold">⚡ Acesso rápido</h3>

              <div className="grid grid-cols-3 gap-3">
                <QuickAction
                  icon={<Stethoscope />}
                  text="Novo atendimento"
                />

                <QuickAction
                  icon={<UserPlus />}
                  text="Novo cliente"
                />

                <QuickAction
                  icon={<PawPrint />}
                  text="Novo paciente"
                />

                <QuickAction
                  icon={<CalendarDays />}
                  text="Agendar"
                />

                <QuickAction
                  icon={<Syringe />}
                  text="Registrar vacinação"
                />

                <QuickAction
                  icon={<Package />}
                  text="Adicionar produto"
                />

                <QuickAction
                  icon={<FileText />}
                  text="Emitir nota"
                />

                <QuickAction
                  icon={<ChartNoAxesCombined />}
                  text="Relatórios"
                />

                <QuickAction
                  icon={<Sparkles />}
                  text="MRA Vet IA"
                  purple
                />
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-5 flex justify-between border-t border-slate-200 bg-white px-7 py-4 text-xs text-slate-500">
          <div>
            <b className="text-blue-700">MRA Vet</b>
            <span className="mx-3">v0.1.0</span>
            Sistema de Gestão Veterinária
          </div>

          <div>
            Feito com ❤️ para uma medicina veterinária mais completa.
          </div>
        </footer>
      </main>
    </div>
  );
}