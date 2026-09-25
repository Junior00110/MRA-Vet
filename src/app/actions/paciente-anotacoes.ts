"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

export type EstadoAnotacao = {
  ok: boolean;
  mensagem: string;
};

export async function adicionarAnotacaoPaciente(
  _estadoAnterior: EstadoAnotacao,
  formData: FormData,
): Promise<EstadoAnotacao> {
  const acesso = await exigirPermissao(
    "paciente.editar",
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const clienteId = Number(
    formData.get("clienteId"),
  );

  const texto = String(
    formData.get("texto") ?? "",
  ).trim();

  if (
    !Number.isInteger(pacienteId) ||
    pacienteId <= 0
  ) {
    return {
      ok: false,
      mensagem: "Paciente inválido.",
    };
  }

  if (
    !Number.isInteger(clienteId) ||
    clienteId <= 0
  ) {
    return {
      ok: false,
      mensagem: "Cliente inválido.",
    };
  }

  if (!texto) {
    return {
      ok: false,
      mensagem: "Digite uma anotação.",
    };
  }

  if (texto.length > 2000) {
    return {
      ok: false,
      mensagem:
        "A anotação pode ter no máximo 2000 caracteres.",
    };
  }

  const runtime = db.runtime();

  const planoPaciente =
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
      planoPaciente,
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
        "Este paciente não pertence a este tutor.",
    };
  }

  const planoInsert =
    db.sql.public.pacienteAnotacao
      .insert([
        {
          texto,
          pacienteId,
          criadoPorUsuarioId:
            acesso.usuario.id,
          criadoPorNome:
            acesso.usuario.nome,
        },
      ])
      .build();

  await runtime.execute(
    planoInsert,
  );

  revalidatePath(
    `/clientes/${clienteId}`,
  );

  return {
    ok: true,
    mensagem:
      "Anotação salva com sucesso.",
  };
}

/*
 * EXCLUSÃO LÓGICA DA ANOTAÇÃO
 *
 * A anotação não é apagada do banco.
 * Ela apenas passa a ficar inativa,
 * preservando o histórico do paciente.
 */

export async function atualizarAnotacaoPaciente(
  _estadoAnterior: EstadoAnotacao,
  formData: FormData,
): Promise<EstadoAnotacao> {
  await exigirPermissao(
    "paciente.editar",
  );

  const anotacaoId = Number(
    formData.get("anotacaoId"),
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const clienteId = Number(
    formData.get("clienteId"),
  );

  const texto = String(
    formData.get("texto") ?? "",
  ).trim();

  if (
    !Number.isInteger(anotacaoId) ||
    anotacaoId <= 0 ||
    !Number.isInteger(pacienteId) ||
    pacienteId <= 0 ||
    !Number.isInteger(clienteId) ||
    clienteId <= 0
  ) {
    return {
      ok: false,
      mensagem:
        "Dados inválidos para editar a anotação.",
    };
  }

  if (!texto) {
    return {
      ok: false,
      mensagem:
        "Digite uma anotação.",
    };
  }

  if (texto.length > 2000) {
    return {
      ok: false,
      mensagem:
        "A anotação pode ter no máximo 2000 caracteres.",
    };
  }

  const runtime = db.runtime();

  const planoPaciente =
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
      planoPaciente,
    );

  const paciente =
    resultadoPaciente[0];

  if (
    !paciente ||
    paciente.clienteId !==
      clienteId
  ) {
    return {
      ok: false,
      mensagem:
        "Paciente inválido.",
    };
  }

  const planoAnotacao =
    db.sql.public.pacienteAnotacao
      .select(
        "id",
        "pacienteId",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          anotacaoId,
        ),
      )
      .limit(1)
      .build();

  const resultadoAnotacao =
    await runtime.query(
      planoAnotacao,
    );

  const anotacao =
    resultadoAnotacao[0];

  if (
    !anotacao ||
    anotacao.pacienteId !==
      pacienteId ||
    !anotacao.ativo
  ) {
    return {
      ok: false,
      mensagem:
        "Anotação não encontrada.",
    };
  }

  const planoAtualizar =
    db.sql.public.pacienteAnotacao
      .update({
        texto,
      })
      .where((f, fns) =>
        fns.eq(
          f.id,
          anotacaoId,
        ),
      )
      .build();

  await runtime.execute(
    planoAtualizar,
  );

  revalidatePath(
    `/clientes/${clienteId}`,
  );

  revalidatePath(
    `/pacientes/${pacienteId}`,
  );

  return {
    ok: true,
    mensagem:
      "Anotação atualizada com sucesso.",
  };
}

export async function removerAnotacaoPaciente(
  formData: FormData,
) {
  await exigirPermissao(
    "paciente.editar",
  );

  const anotacaoId = Number(
    formData.get("anotacaoId"),
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const clienteId = Number(
    formData.get("clienteId"),
  );

  if (
    !Number.isInteger(anotacaoId) ||
    anotacaoId <= 0 ||
    !Number.isInteger(pacienteId) ||
    pacienteId <= 0 ||
    !Number.isInteger(clienteId) ||
    clienteId <= 0
  ) {
    throw new Error(
      "Dados inválidos para remover anotação.",
    );
  }

  const runtime = db.runtime();

  /*
   * Confere se a anotação existe
   * e pertence ao paciente informado.
   */
  const planoAnotacao =
    db.sql.public.pacienteAnotacao
      .select(
        "id",
        "pacienteId",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          anotacaoId,
        ),
      )
      .limit(1)
      .build();

  const resultadoAnotacao =
    await runtime.query(
      planoAnotacao,
    );

  const anotacao =
    resultadoAnotacao[0];

  if (
    !anotacao ||
    anotacao.pacienteId !==
      pacienteId
  ) {
    throw new Error(
      "Anotação não encontrada.",
    );
  }

  /*
   * Confere se o paciente pertence
   * realmente ao cliente aberto.
   */
  const planoPaciente =
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
      planoPaciente,
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
   * Não apaga a anotação.
   * Apenas marca como inativa.
   */
  if (anotacao.ativo) {
    const planoDesativar =
      db.sql.public.pacienteAnotacao
        .update({
          ativo: false,
        })
        .where((f, fns) =>
          fns.eq(
            f.id,
            anotacaoId,
          ),
        )
        .build();

    await runtime.execute(
      planoDesativar,
    );
  }

  revalidatePath(
    `/clientes/${clienteId}`,
  );

  revalidatePath(
    `/pacientes/${pacienteId}`,
  );
}