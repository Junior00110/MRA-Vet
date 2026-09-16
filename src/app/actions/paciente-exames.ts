"use server";

import { revalidatePath } from "next/cache";

import { exigirPermissao } from "@/lib/auth/authorization";
import { db } from "@/prisma/db";

export type EstadoExame = {
  ok: boolean;
  mensagem: string;
};

type StatusExame =
  | "SOLICITADO"
  | "REALIZADO"
  | "RESULTADO_DISPONIVEL"
  | "CANCELADO";

const STATUS_VALIDOS = new Set<StatusExame>([
  "SOLICITADO",
  "REALIZADO",
  "RESULTADO_DISPONIVEL",
  "CANCELADO",
]);

function textoFormulario(
  formData: FormData,
  campo: string,
) {
  return String(
    formData.get(campo) ?? "",
  ).trim();
}

function numeroInteiroOpcional(
  valor: FormDataEntryValue | null,
) {
  const texto = String(
    valor ?? "",
  ).trim();

  if (!texto) {
    return null;
  }

  const numero = Number(texto);

  if (
    !Number.isInteger(numero) ||
    numero <= 0
  ) {
    return null;
  }

  return numero;
}

function normalizarData(
  valor: string,
) {
  const texto = valor.trim();

  if (!texto) {
    return null;
  }

  const data = new Date(
    `${texto.slice(0, 10)}T12:00:00.000Z`,
  );

  if (
    Number.isNaN(
      data.getTime(),
    )
  ) {
    return null;
  }

  return data.toISOString();
}

async function revalidarPaciente(
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

export async function adicionarExamePaciente(
  _estadoAnterior: EstadoExame,
  formData: FormData,
): Promise<EstadoExame> {
  const acesso =
    await exigirPermissao(
      "paciente.editar",
    );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const nome =
    textoFormulario(
      formData,
      "nome",
    );

  const tipo =
    textoFormulario(
      formData,
      "tipo",
    );

  const laboratorio =
    textoFormulario(
      formData,
      "laboratorio",
    );

  const resultado =
    textoFormulario(
      formData,
      "resultado",
    );

  const observacoes =
    textoFormulario(
      formData,
      "observacoes",
    );

  const statusTexto =
    textoFormulario(
      formData,
      "status",
    ) || "SOLICITADO";

  const atendimentoTexto =
    textoFormulario(
      formData,
      "atendimentoId",
    );

  const atendimentoId =
    numeroInteiroOpcional(
      formData.get(
        "atendimentoId",
      ),
    );

  const dataSolicitacaoTexto =
    textoFormulario(
      formData,
      "dataSolicitacao",
    );

  const dataRealizacaoTexto =
    textoFormulario(
      formData,
      "dataRealizacao",
    );

  const dataResultadoTexto =
    textoFormulario(
      formData,
      "dataResultado",
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

  if (!nome) {
    return {
      ok: false,
      mensagem:
        "Informe o nome do exame.",
    };
  }

  if (nome.length > 200) {
    return {
      ok: false,
      mensagem:
        "O nome do exame pode ter no máximo 200 caracteres.",
    };
  }

  if (tipo.length > 150) {
    return {
      ok: false,
      mensagem:
        "O tipo do exame pode ter no máximo 150 caracteres.",
    };
  }

  if (
    laboratorio.length >
    200
  ) {
    return {
      ok: false,
      mensagem:
        "O laboratório pode ter no máximo 200 caracteres.",
    };
  }

  if (
    resultado.length >
    10000
  ) {
    return {
      ok: false,
      mensagem:
        "O resultado do exame está muito extenso.",
    };
  }

  if (
    observacoes.length >
    5000
  ) {
    return {
      ok: false,
      mensagem:
        "As observações podem ter no máximo 5000 caracteres.",
    };
  }

  if (
    !STATUS_VALIDOS.has(
      statusTexto as StatusExame,
    )
  ) {
    return {
      ok: false,
      mensagem:
        "Status de exame inválido.",
    };
  }

  if (
    atendimentoTexto &&
    atendimentoId === null
  ) {
    return {
      ok: false,
      mensagem:
        "Atendimento inválido.",
    };
  }

  const dataSolicitacao =
    dataSolicitacaoTexto
      ? normalizarData(
          dataSolicitacaoTexto,
        )
      : new Date().toISOString();

  const dataRealizacao =
    dataRealizacaoTexto
      ? normalizarData(
          dataRealizacaoTexto,
        )
      : null;

  const dataResultado =
    dataResultadoTexto
      ? normalizarData(
          dataResultadoTexto,
        )
      : null;

  if (!dataSolicitacao) {
    return {
      ok: false,
      mensagem:
        "Data de solicitação inválida.",
    };
  }

  if (
    dataRealizacaoTexto &&
    !dataRealizacao
  ) {
    return {
      ok: false,
      mensagem:
        "Data de realização inválida.",
    };
  }

  if (
    dataResultadoTexto &&
    !dataResultado
  ) {
    return {
      ok: false,
      mensagem:
        "Data do resultado inválida.",
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
        "Não é possível registrar exames para um paciente inativo.",
    };
  }

  if (
    atendimentoId !== null
  ) {
    const consultaAtendimento =
      db.sql.public
        .pacienteAtendimento
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

    if (!atendimento) {
      return {
        ok: false,
        mensagem:
          "Atendimento não encontrado.",
      };
    }

    if (
      atendimento.pacienteId !==
      pacienteId
    ) {
      return {
        ok: false,
        mensagem:
          "O atendimento selecionado não pertence a este paciente.",
      };
    }

    if (!atendimento.ativo) {
      return {
        ok: false,
        mensagem:
          "Não é possível vincular o exame a um atendimento inativo.",
      };
    }
  }

  const agora =
    new Date().toISOString();

  const inserirExame =
    db.sql.public.pacienteExame
      .insert([
        {
          nome,

          tipo:
            tipo ||
            null,

          status:
            statusTexto as StatusExame,

          dataSolicitacao,

          dataRealizacao,

          dataResultado,

          laboratorio:
            laboratorio ||
            null,

          resultado:
            resultado ||
            null,

          observacoes:
            observacoes ||
            null,

          profissionalUsuarioId:
            acesso.usuario.id,

          profissionalNome:
            acesso.usuario.nome,

          ativo: true,

          pacienteId,

          atendimentoId,

          updatedAt: agora,
        },
      ])
      .build();

  await runtime.execute(
    inserirExame,
  );

  await revalidarPaciente(
    pacienteId,
    paciente.clienteId,
  );

  return {
    ok: true,
    mensagem:
      "Exame registrado com sucesso.",
  };
}

export async function atualizarExamePaciente(
  _estadoAnterior: EstadoExame,
  formData: FormData,
): Promise<EstadoExame> {
  await exigirPermissao(
    "paciente.editar",
  );

  const exameId = Number(
    formData.get("exameId"),
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  const nome =
    textoFormulario(
      formData,
      "nome",
    );

  const tipo =
    textoFormulario(
      formData,
      "tipo",
    );

  const laboratorio =
    textoFormulario(
      formData,
      "laboratorio",
    );

  const resultadoTexto =
    textoFormulario(
      formData,
      "resultado",
    );

  const observacoes =
    textoFormulario(
      formData,
      "observacoes",
    );

  const statusTexto =
    textoFormulario(
      formData,
      "status",
    );

  const dataRealizacaoTexto =
    textoFormulario(
      formData,
      "dataRealizacao",
    );

  const dataResultadoTexto =
    textoFormulario(
      formData,
      "dataResultado",
    );

  if (
    !Number.isInteger(exameId) ||
    exameId <= 0 ||
    !Number.isInteger(pacienteId) ||
    pacienteId <= 0
  ) {
    return {
      ok: false,
      mensagem:
        "Dados do exame inválidos.",
    };
  }

  if (!nome) {
    return {
      ok: false,
      mensagem:
        "Informe o nome do exame.",
    };
  }

  if (
    !STATUS_VALIDOS.has(
      statusTexto as StatusExame,
    )
  ) {
    return {
      ok: false,
      mensagem:
        "Status de exame inválido.",
    };
  }

  if (nome.length > 200) {
    return {
      ok: false,
      mensagem:
        "O nome do exame pode ter no máximo 200 caracteres.",
    };
  }

  if (tipo.length > 150) {
    return {
      ok: false,
      mensagem:
        "O tipo do exame pode ter no máximo 150 caracteres.",
    };
  }

  if (
    laboratorio.length >
    200
  ) {
    return {
      ok: false,
      mensagem:
        "O laboratório pode ter no máximo 200 caracteres.",
    };
  }

  if (
    resultadoTexto.length >
    10000
  ) {
    return {
      ok: false,
      mensagem:
        "O resultado do exame está muito extenso.",
    };
  }

  if (
    observacoes.length >
    5000
  ) {
    return {
      ok: false,
      mensagem:
        "As observações podem ter no máximo 5000 caracteres.",
    };
  }

  const dataRealizacao =
    dataRealizacaoTexto
      ? normalizarData(
          dataRealizacaoTexto,
        )
      : null;

  const dataResultado =
    dataResultadoTexto
      ? normalizarData(
          dataResultadoTexto,
        )
      : null;

  if (
    dataRealizacaoTexto &&
    !dataRealizacao
  ) {
    return {
      ok: false,
      mensagem:
        "Data de realização inválida.",
    };
  }

  if (
    dataResultadoTexto &&
    !dataResultado
  ) {
    return {
      ok: false,
      mensagem:
        "Data do resultado inválida.",
    };
  }

  const runtime =
    db.runtime();

  const consultaExame =
    db.sql.public.pacienteExame
      .select(
        "id",
        "pacienteId",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          exameId,
        ),
      )
      .limit(1)
      .build();

  const resultadoConsultaExame =
    await runtime.query(
      consultaExame,
    );

  const exame =
    resultadoConsultaExame[0];

  if (
    !exame ||
    exame.pacienteId !==
      pacienteId
  ) {
    return {
      ok: false,
      mensagem:
        "Exame não encontrado.",
    };
  }

  if (!exame.ativo) {
    return {
      ok: false,
      mensagem:
        "Este exame está inativo.",
    };
  }

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

  if (!paciente) {
    return {
      ok: false,
      mensagem:
        "Paciente não encontrado.",
    };
  }

  const agora =
    new Date().toISOString();

  let dataResultadoFinal =
    dataResultado;

  if (
    statusTexto ===
      "RESULTADO_DISPONIVEL" &&
    !dataResultadoFinal
  ) {
    dataResultadoFinal =
      agora;
  }

  let dataRealizacaoFinal =
    dataRealizacao;

  if (
    (
      statusTexto ===
        "REALIZADO" ||
      statusTexto ===
        "RESULTADO_DISPONIVEL"
    ) &&
    !dataRealizacaoFinal
  ) {
    dataRealizacaoFinal =
      agora;
  }

  const atualizarExame =
    db.sql.public.pacienteExame
      .update({
        nome,

        tipo:
          tipo ||
          null,

        status:
          statusTexto as StatusExame,

        dataRealizacao:
          dataRealizacaoFinal,

        dataResultado:
          dataResultadoFinal,

        laboratorio:
          laboratorio ||
          null,

        resultado:
          resultadoTexto ||
          null,

        observacoes:
          observacoes ||
          null,

        updatedAt:
          agora,
      })
      .where((f, fns) =>
        fns.and(
          fns.eq(
            f.id,
            exameId,
          ),
          fns.eq(
            f.pacienteId,
            pacienteId,
          ),
        ),
      )
      .build();

  await runtime.execute(
    atualizarExame,
  );

  await revalidarPaciente(
    pacienteId,
    paciente.clienteId,
  );

  return {
    ok: true,
    mensagem:
      "Exame atualizado com sucesso.",
  };
}

export async function removerExamePaciente(
  formData: FormData,
): Promise<void> {
  await exigirPermissao(
    "paciente.editar",
  );

  const exameId = Number(
    formData.get("exameId"),
  );

  const pacienteId = Number(
    formData.get("pacienteId"),
  );

  if (
    !Number.isInteger(exameId) ||
    exameId <= 0 ||
    !Number.isInteger(pacienteId) ||
    pacienteId <= 0
  ) {
    throw new Error(
      "Dados inválidos para excluir o exame.",
    );
  }

  const runtime =
    db.runtime();

  const consultaExame =
    db.sql.public.pacienteExame
      .select(
        "id",
        "pacienteId",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.id,
          exameId,
        ),
      )
      .limit(1)
      .build();

  const resultadoExame =
    await runtime.query(
      consultaExame,
    );

  const exame =
    resultadoExame[0];

  if (
    !exame ||
    exame.pacienteId !==
      pacienteId
  ) {
    throw new Error(
      "Exame não encontrado.",
    );
  }

  if (!exame.ativo) {
    return;
  }

  const agora =
    new Date().toISOString();

  const desativarExame =
    db.sql.public.pacienteExame
      .update({
        ativo: false,
        updatedAt: agora,
      })
      .where((f, fns) =>
        fns.and(
          fns.eq(
            f.id,
            exameId,
          ),
          fns.eq(
            f.pacienteId,
            pacienteId,
          ),
        ),
      )
      .build();

  await runtime.execute(
    desativarExame,
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

  await revalidarPaciente(
    pacienteId,
    paciente?.clienteId,
  );
}