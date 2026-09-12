import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "mra_session";

const DURACAO_SEGUNDOS = 60 * 60 * 8;

export type SessionData = {
  usuarioId: number;
  setorId?: number;
  unidadeId?: number;
  exp: number;
};

function getSecret() {
  const secret = process.env["AUTH_SECRET"];

  if (!secret) {
    throw new Error(
      "AUTH_SECRET não configurada no arquivo .env",
    );
  }

  return secret;
}

function assinar(payload: string) {
  return createHmac(
    "sha256",
    getSecret(),
  )
    .update(payload)
    .digest("base64url");
}

function gerarToken(
  dados: Omit<SessionData, "exp">,
) {
  const session: SessionData = {
    ...dados,
    exp:
      Math.floor(Date.now() / 1000) +
      DURACAO_SEGUNDOS,
  };

  const payload = Buffer.from(
    JSON.stringify(session),
  ).toString("base64url");

  const assinatura = assinar(payload);

  return `${payload}.${assinatura}`;
}

function verificarToken(
  token: string,
): SessionData | null {
  try {
    const [payload, assinaturaRecebida] =
      token.split(".");

    if (!payload || !assinaturaRecebida) {
      return null;
    }

    const assinaturaEsperada =
      assinar(payload);

    const recebida = Buffer.from(
      assinaturaRecebida,
    );

    const esperada = Buffer.from(
      assinaturaEsperada,
    );

    if (
      recebida.length !== esperada.length ||
      !timingSafeEqual(
        recebida,
        esperada,
      )
    ) {
      return null;
    }

    const dados = JSON.parse(
      Buffer.from(
        payload,
        "base64url",
      ).toString("utf8"),
    ) as SessionData;

    if (
      !dados.usuarioId ||
      dados.exp <
        Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return dados;
  } catch {
    return null;
  }
}

export async function criarSessao(
  dados: Omit<SessionData, "exp">,
) {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAME,
    gerarToken(dados),
    {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV ===
        "production",
      path: "/",
      maxAge: DURACAO_SEGUNDOS,
    },
  );
}

export async function lerSessao() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verificarToken(token);
}

export async function excluirSessao() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}
