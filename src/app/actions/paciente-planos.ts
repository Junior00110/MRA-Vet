"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

export type EstadoPlano = {
  ok: boolean;
  mensagem: string;
};

export async function adicionarPlanoPaciente(
  _estadoAnterior: EstadoPlano,
  formData: FormData,
): Promise<EstadoPlano> {
  await exigirPermissao(
    "paciente.editar",
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const clienteId = Number(
    formData.get("clienteId"),
  );

  const nome = String(
    formData.get("nome") ?? "",
  ).trim();

  const numeroCarteirinha = String(
    formData.get(
      "numeroCarteirinha",
    ) ?? "",
  ).trim();

  const observacoes = String(
    formData.get(
      "observacoes",
    ) ?? "",
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
    !Number.isInteger(clienteId) ||
    clienteId <= 0
  ) {
    return {
      ok: false,
      mensagem:
        "Cliente inválido.",
    };
  }

  if (!nome) {
    return {
      ok: false,
      mensagem:
        "Informe o nome do plano.",
    };
  }

  if (nome.length > 120) {
    return {
      ok: false,
      mensagem:
        "O nome do plano é muito grande.",
    };
  }

  if (
    numeroCarteirinha.length >
    120
  ) {
    return {
      ok: false,
      mensagem:
        "O número da carteirinha é muito grande.",
    };
  }

  if (
    observacoes.length >
    1500
  ) {
    return {
      ok: false,
      mensagem:
        "As observações podem ter no máximo 1500 caracteres.",
    };
  }

  const runtime =
    db.runtime();

  /*
   * CONFERE O PACIENTE
   */
  const consultaPaciente =
    db.sql.public.paciente
      .select(
        "id",
        "clienteId",
        "ativo",
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

  if (
    paciente.clienteId !==
    clienteId
  ) {
    return {
      ok: false,
      mensagem:
        "Este paciente não pertence ao tutor informado.",
    };
  }

  const agora =
    new Date().toISOString();

  /*
   * DESATIVA QUALQUER PLANO
   * ATUAL DO PACIENTE.
   *
   * Assim só existe um plano
   * ativo por vez.
   */
  const desativarPlanos =
    db.sql.public.pacientePlano
      .update({
        ativo: false,
        updatedAt: agora,
      })
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
      .build();

  await runtime.execute(
    desativarPlanos,
  );

  /*
   * CADASTRA O NOVO PLANO
   */
  const inserirPlano =
    db.sql.public.pacientePlano
      .insert([
        {
          nome,

          numeroCarteirinha:
            numeroCarteirinha ||
            null,

          observacoes:
            observacoes ||
            null,

          ativo: true,

          pacienteId,

          updatedAt: agora,
        },
      ])
      .build();

  await runtime.execute(
    inserirPlano,
  );

  revalidatePath(
    `/clientes/${clienteId}`,
  );

  return {
    ok: true,
    mensagem:
      "Plano cadastrado com sucesso.",
  };
}

/*
 * EXCLUIR PLANO
 *
 * Não apagamos o registro.
 * Marcamos o plano como inativo
 * para preservar o histórico.
 */
export async function removerPlanoPaciente(
  formData: FormData,
): Promise<void> {
  await exigirPermissao(
    "paciente.editar",
  );

  const planoId = Number(
    formData.get("planoId"),
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const clienteId = Number(
    formData.get("clienteId"),
  );

  if (
    !Number.isInteger(planoId) ||
    planoId <= 0 ||
    !Number.isInteger(pacienteId) ||
    pacienteId <= 0 ||
    !Number.isInteger(clienteId) ||
    clienteId <= 0
  ) {
    throw new Error(
      "Dados inválidos para excluir o plano.",
    );
  }

  const runtime =
    db.runtime();

  /*
   * CONFERE O PLANO
   */
  const consultaPlano =
    db.sql.public.pacientePlano
      .select(
        "id",
        "pacienteId",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          planoId,
        ),
      )
      .limit(1)
      .build();

  const resultadoPlano =
    await runtime.query(
      consultaPlano,
    );

  const plano =
    resultadoPlano[0];

  if (
    !plano ||
    plano.pacienteId !==
      pacienteId
  ) {
    throw new Error(
      "Plano não encontrado.",
    );
  }

  /*
   * CONFERE SE O PACIENTE
   * PERTENCE AO CLIENTE ABERTO.
   */
  const consultaPaciente =
    db.sql.public.paciente
      .select(
        "id",
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

  if (
    !paciente ||
    paciente.clienteId !==
      clienteId
  ) {
    throw new Error(
      "Paciente inválido.",
    );
  }

  /*
   * REMOÇÃO LÓGICA
   */
  const desativarPlano =
    db.sql.public.pacientePlano
      .update({
        ativo: false,
        updatedAt:
          new Date().toISOString(),
      })
      .where((f, fns) =>
        fns.eq(
          f.id,
          planoId,
        ),
      )
      .build();

  await runtime.execute(
    desativarPlano,
  );

  revalidatePath(
    `/clientes/${clienteId}`,
  );
}