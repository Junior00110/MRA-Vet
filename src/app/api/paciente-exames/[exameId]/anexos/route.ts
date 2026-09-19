import {
  revalidatePath,
} from "next/cache";

import {
  NextResponse,
} from "next/server";

import {
  exigirPermissao,
} from "@/lib/auth/authorization";

import {
  removerArquivoPrivado,
  salvarAnexoPrivado,
} from "@/lib/exames/anexo-storage";

import {
  db,
} from "@/prisma/db";

type ContextoRota = {
  params: Promise<{
    exameId: string;
  }>;
};

export async function POST(
  request: Request,
  contexto: ContextoRota,
) {
  let storageKeyCriado:
    | string
    | null = null;

  try {
    const acesso =
      await exigirPermissao(
        "paciente.editar",
      );

    const {
      exameId: exameIdTexto,
    } = await contexto.params;

    const exameId =
      Number(
        exameIdTexto,
      );

    if (
      !Number.isInteger(
        exameId,
      ) ||
      exameId <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Exame inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const formData =
      await request.formData();

    const pacienteId =
      Number(
        formData.get(
          "pacienteId",
        ),
      );

    if (
      !Number.isInteger(
        pacienteId,
      ) ||
      pacienteId <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Paciente inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const arquivo =
      formData.get(
        "arquivo",
      );

    if (
      !(arquivo instanceof File) ||
      arquivo.size <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Selecione um arquivo válido.",
        },
        {
          status: 400,
        },
      );
    }

    const runtime =
      db.runtime();

    const consultaExame =
      db.sql.public
        .pacienteExame
        .select(
          "id",
          "pacienteId",
          "ativo",
        )
        .where(
          (
            f,
            fns,
          ) =>
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

    if (!exame) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Exame não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      exame.pacienteId !==
      pacienteId
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Este exame não pertence ao paciente informado.",
        },
        {
          status: 400,
        },
      );
    }

    if (!exame.ativo) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Não é possível anexar arquivos a um exame inativo.",
        },
        {
          status: 400,
        },
      );
    }

    const consultaPaciente =
      db.sql.public.paciente
        .select(
          "id",
          "ativo",
          "clienteId",
        )
        .where(
          (
            f,
            fns,
          ) =>
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
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Paciente não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    if (!paciente.ativo) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Não é possível anexar arquivos a um paciente inativo.",
        },
        {
          status: 400,
        },
      );
    }

    const anexoSalvo =
      await salvarAnexoPrivado(
        {
          exameId,
          arquivo,
        },
      );

    storageKeyCriado =
      anexoSalvo.storageKey;

    const agora =
      new Date().toISOString();

    const inserirAnexo =
      db.sql.public
        .pacienteExameAnexo
        .insert([
          {
            nomeOriginal:
              anexoSalvo.nomeOriginal,

            nomeArmazenado:
              anexoSalvo.nomeArmazenado,

            mimeType:
              anexoSalvo.mimeType,

            tamanhoBytes:
              anexoSalvo.tamanhoBytes,

            storageKey:
              anexoSalvo.storageKey,

            profissionalUsuarioId:
              acesso.usuario.id,

            profissionalNome:
              acesso.usuario.nome,

            ativo: true,

            exameId,

            updatedAt:
              agora,
          },
        ])
        .build();

    await runtime.execute(
      inserirAnexo,
    );

    revalidatePath(
      `/pacientes/${pacienteId}`,
    );

    if (
      paciente.clienteId !==
        null &&
      paciente.clienteId !==
        undefined
    ) {
      revalidatePath(
        `/clientes/${paciente.clienteId}`,
      );
    }

    return NextResponse.json(
      {
        ok: true,

        mensagem:
          "Arquivo anexado com sucesso.",

        anexo: {
          nome:
            anexoSalvo.nomeOriginal,

          mimeType:
            anexoSalvo.mimeType,

          tamanhoBytes:
            anexoSalvo.tamanhoBytes,
        },
      },
      {
        status: 201,
      },
    );
  } catch (erro) {
    /*
     * Se o arquivo foi gravado no disco,
     * mas houve erro ao registrar no banco,
     * removemos o arquivo físico para não
     * deixar arquivo órfão.
     */
    if (
      storageKeyCriado
    ) {
      try {
        await removerArquivoPrivado(
          storageKeyCriado,
        );
      } catch {
        /*
         * Não escondemos o erro principal
         * caso a limpeza também falhe.
         */
      }
    }

    const mensagem =
      erro instanceof Error
        ? erro.message
        : "Não foi possível anexar o arquivo.";

    return NextResponse.json(
      {
        ok: false,
        mensagem,
      },
      {
        status: 400,
      },
    );
  }
}