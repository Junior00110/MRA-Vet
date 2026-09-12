import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { Pool } from "pg";
import "dotenv/config";

type LinhaCSV = Record<string, string>;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function texto(valor: unknown): string | null {
  if (valor === undefined || valor === null) return null;

  const resultado = String(valor).trim();

  if (
    resultado === "" ||
    resultado.toLowerCase() === "nan" ||
    resultado.toLowerCase() === "null"
  ) {
    return null;
  }

  return resultado;
}

function numero(valor: unknown): number | null {
  const t = texto(valor);

  if (!t) return null;

  const n = Number(t);

  return Number.isNaN(n) ? null : n;
}

function dataBR(valor: unknown): string | null {
  const t = texto(valor);

  if (!t) return null;

  const partes = t.split("/");

  if (partes.length !== 3) {
    return null;
  }

  const [dia, mes, ano] = partes;

  if (!dia || !mes || !ano) {
    return null;
  }

  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function booleanoCastrado(valor: unknown): boolean {
  const t = texto(valor)?.toLowerCase();

  if (!t) return false;

  return (
    t.includes("castrado") ||
    t.includes("castrada") ||
    t.includes("esterilizado") ||
    t.includes("esterilizada")
  );
}

function booleanoAtivo(valor: unknown): boolean {
  const t = texto(valor)?.toLowerCase();

  if (!t) return true;

  return !(
    t.includes("inativo") ||
    t.includes("inativa") ||
    t.includes("falecido") ||
    t.includes("falecida") ||
    t.includes("morto") ||
    t.includes("morta")
  );
}

async function main() {
  console.log("");
  console.log("======================================");
  console.log("   IMPORTAÇÃO COMPLETA - MRA VET");
  console.log("======================================");
  console.log("");

  const arquivo = path.join(
    process.cwd(),
    "dados",
    "clientes.csv"
  );

  if (!fs.existsSync(arquivo)) {
    throw new Error(
      `Arquivo não encontrado:\n${arquivo}`
    );
  }

  const conteudo = fs
    .readFileSync(arquivo, "utf8")
    .replace(/^\uFEFF/, "");

  const registros = parse(conteudo, {
    columns: true,
    delimiter: ";",
    skip_empty_lines: true,
    relax_quotes: true,
    trim: true,
  }) as LinhaCSV[];

  console.log(`Linhas do CSV: ${registros.length}`);
  console.log("");

  const clientesUnicos = new Map<number, LinhaCSV>();

  for (const linha of registros) {
    const codigoCliente = numero(
      linha["Cliente - Código"]
    );

    if (codigoCliente === null) {
      continue;
    }

    if (!clientesUnicos.has(codigoCliente)) {
      clientesUnicos.set(
        codigoCliente,
        linha
      );
    }
  }

  console.log(
    `Clientes únicos encontrados: ${clientesUnicos.size}`
  );

  console.log(
    `Registros de pacientes encontrados: ${registros.length}`
  );

  console.log("");

  const conexao = await pool.connect();

  let clientesCriados = 0;
  let clientesExistentes = 0;
  let pacientesCriados = 0;
  let pacientesExistentes = 0;
  let clientesIgnorados = 0;
  let pacientesIgnorados = 0;

  const clienteIdPorCodigo = new Map<number, number>();

  try {
    await conexao.query("BEGIN");

    // ============================
    // CLIENTES
    // ============================

    for (const [
      codigoCliente,
      linha,
    ] of clientesUnicos.entries()) {
      const nome = texto(
        linha["Cliente - Nome"]
      );

      if (!nome) {
        clientesIgnorados++;

        console.log(
          `⚠ Cliente ${codigoCliente} ignorado: sem nome`
        );

        continue;
      }

      const existente = await conexao.query(
        `
        SELECT id
        FROM public.cliente
        WHERE "codigoAntigo" = $1
        LIMIT 1
        `,
        [codigoCliente]
      );

      if (existente.rows.length > 0) {
        const id = Number(
          existente.rows[0].id
        );

        clienteIdPorCodigo.set(
          codigoCliente,
          id
        );

        clientesExistentes++;

        continue;
      }

      const cpf = texto(
        linha["Cliente - CPF"]
      );

      const telefone = texto(
        linha["Cliente - Telefones"]
      );

      const email = texto(
        linha["Cliente - Email"]
      );

      const cep = texto(
        linha["Cliente - CEP"]
      );

      const endereco = texto(
        linha["Cliente - Endereço"]
      );

      const bairro = texto(
        linha["Cliente - Bairro"]
      );

      const cidade = texto(
        linha["Cliente - Cidade"]
      );

      const estado = texto(
        linha["Cliente - UF"]
      );

      const resultado = await conexao.query(
        `
        INSERT INTO public.cliente (
          "codigoAntigo",
          "nome",
          "cpf",
          "telefone",
          "whatsapp",
          "email",
          "cep",
          "endereco",
          "bairro",
          "cidade",
          "estado",
          "ativo",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          true,
          NOW(),
          NOW()
        )
        RETURNING id
        `,
        [
          codigoCliente,
          nome,
          cpf,
          telefone,
          telefone,
          email,
          cep,
          endereco,
          bairro,
          cidade,
          estado,
        ]
      );

      const novoId = Number(
        resultado.rows[0].id
      );

      clienteIdPorCodigo.set(
        codigoCliente,
        novoId
      );

      clientesCriados++;

      if (clientesCriados % 250 === 0) {
        console.log(
          `Clientes importados: ${clientesCriados}`
        );
      }
    }

    console.log("");
    console.log(
      "Clientes concluídos. Iniciando pacientes..."
    );
    console.log("");

    // ============================
    // PACIENTES
    // ============================

    for (const linha of registros) {
      const codigoAnimal = numero(
        linha["Animal - Código"]
      );

      const codigoCliente = numero(
        linha["Cliente - Código"]
      );

      const nomeAnimal = texto(
        linha["Animal - Nome"]
      );

      if (
        codigoAnimal === null ||
        !nomeAnimal
      ) {
        pacientesIgnorados++;

        continue;
      }

      const existente = await conexao.query(
        `
        SELECT id
        FROM public.paciente
        WHERE "codigoAntigo" = $1
        LIMIT 1
        `,
        [codigoAnimal]
      );

      if (existente.rows.length > 0) {
        pacientesExistentes++;

        continue;
      }

      let clienteId: number | null = null;

      if (codigoCliente !== null) {
        clienteId =
          clienteIdPorCodigo.get(
            codigoCliente
          ) ?? null;
      }

      const especie = texto(
        linha["Animal - Espécie"]
      );

      const raca = texto(
        linha["Animal - Raça"]
      );

      const pelagem = texto(
        linha["Animal - Pelagem"]
      );

      const sexo = texto(
        linha["Animal - Sexo"]
      );

      const nascimento = dataBR(
        linha["Animal - Nascimento"]
      );

      const microchip = texto(
        linha["Animal - Microchip"]
      );

      const castrado = booleanoCastrado(
        linha["Animal - Esterilização"]
      );

      const ativo =
        booleanoAtivo(
          linha["Animal - Status"]
        ) &&
        booleanoAtivo(
          linha["Animal - Vivo/Morto"]
        );

      await conexao.query(
        `
        INSERT INTO public.paciente (
          "codigoAntigo",
          "nome",
          "especie",
          "raca",
          "corPelagem",
          "sexo",
          "dataNascimento",
          "microchip",
          "castrado",
          "ativo",
          "clienteId",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          NOW(),
          NOW()
        )
        `,
        [
          codigoAnimal,
          nomeAnimal,
          especie,
          raca,
          pelagem,
          sexo,
          nascimento,
          microchip,
          castrado,
          ativo,
          clienteId,
        ]
      );

      pacientesCriados++;

      if (pacientesCriados % 250 === 0) {
        console.log(
          `Pacientes importados: ${pacientesCriados}`
        );
      }
    }

    await conexao.query("COMMIT");

    console.log("");
    console.log("======================================");
    console.log("       IMPORTAÇÃO CONCLUÍDA");
    console.log("======================================");
    console.log("");

    console.log(
      `Clientes criados:          ${clientesCriados}`
    );

    console.log(
      `Clientes já existentes:    ${clientesExistentes}`
    );

    console.log(
      `Clientes ignorados:        ${clientesIgnorados}`
    );

    console.log("");

    console.log(
      `Pacientes criados:         ${pacientesCriados}`
    );

    console.log(
      `Pacientes já existentes:   ${pacientesExistentes}`
    );

    console.log(
      `Pacientes ignorados:       ${pacientesIgnorados}`
    );

    console.log("");

    console.log(
      "✅ Transação confirmada no PostgreSQL."
    );

    console.log("");
  } catch (erro) {
    await conexao.query("ROLLBACK");

    console.error("");
    console.error(
      "❌ ERRO: toda a importação desta execução foi desfeita."
    );

    console.error("");
    console.error(erro);

    throw erro;
  } finally {
    conexao.release();
    await pool.end();
  }
}

main().catch(() => {
  process.exit(1);
});