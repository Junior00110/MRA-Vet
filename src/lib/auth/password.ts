import { scryptSync, timingSafeEqual } from "node:crypto";

export function verificarSenha(
  senha: string,
  senhaHashSalva: string,
): boolean {
  try {
    const [algoritmo, salt, hashHex] = senhaHashSalva.split("$");

    if (
      algoritmo !== "scrypt" ||
      !salt ||
      !hashHex
    ) {
      return false;
    }

    const hashCalculado = scryptSync(
      senha,
      salt,
      64,
    );

    const hashSalvo = Buffer.from(hashHex, "hex");

    if (hashCalculado.length !== hashSalvo.length) {
      return false;
    }

    return timingSafeEqual(
      hashCalculado,
      hashSalvo,
    );
  } catch {
    return false;
  }
}
