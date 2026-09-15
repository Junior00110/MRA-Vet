"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

export type EstadoAtendimento = {
  ok: boolean;
  mensagem: string;
};

export async function adicionarAtendimentoPaciente(
  _estadoAnterior: EstadoAtendimento,
  formData: FormData,
): Promise<EstadoAtendimento> {
  const acesso =
    await exigirPermissao(
      "paciente.editar",
    );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const motivoConsulta = String(
    formData.get("motivoConsulta") ??
      "",
  ).trim();

  const anamnese = String(
    formData.get("anamnese") ??
      "",
  ).trim();

  const exameClinico = String(
    formData.get("exameClinico") ??
      "",
  ).trim();

  const diagnosticoSuspeita =
    String(
      formData.get(
        "diagnosticoSuspeita",
      ) ?? "",
    ).trim();

  const conduta = String(
    formData.get("conduta") ??
      "",
  ).trim();

  const observacoes = String(
    formData.get("observacoes") ??
      "",
  ).trim();

  if (
    !Number.isInteger(pacienteId) ||
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

  const paciente =
    resultadoPaciente[0];

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
          pacienteId,

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
      .build();

  await runtime.execute(
    inserirAtendimento,
  );

  revalidatePath(
    `/pacientes/${pacienteId}`,
  );

  if (
    paciente.clienteId !== null
  ) {
    revalidatePath(
      `/clientes/${paciente.clienteId}`,
    );
  }

  return {
    ok: true,
    mensagem:
      "Atendimento salvo com sucesso.",
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

  const atendimentoId = Number(
    formData.get("atendimentoId"),
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
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

  /*
   * CONFERE SE O ATENDIMENTO
   * REALMENTE PERTENCE AO PACIENTE
   */
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

  /*
   * NÃO APAGA DO BANCO.
   * SOMENTE MARCA COMO INATIVO.
   */
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