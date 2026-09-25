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
import PacienteRetornoForm from "@/components/pacientes/PacienteRetornoForm";
import PacientePatologiaObrigatoria, {
  type PatologiaReferencia,
} from "@/components/pacientes/PacientePatologiaObrigatoria";
import ExcluirAtendimentoButton from "@/components/pacientes/ExcluirAtendimentoButton";
import PacientePesoForm from "@/components/pacientes/PacientePesoForm";
import EditarPesoButton from "@/components/pacientes/EditarPesoButton";
import ExcluirPesoButton from "@/components/pacientes/ExcluirPesoButton";
import PacienteVacinaForm from "@/components/pacientes/PacienteVacinaForm";
import EditarVacinaButton from "@/components/pacientes/EditarVacinaButton";
import ExcluirVacinaButton from "@/components/pacientes/ExcluirVacinaButton";
import PacienteExameForm from "@/components/pacientes/PacienteExameForm";
import EditarExameButton from "@/components/pacientes/EditarExameButton";
import ExcluirExameButton from "@/components/pacientes/ExcluirExameButton";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

type PacientePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    historico?: string;
    busca?: string;
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
  searchParams,
}: PacientePageProps) {
  const acesso =
    await exigirPermissao(
      "cliente.visualizar",
    );

  const { id } = await params;

  const filtrosHistorico =
    searchParams
      ? await searchParams
      : {};

  const tipoHistorico =
    String(
      filtrosHistorico.historico ??
        "todos",
    )
      .trim()
      .toLowerCase();

  const buscaHistorico =
    String(
      filtrosHistorico.busca ??
        "",
    ).trim();

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
        "tipo",
        "statusAtendimento",
        "motivoConsulta",
        "anamnese",
        "exameClinico",
        "diagnosticoSuspeita",
        "conduta",
        "observacoes",
        "evolucao",
        "atendimentoOrigemId",
        "dataAtendimento",
        "profissionalUsuarioId",
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

  const consultaVacinas =
    db.sql.public.pacienteVacina
      .select(
        "id",
        "nome",
        "dose",
        "lote",
        "fabricante",
        "observacoes",
        "dataAplicacao",
        "validade",
        "proximaDose",
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
        "dataAplicacao",
        {
          direction: "desc",
        },
      )
      .build();

  const vacinas =
    await runtime.query(
      consultaVacinas,
    );

  const consultaExames =
    db.sql.public.pacienteExame
      .select(
        "id",
        "nome",
        "tipo",
        "status",
        "dataSolicitacao",
        "dataRealizacao",
        "dataResultado",
        "laboratorio",
        "resultado",
        "observacoes",
        "profissionalNome",
        "atendimentoId",
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
        "dataSolicitacao",
        {
          direction: "desc",
        },
      )
      .build();

  const exames =
    await runtime.query(
      consultaExames,
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

  const consultaPatologias =
    db.sql.public.pacientePatologia
      .select(
        "id",
        "nome",
        "status",
        "observacoes",
        "dataRegistro",
        "profissionalNome",
        "atendimentoId",
        "doencaId",
        "patologiaOrigemId",
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
        "dataRegistro",
        {
          direction: "desc",
        },
      )
      .build();

  const patologias =
    await runtime.query(
      consultaPatologias,
    );

  function montarPatologiasReferencia(
    atendimentoOrigemId: number,
  ): PatologiaReferencia[] {
    const raizes =
      patologias.filter(
        (patologia) =>
          patologia.atendimentoId ===
            atendimentoOrigemId &&
          patologia.patologiaOrigemId ===
            null &&
          patologia.status !==
            "SEM_PROBLEMA_CLINICO",
      );

    return raizes.flatMap(
      (raiz) => {
        const evolucoes =
          patologias
            .filter(
              (patologia) =>
                patologia.patologiaOrigemId ===
                  raiz.id,
            )
            .sort(
              (a, b) =>
                new Date(
                  String(
                    b.dataRegistro,
                  ),
                ).getTime() -
                new Date(
                  String(
                    a.dataRegistro,
                  ),
                ).getTime(),
            );

        const atual =
          evolucoes[0] ??
          raiz;

        if (
          atual.status ===
            "TRATADA" ||
          atual.status ===
            "SEM_PROBLEMA_CLINICO"
        ) {
          return [];
        }

        return [
          {
            id:
              raiz.id,
            nome:
              atual.nome ??
              raiz.nome,
            doencaId:
              atual.doencaId ??
              raiz.doencaId,
            status:
              atual.status,
          },
        ];
      },
    );
  }

  const atendimentoPendentePatologia =
    atendimentos.find(
      (atendimento) =>
        atendimento.statusAtendimento ===
          "AGUARDANDO_PATOLOGIA" &&
        atendimento.profissionalUsuarioId ===
          acesso.usuario.id,
    );

  const atendimentoReferenciaPendenteId =
    atendimentoPendentePatologia?.tipo ===
      "RETORNO"
      ? atendimentoPendentePatologia.atendimentoOrigemId
      : atendimentoPendentePatologia?.id;

  const patologiasReferenciaPendentes =
    atendimentoReferenciaPendenteId
      ? montarPatologiasReferencia(
          atendimentoReferenciaPendenteId,
        )
      : [];

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

    ...vacinas.map(
      (vacina) => ({
        tipo: "vacina" as const,
        id: vacina.id,
        data: String(
          vacina.dataAplicacao,
        ),
        vacina,
      }),
    ),

    ...exames.map(
      (exame) => ({
        tipo: "exame" as const,
        id: exame.id,
        data: String(
          exame.dataSolicitacao,
        ),
        exame,
      }),
    ),
  ].sort((a, b) => {
    const dataA =
      new Date(a.data).getTime();

    const dataB =
      new Date(b.data).getTime();

    return dataB - dataA;
  });

  const contagemHistorico = {
    todos: historico.length,
    atendimento: historico.filter(
      (registro) =>
        registro.tipo ===
        "atendimento",
    ).length,
    vacina: historico.filter(
      (registro) =>
        registro.tipo === "vacina",
    ).length,
    exame: historico.filter(
      (registro) =>
        registro.tipo === "exame",
    ).length,
    peso: historico.filter(
      (registro) =>
        registro.tipo === "peso",
    ).length,
    anotacao: historico.filter(
      (registro) =>
        registro.tipo ===
        "anotacao",
    ).length,
  };

  const tiposHistoricoValidos =
    new Set([
      "todos",
      "atendimento",
      "vacina",
      "exame",
      "peso",
      "anotacao",
    ]);

  const tipoHistoricoAtivo =
    tiposHistoricoValidos.has(
      tipoHistorico,
    )
      ? tipoHistorico
      : "todos";

  const buscaNormalizada =
    buscaHistorico
      .toLocaleLowerCase(
        "pt-BR",
      );

  const historicoFiltrado =
    historico.filter(
      (registro) => {
        if (
          tipoHistoricoAtivo !==
            "todos" &&
          registro.tipo !==
            tipoHistoricoAtivo
        ) {
          return false;
        }

        if (!buscaNormalizada) {
          return true;
        }

        let texto = "";

        if (
          registro.tipo ===
          "atendimento"
        ) {
          const item =
            registro.atendimento;

          const patologiasDoAtendimento =
            patologias.filter(
              (patologia) =>
                patologia.atendimentoId ===
                item.id,
            );

          texto = [
            item.tipo,
            item.statusAtendimento,
            item.motivoConsulta,
            item.anamnese,
            item.exameClinico,
            item.diagnosticoSuspeita,
            item.conduta,
            item.observacoes,
            item.evolucao,
            item.profissionalNome,
            ...patologiasDoAtendimento.flatMap(
              (patologia) => [
                patologia.nome,
                patologia.status,
                patologia.observacoes,
                patologia.profissionalNome,
              ],
            ),
          ]
            .filter(Boolean)
            .join(" ");
        } else if (
          registro.tipo === "peso"
        ) {
          const item =
            registro.pesagem;

          texto = [
            item.peso,
            item.observacoes,
            item.profissionalNome,
          ]
            .filter(
              (valor) =>
                valor !== null &&
                valor !== undefined &&
                valor !== "",
            )
            .join(" ");
        } else if (
          registro.tipo === "vacina"
        ) {
          const item =
            registro.vacina;

          texto = [
            item.nome,
            item.dose,
            item.fabricante,
            item.lote,
            item.observacoes,
            item.profissionalNome,
          ]
            .filter(Boolean)
            .join(" ");
        } else if (
          registro.tipo === "exame"
        ) {
          const item =
            registro.exame;

          texto = [
            item.nome,
            item.tipo,
            item.status,
            item.laboratorio,
            item.resultado,
            item.observacoes,
            item.profissionalNome,
          ]
            .filter(Boolean)
            .join(" ");
        } else {
          const item =
            registro.anotacao;

          texto = [
            item.texto,
            item.criadoPorNome,
          ]
            .filter(Boolean)
            .join(" ");
        }

        return texto
          .toLocaleLowerCase(
            "pt-BR",
          )
          .includes(
            buscaNormalizada,
          );
      },
    );

  function hrefHistorico(
    tipoSelecionado: string,
  ) {
    const params =
      new URLSearchParams();

    if (
      tipoSelecionado !== "todos"
    ) {
      params.set(
        "historico",
        tipoSelecionado,
      );
    }

    if (buscaHistorico) {
      params.set(
        "busca",
        buscaHistorico,
      );
    }

    const query =
      params.toString();

    return query
      ? `/pacientes/${paciente.id}?${query}`
      : `/pacientes/${paciente.id}`;
  }

  const tipo =
    tipoAnimal(
      paciente.especie,
    );

  return (
    <div className="min-h-screen bg-[#F2F1EC] font-[family-name:var(--font-dosis)] text-[#24343A]">
      <Sidebar />

      <main className="min-h-screen lg:ml-64">
        <Header />

        <div className="p-3 sm:p-4 md:p-6">
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

            <div className="flex flex-col items-stretch justify-between gap-5 p-4 sm:p-5 md:p-6 xl:flex-row xl:items-center">
              <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                <AnimalAvatar
                  tipo={tipo}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="break-words text-[26px] font-black leading-tight text-[#24343A] sm:text-[32px]">
                      {paciente.nome}
                    </h1>

                    <span className="rounded-full bg-[#E2F2EA] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#3E765E]">
                      {paciente.ativo
                        ? "Ativo"
                        : "Inativo"}
                    </span>
                  </div>

                  <p className="mt-2 break-words text-sm font-semibold text-[#73817F]">
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

                  <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="min-w-0 rounded-2xl border border-[#DCE4E1] bg-[#F8FAF9] px-4 py-3">
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

                    <div className="min-w-0 rounded-2xl border border-[#E7D8BE] bg-[#FFF9F0] px-4 py-3">
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
                      <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#DCE4E1] bg-[#F8FAF9] px-4 py-3">
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
                  className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-[#DCE4E1] bg-[#F6F8F7] px-4 py-3 transition hover:border-[#BFD1CB] xl:w-auto xl:min-w-[260px]"
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

            <div className="ml-0 flex gap-2 sm:ml-auto">
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
          <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[270px_minmax(0,1fr)]">
            {/* ESQUERDA */}
            <aside className="grid gap-4 md:grid-cols-2 xl:block xl:space-y-4">
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
            <section className="min-w-0 overflow-hidden rounded-[24px] border border-[#D9E1DE] bg-white shadow-sm">
              <div className="border-b border-[#E2E8E5] px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    {
                      valor: "todos",
                      label: "Todos",
                    },
                    {
                      valor:
                        "atendimento",
                      label:
                        "Atendimentos",
                    },
                    {
                      valor: "vacina",
                      label: "Vacinas",
                    },
                    {
                      valor: "exame",
                      label: "Exames",
                    },
                    {
                      valor: "peso",
                      label: "Peso",
                    },
                    {
                      valor:
                        "anotacao",
                      label:
                        "Observações",
                    },
                  ].map(
                    (filtro) => {
                      const ativo =
                        tipoHistoricoAtivo ===
                        filtro.valor;

                      return (
                        <Link
                          key={
                            filtro.valor
                          }
                          href={hrefHistorico(
                            filtro.valor,
                          )}
                          scroll={false}
                          className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                            ativo
                              ? "border-[#174A5B] bg-[#174A5B] text-white shadow-sm"
                              : "border-[#DCE4E1] bg-[#F8FAF9] text-[#657572] hover:border-[#B8CBC5] hover:bg-white"
                          }`}
                        >
                          <span>
                            {filtro.label}
                          </span>

                          <span
                            className={`ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                              ativo
                                ? "bg-white/20 text-white"
                                : "bg-[#E8EFEC] text-[#657572]"
                            }`}
                          >
                            {
                              contagemHistorico[
                                filtro.valor as keyof typeof contagemHistorico
                              ]
                            }
                          </span>
                        </Link>
                      );
                    },
                  )}

                  <button
                    type="button"
                    disabled
                    title="Filtro por período será ativado em uma próxima etapa"
                    className="ml-0 flex cursor-not-allowed items-center gap-2 rounded-xl border border-[#DCE4E1] bg-[#F8FAF9] px-3 py-2 text-xs font-semibold text-[#9AA6A3] sm:ml-auto"
                  >
                    <CalendarDays
                      size={15}
                    />

                    Período

                    <ChevronDown
                      size={14}
                    />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form
                    method="get"
                    action={`/pacientes/${paciente.id}`}
                    className="flex w-full min-w-0 flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center"
                  >
                    {tipoHistoricoAtivo !==
                      "todos" && (
                      <input
                        type="hidden"
                        name="historico"
                        value={
                          tipoHistoricoAtivo
                        }
                      />
                    )}

                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#DCE4E1] bg-[#F8FAF9] px-3 py-2">
                      <Search
                        size={15}
                        className="shrink-0 text-[#92A09D]"
                      />

                      <input
                        name="busca"
                        defaultValue={
                          buscaHistorico
                        }
                        placeholder="Buscar no histórico..."
                        className="w-full bg-transparent text-xs font-semibold text-[#53625F] outline-none placeholder:font-medium placeholder:text-[#A1ACA9]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="shrink-0 rounded-xl bg-[#174A5B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#123D4B]"
                    >
                      Buscar
                    </button>
                  </form>

                  {(tipoHistoricoAtivo !==
                    "todos" ||
                    buscaHistorico) && (
                    <Link
                      href={`/pacientes/${paciente.id}`}
                      scroll={false}
                      className="rounded-xl border border-[#DCE4E1] bg-white px-3 py-2 text-xs font-bold text-[#657572] transition hover:border-[#B8CBC5]"
                    >
                      Limpar filtros
                    </Link>
                  )}

                  <span className="rounded-full bg-[#EEF3F1] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#6F807C]">
                    {historicoFiltrado.length} de{" "}
                    {historico.length}
                  </span>
                </div>
              </div>

              {/* BOTÕES COLORIDOS */}
              <div className="border-b border-[#E2E8E5] bg-[#FAFBFA] p-4 sm:p-5">
                <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
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

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

                  <PacienteExameForm
                    pacienteId={
                      paciente.id
                    }
                    pacienteNome={
                      paciente.nome
                    }
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

                  <PacienteVacinaForm
                    pacienteId={
                      paciente.id
                    }
                    pacienteNome={
                      paciente.nome
                    }
                    especie={
                      paciente.especie
                    }
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
              <div className="p-4 sm:p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#7FA89A]">
                      Linha do tempo
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      Histórico
                    </h2>

                    <p className="mt-1 text-xs font-semibold text-[#8A9794]">
                      Tudo que já foi registrado para este paciente, em ordem cronológica.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#174A5B] px-3 py-1 text-[10px] font-semibold text-white">
                    {historicoFiltrado.length}{" "}
                    {historicoFiltrado.length ===
                    1
                      ? "registro"
                      : "registros"}
                  </span>
                </div>

                {historicoFiltrado.length ===
                0 ? (
                  <div className="rounded-[18px] border border-dashed border-[#CCD8D4] bg-[#F8FAF9] px-5 py-10 text-center">
                    <Stethoscope
                      size={30}
                      className="mx-auto text-[#9BB0AA]"
                    />

                    <h3 className="mt-3 font-black">
                      Histórico vazio
                    </h3>

                    <p className="mx-auto mt-1 max-w-[420px] text-sm font-medium text-[#899693]">
                      {historico.length === 0
                        ? "Ainda não existem registros clínicos deste paciente."
                        : "Nenhum registro corresponde aos filtros selecionados."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-[20px] border border-[#DCE5E2] bg-white">
                    {historicoFiltrado.map(
                      (
                        registro,
                        indice,
                      ) => {
                        const dataRegistro =
                          new Date(
                            registro.data,
                          );

                        const anoAtual =
                          Number.isNaN(
                            dataRegistro.getTime(),
                          )
                            ? ""
                            : String(
                                dataRegistro.getFullYear(),
                              );

                        const registroAnterior =
                          indice > 0
                            ? historicoFiltrado[
                                indice - 1
                              ]
                            : null;

                        const dataAnterior =
                          registroAnterior
                            ? new Date(
                                registroAnterior.data,
                              )
                            : null;

                        const anoAnterior =
                          dataAnterior &&
                          !Number.isNaN(
                            dataAnterior.getTime(),
                          )
                            ? String(
                                dataAnterior.getFullYear(),
                              )
                            : "";

                        const mostrarAno =
                          indice === 0 ||
                          anoAtual !==
                            anoAnterior;

                        return (
                          <div
                            key={`${registro.tipo}-${registro.id}`}
                          >
                            {mostrarAno &&
                              anoAtual && (
                                <div className="border-b border-[#E4EBE8] bg-[#F5F7F6] px-4 py-2.5">
                                  <span className="text-sm font-black text-[#52615E]">
                                    {anoAtual}
                                  </span>
                                </div>
                              )}

                            {registro.tipo ===
                              "atendimento" && (
                              <details className="group border-b border-[#E7ECEA] last:border-b-0">
                                <summary
                                  className={`flex cursor-pointer list-none items-start gap-3 border-l-4 px-4 py-4 transition [&::-webkit-details-marker]:hidden ${
                                    registro.atendimento.tipo ===
                                    "RETORNO"
                                      ? "border-l-[#7FA89A] hover:bg-[#F7FBF9]"
                                      : "border-l-[#3A8DDA] hover:bg-[#F8FBFD]"
                                  }`}
                                >
                                  <div
                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                      registro.atendimento.tipo ===
                                      "RETORNO"
                                        ? "bg-[#E7F0ED] text-[#5F8579]"
                                        : "bg-[#E6F1FB] text-[#3A8DDA]"
                                    }`}
                                  >
                                    <Stethoscope
                                      size={15}
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                      <span
                                        className={`text-sm font-black ${
                                          registro.atendimento.tipo ===
                                          "RETORNO"
                                            ? "text-[#5F8579]"
                                            : "text-[#3A8DDA]"
                                        }`}
                                      >
                                        {formatarDataHora(
                                          String(
                                            registro.atendimento
                                              .dataAtendimento,
                                          ),
                                        )}
                                      </span>

                                      <span className="text-xs font-bold uppercase tracking-[0.10em] text-[#6F7E7A]">
                                        {registro.atendimento.tipo ===
                                        "RETORNO"
                                          ? "Retorno"
                                          : "Consulta"}
                                      </span>

                                      {registro.atendimento.tipo ===
                                        "RETORNO" &&
                                        registro.atendimento
                                          .atendimentoOrigemId && (
                                          <span className="rounded-full bg-[#EDF4F1] px-2.5 py-1 text-[10px] font-bold text-[#5F7C73]">
                                            Consulta #
                                            {
                                              registro.atendimento
                                                .atendimentoOrigemId
                                            }
                                          </span>
                                        )}

                                      {registro.atendimento
                                        .statusAtendimento ===
                                        "AGUARDANDO_PATOLOGIA" && (
                                        <span className="rounded-full bg-[#F4EAF7] px-2.5 py-1 text-[10px] font-bold text-[#725A89]">
                                          Aguardando patologia
                                        </span>
                                      )}
                                    </div>

                                    <p className="mt-1 truncate text-lg font-black text-[#2F3A37]">
                                      {registro.atendimento.tipo ===
                                      "RETORNO"
                                        ? "Consulta de retorno"
                                        : registro.atendimento
                                            .motivoConsulta ||
                                          "Atendimento clínico"}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-[#778480]">
                                      {registro
                                        .atendimento
                                        .profissionalNome ||
                                        "Profissional do sistema"}
                                    </p>
                                  </div>

                                  <div className="flex shrink-0 items-center gap-2">
                                    <span className="hidden text-xs font-bold text-[#7D8986] sm:inline">
                                      Ver detalhes
                                    </span>

                                    <ChevronDown
                                      size={16}
                                      className="text-[#8C9995] transition group-open:rotate-180"
                                    />
                                  </div>
                                </summary>

                                <div
                                  className={`border-l-4 px-4 pb-4 pl-[60px] ${
                                    registro.atendimento.tipo ===
                                    "RETORNO"
                                      ? "border-l-[#7FA89A] bg-[#FAFCFB]"
                                      : "border-l-[#3A8DDA] bg-[#FBFDFE]"
                                  }`}
                                >
                                  <div className="grid gap-3">
                                    {registro
                                      .atendimento
                                      .evolucao && (
                                      <BlocoAtendimento
                                        titulo="Evolução"
                                        texto={
                                          registro
                                            .atendimento
                                            .evolucao
                                        }
                                      />
                                    )}

                                    {registro
                                      .atendimento
                                      .anamnese && (
                                      <BlocoAtendimento
                                        titulo="Anamnese"
                                        texto={
                                          registro
                                            .atendimento
                                            .anamnese
                                        }
                                      />
                                    )}

                                    {registro
                                      .atendimento
                                      .exameClinico && (
                                      <BlocoAtendimento
                                        titulo="Exame clínico"
                                        texto={
                                          registro
                                            .atendimento
                                            .exameClinico
                                        }
                                      />
                                    )}

                                    {registro
                                      .atendimento
                                      .diagnosticoSuspeita && (
                                      <BlocoAtendimento
                                        titulo="Diagnóstico / suspeita"
                                        texto={
                                          registro
                                            .atendimento
                                            .diagnosticoSuspeita
                                        }
                                      />
                                    )}

                                    {registro
                                      .atendimento
                                      .conduta && (
                                      <BlocoAtendimento
                                        titulo="Conduta"
                                        texto={
                                          registro
                                            .atendimento
                                            .conduta
                                        }
                                      />
                                    )}

                                    {registro
                                      .atendimento
                                      .observacoes && (
                                      <BlocoAtendimento
                                        titulo="Observações"
                                        texto={
                                          registro
                                            .atendimento
                                            .observacoes
                                        }
                                      />
                                    )}

                                    {patologias
                                      .filter(
                                        (patologia) =>
                                          patologia.atendimentoId ===
                                          registro.atendimento.id,
                                      )
                                      .map(
                                        (patologia) => (
                                          <BlocoAtendimento
                                            key={`patologia-${patologia.id}`}
                                            titulo={`Patologia — ${rotuloStatusPatologia(
                                              patologia.status,
                                            )}`}
                                            texto={
                                              patologia.status ===
                                              "SEM_PROBLEMA_CLINICO"
                                                ? patologia.observacoes ||
                                                  "Sem problema clínico identificado."
                                                : [
                                                    patologia.nome,
                                                    patologia.observacoes,
                                                  ]
                                                    .filter(Boolean)
                                                    .join(
                                                      "\n\n",
                                                    )
                                            }
                                          />
                                        ),
                                      )}
                                  </div>

                                  {registro.atendimento.tipo !==
                                    "RETORNO" && (
                                    <div className="mt-4">
                                      <PacienteRetornoForm
                                        pacienteId={
                                          paciente.id
                                        }
                                        pacienteNome={
                                          paciente.nome
                                        }
                                        atendimentoOrigemId={
                                          registro
                                            .atendimento
                                            .id
                                        }
                                        motivoConsulta={
                                          registro
                                            .atendimento
                                            .motivoConsulta
                                        }
                                        diagnosticoSuspeita={
                                          registro
                                            .atendimento
                                            .diagnosticoSuspeita
                                        }
                                        patologiasReferencia={
                                          montarPatologiasReferencia(
                                            registro
                                              .atendimento
                                              .id,
                                          )
                                        }
                                      />
                                    </div>
                                  )}

                                  <div className="mt-4 flex justify-end">
                                    <ExcluirAtendimentoButton
                                      atendimentoId={
                                        registro
                                          .atendimento
                                          .id
                                      }
                                      pacienteId={
                                        paciente.id
                                      }
                                    />
                                  </div>
                                </div>
                              </details>
                            )}

                            {registro.tipo ===
                              "peso" && (
                              <details className="group border-b border-[#E7ECEA] last:border-b-0">
                                <summary className="flex cursor-pointer list-none items-start gap-3 border-l-4 border-l-[#D38A2B] px-4 py-4 transition hover:bg-[#FFFCF7] [&::-webkit-details-marker]:hidden">
                                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF0DA] text-[#C27A21]">
                                    <Scale
                                      size={15}
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                      <span className="text-sm font-black text-[#B97828]">
                                        {formatarDataHora(
                                          String(
                                            registro
                                              .pesagem
                                              .dataPesagem,
                                          ),
                                        )}
                                      </span>

                                      <span className="text-xs font-bold uppercase tracking-[0.10em] text-[#6F7E7A]">
                                        Peso
                                      </span>
                                    </div>

                                    <p className="mt-1 text-lg font-black text-[#2F3A37]">
                                      {formatarPeso(
                                        registro
                                          .pesagem
                                          .peso,
                                      )}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-[#778480]">
                                      {registro
                                        .pesagem
                                        .profissionalNome ||
                                        "Profissional do sistema"}
                                    </p>
                                  </div>

                                  <ChevronDown
                                    size={16}
                                    className="mt-2 shrink-0 text-[#8C9995] transition group-open:rotate-180"
                                  />
                                </summary>

                                <div className="border-l-4 border-l-[#D38A2B] bg-[#FFFCF7] px-4 pb-4 pl-[60px]">
                                  {registro
                                    .pesagem
                                    .observacoes ? (
                                    <div className="rounded-xl border border-[#EFE3CF] bg-white px-4 py-3">
                                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#A7834F]">
                                        Observações
                                      </p>

                                      <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-6 text-[#5E625D]">
                                        {
                                          registro
                                            .pesagem
                                            .observacoes
                                        }
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-xs font-semibold text-[#929D99]">
                                      Nenhuma observação adicionada.
                                    </p>
                                  )}

                                  <div className="mt-4 flex justify-end">
                                    <div className="flex items-center gap-2">
                                      <EditarPesoButton
                                        pesoId={
                                          registro
                                            .pesagem.id
                                        }
                                        pacienteId={
                                          paciente.id
                                        }
                                        peso={
                                          registro
                                            .pesagem
                                            .peso
                                        }
                                        observacoes={
                                          registro
                                            .pesagem
                                            .observacoes
                                        }
                                      />

                                      <ExcluirPesoButton
                                        pesoId={
                                          registro
                                            .pesagem.id
                                        }
                                        pacienteId={
                                          paciente.id
                                        }
                                        peso={
                                          registro
                                            .pesagem
                                            .peso
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </details>
                            )}

                            {registro.tipo ===
                              "vacina" && (
                              <details className="group border-b border-[#E7ECEA] last:border-b-0">
                                <summary className="flex cursor-pointer list-none items-start gap-3 border-l-4 border-l-[#ECAF2E] px-4 py-4 transition hover:bg-[#FFFCF4] [&::-webkit-details-marker]:hidden">
                                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF3CF] text-[#C48A12]">
                                    <Syringe
                                      size={15}
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                      <span className="text-sm font-black text-[#B17D18]">
                                        {formatarDataHora(
                                          String(
                                            registro
                                              .vacina
                                              .dataAplicacao,
                                          ),
                                        )}
                                      </span>

                                      <span className="text-xs font-bold uppercase tracking-[0.10em] text-[#6F7E7A]">
                                        Vacina
                                      </span>
                                    </div>

                                    <p className="mt-1 truncate text-lg font-black text-[#2F3A37]">
                                      {
                                        registro
                                          .vacina
                                          .nome
                                      }
                                    </p>

                                    <p className="mt-1 truncate text-sm font-semibold text-[#778480]">
                                      {[
                                        registro
                                          .vacina
                                          .dose,
                                        registro
                                          .vacina
                                          .fabricante,
                                        registro
                                          .vacina
                                          .lote
                                          ? `Lote ${registro.vacina.lote}`
                                          : null,
                                      ]
                                        .filter(
                                          Boolean,
                                        )
                                        .join(
                                          " • ",
                                        ) ||
                                        "Aplicação registrada"}
                                    </p>
                                  </div>

                                  <ChevronDown
                                    size={16}
                                    className="mt-2 shrink-0 text-[#8C9995] transition group-open:rotate-180"
                                  />
                                </summary>

                                <div className="border-l-4 border-l-[#ECAF2E] bg-[#FFFCF4] px-4 pb-4 pl-[60px]">
                                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {registro
                                      .vacina
                                      .dose && (
                                      <DadoVacina
                                        label="Dose"
                                        value={
                                          registro
                                            .vacina
                                            .dose
                                        }
                                      />
                                    )}

                                    {registro
                                      .vacina
                                      .fabricante && (
                                      <DadoVacina
                                        label="Fabricante"
                                        value={
                                          registro
                                            .vacina
                                            .fabricante
                                        }
                                      />
                                    )}

                                    {registro
                                      .vacina
                                      .lote && (
                                      <DadoVacina
                                        label="Lote"
                                        value={
                                          registro
                                            .vacina
                                            .lote
                                        }
                                      />
                                    )}

                                    {registro
                                      .vacina
                                      .validade && (
                                      <DadoVacina
                                        label="Validade"
                                        value={formatarData(
                                          String(
                                            registro
                                              .vacina
                                              .validade,
                                          ),
                                        )}
                                      />
                                    )}

                                    {registro
                                      .vacina
                                      .proximaDose && (
                                      <DadoVacina
                                        label="Próxima dose"
                                        value={formatarData(
                                          String(
                                            registro
                                              .vacina
                                              .proximaDose,
                                          ),
                                        )}
                                      />
                                    )}
                                  </div>

                                  {registro
                                    .vacina
                                    .observacoes && (
                                    <div className="mt-3 rounded-xl border border-[#EEE4C8] bg-white px-4 py-3">
                                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9C823F]">
                                        Observações
                                      </p>

                                      <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-6 text-[#56625F]">
                                        {
                                          registro
                                            .vacina
                                            .observacoes
                                        }
                                      </p>
                                    </div>
                                  )}

                                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE8D8] pt-3">
                                    <span className="flex items-center gap-2 text-[10px] font-semibold text-[#8A9693]">
                                      <UserRound
                                        size={13}
                                      />

                                      {registro
                                        .vacina
                                        .profissionalNome ||
                                        "Profissional do sistema"}
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <EditarVacinaButton
                                        vacinaId={
                                          registro
                                            .vacina.id
                                        }
                                        pacienteId={
                                          paciente.id
                                        }
                                        especie={
                                          paciente.especie
                                        }
                                        nome={
                                          registro
                                            .vacina
                                            .nome
                                        }
                                        dose={
                                          registro
                                            .vacina
                                            .dose
                                        }
                                        lote={
                                          registro
                                            .vacina
                                            .lote
                                        }
                                        fabricante={
                                          registro
                                            .vacina
                                            .fabricante
                                        }
                                        observacoes={
                                          registro
                                            .vacina
                                            .observacoes
                                        }
                                        dataAplicacao={
                                          String(
                                            registro
                                              .vacina
                                              .dataAplicacao,
                                          )
                                        }
                                        validade={
                                          registro
                                            .vacina
                                            .validade
                                            ? String(
                                                registro
                                                  .vacina
                                                  .validade,
                                              )
                                            : null
                                        }
                                        proximaDose={
                                          registro
                                            .vacina
                                            .proximaDose
                                            ? String(
                                                registro
                                                  .vacina
                                                  .proximaDose,
                                              )
                                            : null
                                        }
                                      />

                                    <ExcluirVacinaButton
                                      vacinaId={
                                        registro
                                          .vacina.id
                                      }
                                      pacienteId={
                                        paciente.id
                                      }
                                      vacinaNome={
                                        registro
                                          .vacina
                                          .nome
                                      }
                                    />
                                    </div>
                                  </div>
                                </div>
                              </details>
                            )}

                            {registro.tipo ===
                              "exame" && (
                              <details className="group border-b border-[#E7ECEA] last:border-b-0">
                                <summary className="flex cursor-pointer list-none items-start gap-3 border-l-4 border-l-[#EB5965] px-4 py-4 transition hover:bg-[#FFF8F8] [&::-webkit-details-marker]:hidden">
                                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCE8EA] text-[#C94D59]">
                                    <FlaskConical
                                      size={15}
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                      <span className="text-sm font-black text-[#B54C57]">
                                        {formatarDataHora(
                                          String(
                                            registro
                                              .exame
                                              .dataSolicitacao,
                                          ),
                                        )}
                                      </span>

                                      <span className="text-xs font-bold uppercase tracking-[0.10em] text-[#A85760]">
                                        Exame
                                      </span>

                                      <span className="rounded-full bg-[#FBEAEC] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#A94651]">
                                        {formatarStatusExame(
                                          String(
                                            registro
                                              .exame
                                              .status,
                                          ),
                                        )}
                                      </span>
                                    </div>

                                    <p className="mt-1 truncate text-lg font-black text-[#2F3A37]">
                                      {registro
                                        .exame
                                        .nome}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-[#778480]">
                                      {[
                                        registro
                                          .exame
                                          .tipo,
                                        registro
                                          .exame
                                          .laboratorio,
                                        registro
                                          .exame
                                          .profissionalNome,
                                      ]
                                        .filter(
                                          Boolean,
                                        )
                                        .join(
                                          " • ",
                                        ) ||
                                        "Exame registrado"}
                                    </p>
                                  </div>

                                  <ChevronDown
                                    size={16}
                                    className="mt-2 shrink-0 text-[#8C9995] transition group-open:rotate-180"
                                  />
                                </summary>

                                <div className="border-l-4 border-l-[#EB5965] bg-[#FFF9F9] px-4 pb-4 pl-[60px]">
                                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {registro
                                      .exame
                                      .tipo && (
                                      <DadoExame
                                        label="Tipo"
                                        value={
                                          registro
                                            .exame
                                            .tipo
                                        }
                                      />
                                    )}

                                    <DadoExame
                                      label="Status"
                                      value={formatarStatusExame(
                                        String(
                                          registro
                                            .exame
                                            .status,
                                        ),
                                      )}
                                    />

                                    {registro
                                      .exame
                                      .laboratorio && (
                                      <DadoExame
                                        label="Laboratório"
                                        value={
                                          registro
                                            .exame
                                            .laboratorio
                                        }
                                      />
                                    )}

                                    {registro
                                      .exame
                                      .dataRealizacao && (
                                      <DadoExame
                                        label="Realização"
                                        value={formatarData(
                                          String(
                                            registro
                                              .exame
                                              .dataRealizacao,
                                          ),
                                        )}
                                      />
                                    )}

                                    {registro
                                      .exame
                                      .dataResultado && (
                                      <DadoExame
                                        label="Resultado em"
                                        value={formatarData(
                                          String(
                                            registro
                                              .exame
                                              .dataResultado,
                                          ),
                                        )}
                                      />
                                    )}

                                    {registro
                                      .exame
                                      .atendimentoId && (
                                      <DadoExame
                                        label="Atendimento"
                                        value={`#${registro.exame.atendimentoId}`}
                                      />
                                    )}
                                  </div>

                                  {registro
                                    .exame
                                    .resultado && (
                                    <div className="mt-3 rounded-xl border border-[#F0D9DC] bg-white px-4 py-3">
                                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#A85760]">
                                        Resultado / laudo
                                      </p>

                                      <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-6 text-[#56625F]">
                                        {registro
                                          .exame
                                          .resultado}
                                      </p>
                                    </div>
                                  )}

                                  {registro
                                    .exame
                                    .observacoes && (
                                    <div className="mt-3 rounded-xl border border-[#EEE5E6] bg-white px-4 py-3">
                                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8B7477]">
                                        Observações
                                      </p>

                                      <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-6 text-[#56625F]">
                                        {registro
                                          .exame
                                          .observacoes}
                                      </p>
                                    </div>
                                  )}

                                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE5E6] pt-3">
                                    <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8A9693]">
                                      <UserRound
                                        size={13}
                                      />

                                      {registro
                                        .exame
                                        .profissionalNome ||
                                        "Profissional do sistema"}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <EditarExameButton
                                        exameId={registro.exame.id}
                                        pacienteId={paciente.id}
                                        nome={registro.exame.nome}
                                        tipo={registro.exame.tipo}
                                        status={registro.exame.status}
                                        laboratorio={registro.exame.laboratorio}
                                        dataRealizacao={
                                          registro.exame.dataRealizacao
                                            ? String(registro.exame.dataRealizacao)
                                            : null
                                        }
                                        dataResultado={
                                          registro.exame.dataResultado
                                            ? String(registro.exame.dataResultado)
                                            : null
                                        }
                                        resultado={registro.exame.resultado}
                                        observacoes={registro.exame.observacoes}
                                      />

                                      <ExcluirExameButton
                                        exameId={registro.exame.id}
                                        pacienteId={paciente.id}
                                        exameNome={registro.exame.nome}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </details>
                            )}

                            {registro.tipo ===
                              "anotacao" && (
                              <details className="group border-b border-[#E7ECEA] last:border-b-0">
                                <summary className="flex cursor-pointer list-none items-start gap-3 border-l-4 border-l-[#586367] px-4 py-4 transition hover:bg-[#F8F9F9] [&::-webkit-details-marker]:hidden">
                                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBEEEE] text-[#586367]">
                                    <MessageSquareText
                                      size={15}
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                      <span className="text-sm font-black text-[#667175]">
                                        {formatarDataHora(
                                          String(
                                            registro
                                              .anotacao
                                              .createdAt,
                                          ),
                                        )}
                                      </span>

                                      <span className="text-xs font-bold uppercase tracking-[0.10em] text-[#6F7E7A]">
                                        Observação
                                      </span>
                                    </div>

                                    <p className="mt-1 truncate text-lg font-black text-[#2F3A37]">
                                      {
                                        registro
                                          .anotacao
                                          .texto
                                      }
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-[#778480]">
                                      {registro
                                        .anotacao
                                        .criadoPorNome ||
                                        "Usuário do sistema"}
                                    </p>
                                  </div>

                                  <ChevronDown
                                    size={16}
                                    className="mt-2 shrink-0 text-[#8C9995] transition group-open:rotate-180"
                                  />
                                </summary>

                                <div className="border-l-4 border-l-[#586367] bg-[#FAFBFB] px-4 pb-4 pl-[60px]">
                                  <p className="whitespace-pre-wrap text-sm font-medium leading-6 text-[#54605D]">
                                    {
                                      registro
                                        .anotacao
                                        .texto
                                    }
                                  </p>
                                </div>
                              </details>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {atendimentoPendentePatologia && (
        <PacientePatologiaObrigatoria
          pacienteId={
            paciente.id
          }
          pacienteNome={
            paciente.nome
          }
          atendimentoId={
            atendimentoPendentePatologia.id
          }
          tipoAtendimento={
            atendimentoPendentePatologia.tipo
          }
          patologiasReferencia={
            patologiasReferenciaPendentes
          }
        />
      )}
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
  if (titulo === "Anamnese") {
    return (
      <ConteudoClinicoEstruturado
        texto={texto}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-[#E3EAE7] bg-white p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6F8782]">
        {titulo}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-[#4F5D59]">
        {texto}
      </p>
    </div>
  );
}

function ConteudoClinicoEstruturado({
  texto,
}: {
  texto: string;
}) {
  const secoes: {
    titulo: string;
    itens: {
      label: string;
      valor: string;
    }[];
  }[] = [];

  let secaoAtual = {
    titulo: "Anamnese geral",
    itens: [] as {
      label: string;
      valor: string;
    }[],
  };

  const linhas = texto
    .split("\n")
    .map((linha) =>
      linha.trim(),
    )
    .filter(Boolean);

  function salvarSecaoAtual() {
    if (
      secaoAtual.itens.length >
      0
    ) {
      secoes.push(
        secaoAtual,
      );
    }
  }

  for (const linha of linhas) {
    if (
      /^\d+\.\s*ANAMNESE$/i.test(
        linha,
      )
    ) {
      continue;
    }

    const temDoisPontos =
      linha.includes(":");

    const pareceTitulo =
      !temDoisPontos &&
      linha ===
        linha.toUpperCase() &&
      linha.length <= 60;

    if (pareceTitulo) {
      salvarSecaoAtual();

      secaoAtual = {
        titulo: linha,
        itens: [],
      };

      continue;
    }

    if (temDoisPontos) {
      const indice =
        linha.indexOf(":");

      const label =
        linha
          .slice(0, indice)
          .trim();

      const valor =
        linha
          .slice(indice + 1)
          .trim();

      if (valor) {
        secaoAtual.itens.push({
          label,
          valor,
        });
      }

      continue;
    }

    secaoAtual.itens.push({
      label: "Informação",
      valor: linha,
    });
  }

  salvarSecaoAtual();

  if (secoes.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E3EAE7] bg-white p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6F8782]">
          Anamnese
        </p>

        <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-[#4F5D59]">
          {texto}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6F8782]">
          Anamnese
        </p>

        <span className="rounded-full bg-[#EDF4F1] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#648176]">
          {secoes.length}{" "}
          {secoes.length === 1
            ? "grupo"
            : "grupos"}
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {secoes.map(
          (secao, indice) => (
            <section
              key={`${secao.titulo}-${indice}`}
              className="overflow-hidden rounded-2xl border border-[#DFE8E4] bg-white"
            >
              <div className="border-b border-[#E7EEEB] bg-[#F5F8F7] px-4 py-3">
                <h4 className="text-xs font-black uppercase tracking-[0.08em] text-[#35554C]">
                  {secao.titulo}
                </h4>
              </div>

              <div className="divide-y divide-[#EEF2F0]">
                {secao.itens.map(
                  (
                    item,
                    itemIndice,
                  ) => (
                    <div
                      key={`${item.label}-${itemIndice}`}
                      className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.06em] text-[#72847F]">
                        {item.label}
                      </span>

                      <span className="text-sm font-semibold leading-6 text-[#3F4D49]">
                        {item.valor}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </section>
          ),
        )}
      </div>
    </div>
  );
}

function rotuloStatusPatologia(
  status: string,
) {
  switch (status) {
    case "SUSPEITA":
      return "Suspeita";

    case "EM_ACOMPANHAMENTO":
      return "Em acompanhamento";

    case "TRATADA":
      return "Tratada";

    case "SEM_PROBLEMA_CLINICO":
      return "Sem problema clínico";

    default:
      return status;
  }
}

function formatarStatusExame(
  status: string,
) {
  switch (status) {
    case "SOLICITADO":
      return "Solicitado";
    case "REALIZADO":
      return "Realizado";
    case "RESULTADO_DISPONIVEL":
      return "Resultado disponível";
    case "CANCELADO":
      return "Cancelado";
    default:
      return status;
  }
}

function DadoExame({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#F0D9DC] bg-white px-3 py-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#A85760]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-[#46534F]">
        {value}
      </p>
    </div>
  );
}

function DadoVacina({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#E3ECE8] bg-white px-3 py-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A948A]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#3D4B48]">
        {value}
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
