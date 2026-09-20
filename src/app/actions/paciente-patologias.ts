"use server";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";

export type EstadoPatologia = {
  ok: boolean;
  mensagem: string;
};

type StatusPatologiaValor =
  | "SUSPEITA"
  | "EM_ACOMPANHAMENTO"
  | "TRATADA"
  | "SEM_PROBLEMA_CLINICO";

type EspecieCatalogo =
  | "CANINO"
  | "FELINO"
  | "AMBOS";

const STATUS_VALIDOS =
  new Set<StatusPatologiaValor>([
    "SUSPEITA",
    "EM_ACOMPANHAMENTO",
    "TRATADA",
    "SEM_PROBLEMA_CLINICO",
  ]);

function statusPatologiaValido(
  valor: string,
): valor is StatusPatologiaValor {
  return STATUS_VALIDOS.has(
    valor as StatusPatologiaValor,
  );
}

function textoCampo(
  formData: FormData,
  nome: string,
) {
  return String(
    formData.get(nome) ?? "",
  ).trim();
}

function normalizarTexto(
  valor: string,
) {
  return valor
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLocaleLowerCase(
      "pt-BR",
    )
    .trim();
}

function especieDoPaciente(
  especie:
    | string
    | null,
):
  | "CANINO"
  | "FELINO"
  | null {
  const valor =
    normalizarTexto(
      especie ?? "",
    );

  if (
    valor.includes("cao") ||
    valor.includes("canino") ||
    valor.includes("cachorro") ||
    valor === "dog"
  ) {
    return "CANINO";
  }

  if (
    valor.includes("gato") ||
    valor.includes("felino") ||
    valor === "cat"
  ) {
    return "FELINO";
  }

  return null;
}

function doencaCompativelComPaciente(
  especieDoenca:
    EspecieCatalogo,
  especiePaciente:
    | "CANINO"
    | "FELINO"
    | null,
) {
  return (
    !especiePaciente ||
    especieDoenca === "AMBOS" ||
    especieDoenca ===
      especiePaciente
  );
}

export async function registrarPatologiaAtendimento(
  _estadoAnterior: EstadoPatologia,
  formData: FormData,
): Promise<EstadoPatologia> {
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

  const atendimentoId =
    Number(
      formData.get(
        "atendimentoId",
      ),
    );

  const patologiaOrigemInformada =
    Number(
      formData.get(
        "patologiaOrigemId",
      ) || 0,
    );

  const doencaIdInformada =
    Number(
      formData.get(
        "doencaId",
      ) || 0,
    );

  const statusInformado =
    textoCampo(
      formData,
      "status",
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
      atendimentoId,
    ) ||
    atendimentoId <= 0
  ) {
    return {
      ok: false,
      mensagem:
        "Dados inválidos para registrar a patologia.",
    };
  }

  if (
    !statusPatologiaValido(
      statusInformado,
    )
  ) {
    return {
      ok: false,
      mensagem:
        "Selecione uma situação clínica válida.",
    };
  }

  const status =
    statusInformado;

  const semProblemaClinico =
    status ===
    "SEM_PROBLEMA_CLINICO";

  const runtime =
    db.runtime();

  const consultaPaciente =
    db.sql.public.paciente
      .select(
        "id",
        "ativo",
        "clienteId",
        "especie",
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
        "Não é possível registrar patologia para um paciente inativo.",
    };
  }

  const consultaAtendimento =
    db.sql.public.pacienteAtendimento
      .select(
        "id",
        "pacienteId",
        "tipo",
        "atendimentoOrigemId",
        "statusAtendimento",
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
    !atendimento.ativo ||
    atendimento.pacienteId !==
      pacienteId
  ) {
    return {
      ok: false,
      mensagem:
        "Atendimento não encontrado.",
    };
  }

  if (
    atendimento.statusAtendimento ===
    "FINALIZADO"
  ) {
    return {
      ok: true,
      mensagem:
        "Este atendimento já está finalizado.",
    };
  }

  let patologiaOrigemId:
    | number
    | null = null;

  let doencaId:
    | number
    | null = null;

  let nomeDoenca:
    | string
    | null = null;

  if (
    !semProblemaClinico &&
    Number.isInteger(
      patologiaOrigemInformada,
    ) &&
    patologiaOrigemInformada > 0
  ) {
    const consultaPatologiaSelecionada =
      db.sql.public.pacientePatologia
        .select(
          "id",
          "pacienteId",
          "atendimentoId",
          "patologiaOrigemId",
          "doencaId",
          "nome",
          "ativo",
        )
        .where((f, fns) =>
          fns.eq(
            f.id,
            patologiaOrigemInformada,
          ),
        )
        .limit(1)
        .build();

    const resultadoPatologiaSelecionada =
      await runtime.query(
        consultaPatologiaSelecionada,
      );

    const patologiaSelecionada =
      resultadoPatologiaSelecionada[0];

    if (
      !patologiaSelecionada ||
      !patologiaSelecionada.ativo ||
      patologiaSelecionada.pacienteId !==
        pacienteId
    ) {
      return {
        ok: false,
        mensagem:
          "O problema clínico selecionado para acompanhamento não foi encontrado.",
      };
    }

    patologiaOrigemId =
      patologiaSelecionada.patologiaOrigemId ??
      patologiaSelecionada.id;

    let patologiaRaiz =
      patologiaSelecionada;

    if (
      patologiaSelecionada.patologiaOrigemId
    ) {
      const consultaRaiz =
        db.sql.public.pacientePatologia
          .select(
            "id",
            "pacienteId",
            "atendimentoId",
            "patologiaOrigemId",
            "doencaId",
            "nome",
            "ativo",
          )
          .where((f, fns) =>
            fns.eq(
              f.id,
              patologiaOrigemId!,
            ),
          )
          .limit(1)
          .build();

      const resultadoRaiz =
        await runtime.query(
          consultaRaiz,
        );

      if (
        resultadoRaiz[0]
      ) {
        patologiaRaiz =
          resultadoRaiz[0];
      }
    }

    if (
      atendimento.tipo ===
        "RETORNO" &&
      atendimento.atendimentoOrigemId &&
      patologiaRaiz.atendimentoId !==
        atendimento.atendimentoOrigemId
    ) {
      return {
        ok: false,
        mensagem:
          "O problema clínico selecionado não pertence à consulta original deste retorno.",
      };
    }

    doencaId =
      patologiaRaiz.doencaId ??
      patologiaSelecionada.doencaId ??
      null;

    nomeDoenca =
      patologiaSelecionada.nome ??
      patologiaRaiz.nome ??
      null;
  }

  if (
    !semProblemaClinico &&
    !doencaId
  ) {
    if (
      !Number.isInteger(
        doencaIdInformada,
      ) ||
      doencaIdInformada <= 0
    ) {
      return {
        ok: false,
        mensagem:
          "Pesquise e selecione uma doença do catálogo.",
      };
    }

    doencaId =
      doencaIdInformada;
  }

  if (
    !semProblemaClinico &&
    doencaId
  ) {
    const consultaDoenca =
      db.sql.public.doencaVeterinaria
        .select(
          "id",
          "nome",
          "especie",
          "ativo",
        )
        .where((f, fns) =>
          fns.eq(
            f.id,
            doencaId!,
          ),
        )
        .limit(1)
        .build();

    const resultadoDoenca =
      await runtime.query(
        consultaDoenca,
      );

    const doenca =
      resultadoDoenca[0];

    if (
      !doenca ||
      !doenca.ativo
    ) {
      return {
        ok: false,
        mensagem:
          "A doença selecionada não está disponível no catálogo.",
      };
    }

    const especiePaciente =
      especieDoPaciente(
        paciente.especie,
      );

    if (
      !doencaCompativelComPaciente(
        doenca.especie,
        especiePaciente,
      )
    ) {
      return {
        ok: false,
        mensagem:
          "A doença selecionada não é compatível com a espécie deste paciente.",
      };
    }

    nomeDoenca =
      doenca.nome;
  }

  const consultaPatologiaExistente =
    db.sql.public.pacientePatologia
      .select(
        "id",
      )
      .where((f, fns) =>
        fns.and(
          fns.eq(
            f.atendimentoId,
            atendimentoId,
          ),
          fns.eq(
            f.ativo,
            true,
          ),
        ),
      )
      .limit(1)
      .build();

  const resultadoPatologiaExistente =
    await runtime.query(
      consultaPatologiaExistente,
    );

  const patologiaExistente =
    resultadoPatologiaExistente[0];

  const agora =
    new Date().toISOString();

  if (!patologiaExistente) {
    const inserirPatologia =
      db.sql.public.pacientePatologia
        .insert([
          {
            pacienteId,
            atendimentoId,

            patologiaOrigemId,

            doencaId:
              semProblemaClinico
                ? null
                : doencaId,

            nome:
              semProblemaClinico
                ? null
                : nomeDoenca,

            status,

            observacoes:
              observacoes ||
              null,

            dataRegistro:
              agora,

            profissionalUsuarioId:
              acesso.usuario.id,

            profissionalNome:
              acesso.usuario.nome,

            ativo: true,

            updatedAt:
              agora,
          },
        ])
        .build();

    await runtime.execute(
      inserirPatologia,
    );
  }

  const finalizarAtendimento =
    db.sql.public.pacienteAtendimento
      .update({
        statusAtendimento:
          "FINALIZADO",
        updatedAt:
          agora,
      })
      .where((f, fns) =>
        fns.eq(
          f.id,
          atendimentoId,
        ),
      )
      .build();

  await runtime.execute(
    finalizarAtendimento,
  );

  return {
    ok: true,
    mensagem:
      "Problema clínico registrado. Atendimento finalizado com sucesso.",
  };
}
