import { NextResponse } from "next/server";

import {
  registrarPatologiaAtendimento,
  type EstadoPatologia,
} from "@/app/actions/paciente-patologias";

const estadoInicial: EstadoPatologia = {
  ok: false,
  mensagem: "",
};

export async function POST(
  request: Request,
) {
  try {
    const formData =
      await request.formData();

    const resultado =
      await registrarPatologiaAtendimento(
        estadoInicial,
        formData,
      );

    return NextResponse.json(
      resultado,
      {
        status:
          resultado.ok
            ? 200
            : 400,
      },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        mensagem:
          "Não foi possível finalizar a patologia. Tente novamente.",
      } satisfies EstadoPatologia,
      {
        status: 500,
      },
    );
  }
}
