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
  lerAnexoPrivado,
} from "@/lib/exames/anexo-storage";

import {
  db,
} from "@/prisma/db";

type ContextoRota = {
  params: Promise<{
    anexoId: string;
  }>;
};

function numeroId(
  valor: string,
) {
  const numero =
    Number(valor);

  if (
    !Number.isInteger(
      numero,
    ) ||
    numero <= 0
  ) {
    return null;
  }

  return numero;
}

function contentDisposition(
  nomeOriginal: string,
) {
  const nomeSeguro =
    nomeOriginal
      .replaceAll(
        "\r",
        "",
      )
      .replaceAll(
        "\n",
        "",
      )
      .trim() ||
    "anexo";

  return `inline; filename*=UTF-8''${encodeURIComponent(
    nomeSeguro,
  )}`;
}

export async function GET(
  _request: Request,
  contexto: ContextoRota,
) {
  try {
    /*
     * Por enquanto usamos a permissão já existente
     * do prontuário. Depois podemos separar
     * visualização e edição caso a regra de acesso
     * clínico seja refinada.
     */
    await exigirPermissao(
      "paciente.editar",
    );

    const {
      anexoId:
        anexoIdTexto,
    } = await contexto.params;

    const anexoId =
      numeroId(
        anexoIdTexto,
      );

    if (!anexoId) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Anexo inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const runtime =
      db.runtime();

    const consultaAnexo =
      db.sql.public
        .pacienteExameAnexo
        .select(
          "id",
          "exameId",
          "nomeOriginal",
          "mimeType",
          "storageKey",
          "ativo",
        )
        .where(
          (
            f,
            fns,
          ) =>
            fns.eq(
              f.id,
              anexoId,
            ),
        )
        .limit(1)
        .build();

    const resultadoAnexo =
      await runtime.query(
        consultaAnexo,
      );

    const anexo =
      resultadoAnexo[0];

    if (
      !anexo ||
      !anexo.ativo
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Anexo não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const consultaExame =
      db.sql.public
        .pacienteExame
        .select(
          "id",
          "ativo",
        )
        .where(
          (
            f,
            fns,
          ) =>
            fns.eq(
              f.id,
              anexo.exameId,
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
      !exame.ativo
    ) {
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

    const arquivo =
      await lerAnexoPrivado(
        anexo.storageKey,
      );

    return new Response(
      new Uint8Array(
        arquivo,
      ),
      {
        status: 200,

        headers: {
          "Content-Type":
            anexo.mimeType,

          "Content-Length":
            String(
              arquivo.length,
            ),

          "Content-Disposition":
            contentDisposition(
              anexo.nomeOriginal,
            ),

          "Cache-Control":
            "private, no-store",

          "X-Content-Type-Options":
            "nosniff",
        },
      },
    );
  } catch (erro) {
    const mensagem =
      erro instanceof Error
        ? erro.message
        : "Não foi possível abrir o anexo.";

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

export async function DELETE(
  _request: Request,
  contexto: ContextoRota,
) {
  try {
    await exigirPermissao(
      "paciente.editar",
    );

    const {
      anexoId:
        anexoIdTexto,
    } = await contexto.params;

    const anexoId =
      numeroId(
        anexoIdTexto,
      );

    if (!anexoId) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Anexo inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const runtime =
      db.runtime();

    const consultaAnexo =
      db.sql.public
        .pacienteExameAnexo
        .select(
          "id",
          "exameId",
          "ativo",
        )
        .where(
          (
            f,
            fns,
          ) =>
            fns.eq(
              f.id,
              anexoId,
            ),
        )
        .limit(1)
        .build();

    const resultadoAnexo =
      await runtime.query(
        consultaAnexo,
      );

    const anexo =
      resultadoAnexo[0];

    if (!anexo) {
      return NextResponse.json(
        {
          ok: false,
          mensagem:
            "Anexo não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    if (!anexo.ativo) {
      return NextResponse.json(
        {
          ok: true,
          mensagem:
            "Anexo já estava removido.",
        },
      );
    }

    const consultaExame =
      db.sql.public
        .pacienteExame
        .select(
          "id",
          "pacienteId",
        )
        .where(
          (
            f,
            fns,
          ) =>
            fns.eq(
              f.id,
              anexo.exameId,
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

    /*
     * Exclusão lógica:
     * o registro e o arquivo físico são preservados.
     *
     * Isso permite auditoria e evita destruir
     * documentos clínicos definitivamente.
     */
    const agora =
      new Date().toISOString();

    const desativarAnexo =
      db.sql.public
        .pacienteExameAnexo
        .update({
          ativo: false,
          updatedAt:
            agora,
        })
        .where(
          (
            f,
            fns,
          ) =>
            fns.eq(
              f.id,
              anexoId,
            ),
        )
        .build();

    await runtime.execute(
      desativarAnexo,
    );

    const consultaPaciente =
      db.sql.public.paciente
        .select(
          "id",
          "clienteId",
        )
        .where(
          (
            f,
            fns,
          ) =>
            fns.eq(
              f.id,
              exame.pacienteId,
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
      `/pacientes/${exame.pacienteId}`,
    );

    if (
      paciente?.clienteId !==
        null &&
      paciente?.clienteId !==
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
          "Anexo removido com sucesso.",
      },
    );
  } catch (erro) {
    const mensagem =
      erro instanceof Error
        ? erro.message
        : "Não foi possível remover o anexo.";

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