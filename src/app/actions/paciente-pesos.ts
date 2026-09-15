"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

export type EstadoPeso = {
  ok: boolean;
  mensagem: string;
};

export async function adicionarPesoPaciente(
  _estadoAnterior: EstadoPeso,
  formData: FormData,
): Promise<EstadoPeso> {
  const acesso =
    await exigirPermissao(
      "paciente.editar",
    );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const pesoTexto = String(
    formData.get("peso") ?? "",
  )
    .trim()
    .replace(",", ".");

  const observacoes = String(
    formData.get("observacoes") ?? "",
  ).trim();

  const peso = Number(
    pesoTexto,
  );

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
    !Number.isFinite(peso) ||
    peso <= 0
  ) {
    return {
      ok: false,
      mensagem:
        "Informe um peso válido.",
    };
  }

  if (peso > 500) {
    return {
      ok: false,
      mensagem:
        "O peso informado parece inválido.",
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
        "Não é possível registrar peso para um paciente inativo.",
    };
  }

  const agora =
    new Date().toISOString();

  const inserirPeso =
    db.sql.public.pacientePeso
      .insert([
        {
          peso,

          observacoes:
            observacoes ||
            null,

          dataPesagem:
            agora,

          profissionalUsuarioId:
            acesso.usuario.id,

          profissionalNome:
            acesso.usuario.nome,

          ativo: true,

          pacienteId,

          updatedAt: agora,
        },
      ])
      .build();

  await runtime.execute(
    inserirPeso,
  );

  const atualizarPaciente =
    db.sql.public.paciente
      .update({
        peso,
        updatedAt: agora,
      })
      .where((f, fns) =>
        fns.eq(
          f.id,
          pacienteId,
        ),
      )
      .build();

  await runtime.execute(
    atualizarPaciente,
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
      "Peso registrado com sucesso.",
  };
}

export async function removerPesoPaciente(
  formData: FormData,
): Promise<void> {
  await exigirPermissao(
    "paciente.editar",
  );

  const pesoId = Number(
    formData.get("pesoId"),
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  if (
    !Number.isInteger(pesoId) ||
    pesoId <= 0 ||
    !Number.isInteger(pacienteId) ||
    pacienteId <= 0
  ) {
    throw new Error(
      "Dados inválidos para excluir a pesagem.",
    );
  }

  const runtime =
    db.runtime();

  const consultaPeso =
    db.sql.public.pacientePeso
      .select(
        "id",
        "pacienteId",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          pesoId,
        ),
      )
      .limit(1)
      .build();

  const resultadoPeso =
    await runtime.query(
      consultaPeso,
    );

  const pesagem =
    resultadoPeso[0];

  if (
    !pesagem ||
    pesagem.pacienteId !==
      pacienteId
  ) {
    throw new Error(
      "Pesagem não encontrada.",
    );
  }

  const agora =
    new Date().toISOString();

  const desativarPeso =
    db.sql.public.pacientePeso
      .update({
        ativo: false,
        updatedAt: agora,
      })
      .where((f, fns) =>
        fns.eq(
          f.id,
          pesoId,
        ),
      )
      .build();

  await runtime.execute(
    desativarPeso,
  );

  const consultaUltimoPeso =
    db.sql.public.pacientePeso
      .select(
        "peso",
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
      .limit(1)
      .build();

  const resultadoUltimoPeso =
    await runtime.query(
      consultaUltimoPeso,
    );

  const ultimoPeso =
    resultadoUltimoPeso[0];

  const atualizarPaciente =
    db.sql.public.paciente
      .update({
        peso:
          ultimoPeso?.peso ??
          null,
        updatedAt: agora,
      })
      .where((f, fns) =>
        fns.eq(
          f.id,
          pacienteId,
        ),
      )
      .build();

  await runtime.execute(
    atualizarPaciente,
  );

  const consultaPaciente =
    db.sql.public.paciente
      .select(
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

  revalidatePath(
    `/pacientes/${pacienteId}`,
  );

  if (
    paciente?.clienteId !== null &&
    paciente?.clienteId !== undefined
  ) {
    revalidatePath(
      `/clientes/${paciente.clienteId}`,
    );
  }
}
