"use server";

import { db } from "@/prisma/db";
import { exigirPermissao } from "@/lib/auth/authorization";
import {
  CATALOGO_DOENCAS_CAES_GATOS,
} from "@/lib/patologias/catalogo-doencas-caes-gatos";

export type DoencaVeterinariaBusca = {
  id: number;
  nome: string;
  especie:
    | "CANINO"
    | "FELINO"
    | "AMBOS";
  categoria: string | null;
};

function normalizarBusca(
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

function especieCatalogo(
  especiePaciente:
    | string
    | null,
):
  | "CANINO"
  | "FELINO"
  | null {
  const especie =
    normalizarBusca(
      especiePaciente ?? "",
    );

  if (
    especie.includes("cao") ||
    especie.includes("canino") ||
    especie.includes("cachorro") ||
    especie === "dog"
  ) {
    return "CANINO";
  }

  if (
    especie.includes("gato") ||
    especie.includes("felino") ||
    especie === "cat"
  ) {
    return "FELINO";
  }

  return null;
}

export async function buscarDoencasVeterinarias(
  pacienteId: number,
  termo: string,
): Promise<
  DoencaVeterinariaBusca[]
> {
  await exigirPermissao(
    "paciente.editar",
  );

  if (
    !Number.isInteger(
      pacienteId,
    ) ||
    pacienteId <= 0
  ) {
    return [];
  }

  const runtime =
    db.runtime();

  const consultaPaciente =
    db.sql.public.paciente
      .select(
        "id",
        "especie",
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

  if (
    !paciente ||
    !paciente.ativo
  ) {
    return [];
  }

  const consultaExistentes =
    db.sql.public.doencaVeterinaria
      .select(
        "nome",
        "especie",
      )
      .build();

  const existentes =
    await runtime.query(
      consultaExistentes,
    );

  const chavesExistentes =
    new Set(
      existentes.map(
        (item) =>
          `${normalizarBusca(
            item.nome,
          )}|${item.especie}`,
      ),
    );

  const faltantes =
    CATALOGO_DOENCAS_CAES_GATOS.filter(
      (item) =>
        !chavesExistentes.has(
          `${normalizarBusca(
            item.nome,
          )}|${item.especie}`,
        ),
    );

  if (
    faltantes.length > 0
  ) {
    const agora =
      new Date().toISOString();

    const inserir =
      db.sql.public.doencaVeterinaria
        .insert(
          faltantes.map(
            (item) => ({
              nome:
                item.nome,
              especie:
                item.especie,
              categoria:
                item.categoria,
              sinonimos:
                item.sinonimos ||
                null,
              ativo:
                true,
              updatedAt:
                agora,
            }),
          ),
        )
        .build();

    try {
      await runtime.execute(
        inserir,
      );
    } catch {
      // Em uma corrida entre duas buscas,
      // outra requisição pode ter inserido
      // os mesmos itens primeiro.
    }
  }

  const consultaCatalogo =
    db.sql.public.doencaVeterinaria
      .select(
        "id",
        "nome",
        "especie",
        "categoria",
        "sinonimos",
        "ativo",
      )
      .where((f, fns) =>
        fns.eq(
          f.ativo,
          true,
        ),
      )
      .orderBy(
        "nome",
        {
          direction: "asc",
        },
      )
      .build();

  const catalogo =
    await runtime.query(
      consultaCatalogo,
    );

  const especiePaciente =
    especieCatalogo(
      paciente.especie,
    );

  const busca =
    normalizarBusca(
      termo,
    );

  return catalogo
    .filter(
      (item) =>
        (
          !especiePaciente ||
          item.especie ===
            "AMBOS" ||
          item.especie ===
            especiePaciente
        ) &&
        (
          !busca ||
          normalizarBusca(
            [
              item.nome,
              item.categoria ??
                "",
              item.sinonimos ??
                "",
            ].join(" "),
          ).includes(
            busca,
          )
        ),
    )
    .slice(
      0,
      20,
    )
    .map(
      (item) => ({
        id:
          item.id,
        nome:
          item.nome,
        especie:
          item.especie,
        categoria:
          item.categoria,
      }),
    );
}
