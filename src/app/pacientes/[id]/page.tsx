import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  CalendarDays,
  Camera,
  ChevronDown,
  FileText,
  FlaskConical,
  HeartPulse,
  Hospital,
  MessageSquareText,
  PackagePlus,
  PawPrint,
  Printer,
  ReceiptText,
  Scale,
  Search,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  Syringe,
  UserRound,
  Video,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import PacienteAtendimentoForm from "@/components/pacientes/PacienteAtendimentoForm";
import ExcluirAtendimentoButton from "@/components/pacientes/ExcluirAtendimentoButton";
import PacientePesoForm from "@/components/pacientes/PacientePesoForm";
import ExcluirPesoButton from "@/components/pacientes/ExcluirPesoButton";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

type PacientePageProps = {
  params: Promise<{
    id: string;
  }>;
};

type TipoAnimal =
  | "felino"
  | "canino"
  | "outro";

type CorAcao =
  | "laranja"
  | "roxo"
  | "verde"
  | "coral"
  | "petroleo"
  | "amarelo"
  | "lilas"
  | "grafite"
  | "vermelho"
  | "verdeForte";

function valorOuTraco(
  valor:
    | string
    | number
    | null
    | undefined,
) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "Não informado";
  }

  return String(valor);
}

function formatarData(
  data:
    | string
    | null
    | undefined,
) {
  if (!data) {
    return "Não informada";
  }

  const partes = String(data)
    .slice(0, 10)
    .split("-");

  if (partes.length !== 3) {
    return String(data);
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarIdade(
  data:
    | string
    | null
    | undefined,
) {
  if (!data) {
    return "Não informada";
  }

  const partes = String(data)
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (
    partes.length !== 3 ||
    partes.some(
      (parte) =>
        !Number.isFinite(parte),
    )
  ) {
    return "Não informada";
  }

  const [
    ano,
    mes,
    dia,
  ] = partes;

  const nascimento =
    new Date(
      ano,
      mes - 1,
      dia,
    );

  if (
    Number.isNaN(
      nascimento.getTime(),
    )
  ) {
    return "Não informada";
  }

  const hoje =
    new Date();

  let anos =
    hoje.getFullYear() -
    nascimento.getFullYear();

  let meses =
    hoje.getMonth() -
    nascimento.getMonth();

  if (
    hoje.getDate() <
    nascimento.getDate()
  ) {
    meses -= 1;
  }

  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }

  if (anos < 0) {
    return "Não informada";
  }

  if (anos === 0) {
    if (meses <= 0) {
      return "Menos de 1 mês";
    }

    return `${meses} ${
      meses === 1
        ? "mês"
        : "meses"
    }`;
  }

  if (meses === 0) {
    return `${anos} ${
      anos === 1
        ? "ano"
        : "anos"
    }`;
  }

  return `${anos} ${
    anos === 1
      ? "ano"
      : "anos"
  } e ${meses} ${
    meses === 1
      ? "mês"
      : "meses"
  }`;
}

function formatarDataHora(
  data: string,
) {
  const valor = new Date(data);

  if (
    Number.isNaN(
      valor.getTime(),
    )
  ) {
    return data;
  }

  return valor.toLocaleString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function formatarPeso(
  peso:
    | number
    | null
    | undefined,
) {
  if (
    peso === null ||
    peso === undefined
  ) {
    return "Não informado";
  }

  return `${new Intl.NumberFormat(
    "pt-BR",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  ).format(peso)} kg`;
}

function tipoAnimal(
  especie:
    | string
    | null
    | undefined,
): TipoAnimal {
  const valor = (
    especie ?? ""
  ).toLowerCase();

  if (
    valor.includes("felino") ||
    valor.includes("gato")
  ) {
    return "felino";
  }

  if (
    valor.includes("canino") ||
    valor.includes("cão") ||
    valor.includes("cao") ||
    valor.includes("cachorro")
  ) {
    return "canino";
  }

  return "outro";
}

function SiameseFace() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-[78px] w-[78px]"
      aria-hidden="true"
    >
      <path
        d="M26 43 L38 13 L52 39 Z"
        fill="#5F4A43"
      />

      <path
        d="M94 43 L82 13 L68 39 Z"
        fill="#5F4A43"
      />

      <path
        d="M32 37 L38 20 L46 38 Z"
        fill="#B98C89"
      />

      <path
        d="M88 37 L82 20 L74 38 Z"
        fill="#B98C89"
      />

      <ellipse
        cx="60"
        cy="62"
        rx="36"
        ry="32"
        fill="#E8DAC6"
      />

      <path
        d="M37 47 Q60 30 83 47 Q78 68 60 76 Q42 68 37 47 Z"
        fill="#775D54"
        opacity="0.92"
      />

      <ellipse
        cx="60"
        cy="70"
        rx="13"
        ry="11"
        fill="#675049"
      />

      <ellipse
        cx="46"
        cy="56"
        rx="6"
        ry="7"
        fill="#72AFCF"
      />

      <ellipse
        cx="74"
        cy="56"
        rx="6"
        ry="7"
        fill="#72AFCF"
      />

      <circle
        cx="47"
        cy="55"
        r="2"
        fill="#16262D"
      />

      <circle
        cx="73"
        cy="55"
        r="2"
        fill="#16262D"
      />

      <circle
        cx="48"
        cy="53"
        r="1.2"
        fill="white"
      />

      <circle
        cx="72"
        cy="53"
        r="1.2"
        fill="white"
      />

      <path
        d="M56 67 Q60 64 64 67 Q60 72 56 67 Z"
        fill="#3F3130"
      />

      <path
        d="M60 71 L60 75"
        stroke="#3F3130"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M60 75 Q55 79 50 76"
        stroke="#3F3130"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M60 75 Q65 79 70 76"
        stroke="#3F3130"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PugFace() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-[78px] w-[78px]"
      aria-hidden="true"
    >
      <path
        d="
          M29 37
          C17 36 16 51 25 59
          L39 49
          Z
        "
        fill="#433532"
      />

      <path
        d="
          M91 37
          C103 36 104 51 95 59
          L81 49
          Z
        "
        fill="#433532"
      />

      <ellipse
        cx="60"
        cy="62"
        rx="36"
        ry="34"
        fill="#D8AD7D"
      />

      <ellipse
        cx="60"
        cy="68"
        rx="22"
        ry="20"
        fill="#4A3A36"
      />

      <circle
        cx="46"
        cy="57"
        r="6"
        fill="#242020"
      />

      <circle
        cx="74"
        cy="57"
        r="6"
        fill="#242020"
      />

      <circle
        cx="48"
        cy="55"
        r="1.6"
        fill="white"
      />

      <circle
        cx="76"
        cy="55"
        r="1.6"
        fill="white"
      />

      <ellipse
        cx="60"
        cy="67"
        rx="8"
        ry="6"
        fill="#181515"
      />

      <path
        d="M60 71 L60 76"
        stroke="#181515"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M60 76 Q54 80 48 76"
        stroke="#181515"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M60 76 Q66 80 72 76"
        stroke="#181515"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AnimalAvatar({
  tipo,
}: {
  tipo: TipoAnimal;
}) {
  if (tipo === "felino") {
    return (
      <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-[28px] border border-[#E9DCC9] bg-gradient-to-br from-[#FFF6E9] via-[#F0E2CF] to-[#D5C0A5] shadow-lg">
        <SiameseFace />
      </div>
    );
  }

  if (tipo === "canino") {
    return (
      <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-[28px] border border-[#E7D5C1] bg-gradient-to-br from-[#FAEDD9] via-[#E8C99F] to-[#CDA574] shadow-lg">
        <PugFace />
      </div>
    );
  }

  return (
    <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[28px] bg-[#E7F0ED] text-[#174A5B] shadow-lg">
      <PawPrint size={38} />
    </div>
  );
}

export default async function PacientePage({
  params,
}: PacientePageProps) {
  await exigirPermissao(
    "cliente.visualizar",
  );

  const { id } = await params;

  const pacienteId =
    Number(id);

  if (
    !Number.isInteger(
      pacienteId,
    ) ||
    pacienteId <= 0
  ) {
    notFound();
  }

  const runtime =
    db.runtime();

  const consultaPaciente =
    db.sql.public.paciente
      .select(
        "id",
        "codigoAntigo",
        "nome",
        "especie",
        "sexo",
        "raca",
        "dataNascimento",
        "corPelagem",
        "peso",
        "microchip",
        "observacoes",
        "castrado",
        "ativo",
        "clienteId",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          pacienteId,
        ),
      )
      .limit(1)
      .build();

  const resultadoPaciente =
    await runtime.query(
      consultaPaciente,
    );

  const paciente =
    resultadoPaciente[0];

  if (!paciente) {
    notFound();
  }

  let cliente:
    | {
        id: number;
        nome: string;
        telefone:
          | string
          | null;
        whatsapp:
          | string
          | null;
        email:
          | string
          | null;
      }
    | undefined;

  if (
    paciente.clienteId !==
    null
  ) {
    const consultaCliente =
      db.sql.public.cliente
        .select(
          "id",
          "nome",
          "telefone",
          "whatsapp",
          "email",
        )
        .where((f, fns) =>
          fns.eq(
            f.id,
            paciente.clienteId!,
          ),
        )
        .limit(1)
        .build();

    const resultadoCliente =
      await runtime.query(
        consultaCliente,
      );

    cliente =
      resultadoCliente[0];
  }

  const consultaAnotacoes =
    db.sql.public.pacienteAnotacao
      .select(
        "id",
        "texto",
        "criadoPorNome",
        "createdAt",
        "ativo",
      )
      .where((f, fns) =>
        fns.and(
          fns.eq(
            f.pacienteId,
            pacienteId,
          ),
          fns.eq(
            f.ativo,
            true,
          ),
        ),
      )
      .orderBy(
        "createdAt",
        {
          direction: "desc",
        },
      )
      .build();

  const anotacoes =
    await runtime.query(
      consultaAnotacoes,
    );

  const consultaAtendimentos =
    db.sql.public.pacienteAtendimento
      .select(
        "id",
        "motivoConsulta",
        "anamnese",
        "exameClinico",
        "diagnosticoSuspeita",
        "conduta",
        "observacoes",
        "dataAtendimento",
        "profissionalNome",
        "ativo",
        "createdAt",
      )
      .where((f, fns) =>
        fns.and(
          fns.eq(
            f.pacienteId,
            pacienteId,
          ),
          fns.eq(
            f.ativo,
            true,
          ),
        ),
      )
      .orderBy(
        "dataAtendimento",
        {
          direction: "desc",
        },
      )
      .build();

  const atendimentos =
    await runtime.query(
      consultaAtendimentos,
    );

  const consultaPesos =
    db.sql.public.pacientePeso
      .select(
        "id",
        "peso",
        "observacoes",
        "dataPesagem",
        "profissionalNome",
        "ativo",
        "createdAt",
      )
      .where((f, fns) =>
        fns.and(
          fns.eq(
            f.pacienteId,
            pacienteId,
          ),
          fns.eq(
            f.ativo,
            true,
          ),
        ),
      )
      .orderBy(
        "dataPesagem",
        {
          direction: "desc",
        },
      )
      .build();

  const pesagens =
    await runtime.query(
      consultaPesos,
    );

  const consultaPlanos =
    db.sql.public.pacientePlano
      .select(
        "id",
        "nome",
        "numeroCarteirinha",
        "observacoes",
        "ativo",
        "createdAt",
      )
      .where((f, fns) =>
        fns.eq(
          f.pacienteId,
          pacienteId,
        ),
      )
      .orderBy(
        "createdAt",
        {
          direction: "desc",
        },
      )
      .build();

  const planos =
    await runtime.query(
      consultaPlanos,
    );

  const planoAtivo =
    planos.find(
      (plano) =>
        plano.ativo,
    );

  const historico = [
    ...anotacoes.map(
      (anotacao) => ({
        tipo: "anotacao" as const,
        id: anotacao.id,
        data: String(
          anotacao.createdAt,
        ),
        anotacao,
      }),
    ),

    ...atendimentos.map(
      (atendimento) => ({
        tipo: "atendimento" as const,
        id: atendimento.id,
        data: String(
          atendimento.dataAtendimento,
        ),
        atendimento,
      }),
    ),

    ...pesagens.map(
      (pesagem) => ({
        tipo: "peso" as const,
        id: pesagem.id,
        data: String(
          pesagem.dataPesagem,
        ),
        pesagem,
      }),
    ),
  ].sort((a, b) => {
    const dataA =
      new Date(a.data).getTime();

    const dataB =
      new Date(b.data).getTime();

    return dataB - dataA;
  });

  const tipo =
    tipoAnimal(
      paciente.especie,
    );

  return (
    <div className="min-h-screen bg-[#F2F1EC] font-[family-name:var(--font-dosis)] text-[#24343A]">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <Header />

        <div className="p-6">
          {cliente ? (
            <Link
              href={`/clientes/${cliente.id}`}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#526764] transition hover:text-[#174A5B]"
            >
              <ArrowLeft
                size={17}
              />

              Voltar para o tutor
            </Link>
          ) : (
            <Link
              href="/clientes"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#526764]"
            >
              <ArrowLeft
                size={17}
              />

              Voltar
            </Link>
          )}

          {/* CABEÇALHO */}
          <section className="relative overflow-hidden rounded-[28px] border border-[#D9E1DE] bg-white shadow-sm">
            <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#174A5B] via-[#7FA89A] to-[#D7B78A]" />

            <div className="flex flex-wrap items-center justify-between gap-6 p-6">
              <div className="flex items-center gap-5">
                <AnimalAvatar
                  tipo={tipo}
                />

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-[32px] font-black leading-none text-[#24343A]">
                      {paciente.nome}
                    </h1>

                    <span className="rounded-full bg-[#E2F2EA] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#3E765E]">
                      {paciente.ativo
                        ? "Ativo"
                        : "Inativo"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#73817F]">
                    {valorOuTraco(
                      paciente.especie,
                    )}

                    {" • "}

                    {valorOuTraco(
                      paciente.raca,
                    )}

                    {" • "}

                    {valorOuTraco(
                      paciente.sexo,
                    )}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="min-w-[200px] rounded-2xl border border-[#DCE4E1] bg-[#F8FAF9] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-[#174A5B]"
                        />

                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A8B87]">
                          Idade
                        </p>
                      </div>

                      <p className="mt-1 text-[24px] font-black leading-tight text-[#24343A] sm:text-[28px]">
                        {formatarIdade(
                          paciente.dataNascimento,
                        )}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-[#8A9794]">
                        Nascimento:{" "}
                        {formatarData(
                          paciente.dataNascimento,
                        )}
                      </p>
                    </div>

                    <div className="min-w-[170px] rounded-2xl border border-[#E7D8BE] bg-[#FFF9F0] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Scale
                          size={16}
                          className="text-[#B97828]"
                        />

                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#987A4F]">
                          Peso
                        </p>
                      </div>

                      <p className="mt-1 text-[24px] font-black leading-tight text-[#24343A] sm:text-[28px]">
                        {formatarPeso(
                          paciente.peso,
                        )}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-[#9A8C77]">
                        Último peso registrado
                      </p>
                    </div>

                    {planoAtivo && (
                      <div className="flex min-w-[180px] items-center gap-3 rounded-2xl border border-[#DCE4E1] bg-[#F8FAF9] px-4 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E7F0ED] text-[#174A5B]">
                          <ShieldCheck
                            size={17}
                          />
                        </div>

                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#879592]">
                            Plano
                          </p>

                          <p className="mt-0.5 text-sm font-black text-[#3D4B48]">
                            {planoAtivo.nome}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {cliente && (
                <Link
                  href={`/clientes/${cliente.id}`}
                  className="flex min-w-[260px] items-center gap-3 rounded-2xl border border-[#DCE4E1] bg-[#F6F8F7] px-4 py-3 transition hover:border-[#BFD1CB]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#174A5B] text-white">
                    <UserRound
                      size={18}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#83928F]">
                      Tutor
                    </p>

                    <p className="font-black">
                      {cliente.nome}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </section>

          {/* ABAS */}
          <section className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-[#D9E1DE] bg-white p-2 shadow-sm">
            <TabButton
              ativo
              icon={
                <Stethoscope
                  size={16}
                />
              }
              label="Histórico"
            />

            <TabButton
              icon={
                <HeartPulse
                  size={16}
                />
              }
              label="Protocolos"
            />

            <TabButton
              icon={
                <CalendarDays
                  size={16}
                />
              }
              label="Agenda"
            />

            <TabButton
              icon={
                <ShoppingCart
                  size={16}
                />
              }
              label="Vendas"
            />

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                disabled
                className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl border border-[#DDE4E2] bg-[#F7F9F8] text-[#869592]"
              >
                <Printer
                  size={16}
                />
              </button>
            </div>
          </section>

          {/* ÁREA PRINCIPAL */}
          <div className="mt-4 grid gap-4 xl:grid-cols-[270px_minmax(0,1fr)]">
            {/* ESQUERDA */}
            <aside className="space-y-4">
              <section className="rounded-[24px] border border-[#D9E1DE] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#174A5B] text-white">
                    <ShoppingCart
                      size={18}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#83928F]">
                      Comercial
                    </p>

                    <h2 className="font-black">
                      Venda
                    </h2>
                  </div>
                </div>

                <Link
                  href={
                    cliente
                      ? `/vendas/nova?clienteId=${cliente.id}`
                      : "#"
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#174A5B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#123D4B]"
                >
                  <PackagePlus
                    size={16}
                  />

                  Adicionar
                </Link>

                <button
                  type="button"
                  disabled
                  className="mt-2 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#DDE4E2] bg-[#F7F9F8] px-4 py-3 text-sm font-semibold text-[#82908D]"
                >
                  <ReceiptText
                    size={16}
                  />

                  Orçamentos
                </button>

                <div className="mt-5 rounded-2xl bg-[#F5F7F5] p-4 text-center">
                  <ShoppingCart
                    size={22}
                    className="mx-auto text-[#A4B0AD]"
                  />

                  <p className="mt-2 text-xs font-medium text-[#8E9B98]">
                    Nenhum item em venda.
                  </p>
                </div>
              </section>

              <section className="rounded-[24px] border border-[#D9E1DE] bg-white p-5 shadow-sm">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#7FA89A]">
                  Dados rápidos
                </p>

                <div className="mt-4 space-y-3">
                  <DadoRapido
                    label="Cor / pelagem"
                    value={valorOuTraco(
                      paciente.corPelagem,
                    )}
                  />

                  <DadoRapido
                    label="Microchip"
                    value={valorOuTraco(
                      paciente.microchip,
                    )}
                  />

                  <DadoRapido
                    label="Castrado"
                    value={
                      paciente.castrado
                        ? "Sim"
                        : "Não"
                    }
                  />

                  <DadoRapido
                    label="Plano"
                    value={
                      planoAtivo?.nome ??
                      "Sem plano"
                    }
                  />
                </div>
              </section>
            </aside>

            {/* CONTEÚDO CENTRAL */}
            <section className="overflow-hidden rounded-[24px] border border-[#D9E1DE] bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b border-[#E2E8E5] px-5 py-4">
                <button
                  type="button"
                  disabled
                  className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-[#DCE4E1] bg-[#F8FAF9] px-3 py-2 text-xs font-semibold text-[#657572]"
                >
                  <CalendarDays
                    size={15}
                  />

                  Período

                  <ChevronDown
                    size={14}
                  />
                </button>

                <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#DCE4E1] bg-[#F8FAF9] px-3 py-2">
                  <Search
                    size={15}
                    className="text-[#92A09D]"
                  />

                  <input
                    disabled
                    placeholder="Buscar no histórico..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-[#A1ACA9]"
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A19E]">
                  todos
                </span>
              </div>

              {/* BOTÕES COLORIDOS */}
              <div className="border-b border-[#E2E8E5] bg-[#FAFBFA] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#7FA89A]">
                      Prontuário
                    </p>

                    <h2 className="mt-1 text-lg font-black">
                      Adicionar registro
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#E8F1F8] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#39749F]">
                    Atendimento ativo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                  <PacienteAtendimentoForm
                    pacienteId={
                      paciente.id
                    }
                    pacienteNome={
                      paciente.nome
                    }
                  />

                  <PacientePesoForm
                    pacienteId={
                      paciente.id
                    }
                    pacienteNome={
                      paciente.nome
                    }
                  />

                  <AcaoCard
                    icon={
                      <HeartPulse
                        size={24}
                      />
                    }
                    titulo="Patologia"
                    cor="roxo"
                  />

                  <AcaoCard
                    icon={
                      <FileText
                        size={24}
                      />
                    }
                    titulo="Documento"
                    cor="verde"
                  />

                  <AcaoCard
                    icon={
                      <FlaskConical
                        size={24}
                      />
                    }
                    titulo="Exame"
                    cor="coral"
                  />

                  <AcaoCard
                    icon={
                      <Camera
                        size={24}
                      />
                    }
                    titulo="Fotos"
                    cor="petroleo"
                  />

                  <AcaoCard
                    icon={
                      <Syringe
                        size={24}
                      />
                    }
                    titulo="Vacina"
                    cor="amarelo"
                  />

                  <AcaoCard
                    icon={
                      <ReceiptText
                        size={24}
                      />
                    }
                    titulo="Receita"
                    cor="lilas"
                  />

                  <AcaoCard
                    icon={
                      <MessageSquareText
                        size={24}
                      />
                    }
                    titulo="Observação"
                    cor="grafite"
                  />

                  <AcaoCard
                    icon={
                      <Hospital
                        size={24}
                      />
                    }
                    titulo="Internação"
                    cor="vermelho"
                  />

                  <AcaoCard
                    icon={
                      <Video
                        size={24}
                      />
                    }
                    titulo="Vídeo"
                    cor="verdeForte"
                  />
                </div>
              </div>

              {/* HISTÓRICO */}
              <div className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#7FA89A]">
                      Linha do tempo
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      Histórico
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#174A5B] px-3 py-1 text-[10px] font-semibold text-white">
                    {historico.length}{" "}
                    {historico.length ===
                    1
                      ? "registro"
                      : "registros"}
                  </span>
                </div>

                {historico.length ===
                0 ? (
                  <div className="rounded-[22px] border border-dashed border-[#CCD8D4] bg-[#F8FAF9] px-5 py-12 text-center">
                    <Stethoscope
                      size={32}
                      className="mx-auto text-[#9BB0AA]"
                    />

                    <h3 className="mt-3 font-black">
                      Histórico vazio
                    </h3>

                    <p className="mx-auto mt-1 max-w-[420px] text-sm font-medium text-[#899693]">
                      Ainda não existem registros clínicos deste paciente.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute bottom-5 left-[19px] top-5 w-px bg-[#D9E4E0]" />

                    <div className="space-y-4">
                      {historico.map(
                        (registro) => {
                          if (
                            registro.tipo ===
                            "atendimento"
                          ) {
                            const atendimento =
                              registro.atendimento;

                            return (
                              <div
                                key={`atendimento-${atendimento.id}`}
                                className="relative flex gap-4"
                              >
                                <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#3A8DDA] text-white shadow-sm">
                                  <Stethoscope
                                    size={15}
                                  />
                                </div>

                                <div className="min-w-0 flex-1 rounded-[20px] border border-[#D9E5EC] bg-[#FBFDFE] p-4">
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#3A8DDA]">
                                        Atendimento
                                      </p>

                                      <h3 className="mt-1 font-black">
                                        {atendimento.motivoConsulta ||
                                          "Atendimento clínico"}
                                      </h3>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                      <span className="text-[10px] font-semibold text-[#8E9A97]">
                                        {formatarDataHora(
                                          String(
                                            atendimento.dataAtendimento,
                                          ),
                                        )}
                                      </span>

                                      <ExcluirAtendimentoButton
                                        atendimentoId={
                                          atendimento.id
                                        }
                                        pacienteId={
                                          paciente.id
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="mt-4 grid gap-4">
                                    {atendimento.anamnese && (
                                      <BlocoAtendimento
                                        titulo="Anamnese"
                                        texto={
                                          atendimento.anamnese
                                        }
                                      />
                                    )}

                                    {atendimento.exameClinico && (
                                      <BlocoAtendimento
                                        titulo="Exame clínico"
                                        texto={
                                          atendimento.exameClinico
                                        }
                                      />
                                    )}

                                    {atendimento.diagnosticoSuspeita && (
                                      <BlocoAtendimento
                                        titulo="Diagnóstico / suspeita"
                                        texto={
                                          atendimento.diagnosticoSuspeita
                                        }
                                      />
                                    )}

                                    {atendimento.conduta && (
                                      <BlocoAtendimento
                                        titulo="Conduta"
                                        texto={
                                          atendimento.conduta
                                        }
                                      />
                                    )}

                                    {atendimento.observacoes && (
                                      <BlocoAtendimento
                                        titulo="Observações"
                                        texto={
                                          atendimento.observacoes
                                        }
                                      />
                                    )}
                                  </div>

                                  <div className="mt-4 flex items-center gap-2 border-t border-[#E8ECEA] pt-3 text-[10px] font-semibold text-[#8A9693]">
                                    <UserRound
                                      size={13}
                                    />

                                    {atendimento.profissionalNome ||
                                      "Profissional do sistema"}
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          if (
                            registro.tipo ===
                            "peso"
                          ) {
                            const pesagem =
                              registro.pesagem;

                            return (
                              <div
                                key={`peso-${pesagem.id}`}
                                className="relative flex gap-4"
                              >
                                <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#D38A2B] text-white shadow-sm">
                                  <Scale
                                    size={15}
                                  />
                                </div>

                                <div className="min-w-0 flex-1 rounded-[20px] border border-[#E8D8BD] bg-[#FFFCF7] p-4">
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#B97828]">
                                        Peso
                                      </p>

                                      <h3 className="mt-1 text-lg font-black text-[#3B4542]">
                                        {formatarPeso(
                                          pesagem.peso,
                                        )}
                                      </h3>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                      <span className="text-[10px] font-semibold text-[#8E9A97]">
                                        {formatarDataHora(
                                          String(
                                            pesagem.dataPesagem,
                                          ),
                                        )}
                                      </span>

                                      <ExcluirPesoButton
                                        pesoId={
                                          pesagem.id
                                        }
                                        pacienteId={
                                          paciente.id
                                        }
                                        peso={
                                          pesagem.peso
                                        }
                                      />
                                    </div>
                                  </div>

                                  {pesagem.observacoes && (
                                    <div className="mt-3 rounded-xl border border-[#EFE3CF] bg-white px-4 py-3">
                                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#A7834F]">
                                        Observações
                                      </p>

                                      <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-6 text-[#5E625D]">
                                        {
                                          pesagem.observacoes
                                        }
                                      </p>
                                    </div>
                                  )}

                                  <div className="mt-4 flex items-center gap-2 border-t border-[#EEE6D9] pt-3 text-[10px] font-semibold text-[#8A9693]">
                                    <UserRound
                                      size={13}
                                    />

                                    {pesagem.profissionalNome ||
                                      "Profissional do sistema"}
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          const anotacao =
                            registro.anotacao;

                          return (
                            <div
                              key={`anotacao-${anotacao.id}`}
                              className="relative flex gap-4"
                            >
                              <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#D9A85F] text-white shadow-sm">
                                <MessageSquareText
                                  size={15}
                                />
                              </div>

                              <div className="min-w-0 flex-1 rounded-[20px] border border-[#E3E8E6] bg-[#FBFCFB] p-4">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div>
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#A58351]">
                                      Observação
                                    </p>

                                    <h3 className="mt-1 font-black">
                                      Registro do paciente
                                    </h3>
                                  </div>

                                  <span className="text-[10px] font-semibold text-[#8E9A97]">
                                    {formatarDataHora(
                                      String(
                                        anotacao.createdAt,
                                      ),
                                    )}
                                  </span>
                                </div>

                                <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-[#54605D]">
                                  {
                                    anotacao.texto
                                  }
                                </p>

                                <div className="mt-4 flex items-center gap-2 border-t border-[#E8ECEA] pt-3 text-[10px] font-semibold text-[#8A9693]">
                                  <UserRound
                                    size={13}
                                  />

                                  {anotacao.criadoPorNome ||
                                    "Usuário do sistema"}
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function TabButton({
  icon,
  label,
  ativo = false,
}: {
  icon: ReactNode;
  label: string;
  ativo?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={!ativo}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
        ativo
          ? "bg-[#174A5B] text-white shadow-sm"
          : "cursor-not-allowed text-[#81908D]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function DadoRapido({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#F5F7F5] px-3 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#94A09D]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#3D4B48]">
        {value}
      </p>
    </div>
  );
}

function BlocoAtendimento({
  titulo,
  texto,
}: {
  titulo: string;
  texto: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#78908D]">
        {titulo}
      </p>

      <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-6 text-[#54605D]">
        {texto}
      </p>
    </div>
  );
}

function AcaoCard({
  icon,
  titulo,
  cor,
}: {
  icon: ReactNode;
  titulo: string;
  cor: CorAcao;
}) {
  const cores: Record<
    CorAcao,
    string
  > = {
    laranja:
      "border-[#D38A2B] bg-[#D38A2B]",

    roxo:
      "border-[#704087] bg-[#704087]",

    verde:
      "border-[#39A94F] bg-[#39A94F]",

    coral:
      "border-[#EB5965] bg-[#EB5965]",

    petroleo:
      "border-[#286C96] bg-[#286C96]",

    amarelo:
      "border-[#ECAF2E] bg-[#ECAF2E]",

    lilas:
      "border-[#9950B7] bg-[#9950B7]",

    grafite:
      "border-[#586367] bg-[#586367]",

    vermelho:
      "border-[#B7444B] bg-[#B7444B]",

    verdeForte:
      "border-[#22813A] bg-[#22813A]",
  };

  return (
    <button
      type="button"
      disabled
      title="Será conectado ao prontuário em uma próxima etapa"
      className={`group relative flex min-h-[96px] cursor-not-allowed flex-col items-center justify-center overflow-hidden rounded-2xl border px-3 py-4 text-center text-white shadow-sm opacity-90 ${cores[cor]}`}
    >
      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/10" />

      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 shadow-sm">
        {icon}
      </span>
''
      <span className="relative mt-2 text-xs font-bold">
        {titulo}
      </span>
    </button>
  );
}
 