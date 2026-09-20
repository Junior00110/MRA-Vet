"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

export type EstadoAtendimento = {
  ok: boolean;
  mensagem: string;
  atendimentoId?: number;
  requerPatologia?: boolean;
};

function textoCampo(
  formData: FormData,
  nome: string,
) {
  return String(
    formData.get(nome) ??
      "",
  ).trim();
}

async function buscarPaciente(
  pacienteId: number,
) {
  const runtime =
    db.runtime();

  const consultaPaciente =
    db.sql.public.paciente
      .select(
        "id",
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

  return {
    runtime,
    paciente:
      resultadoPaciente[0],
  };
}

function revalidarPaciente(
  pacienteId: number,
  clienteId:
    | number
    | null
    | undefined,
) {
  revalidatePath(
    `/pacientes/${pacienteId}`,
  );

  if (
    clienteId !== null &&
    clienteId !== undefined
  ) {
    revalidatePath(
      `/clientes/${clienteId}`,
    );
  }
}

export async function adicionarAtendimentoPaciente(
  _estadoAnterior: EstadoAtendimento,
  formData: FormData,
): Promise<EstadoAtendimento> {
  const acesso =
    await exigirPermissao(
      "paciente.editar",
    );

  const pacienteId =
    Number(
      formData.get(
        "pacienteId",
      ),
    );

  const motivoConsulta =
    textoCampo(
      formData,
      "motivoConsulta",
    );

  const anamnese =
    textoCampo(
      formData,
      "anamnese",
    );

  const exameClinico =
    textoCampo(
      formData,
      "exameClinico",
    );

  const diagnosticoSuspeita =
    textoCampo(
      formData,
      "diagnosticoSuspeita",
    );

  const conduta =
    textoCampo(
      formData,
      "conduta",
    );

  const observacoes =
    textoCampo(
      formData,
      "observacoes",
    );

  if (
    !Number.isInteger(
      pacienteId,
    ) ||
    pacienteId <= 0
  ) {
    return {
      ok: false,
      mensagem:
        "Paciente inválido.",
    };
  }

  if (
    !motivoConsulta &&
    !anamnese &&
    !exameClinico &&
    !diagnosticoSuspeita &&
    !conduta &&
    !observacoes
  ) {
    return {
      ok: false,
      mensagem:
        "Preencha pelo menos uma informação do atendimento.",
    };
  }

  const {
    runtime,
    paciente,
  } = await buscarPaciente(
    pacienteId,
  );

  if (!paciente) {
    return {
      ok: false,
      mensagem:
        "Paciente não encontrado.",
    };
  }

  if (!paciente.ativo) {
    return {
      ok: false,
      mensagem:
        "Não é possível registrar atendimento para um paciente inativo.",
    };
  }

  const agora =
    new Date().toISOString();

  const inserirAtendimento =
    db.sql.public.pacienteAtendimento
      .insert([
        {
          tipo:
            "CONSULTA",

          statusAtendimento:
            "AGUARDANDO_PATOLOGIA",

          pacienteId,

          atendimentoOrigemId:
            null,

          motivoConsulta:
            motivoConsulta ||
            null,

          anamnese:
            anamnese ||
            null,

          exameClinico:
            exameClinico ||
            null,

          diagnosticoSuspeita:
            diagnosticoSuspeita ||
            null,

          conduta:
            conduta ||
            null,

          observacoes:
            observacoes ||
            null,

          evolucao:
            null,

          dataAtendimento:
            agora,

          profissionalUsuarioId:
            acesso.usuario.id,

          profissionalNome:
            acesso.usuario.nome,

          ativo: true,

          updatedAt: agora,
        },
      ])
      .returning("id")
      .build();

  const resultadoInsercao =
    await runtime.query(
      inserirAtendimento,
    );

  const atendimentoCriado =
    resultadoInsercao[0];

  if (!atendimentoCriado) {
    return {
      ok: false,
      mensagem:
        "O atendimento foi salvo, mas não foi possível confirmar o identificador criado.",
    };
  }

  revalidarPaciente(
    pacienteId,
    paciente.clienteId,
  );

  return {
    ok: true,
    mensagem:
      "Atendimento registrado. Agora informe a patologia para concluir.",
    atendimentoId:
      atendimentoCriado.id,
    requerPatologia: true,
  };
}

export async function adicionarRetornoPaciente(
  _estadoAnterior: EstadoAtendimento,
  formData: FormData,
): Promise<EstadoAtendimento> {
  const acesso =
    await exigirPermissao(
      "paciente.editar",
    );

  const pacienteId =
    Number(
      formData.get(
        "pacienteId",
      ),
    );

  const atendimentoOrigemId =
    Number(
      formData.get(
        "atendimentoOrigemId",
      ),
    );

  const evolucao =
    textoCampo(
      formData,
      "evolucao",
    );

  const exameClinico =
    textoCampo(
      formData,
      "exameClinico",
    );

  const diagnosticoSuspeita =
    textoCampo(
      formData,
      "diagnosticoSuspeita",
    );

  const conduta =
    textoCampo(
      formData,
      "conduta",
    );

  const observacoes =
    textoCampo(
      formData,
      "observacoes",
    );

  if (
    !Number.isInteger(
      pacienteId,
    ) ||
    pacienteId <= 0 ||
    !Number.isInteger(
      atendimentoOrigemId,
    ) ||
    atendimentoOrigemId <= 0
  ) {
    return {
      ok: false,
      mensagem:
        "Dados inválidos para registrar o retorno.",
    };
  }

  if (
    !evolucao &&
    !exameClinico &&
    !diagnosticoSuspeita &&
    !conduta &&
    !observacoes
  ) {
    return {
      ok: false,
      mensagem:
        "Preencha pelo menos uma informação do retorno.",
    };
  }

  const {
    runtime,
    paciente,
  } = await buscarPaciente(
    pacienteId,
  );

  if (!paciente) {
    return {
      ok: false,
      mensagem:
        "Paciente não encontrado.",
    };
  }

  if (!paciente.ativo) {
    return {
      ok: false,
      mensagem:
        "Não é possível registrar retorno para um paciente inativo.",
    };
  }

  const consultaAtendimentoOrigem =
    db.sql.public.pacienteAtendimento
      .select(
        "id",
        "pacienteId",
        "tipo",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          atendimentoOrigemId,
        ),
      )
      .limit(1)
      .build();

  const resultadoAtendimentoOrigem =
    await runtime.query(
      consultaAtendimentoOrigem,
    );

  const atendimentoOrigem =
    resultadoAtendimentoOrigem[0];

  if (
    !atendimentoOrigem ||
    !atendimentoOrigem.ativo ||
    atendimentoOrigem.pacienteId !==
      pacienteId
  ) {
    return {
      ok: false,
      mensagem:
        "A consulta de origem não foi encontrada.",
    };
  }

  if (
    atendimentoOrigem.tipo !==
    "CONSULTA"
  ) {
    return {
      ok: false,
      mensagem:
        "O retorno deve ser vinculado à consulta inicial.",
    };
  }

  const agora =
    new Date().toISOString();

  const inserirRetorno =
    db.sql.public.pacienteAtendimento
      .insert([
        {
          tipo:
            "RETORNO",

          statusAtendimento:
            "AGUARDANDO_PATOLOGIA",

          pacienteId,

          atendimentoOrigemId,

          motivoConsulta:
            null,

          anamnese:
            null,

          exameClinico:
            exameClinico ||
            null,

          diagnosticoSuspeita:
            diagnosticoSuspeita ||
            null,

          conduta:
            conduta ||
            null,

          observacoes:
            observacoes ||
            null,

          evolucao:
            evolucao ||
            null,

          dataAtendimento:
            agora,

          profissionalUsuarioId:
            acesso.usuario.id,

          profissionalNome:
            acesso.usuario.nome,

          ativo: true,

          updatedAt: agora,
        },
      ])
      .returning("id")
      .build();

  const resultadoInsercao =
    await runtime.query(
      inserirRetorno,
    );

  const retornoCriado =
    resultadoInsercao[0];

  if (!retornoCriado) {
    return {
      ok: false,
      mensagem:
        "O retorno foi salvo, mas não foi possível confirmar o identificador criado.",
    };
  }

  revalidarPaciente(
    pacienteId,
    paciente.clienteId,
  );

  return {
    ok: true,
    mensagem:
      "Retorno registrado. Agora informe a patologia para concluir.",
    atendimentoId:
      retornoCriado.id,
    requerPatologia: true,
  };
}

/*
 * EXCLUSÃO LÓGICA DO ATENDIMENTO
 *
 * O registro continua no banco,
 * porém deixa de aparecer no
 * histórico normal do paciente.
 */
export async function removerAtendimentoPaciente(
  formData: FormData,
): Promise<void> {
  await exigirPermissao(
    "paciente.editar",
  );

  const atendimentoId =
    Number(
      formData.get(
        "atendimentoId",
      ),
    );

  const pacienteId =
    Number(
      formData.get(
        "pacienteId",
      ),
    );

  if (
    !Number.isInteger(
      atendimentoId,
    ) ||
    atendimentoId <= 0 ||
    !Number.isInteger(
      pacienteId,
    ) ||
    pacienteId <= 0
  ) {
    throw new Error(
      "Dados inválidos para excluir o atendimento.",
    );
  }

  const runtime =
    db.runtime();

  const consultaAtendimento =
    db.sql.public.pacienteAtendimento
      .select(
        "id",
        "pacienteId",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          atendimentoId,
        ),
      )
      .limit(1)
      .build();

  const resultadoAtendimento =
    await runtime.query(
      consultaAtendimento,
    );

  const atendimento =
    resultadoAtendimento[0];

  if (
    !atendimento ||
    atendimento.pacienteId !==
      pacienteId
  ) {
    throw new Error(
      "Atendimento não encontrado.",
    );
  }

  const desativarAtendimento =
    db.sql.public.pacienteAtendimento
      .update({
        ativo: false,
        updatedAt:
          new Date().toISOString(),
      })
      .where((f, fns) =>
        fns.eq(
          f.id,
          atendimentoId,
        ),
      )
      .build();

  await runtime.execute(
    desativarAtendimento,
  );

  revalidatePath(
    `/pacientes/${pacienteId}`,
  );
}
