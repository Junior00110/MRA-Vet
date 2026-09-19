import {
  mkdir,
  readFile,
  unlink,
  writeFile,
} from "node:fs/promises";

import path from "node:path";
import crypto from "node:crypto";

export const TAMANHO_MAXIMO_ANEXO =
  25 * 1024 * 1024;

export const TIPOS_ANEXO_PERMITIDOS = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

type TipoAnexoPermitido =
  (typeof TIPOS_ANEXO_PERMITIDOS)[number];

type AnexoValidado = {
  buffer: Buffer;
  mimeType: TipoAnexoPermitido;
  extensao:
    | ".pdf"
    | ".jpg"
    | ".png"
    | ".webp";
  tamanhoBytes: number;
};

type SalvarAnexoParams = {
  exameId: number;
  arquivo: File;
};

type AnexoSalvo = {
  nomeOriginal: string;
  nomeArmazenado: string;
  mimeType: TipoAnexoPermitido;
  tamanhoBytes: number;
  storageKey: string;
};

const STORAGE_BASE =
  process.env.MRA_VET_STORAGE_PATH?.trim() ||
  path.join(
    process.cwd(),
    "storage",
  );

const EXAMES_STORAGE =
  path.join(
    STORAGE_BASE,
    "exames",
  );

function temAssinaturaPdf(
  buffer: Buffer,
) {
  return (
    buffer.length >= 5 &&
    buffer
      .subarray(0, 5)
      .toString("ascii") ===
      "%PDF-"
  );
}

function temAssinaturaJpeg(
  buffer: Buffer,
) {
  return (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  );
}

function temAssinaturaPng(
  buffer: Buffer,
) {
  if (buffer.length < 8) {
    return false;
  }

  const assinatura = [
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
  ];

  return assinatura.every(
    (valor, indice) =>
      buffer[indice] === valor,
  );
}

function temAssinaturaWebp(
  buffer: Buffer,
) {
  if (buffer.length < 12) {
    return false;
  }

  return (
    buffer
      .subarray(0, 4)
      .toString("ascii") ===
      "RIFF" &&
    buffer
      .subarray(8, 12)
      .toString("ascii") ===
      "WEBP"
  );
}

function detectarTipoArquivo(
  buffer: Buffer,
): {
  mimeType: TipoAnexoPermitido;
  extensao:
    | ".pdf"
    | ".jpg"
    | ".png"
    | ".webp";
} | null {
  if (
    temAssinaturaPdf(
      buffer,
    )
  ) {
    return {
      mimeType:
        "application/pdf",
      extensao: ".pdf",
    };
  }

  if (
    temAssinaturaJpeg(
      buffer,
    )
  ) {
    return {
      mimeType:
        "image/jpeg",
      extensao: ".jpg",
    };
  }

  if (
    temAssinaturaPng(
      buffer,
    )
  ) {
    return {
      mimeType:
        "image/png",
      extensao: ".png",
    };
  }

  if (
    temAssinaturaWebp(
      buffer,
    )
  ) {
    return {
      mimeType:
        "image/webp",
      extensao: ".webp",
    };
  }

  return null;
}

function nomeOriginalSeguro(
  nome: string,
) {
  const nomeBase =
    path
      .basename(nome)
      .trim();

  if (!nomeBase) {
    return "arquivo";
  }

  return nomeBase.slice(
    0,
    255,
  );
}

export async function validarAnexo(
  arquivo: File,
): Promise<AnexoValidado> {
  if (
    !arquivo ||
    arquivo.size <= 0
  ) {
    throw new Error(
      "Selecione um arquivo válido.",
    );
  }

  if (
    arquivo.size >
    TAMANHO_MAXIMO_ANEXO
  ) {
    throw new Error(
      "O arquivo excede o limite de 25 MB.",
    );
  }

  const arrayBuffer =
    await arquivo.arrayBuffer();

  const buffer =
    Buffer.from(
      arrayBuffer,
    );

  const detectado =
    detectarTipoArquivo(
      buffer,
    );

  if (!detectado) {
    throw new Error(
      "Formato não permitido. Envie PDF, JPG, PNG ou WEBP.",
    );
  }

  /*
   * Não confiamos apenas no `arquivo.type`.
   * A assinatura real do arquivo é verificada acima.
   */
  if (
    arquivo.type &&
    !TIPOS_ANEXO_PERMITIDOS.includes(
      arquivo.type as TipoAnexoPermitido,
    )
  ) {
    throw new Error(
      "O tipo informado pelo arquivo não é permitido.",
    );
  }

  return {
    buffer,
    mimeType:
      detectado.mimeType,
    extensao:
      detectado.extensao,
    tamanhoBytes:
      buffer.length,
  };
}

export async function salvarAnexoPrivado({
  exameId,
  arquivo,
}: SalvarAnexoParams): Promise<AnexoSalvo> {
  const validado =
    await validarAnexo(
      arquivo,
    );

  const identificador =
    crypto.randomUUID();

  const nomeArmazenado =
    `${identificador}${validado.extensao}`;

  const pastaExame =
    path.join(
      EXAMES_STORAGE,
      String(exameId),
    );

  await mkdir(
    pastaExame,
    {
      recursive: true,
    },
  );

  const caminhoCompleto =
    path.join(
      pastaExame,
      nomeArmazenado,
    );

  await writeFile(
    caminhoCompleto,
    validado.buffer,
    {
      flag: "wx",
    },
  );

  const storageKey =
    path
      .join(
        "exames",
        String(exameId),
        nomeArmazenado,
      )
      .replaceAll(
        "\\",
        "/",
      );

  return {
    nomeOriginal:
      nomeOriginalSeguro(
        arquivo.name,
      ),

    nomeArmazenado,

    mimeType:
      validado.mimeType,

    tamanhoBytes:
      validado.tamanhoBytes,

    storageKey,
  };
}

function resolverStorageKey(
  storageKey: string,
) {
  const normalizado =
    storageKey
      .replaceAll(
        "\\",
        "/",
      )
      .replace(
        /^\/+/,
        "",
      );

  if (
    normalizado.includes(
      "..",
    )
  ) {
    throw new Error(
      "Caminho de anexo inválido.",
    );
  }

  const caminho =
    path.resolve(
      STORAGE_BASE,
      normalizado,
    );

  const base =
    path.resolve(
      STORAGE_BASE,
    );

  if (
    caminho !== base &&
    !caminho.startsWith(
      `${base}${path.sep}`,
    )
  ) {
    throw new Error(
      "Caminho de anexo inválido.",
    );
  }

  return caminho;
}

export async function lerAnexoPrivado(
  storageKey: string,
) {
  const caminho =
    resolverStorageKey(
      storageKey,
    );

  return readFile(
    caminho,
  );
}

export async function removerArquivoPrivado(
  storageKey: string,
) {
  const caminho =
    resolverStorageKey(
      storageKey,
    );

  try {
    await unlink(
      caminho,
    );
  } catch (erro) {
    const codigo =
      (
        erro as {
          code?: string;
        }
      ).code;

    if (
      codigo !== "ENOENT"
    ) {
      throw erro;
    }
  }
}