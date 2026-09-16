"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

export type EstadoVacina = {
  ok: boolean;
  mensagem: string;
};

export async function adicionarVacinaPaciente(
  _estadoAnterior: EstadoVacina,
  formData: FormData,
): Promise<EstadoVacina> {
  const acesso =
    await exigirPermissao(
      "paciente.editar",
    );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const nome = String(
    formData.get("nome") ?? "",
  ).trim();

  const dose = String(
    formData.get("dose") ?? "",
  ).trim();

  const lote = String(
    formData.get("lote") ?? "",
  ).trim();

  const fabricante = String(
    formData.get("fabricante") ?? "",
  ).trim();

  const observacoes = String(
    formData.get("observacoes") ?? "",
  ).trim();

  const dataAplicacaoTexto =
    String(
      formData.get("dataAplicacao") ??
        "",
    ).trim();

  const validadeTexto = String(
    formData.get("validade") ?? "",
  ).trim();

  const proximaDoseTexto = String(
    formData.get("proximaDose") ??
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

  if (!nome) {
    return {
      ok: false,
      mensagem:
        "Informe a vacina aplicada.",
    };
  }

  if (nome.length > 120) {
    return {
      ok: false,
      mensagem:
        "O nome da vacina pode ter no máximo 120 caracteres.",
    };
  }

  if (dose.length > 80) {
    return {
      ok: false,
      mensagem:
        "A dose pode ter no máximo 80 caracteres.",
    };
  }

  if (lote.length > 100) {
    return {
      ok: false,
      mensagem:
        "O lote pode ter no máximo 100 caracteres.",
    };
  }

  if (fabricante.length > 120) {
    return {
      ok: false,
      mensagem:
        "O fabricante pode ter no máximo 120 caracteres.",
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

  let dataAplicacao =
    new Date().toISOString();

  if (dataAplicacaoTexto) {
    const data =
      new Date(
        `${dataAplicacaoTexto}T12:00:00`,
      );

    if (
      Number.isNaN(
        data.getTime(),
      )
    ) {
      return {
        ok: false,
        mensagem:
          "Data de aplicação inválida.",
      };
    }

    dataAplicacao =
      data.toISOString();
  }

  if (
    validadeTexto &&
    Number.isNaN(
      new Date(
        `${validadeTexto}T12:00:00`,
      ).getTime(),
    )
  ) {
    return {
      ok: false,
      mensagem:
        "Data de validade inválida.",
    };
  }

  if (
    proximaDoseTexto &&
    Number.isNaN(
      new Date(
        `${proximaDoseTexto}T12:00:00`,
      ).getTime(),
    )
  ) {
    return {
      ok: false,
      mensagem:
        "Data da próxima dose inválida.",
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
        "Não é possível registrar vacinação para um paciente inativo.",
    };
  }

  const agora =
    new Date().toISOString();

  const inserirVacina =
    db.sql.public.pacienteVacina
      .insert([
        {
          nome,

          dose:
            dose ||
            null,

          lote:
            lote ||
            null,

          fabricante:
            fabricante ||
            null,

          observacoes:
            observacoes ||
            null,

          dataAplicacao,

          validade:
            validadeTexto ||
            null,

          proximaDose:
            proximaDoseTexto ||
            null,

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
    inserirVacina,
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
      "Vacina registrada com sucesso.",
  };
}

export async function removerVacinaPaciente(
  formData: FormData,
): Promise<void> {
  await exigirPermissao(
    "paciente.editar",
  );

  const vacinaId = Number(
    formData.get("vacinaId"),
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  if (
    !Number.isInteger(vacinaId) ||
    vacinaId <= 0 ||
    !Number.isInteger(pacienteId) ||
    pacienteId <= 0
  ) {
    throw new Error(
      "Dados inválidos para excluir a vacinação.",
    );
  }

  const runtime =
    db.runtime();

  const consultaVacina =
    db.sql.public.pacienteVacina
      .select(
        "id",
        "pacienteId",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          vacinaId,
        ),
      )
      .limit(1)
      .build();

  const resultadoVacina =
    await runtime.query(
      consultaVacina,
    );

  const vacina =
    resultadoVacina[0];

  if (
    !vacina ||
    vacina.pacienteId !==
      pacienteId
  ) {
    throw new Error(
      "Vacinação não encontrada.",
    );
  }

  const agora =
    new Date().toISOString();

  const desativarVacina =
    db.sql.public.pacienteVacina
      .update({
        ativo: false,
        updatedAt: agora,
      })
      .where((f, fns) =>
        fns.eq(
          f.id,
          vacinaId,
        ),
      )
      .build();

  await runtime.execute(
    desativarVacina,
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