import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  IdCard,
  Mail,
  MessageCircle,
  PawPrint,
  Phone,
  ReceiptText,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import PacienteAnotacoes from "@/components/clientes/PacienteAnotacoes";
import PacientePlano from "@/components/clientes/PacientePlano";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

type ClienteDetalhesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type TipoAnimal =
  | "felino"
  | "canino"
  | "outro";

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
    return "NÃ£o informado";
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
    return "NÃ£o informada";
  }

  const partes =
    data.split("-");

  if (partes.length < 3) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function iniciais(
  nome: string,
) {
  const partes = nome
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) {
    return "?";
  }

  if (partes.length === 1) {
    return partes[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${partes[0][0]}${
    partes[
      partes.length - 1
    ][0]
  }`.toUpperCase();
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
    valor.includes("gato") ||
    valor.includes("felino")
  ) {
    return "felino";
  }

  if (
    valor.includes("cao") ||
    valor.includes("cÃ£o") ||
    valor.includes("canino") ||
    valor.includes("cachorro")
  ) {
    return "canino";
  }

  return "outro";
}

function SiameseFace({
  pequeno = false,
}: {
  pequeno?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={
        pequeno
          ? "h-9 w-9"
          : "h-[72px] w-[72px]"
      }
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
        d="
          M39 48
          C44 39 76 39 81 48
          C82 58 79 70 70 77
          C65 81 55 81 50 77
          C41 70 38 58 39 48
          Z
        "
        fill="#594641"
      />

      <path
        d="
          M44 46
          C48 39 72 39 76 46
          C70 44 66 45 60 49
          C54 45 50 44 44 46
          Z
        "
        fill="#65504A"
      />

      <path
        d="M44 57 Q49 52 55 57 Q50 64 44 57 Z"
        fill="#64BFD0"
      />

      <path
        d="M65 57 Q71 52 76 57 Q70 64 65 57 Z"
        fill="#64BFD0"
      />

      <ellipse
        cx="50"
        cy="57"
        rx="1.3"
        ry="3"
        fill="#20272A"
      />

      <ellipse
        cx="70"
        cy="57"
        rx="1.3"
        ry="3"
        fill="#20272A"
      />

      <path
        d="M55 68 Q60 65 65 68 Q60 73 55 68 Z"
        fill="#A67575"
      />

      <path
        d="M60 70 L60 74"
        stroke="#443633"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M60 74 Q55 78 50 74"
        stroke="#443633"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M60 74 Q65 78 70 74"
        stroke="#443633"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M21 65 L46 64"
        stroke="#665B54"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M22 72 L46 68"
        stroke="#665B54"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M74 64 L99 65"
        stroke="#665B54"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M74 68 L98 72"
        stroke="#665B54"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PugFace({
  pequeno = false,
}: {
  pequeno?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={
        pequeno
          ? "h-9 w-9"
          : "h-[72px] w-[72px]"
      }
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

      <path
        d="M43 45 Q60 34 77 45"
        stroke="#9F7657"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M47 50 Q60 43 73 50"
        stroke="#9F7657"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
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
      <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-[#E9DCC9] bg-gradient-to-br from-[#FFF6E9] via-[#F0E2CF] to-[#D5C0A5] shadow-sm">
        <SiameseFace />
      </div>
    );
  }

  if (tipo === "canino") {
    return (
      <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-[#E7D5C1] bg-gradient-to-br from-[#FAEDD9] via-[#E8C99F] to-[#CDA574] shadow-sm">
        <PugFace />
      </div>
    );
  }

  return (
    <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[24px] bg-[#E7F0ED] text-[#174A5B]">
      <PawPrint
        size={32}
      />
    </div>
  );
}

function EspecieAnimal({
  tipo,
  especie,
}: {
  tipo: TipoAnimal;
  especie:
    | string
    | null
    | undefined;
}) {
  const label =
    valorOuTraco(
      especie,
    );

  if (tipo === "felino") {
    return (
      <div className="mt-1 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EFE1CD]">
          <SiameseFace
            pequeno
          />
        </span>

        <span className="text-sm font-bold text-[#24343A]">
          {label}
        </span>
      </div>
    );
  }

  if (tipo === "canino") {
    return (
      <div className="mt-1 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E8CAA5]">
          <PugFace
            pequeno
          />
        </span>

        <span className="text-sm font-bold text-[#24343A]">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-1 flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7F0ED] text-[#174A5B]">
        <PawPrint
          size={15}
        />
      </span>

      <span className="text-sm font-bold">
        {label}
      </span>
    </div>
  );
}

export default async function ClienteDetalhesPage({
  params,
}: ClienteDetalhesPageProps) {
  const acesso =
    await exigirPermissao(
      "cliente.visualizar",
    );

  const { id } =
    await params;

  const clienteId =
    Number(id);

  if (
    !Number.isInteger(
      clienteId,
    ) ||
    clienteId <= 0
  ) {
    notFound();
  }

  const runtime =
    db.runtime();

  const planoCliente =
    db.sql.public.cliente
      .select(
        "id",
        "codigoAntigo",
        "nome",
        "cpf",
        "telefone",
        "whatsapp",
        "email",
        "cep",
        "endereco",
        "numero",
        "complemento",
        "bairro",
        "cidade",
        "estado",
        "observacoes",
        "ativo",
        "createdAt",
        "updatedAt",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          clienteId,
        ),
      )
      .limit(1)
      .build();

  const resultadoCliente =
    await runtime.query(
      planoCliente,
    );

  const cliente =
    resultadoCliente[0];

  if (!cliente) {
    notFound();
  }

  const planoPacientes =
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
      )
      .where((f, fns) =>
        fns.eq(
          f.clienteId,
          clienteId,
        ),
      )
      .orderBy(
        "nome",
        {
          direction:
            "asc",
        },
      )
      .build();

  const pacientes =
    await runtime.query(
      planoPacientes,
    );

  const pacientesAtivos =
    pacientes.filter(
      (paciente) =>
        paciente.ativo,
    );

  const pacientesComDados =
    await Promise.all(
      pacientesAtivos.map(
        async (
          paciente,
        ) => {
          const consultaAnotacoes =
            db.sql.public.pacienteAnotacao
              .select(
                "id",
                "texto",
                "criadoPorNome",
                "createdAt",
              )
              .where(
                (f, fns) =>
                  fns.and(
                    fns.eq(
                      f.pacienteId,
                      paciente.id,
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
                  direction:
                    "desc",
                },
              )
              .build();

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
              .where(
                (f, fns) =>
                  fns.eq(
                    f.pacienteId,
                    paciente.id,
                  ),
              )
              .orderBy(
                "createdAt",
                {
                  direction:
                    "desc",
                },
              )
              .build();

          const [
            anotacoes,
            planos,
          ] =
            await Promise.all([
              runtime.query(
                consultaAnotacoes,
              ),

              runtime.query(
                consultaPlanos,
              ),
            ]);

          return {
            ...paciente,

            anotacoes:
              anotacoes.map(
                (
                  anotacao,
                ) => ({
                  ...anotacao,

                  createdAt:
                    String(
                      anotacao.createdAt,
                    ),
                }),
              ),

            planos:
              planos.map(
                (
                  plano,
                ) => ({
                  ...plano,

                  createdAt:
                    String(
                      plano.createdAt,
                    ),
                }),
              ),
          };
        },
      ),
    );

  const podeEditarCliente =
    acesso.usuario.isMaster ||
    acesso.permissoes.has(
      "cliente.editar",
    );

  const podeEditarPaciente =
    acesso.usuario.isMaster ||
    acesso.permissoes.has(
      "paciente.editar",
    );

  const podeCriarVenda =
    acesso.usuario.isMaster ||
    acesso.permissoes.has(
      "venda.criar",
    );

  return (
    <div className="min-h-screen bg-[#F2F1EC] font-[family-name:var(--font-dosis)] text-[#24343A]">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <Header />

        <div className="p-7">
          <Link
            href="/clientes"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#526764] transition hover:text-[#174A5B]"
          >
            <ArrowLeft
              size={18}
            />

            Voltar para clientes
          </Link>

          {/* CABEÃ‡ALHO CLIENTE */}
          <section className="relative overflow-hidden rounded-[30px] bg-[#174A5B] text-white shadow-[0_16px_40px_rgba(23,74,91,0.16)]">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#7FA89A]/25" />

            <div className="absolute -bottom-28 right-16 h-56 w-56 rounded-full border-[35px] border-white/5" />

            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#7FA89A] via-[#D7B78A] to-[#C77A61]" />

            <div className="relative flex flex-wrap items-center justify-between gap-7 px-8 py-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="flex h-[86px] w-[86px] items-center justify-center rounded-[26px] bg-[#F3EFE8] text-2xl font-black text-[#174A5B] shadow-lg">
                    {iniciais(
                      cliente.nome,
                    )}
                  </div>

                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#174A5B] bg-[#7FA89A] text-white">
                    <UserRound
                      size={15}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#BFD3CC]">
                      Tutor cadastrado
                    </p>

                    <span className="rounded-full bg-[#7FA89A]/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#D9EEE7]">
                      {cliente.ativo
                        ? "Ativo"
                        : "Inativo"}
                    </span>
                  </div>

                  <h1 className="mt-2 text-[34px] font-black leading-tight tracking-tight">
                    {cliente.nome}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-[#D5E4DF]">
                    <span className="flex items-center gap-1.5">
                      <IdCard
                        size={15}
                      />

                      ID #
                      {cliente.id}
                    </span>

                    {cliente.codigoAntigo !=
                      null && (
                      <span>
                        CÃ³digo antigo{" "}
                        {
                          cliente.codigoAntigo
                        }
                      </span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <PawPrint
                        size={15}
                      />

                      {
                        pacientesAtivos.length
                      }{" "}
                      {pacientesAtivos.length ===
                      1
                        ? "paciente"
                        : "pacientes"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/clientes/${cliente.id}/informacoes`}
                  className="flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <IdCard
                    size={17}
                  />

                  InformaÃ§Ãµes completas
                </Link>

                {podeEditarCliente && (
                  <button
                    type="button"
                    disabled
                    title="EdiÃ§Ã£o do cliente serÃ¡ implementada depois"
                    className="cursor-not-allowed rounded-2xl bg-[#7FA89A]/45 px-5 py-3.5 text-sm font-semibold text-white"
                  >
                    Editar cliente
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ANOTAÃ‡Ã•ES */}
          <section className="mt-5">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A88B5C]">
                HistÃ³rico
              </p>

              <h2 className="mt-1 text-2xl font-black">
                AnotaÃ§Ãµes importantes
              </h2>
            </div>

            <div className="space-y-4">
              {pacientesComDados.map(
                (paciente) => (
                  <PacienteAnotacoes
                    key={
                      paciente.id
                    }
                    pacienteId={
                      paciente.id
                    }
                    clienteId={
                      cliente.id
                    }
                    nomePaciente={
                      paciente.nome
                    }
                    anotacoes={
                      paciente.anotacoes
                    }
                    observacaoAntiga={
                      paciente.observacoes
                    }
                    podeAdicionar={
                      podeEditarPaciente
                    }
                  />
                ),
              )}
            </div>
          </section>

          {/* VENDA RÃPIDA */}
          {podeCriarVenda && (
            <section className="relative mt-5 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#244C45] to-[#367364] px-7 py-6 text-white shadow-[0_12px_30px_rgba(36,76,69,0.14)]">
              <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/8" />

              <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full border-[25px] border-white/5" />

              <div className="relative flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                    <ShoppingCart
                      size={25}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8D8CF]">
                      Venda rÃ¡pida
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Nova venda para{" "}
                      {cliente.nome}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-[#D5E8E2]">
                      O cliente jÃ¡ serÃ¡ vinculado automaticamente Ã  venda.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/vendas/nova?clienteId=${cliente.id}`}
                  className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#244C45] shadow-sm transition hover:bg-[#F3F7F5]"
                >
                  <ReceiptText
                    size={18}
                  />

                  Iniciar venda
                </Link>
              </div>
            </section>
          )}

          {/* PACIENTES */}
          <section className="mt-5 overflow-hidden rounded-[26px] border border-[#D9E1DE] bg-[#FBFCFA] shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8E5] px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#174A5B] text-white">
                  <PawPrint
                    size={24}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7FA89A]">
                    Animais
                  </p>

                  <h2 className="text-xl font-black">
                    Pacientes do tutor
                  </h2>
                </div>
              </div>

              <div className="rounded-full bg-[#174A5B] px-4 py-2 text-xs font-semibold text-white">
                {
                  pacientesAtivos.length
                }{" "}
                {pacientesAtivos.length ===
                1
                  ? "paciente"
                  : "pacientes"}
              </div>
            </div>

            {pacientesComDados.length ===
            0 ? (
              <div className="py-16 text-center">
                <PawPrint
                  size={34}
                  className="mx-auto text-[#7FA89A]"
                />

                <p className="mt-3 font-semibold">
                  Nenhum paciente vinculado
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 p-6 xl:grid-cols-2">
                {pacientesComDados.map(
                  (
                    paciente,
                    index,
                  ) => {
                    const tipo =
                      tipoAnimal(
                        paciente.especie,
                      );

                    const ehUltimo =
                      index ===
                      pacientesComDados.length -
                        1;

                    const totalImpar =
                      pacientesComDados.length %
                        2 !==
                      0;

                    const ocuparLinhaInteira =
                      ehUltimo &&
                      totalImpar;

                    return (
                      <article
                        key={
                          paciente.id
                        }
                        className={`overflow-hidden rounded-[24px] border border-[#DCE5E1] bg-white shadow-sm transition hover:shadow-lg ${
                          ocuparLinhaInteira
                            ? "xl:col-span-2"
                            : ""
                        }`}
                      >
                        <div className="h-2 bg-gradient-to-r from-[#174A5B] via-[#7FA89A] to-[#D7B78A]" />

                        <div className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-4">
                              <AnimalAvatar
                                tipo={
                                  tipo
                                }
                              />

                              <div className="min-w-0">
                                <h3 className="truncate text-2xl font-black">
                                  {
                                    paciente.nome
                                  }
                                </h3>

                                <p className="mt-1 text-xs font-medium text-[#93A09E]">
                                  Paciente #
                                  {
                                    paciente.id
                                  }
                                </p>
                              </div>
                            </div>

                            <span className="shrink-0 rounded-full bg-[#E1F1E9] px-2.5 py-1 text-[9px] font-semibold uppercase text-[#3C735E]">
                              Ativo
                            </span>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                            <div className="rounded-2xl bg-[#F5F7F5] p-3.5">
                              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#93A09E]">
                                EspÃ©cie
                              </p>

                              <EspecieAnimal
                                tipo={
                                  tipo
                                }
                                especie={
                                  paciente.especie
                                }
                              />
                            </div>

                            <div className="rounded-2xl bg-[#F5F7F5] p-3.5">
                              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#93A09E]">
                                RaÃ§a
                              </p>

                              <p className="mt-2 text-sm font-bold">
                                {valorOuTraco(
                                  paciente.raca,
                                )}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-[#F5F7F5] p-3.5">
                              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#93A09E]">
                                Sexo
                              </p>

                              <p className="mt-2 text-sm font-bold">
                                {valorOuTraco(
                                  paciente.sexo,
                                )}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-[#F5F7F5] p-3.5">
                              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#93A09E]">
                                Nascimento
                              </p>

                              <p className="mt-2 flex items-center gap-1.5 text-sm font-bold">
                                <CalendarDays
                                  size={
                                    14
                                  }
                                  className="text-[#C77A61]"
                                />

                                {formatarData(
                                  paciente.dataNascimento,
                                )}
                              </p>
                            </div>
                          </div>

                          {/* PLANO */}
                          <div className="mx-auto mt-6 w-full max-w-[820px]">
                            <PacientePlano
                              pacienteId={
                                paciente.id
                              }
                              clienteId={
                                cliente.id
                              }
                              planos={
                                paciente.planos
                              }
                              podeAdicionar={
                                podeEditarPaciente
                              }
                            />
                          </div>

                          {/* FICHA COMPLETA */}
                          <div className="mx-auto mt-5 w-full max-w-[820px]">
                            <Link
                              href={`/pacientes/${paciente.id}`}
                              className="relative flex w-full items-center justify-center rounded-xl bg-[#174A5B] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123D4B] hover:shadow-md"
                            >
                              <span>
                                Ver ficha completa
                              </span>

                              <ChevronRight
                                size={
                                  17
                                }
                                className="absolute right-4"
                              />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </section>

          {/* CONTATO */}
          <section className="mt-5 pb-8">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7FA89A]">
                ComunicaÃ§Ã£o
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Contato do tutor
              </h2>

              <p className="mt-1 text-sm font-medium text-[#81908D]">
                InformaÃ§Ãµes rÃ¡pidas para comunicaÃ§Ã£o com o cliente.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <article className="relative overflow-hidden rounded-[22px] border border-[#D7E5E8] bg-[#F8FCFD] p-5 shadow-sm">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#174A5B]/5" />

                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#174A5B] text-white shadow-md">
                    <Phone
                      size={25}
                    />
                  </div>

                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#78908E]">
                    Telefone
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {valorOuTraco(
                      cliente.telefone,
                    )}
                  </p>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-[22px] border border-[#CCE8D5] bg-[#F7FCF8] p-5 shadow-sm">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#22A95A]/10" />

                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#22A95A] text-white shadow-md">
                    <MessageCircle
                      size={26}
                    />
                  </div>

                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6E9279]">
                    WhatsApp
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {valorOuTraco(
                      cliente.whatsapp,
                    )}
                  </p>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-[22px] border border-[#D6E2F6] bg-[#F8FAFE] p-5 shadow-sm">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#356EE8]/10" />

                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#356EE8] text-white shadow-md">
                    <Mail
                      size={25}
                    />
                  </div>

                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#7587AA]">
                    E-mail
                  </p>

                  <p className="mt-1 truncate text-lg font-bold">
                    {valorOuTraco(
                      cliente.email,
                    )}
                  </p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}