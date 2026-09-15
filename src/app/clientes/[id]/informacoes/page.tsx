import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  FileText,
  IdCard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  UserRound,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function valor(
  dado: string | number | null | undefined,
) {
  if (
    dado === null ||
    dado === undefined ||
    dado === ""
  ) {
    return "Não informado";
  }

  return String(dado);
}

export default async function InformacoesClientePage({
  params,
}: PageProps) {
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

  const plano =
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

  const resultado =
    await runtime.query(
      plano,
    );

  const cliente =
    resultado[0];

  if (!cliente) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F2F1EC] font-[family-name:var(--font-dosis)] text-[#24343A]">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <Header />

        <div className="p-7">
          <Link
            href={`/clientes/${cliente.id}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#526764] transition hover:text-[#174A5B]"
          >
            <ArrowLeft
              size={18}
            />

            Voltar para ficha
          </Link>

          {/* CABEÇALHO */}
          <section className="rounded-[28px] bg-[#174A5B] px-8 py-7 text-white shadow-sm">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <UserRound
                  size={30}
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#BFD3CC]">
                  Cadastro completo
                </p>

                <h1 className="mt-1 text-3xl font-black">
                  {cliente.nome}
                </h1>

                <p className="mt-2 text-sm font-medium text-[#D9E7E2]">
                  Todas as informações cadastradas do tutor.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            {/* IDENTIFICAÇÃO */}
            <section className="rounded-[24px] border border-[#D9E1DE] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFEAE2] text-[#876C54]">
                  <IdCard
                    size={21}
                  />
                </div>

                <h2 className="text-xl font-black">
                  Identificação
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                <Campo
                  label="Nome completo"
                  value={
                    cliente.nome
                  }
                />

                <Campo
                  label="CPF"
                  value={valor(
                    cliente.cpf,
                  )}
                />

                <Campo
                  label="Código antigo"
                  value={valor(
                    cliente.codigoAntigo,
                  )}
                />

                <Campo
                  label="Status"
                  value={
                    cliente.ativo
                      ? "Ativo"
                      : "Inativo"
                  }
                />
              </div>
            </section>

            {/* CONTATO */}
            <section className="rounded-[24px] border border-[#D9E1DE] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E7F0ED] text-[#174A5B]">
                  <Phone
                    size={20}
                  />
                </div>

                <h2 className="text-xl font-black">
                  Contato
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                <CampoComIcone
                  icon={
                    <Phone size={16} />
                  }
                  label="Telefone"
                  value={valor(
                    cliente.telefone,
                  )}
                />

                <CampoComIcone
                  icon={
                    <MessageCircle
                      size={16}
                    />
                  }
                  label="WhatsApp"
                  value={valor(
                    cliente.whatsapp,
                  )}
                />

                <CampoComIcone
                  icon={
                    <Mail size={16} />
                  }
                  label="E-mail"
                  value={valor(
                    cliente.email,
                  )}
                />
              </div>
            </section>

            {/* ENDEREÇO */}
            <section className="rounded-[24px] border border-[#E5D8CE] bg-[#FFF9F5] p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C77A61] text-white">
                  <MapPin
                    size={20}
                  />
                </div>

                <h2 className="text-xl font-black">
                  Endereço
                </h2>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Campo
                  label="Endereço"
                  value={valor(
                    cliente.endereco,
                  )}
                />

                <Campo
                  label="Número"
                  value={valor(
                    cliente.numero,
                  )}
                />

                <Campo
                  label="Complemento"
                  value={valor(
                    cliente.complemento,
                  )}
                />

                <Campo
                  label="Bairro"
                  value={valor(
                    cliente.bairro,
                  )}
                />

                <Campo
                  label="Cidade"
                  value={valor(
                    cliente.cidade,
                  )}
                />

                <Campo
                  label="Estado"
                  value={valor(
                    cliente.estado,
                  )}
                />

                <Campo
                  label="CEP"
                  value={valor(
                    cliente.cep,
                  )}
                />
              </div>
            </section>

            {/* OBSERVAÇÕES */}
            <section className="rounded-[24px] border border-[#D9E1DE] bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E7EFEC] text-[#174A5B]">
                  <FileText
                    size={20}
                  />
                </div>

                <h2 className="text-xl font-black">
                  Observações do cadastro
                </h2>
              </div>

              <p className="mt-5 whitespace-pre-wrap rounded-2xl bg-[#F5F7F5] p-5 text-sm font-medium leading-6 text-[#566764]">
                {cliente.observacoes ||
                  "Nenhuma observação cadastrada."}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Campo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F5F7F5] p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#899794]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#3E4D4A]">
        {value}
      </p>
    </div>
  );
}

function CampoComIcone({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#F5F7F5] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#174A5B] shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#899794]">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-[#3E4D4A]">
          {value}
        </p>
      </div>
    </div>
  );
}