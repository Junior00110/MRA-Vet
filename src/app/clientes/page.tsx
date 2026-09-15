import Link from "next/link";

import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  PawPrint,
  Phone,
  Search,
  UserPlus,
  Users,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

type ClientesPageProps = {
  searchParams: Promise<{
    busca?: string;
    pagina?: string;
  }>;
};

type ClienteLista = {
  id: number;
  codigoAntigo: number | null;
  nome: string;
  cpf: string | null;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  ativo: boolean;
};

const ITENS_POR_PAGINA = 25;

function normalizarTexto(
  valor: string | null | undefined,
) {
  return (valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function somenteNumeros(
  valor: string | null | undefined,
) {
  return (valor ?? "").replace(
    /\D/g,
    "",
  );
}

function iniciais(nome: string) {
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

function valorContato(
  valor: string | null,
) {
  if (
    !valor ||
    valor.trim() === ""
  ) {
    return "Não informado";
  }

  return valor;
}

function montarHref({
  busca,
  pagina,
}: {
  busca: string;
  pagina: number;
}) {
  const params =
    new URLSearchParams();

  if (busca) {
    params.set(
      "busca",
      busca,
    );
  }

  if (pagina > 1) {
    params.set(
      "pagina",
      String(pagina),
    );
  }

  const query =
    params.toString();

  return query
    ? `/clientes?${query}`
    : "/clientes";
}

export default async function ClientesPage({
  searchParams,
}: ClientesPageProps) {
  const acesso =
    await exigirPermissao(
      "cliente.visualizar",
    );

  const params =
    await searchParams;

  const busca = String(
    params.busca ?? "",
  ).trim();

  const paginaSolicitada =
    Number(
      params.pagina ?? "1",
    );

  const pagina =
    Number.isInteger(
      paginaSolicitada,
    ) &&
    paginaSolicitada > 0
      ? paginaSolicitada
      : 1;

  const runtime =
    db.runtime();

  const consultaClientes =
    db.sql.public.cliente
      .select(
        "id",
        "codigoAntigo",
        "nome",
        "cpf",
        "telefone",
        "whatsapp",
        "email",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.ativo,
          true,
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

  const resultado =
    await runtime.query(
      consultaClientes,
    );

  const todosClientes =
    resultado as ClienteLista[];

  const buscaNormalizada =
    normalizarTexto(busca);

  const buscaNumerica =
    somenteNumeros(busca);

  const clientesFiltrados =
    busca
      ? todosClientes.filter(
          (cliente) => {
            const nome =
              normalizarTexto(
                cliente.nome,
              );

            const email =
              normalizarTexto(
                cliente.email,
              );

            const cpf =
              somenteNumeros(
                cliente.cpf,
              );

            const telefone =
              somenteNumeros(
                cliente.telefone,
              );

            const whatsapp =
              somenteNumeros(
                cliente.whatsapp,
              );

            const codigoAntigo =
              cliente.codigoAntigo !=
              null
                ? String(
                    cliente.codigoAntigo,
                  )
                : "";

            const correspondeTexto =
              nome.includes(
                buscaNormalizada,
              ) ||
              email.includes(
                buscaNormalizada,
              );

            const correspondeNumero =
              buscaNumerica.length >
              0
                ? cpf.includes(
                    buscaNumerica,
                  ) ||
                  telefone.includes(
                    buscaNumerica,
                  ) ||
                  whatsapp.includes(
                    buscaNumerica,
                  ) ||
                  codigoAntigo.includes(
                    buscaNumerica,
                  )
                : false;

            return (
              correspondeTexto ||
              correspondeNumero
            );
          },
        )
      : todosClientes;

  const totalClientes =
    clientesFiltrados.length;

  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        totalClientes /
          ITENS_POR_PAGINA,
      ),
    );

  const paginaAtual =
    Math.min(
      pagina,
      totalPaginas,
    );

  const inicio =
    (paginaAtual - 1) *
    ITENS_POR_PAGINA;

  const fim =
    inicio +
    ITENS_POR_PAGINA;

  const clientesDaPagina =
    clientesFiltrados.slice(
      inicio,
      fim,
    );

  const podeCriarCliente =
    acesso.usuario.isMaster ||
    acesso.permissoes.has(
      "cliente.criar",
    );

  return (
    <div className="min-h-screen bg-[#F2F1EC] font-[family-name:var(--font-dosis)] text-[#24343A]">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <Header />

        <div className="p-7">
          {/* CABEÇALHO */}
          <section className="relative overflow-hidden rounded-[30px] bg-[#174A5B] px-8 py-7 text-white shadow-[0_16px_40px_rgba(23,74,91,0.16)]">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#7FA89A]/25" />

            <div className="absolute -bottom-28 right-16 h-56 w-56 rounded-full border-[35px] border-white/5" />

            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#7FA89A] via-[#D7B78A] to-[#C77A61]" />

            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/10 text-white">
                  <Users
                    size={29}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#BCD2CA]">
                    Cadastro
                  </p>

                  <h1 className="mt-1 text-[32px] font-black leading-tight">
                    Clientes
                  </h1>

                  <p className="mt-2 text-sm font-medium text-[#D6E5E0]">
                    Consulte tutores e acesse rapidamente seus pacientes.
                  </p>
                </div>
              </div>

              {podeCriarCliente && (
                <button
                  type="button"
                  disabled
                  title="Cadastro de novo cliente será implementado nesta etapa"
                  className="flex cursor-not-allowed items-center gap-2 rounded-2xl bg-white/15 px-5 py-3.5 text-sm font-semibold text-white opacity-75"
                >
                  <UserPlus
                    size={18}
                  />

                  Novo cliente
                </button>
              )}
            </div>
          </section>

          {/* BUSCA */}
          <section className="mt-5 rounded-[24px] border border-[#D9E1DE] bg-[#FBFCFA] p-5 shadow-sm">
            <form
              action="/clientes"
              method="get"
              className="flex flex-col gap-3 lg:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#81918E]"
                />

                <input
                  type="search"
                  name="busca"
                  defaultValue={busca}
                  placeholder="Buscar por nome, CPF, telefone, WhatsApp, e-mail ou código..."
                  className="h-12 w-full rounded-2xl border border-[#D7E0DD] bg-[#F7F9F8] pl-12 pr-4 text-sm font-medium text-[#354542] outline-none transition placeholder:text-[#9AA7A4] focus:border-[#7FA89A] focus:bg-white focus:ring-4 focus:ring-[#7FA89A]/10"
                />
              </div>

              <button
                type="submit"
                className="h-12 rounded-2xl bg-[#174A5B] px-6 text-sm font-semibold text-white transition hover:bg-[#123D4B]"
              >
                Buscar cliente
              </button>

              {busca && (
                <Link
                  href="/clientes"
                  className="flex h-12 items-center justify-center rounded-2xl border border-[#D5DEDB] bg-white px-5 text-sm font-semibold text-[#62736F] transition hover:bg-[#F2F6F4]"
                >
                  Limpar
                </Link>
              )}
            </form>
          </section>

          {/* RESUMO */}
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7FA89A]">
                Tutores
              </p>

              <h2 className="mt-1 text-2xl font-black text-[#24343A]">
                {busca
                  ? "Resultados da busca"
                  : "Clientes cadastrados"}
              </h2>

              <p className="mt-1 text-sm font-medium text-[#7D8C89]">
                {totalClientes ===
                1
                  ? "1 cliente encontrado"
                  : `${totalClientes.toLocaleString(
                      "pt-BR",
                    )} clientes encontrados`}
              </p>
            </div>

            <div className="rounded-full border border-[#D5DFDB] bg-white px-4 py-2 text-xs font-semibold text-[#536762] shadow-sm">
              Página{" "}
              {paginaAtual} de{" "}
              {totalPaginas}
            </div>
          </div>

          {/* LISTA */}
          <section className="mt-4 overflow-hidden rounded-[26px] border border-[#D9E1DE] bg-[#FBFCFA] shadow-sm">
            {clientesDaPagina.length ===
            0 ? (
              <div className="px-6 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#E7F0ED] text-[#174A5B]">
                  <Search
                    size={27}
                  />
                </div>

                <h3 className="mt-4 text-xl font-black">
                  Nenhum cliente encontrado
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#81908D]">
                  Tente pesquisar usando outro nome, CPF, telefone, WhatsApp ou e-mail.
                </p>

                {busca && (
                  <Link
                    href="/clientes"
                    className="mt-5 inline-flex rounded-xl bg-[#174A5B] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Ver todos os clientes
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-[#E7ECE9]">
                {clientesDaPagina.map(
                  (cliente) => (
                    <article
                      key={
                        cliente.id
                      }
                      className="group grid gap-5 px-6 py-5 transition hover:bg-[#F7FAF8] lg:grid-cols-[minmax(260px,1.5fr)_minmax(170px,1fr)_minmax(170px,1fr)_auto] lg:items-center"
                    >
                      {/* CLIENTE */}
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#E7F0ED] text-base font-black text-[#174A5B] transition group-hover:bg-[#DCEBE6]">
                          {iniciais(
                            cliente.nome,
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-black text-[#273A3D]">
                              {
                                cliente.nome
                              }
                            </h3>

                            <span className="rounded-full bg-[#E3F1EA] px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#477560]">
                              Ativo
                            </span>
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#8A9996]">
                            <span>
                              ID #
                              {
                                cliente.id
                              }
                            </span>

                            {cliente.codigoAntigo !=
                              null && (
                              <>
                                <span>
                                  •
                                </span>

                                <span>
                                  Código antigo{" "}
                                  {
                                    cliente.codigoAntigo
                                  }
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* TELEFONE */}
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E7F0ED] text-[#174A5B]">
                          <Phone
                            size={16}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[#8A9996]">
                            Telefone
                          </p>

                          <p className="mt-0.5 truncate text-sm font-semibold text-[#485B57]">
                            {valorContato(
                              cliente.telefone,
                            )}
                          </p>
                        </div>
                      </div>

                      {/* WHATSAPP / EMAIL */}
                      <div className="min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <MessageCircle
                            size={14}
                            className="shrink-0 text-[#2DAA63]"
                          />

                          <span className="truncate text-xs font-semibold text-[#52645F]">
                            {valorContato(
                              cliente.whatsapp,
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail
                            size={14}
                            className="shrink-0 text-[#527BD7]"
                          />

                          <span className="truncate text-xs font-medium text-[#758581]">
                            {valorContato(
                              cliente.email,
                            )}
                          </span>
                        </div>
                      </div>

                      {/* ABRIR */}
                      <Link
                        href={`/clientes/${cliente.id}`}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#174A5B] px-4 text-xs font-semibold text-white transition hover:bg-[#123D4B]"
                      >
                        Ver cliente

                        <ChevronRight
                          size={16}
                        />
                      </Link>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>

          {/* PAGINAÇÃO */}
          {totalClientes > 0 && (
            <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-[22px] border border-[#D9E1DE] bg-[#FBFCFA] px-5 py-4 shadow-sm sm:flex-row">
              <p className="text-xs font-medium text-[#7C8D89]">
                Mostrando{" "}
                <strong className="text-[#425651]">
                  {inicio + 1}
                </strong>{" "}
                até{" "}
                <strong className="text-[#425651]">
                  {Math.min(
                    fim,
                    totalClientes,
                  )}
                </strong>{" "}
                de{" "}
                <strong className="text-[#425651]">
                  {totalClientes.toLocaleString(
                    "pt-BR",
                  )}
                </strong>
              </p>

              <div className="flex items-center gap-2">
                {paginaAtual > 1 ? (
                  <Link
                    href={montarHref(
                      {
                        busca,
                        pagina:
                          paginaAtual -
                          1,
                      },
                    )}
                    className="flex h-10 items-center gap-2 rounded-xl border border-[#D7E0DD] bg-white px-4 text-xs font-semibold text-[#536763] transition hover:bg-[#EFF5F2]"
                  >
                    <ChevronLeft
                      size={15}
                    />

                    Anterior
                  </Link>
                ) : (
                  <span className="flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-[#E4E9E7] bg-[#F3F5F4] px-4 text-xs font-semibold text-[#AAB4B1]">
                    <ChevronLeft
                      size={15}
                    />

                    Anterior
                  </span>
                )}

                <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#174A5B] px-3 text-xs font-bold text-white">
                  {
                    paginaAtual
                  }
                </span>

                {paginaAtual <
                totalPaginas ? (
                  <Link
                    href={montarHref(
                      {
                        busca,
                        pagina:
                          paginaAtual +
                          1,
                      },
                    )}
                    className="flex h-10 items-center gap-2 rounded-xl border border-[#D7E0DD] bg-white px-4 text-xs font-semibold text-[#536763] transition hover:bg-[#EFF5F2]"
                  >
                    Próxima

                    <ChevronRight
                      size={15}
                    />
                  </Link>
                ) : (
                  <span className="flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-[#E4E9E7] bg-[#F3F5F4] px-4 text-xs font-semibold text-[#AAB4B1]">
                    Próxima

                    <ChevronRight
                      size={15}
                    />
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#92A09D]">
            <PawPrint
              size={14}
            />

            Clique em “Ver cliente” para acessar pacientes, planos, anotações e venda rápida.
          </div>
        </div>
      </main>
    </div>
  );
}