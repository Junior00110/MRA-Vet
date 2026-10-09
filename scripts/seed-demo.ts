import "dotenv/config";

import { Pool, PoolClient } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CODIGOS_CLIENTES_DEMO = [
  910001,
  910002,
  910003,
  910004,
  910005,
  910006,
  910007,
  910008,
  910009,
  910010,
];

const CODIGOS_PACIENTES_DEMO = [
  920001,
  920002,
  920003,
  920004,
  920005,
  920006,
  920007,
  920008,
  920009,
  920010,
  920011,
  920012,
];

type ClienteDemo = {
  codigoAntigo: number;
  nome: string;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
};

type PacienteDemo = {
  codigoAntigo: number;
  clienteCodigo: number;
  nome: string;
  especie: string;
  sexo: string;
  raca: string;
  dataNascimento: string;
  corPelagem: string;
  peso: number;
  castrado: boolean;
};

const clientes: ClienteDemo[] = [
  {
    codigoAntigo: 910001,
    nome: "Ana Souza - DEMO",
    telefone: "(79) 90000-0001",
    whatsapp: "(79) 90000-0001",
    email: "ana.demo@example.test",
    endereco: "Rua das Acácias",
    numero: "101",
    bairro: "Jardins",
    cidade: "Aracaju",
    estado: "SE",
  },
  {
    codigoAntigo: 910002,
    nome: "Bruno Lima - DEMO",
    telefone: "(79) 90000-0002",
    whatsapp: "(79) 90000-0002",
    email: "bruno.demo@example.test",
    endereco: "Avenida do Parque",
    numero: "220",
    bairro: "Luzia",
    cidade: "Aracaju",
    estado: "SE",
  },
  {
    codigoAntigo: 910003,
    nome: "Carla Mendes - DEMO",
    telefone: "(79) 90000-0003",
    whatsapp: "(79) 90000-0003",
    email: "carla.demo@example.test",
    endereco: "Rua das Palmeiras",
    numero: "315",
    bairro: "Atalaia",
    cidade: "Aracaju",
    estado: "SE",
  },
  {
    codigoAntigo: 910004,
    nome: "Diego Alves - DEMO",
    telefone: "(79) 90000-0004",
    whatsapp: "(79) 90000-0004",
    email: "diego.demo@example.test",
    endereco: "Rua Horizonte",
    numero: "48",
    bairro: "Coroa do Meio",
    cidade: "Aracaju",
    estado: "SE",
  },
  {
    codigoAntigo: 910005,
    nome: "Elisa Rocha - DEMO",
    telefone: "(79) 90000-0005",
    whatsapp: "(79) 90000-0005",
    email: "elisa.demo@example.test",
    endereco: "Rua Primavera",
    numero: "77",
    bairro: "Grageru",
    cidade: "Aracaju",
    estado: "SE",
  },
  {
    codigoAntigo: 910006,
    nome: "Felipe Santos - DEMO",
    telefone: "(79) 90000-0006",
    whatsapp: "(79) 90000-0006",
    email: "felipe.demo@example.test",
    endereco: "Avenida Central",
    numero: "502",
    bairro: "Farolândia",
    cidade: "Aracaju",
    estado: "SE",
  },
  {
    codigoAntigo: 910007,
    nome: "Gabriela Nunes - DEMO",
    telefone: "(79) 90000-0007",
    whatsapp: "(79) 90000-0007",
    email: "gabriela.demo@example.test",
    endereco: "Rua do Sol",
    numero: "88",
    bairro: "13 de Julho",
    cidade: "Aracaju",
    estado: "SE",
  },
  {
    codigoAntigo: 910008,
    nome: "Henrique Costa - DEMO",
    telefone: "(79) 90000-0008",
    whatsapp: "(79) 90000-0008",
    email: "henrique.demo@example.test",
    endereco: "Rua Beira Rio",
    numero: "144",
    bairro: "São José",
    cidade: "Aracaju",
    estado: "SE",
  },
  {
    codigoAntigo: 910009,
    nome: "Isabela Martins - DEMO",
    telefone: "(79) 90000-0009",
    whatsapp: "(79) 90000-0009",
    email: "isabela.demo@example.test",
    endereco: "Rua das Flores",
    numero: "63",
    bairro: "Salgado Filho",
    cidade: "Aracaju",
    estado: "SE",
  },
  {
    codigoAntigo: 910010,
    nome: "João Ribeiro - DEMO",
    telefone: "(79) 90000-0010",
    whatsapp: "(79) 90000-0010",
    email: "joao.demo@example.test",
    endereco: "Avenida Modelo",
    numero: "901",
    bairro: "Inácio Barbosa",
    cidade: "Aracaju",
    estado: "SE",
  },
];

const pacientes: PacienteDemo[] = [
  {
    codigoAntigo: 920001,
    clienteCodigo: 910001,
    nome: "Mel",
    especie: "Canino",
    sexo: "Fêmea",
    raca: "Shih-tzu",
    dataNascimento: "2021-05-10",
    corPelagem: "Branca e caramelo",
    peso: 6.4,
    castrado: true,
  },
  {
    codigoAntigo: 920002,
    clienteCodigo: 910001,
    nome: "Fred",
    especie: "Felino",
    sexo: "Macho",
    raca: "SRD",
    dataNascimento: "2023-02-12",
    corPelagem: "Cinza",
    peso: 4.8,
    castrado: true,
  },
  {
    codigoAntigo: 920003,
    clienteCodigo: 910002,
    nome: "Thor",
    especie: "Canino",
    sexo: "Macho",
    raca: "Golden Retriever",
    dataNascimento: "2020-08-18",
    corPelagem: "Dourada",
    peso: 31.2,
    castrado: false,
  },
  {
    codigoAntigo: 920004,
    clienteCodigo: 910003,
    nome: "Luna",
    especie: "Felino",
    sexo: "Fêmea",
    raca: "Siamês",
    dataNascimento: "2022-01-23",
    corPelagem: "Creme",
    peso: 4.2,
    castrado: true,
  },
  {
    codigoAntigo: 920005,
    clienteCodigo: 910003,
    nome: "Lola",
    especie: "Canino",
    sexo: "Fêmea",
    raca: "Yorkshire",
    dataNascimento: "2019-11-07",
    corPelagem: "Preta e dourada",
    peso: 3.9,
    castrado: true,
  },
  {
    codigoAntigo: 920006,
    clienteCodigo: 910004,
    nome: "Bob",
    especie: "Canino",
    sexo: "Macho",
    raca: "Pug",
    dataNascimento: "2021-09-14",
    corPelagem: "Fulvo",
    peso: 9.7,
    castrado: false,
  },
  {
    codigoAntigo: 920007,
    clienteCodigo: 910005,
    nome: "Nina",
    especie: "Felino",
    sexo: "Fêmea",
    raca: "SRD",
    dataNascimento: "2020-03-30",
    corPelagem: "Preta",
    peso: 4.6,
    castrado: true,
  },
  {
    codigoAntigo: 920008,
    clienteCodigo: 910006,
    nome: "Max",
    especie: "Canino",
    sexo: "Macho",
    raca: "Border Collie",
    dataNascimento: "2022-06-04",
    corPelagem: "Preta e branca",
    peso: 19.5,
    castrado: false,
  },
  {
    codigoAntigo: 920009,
    clienteCodigo: 910007,
    nome: "Amora",
    especie: "Canino",
    sexo: "Fêmea",
    raca: "Spitz Alemão",
    dataNascimento: "2023-04-15",
    corPelagem: "Branca",
    peso: 4.1,
    castrado: false,
  },
  {
    codigoAntigo: 920010,
    clienteCodigo: 910008,
    nome: "Simba",
    especie: "Felino",
    sexo: "Macho",
    raca: "Persa",
    dataNascimento: "2019-12-01",
    corPelagem: "Laranja",
    peso: 5.6,
    castrado: true,
  },
  {
    codigoAntigo: 920011,
    clienteCodigo: 910009,
    nome: "Chico",
    especie: "Canino",
    sexo: "Macho",
    raca: "Beagle",
    dataNascimento: "2020-07-21",
    corPelagem: "Tricolor",
    peso: 13.8,
    castrado: true,
  },
  {
    codigoAntigo: 920012,
    clienteCodigo: 910010,
    nome: "Maya",
    especie: "Felino",
    sexo: "Fêmea",
    raca: "SRD",
    dataNascimento: "2022-10-19",
    corPelagem: "Rajada",
    peso: 4.4,
    castrado: true,
  },
];

function dataHoraDiasAtras(dias: number) {
  const data = new Date();

  data.setDate(
    data.getDate() - dias,
  );

  return data.toISOString();
}

function dataDiasFrente(dias: number) {
  const data = new Date();

  data.setDate(
    data.getDate() + dias,
  );

  return data
    .toISOString()
    .slice(0, 10);
}

async function limparDemo(
  client: PoolClient,
) {
  const pacientesResultado =
    await client.query<{
      id: number;
    }>(
      `
        SELECT id
        FROM paciente
        WHERE "codigoAntigo" = ANY($1::int[])
      `,
      [CODIGOS_PACIENTES_DEMO],
    );

  const pacienteIds =
    pacientesResultado.rows.map(
      (item) => item.id,
    );

  if (pacienteIds.length > 0) {
    await client.query(
      `
        DELETE FROM "pacienteExameAnexo"
        WHERE "exameId" IN (
          SELECT id
          FROM "pacienteExame"
          WHERE "pacienteId" = ANY($1::int[])
        )
      `,
      [pacienteIds],
    );

    await client.query(
      `
        DELETE FROM "pacientePatologia"
        WHERE "pacienteId" = ANY($1::int[])
      `,
      [pacienteIds],
    );

    await client.query(
      `
        DELETE FROM "pacienteExame"
        WHERE "pacienteId" = ANY($1::int[])
      `,
      [pacienteIds],
    );

    await client.query(
      `
        DELETE FROM "pacienteVacina"
        WHERE "pacienteId" = ANY($1::int[])
      `,
      [pacienteIds],
    );

    await client.query(
      `
        DELETE FROM "pacientePeso"
        WHERE "pacienteId" = ANY($1::int[])
      `,
      [pacienteIds],
    );

    await client.query(
      `
        DELETE FROM "pacientePlano"
        WHERE "pacienteId" = ANY($1::int[])
      `,
      [pacienteIds],
    );

    await client.query(
      `
        DELETE FROM "pacienteAnotacao"
        WHERE "pacienteId" = ANY($1::int[])
      `,
      [pacienteIds],
    );

    await client.query(
      `
        UPDATE "pacienteAtendimento"
        SET "atendimentoOrigemId" = NULL
        WHERE "pacienteId" = ANY($1::int[])
      `,
      [pacienteIds],
    );

    await client.query(
      `
        DELETE FROM "pacienteAtendimento"
        WHERE "pacienteId" = ANY($1::int[])
      `,
      [pacienteIds],
    );

    await client.query(
      `
        DELETE FROM paciente
        WHERE id = ANY($1::int[])
      `,
      [pacienteIds],
    );
  }

  await client.query(
    `
      DELETE FROM cliente
      WHERE "codigoAntigo" = ANY($1::int[])
    `,
    [CODIGOS_CLIENTES_DEMO],
  );
}

async function criarClientes(
  client: PoolClient,
) {
  const ids =
    new Map<number, number>();

  for (const cliente of clientes) {
    const resultado =
      await client.query<{
        id: number;
      }>(
        `
          INSERT INTO cliente (
            "codigoAntigo",
            nome,
            telefone,
            whatsapp,
            email,
            endereco,
            numero,
            bairro,
            cidade,
            estado,
            observacoes,
            ativo,
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
            $12
          )
          RETURNING id
        `,
        [
          cliente.codigoAntigo,
          cliente.nome,
          cliente.telefone,
          cliente.whatsapp,
          cliente.email,
          cliente.endereco,
          cliente.numero,
          cliente.bairro,
          cliente.cidade,
          cliente.estado,
          "Cliente fictício criado exclusivamente para demonstração do MRA Vet.",
          new Date().toISOString(),
        ],
      );

    ids.set(
      cliente.codigoAntigo,
      resultado.rows[0].id,
    );
  }

  return ids;
}

async function criarPacientes(
  client: PoolClient,
  clienteIds: Map<number, number>,
) {
  const ids =
    new Map<number, number>();

  for (const paciente of pacientes) {
    const clienteId =
      clienteIds.get(
        paciente.clienteCodigo,
      );

    if (!clienteId) {
      throw new Error(
        `Cliente ${paciente.clienteCodigo} não encontrado.`,
      );
    }

    const resultado =
      await client.query<{
        id: number;
      }>(
        `
          INSERT INTO paciente (
            "codigoAntigo",
            nome,
            especie,
            sexo,
            raca,
            "dataNascimento",
            "corPelagem",
            peso,
            castrado,
            ativo,
            "clienteId",
            observacoes,
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
            true,
            $10,
            $11,
            $12
          )
          RETURNING id
        `,
        [
          paciente.codigoAntigo,
          paciente.nome,
          paciente.especie,
          paciente.sexo,
          paciente.raca,
          paciente.dataNascimento,
          paciente.corPelagem,
          paciente.peso,
          paciente.castrado,
          clienteId,
          "Paciente fictício para demonstração.",
          new Date().toISOString(),
        ],
      );

    ids.set(
      paciente.codigoAntigo,
      resultado.rows[0].id,
    );
  }

  return ids;
}

async function criarPeso(
  client: PoolClient,
  pacienteId: number,
  peso: number,
  diasAtras: number,
  observacoes: string,
) {
  const data =
    dataHoraDiasAtras(
      diasAtras,
    );

  await client.query(
    `
      INSERT INTO "pacientePeso" (
        peso,
        observacoes,
        "dataPesagem",
        "profissionalNome",
        ativo,
        "pacienteId",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        true,
        $5,
        $3,
        $3
      )
    `,
    [
      peso,
      observacoes,
      data,
      "Equipe MRA Vet - DEMO",
      pacienteId,
    ],
  );
}

async function criarVacina(
  client: PoolClient,
  pacienteId: number,
  nome: string,
  dose: string,
  diasAtras: number,
  proximaDoseDias: number,
) {
  const dataAplicacao =
    dataHoraDiasAtras(
      diasAtras,
    );

  await client.query(
    `
      INSERT INTO "pacienteVacina" (
        nome,
        dose,
        lote,
        fabricante,
        observacoes,
        "dataAplicacao",
        "proximaDose",
        "profissionalNome",
        ativo,
        "pacienteId",
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
        true,
        $9,
        $6,
        $6
      )
    `,
    [
      nome,
      dose,
      `DEMO-${pacienteId}`,
      "Fabricante demonstrativo",
      "Registro fictício para apresentação.",
      dataAplicacao,
      dataDiasFrente(
        proximaDoseDias,
      ),
      "Equipe MRA Vet - DEMO",
      pacienteId,
    ],
  );
}

async function criarAnotacao(
  client: PoolClient,
  pacienteId: number,
  texto: string,
) {
  await client.query(
    `
      INSERT INTO "pacienteAnotacao" (
        texto,
        ativo,
        "pacienteId",
        "criadoPorNome",
        "createdAt"
      )
      VALUES (
        $1,
        true,
        $2,
        $3,
        $4
      )
    `,
    [
      texto,
      pacienteId,
      "Equipe MRA Vet - DEMO",
      dataHoraDiasAtras(2),
    ],
  );
}

async function criarAtendimento(
  client: PoolClient,
  pacienteId: number,
  dados: {
    motivo: string;
    anamnese: string;
    exame: string;
    diagnostico: string;
    conduta: string;
    diasAtras: number;
  },
) {
  const data =
    dataHoraDiasAtras(
      dados.diasAtras,
    );

  const resultado =
    await client.query<{
      id: number;
    }>(
      `
        INSERT INTO "pacienteAtendimento" (
          tipo,
          "statusAtendimento",
          "motivoConsulta",
          anamnese,
          "exameClinico",
          "diagnosticoSuspeita",
          conduta,
          observacoes,
          "dataAtendimento",
          "profissionalNome",
          ativo,
          "pacienteId",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          'CONSULTA',
          'FINALIZADO',
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          true,
          $9,
          $7,
          $7
        )
        RETURNING id
      `,
      [
        dados.motivo,
        dados.anamnese,
        dados.exame,
        dados.diagnostico,
        dados.conduta,
        "Atendimento totalmente fictício para demonstração.",
        data,
        "Dra. Mariana - DEMO",
        pacienteId,
      ],
    );

  return resultado.rows[0].id;
}

async function criarRetorno(
  client: PoolClient,
  pacienteId: number,
  atendimentoOrigemId: number,
) {
  const data =
    dataHoraDiasAtras(3);

  const resultado =
    await client.query<{
      id: number;
    }>(
      `
        INSERT INTO "pacienteAtendimento" (
          tipo,
          "statusAtendimento",
          "motivoConsulta",
          anamnese,
          "exameClinico",
          "diagnosticoSuspeita",
          conduta,
          evolucao,
          observacoes,
          "dataAtendimento",
          "profissionalNome",
          ativo,
          "pacienteId",
          "atendimentoOrigemId",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          'RETORNO',
          'FINALIZADO',
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          true,
          $10,
          $11,
          $8,
          $8
        )
        RETURNING id
      `,
      [
        "Retorno clínico programado.",
        "Tutor relata melhora desde a consulta anterior.",
        "Paciente alerta, hidratado e sem alterações relevantes no exame demonstrativo.",
        "Evolução favorável.",
        "Manter acompanhamento e orientações anteriores.",
        "Melhora clínica relatada no retorno fictício.",
        "Retorno fictício para demonstração.",
        data,
        "Dra. Mariana - DEMO",
        pacienteId,
        atendimentoOrigemId,
      ],
    );

  return resultado.rows[0].id;
}

async function obterOuCriarDoenca(
  client: PoolClient,
  nome: string,
  especie:
    | "CANINO"
    | "FELINO"
    | "AMBOS",
  categoria: string,
) {
  const resultado =
    await client.query<{
      id: number;
    }>(
      `
        INSERT INTO "doencaVeterinaria" (
          nome,
          especie,
          categoria,
          sinonimos,
          ativo,
          "updatedAt"
        )
        VALUES (
          $1,
          $2,
          $3,
          NULL,
          true,
          $4
        )
        ON CONFLICT (nome, especie)
        DO UPDATE SET
          categoria = EXCLUDED.categoria,
          ativo = true,
          "updatedAt" = EXCLUDED."updatedAt"
        RETURNING id
      `,
      [
        nome,
        especie,
        categoria,
        new Date().toISOString(),
      ],
    );

  return resultado.rows[0].id;
}

async function criarPatologia(
  client: PoolClient,
  pacienteId: number,
  atendimentoId: number,
  doencaId: number,
  nome: string,
  status:
    | "SUSPEITA"
    | "EM_ACOMPANHAMENTO"
    | "TRATADA",
) {
  const data =
    dataHoraDiasAtras(10);

  await client.query(
    `
      INSERT INTO "pacientePatologia" (
        nome,
        status,
        observacoes,
        "dataRegistro",
        "profissionalNome",
        ativo,
        "pacienteId",
        "atendimentoId",
        "doencaId",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        true,
        $6,
        $7,
        $8,
        $4,
        $4
      )
    `,
    [
      nome,
      status,
      "Registro fictício criado para demonstração do módulo de patologias.",
      data,
      "Dra. Mariana - DEMO",
      pacienteId,
      atendimentoId,
      doencaId,
    ],
  );
}

async function criarExame(
  client: PoolClient,
  pacienteId: number,
  atendimentoId: number,
  nome: string,
  tipo: string,
  resultado: string,
) {
  const solicitacao =
    dataHoraDiasAtras(8);

  const realizacao =
    dataHoraDiasAtras(7);

  await client.query(
    `
      INSERT INTO "pacienteExame" (
        nome,
        tipo,
        status,
        "dataSolicitacao",
        "dataRealizacao",
        "dataResultado",
        laboratorio,
        resultado,
        observacoes,
        "profissionalNome",
        ativo,
        "pacienteId",
        "atendimentoId",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        $1,
        $2,
        'RESULTADO_DISPONIVEL',
        $3,
        $4,
        $4,
        $5,
        $6,
        $7,
        $8,
        true,
        $9,
        $10,
        $3,
        $4
      )
    `,
    [
      nome,
      tipo,
      solicitacao,
      realizacao,
      "Laboratório Veterinário - DEMO",
      resultado,
      "Resultado fictício usado apenas para apresentação.",
      "Dra. Mariana - DEMO",
      pacienteId,
      atendimentoId,
    ],
  );
}

async function criarPlano(
  client: PoolClient,
  pacienteId: number,
) {
  await client.query(
    `
      INSERT INTO "pacientePlano" (
        nome,
        "numeroCarteirinha",
        validade,
        observacoes,
        ativo,
        "pacienteId",
        "updatedAt"
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        true,
        $5,
        $6
      )
    `,
    [
      "Plano Saúde Pet - DEMO",
      `DEMO-${pacienteId}`,
      dataDiasFrente(180),
      "Plano fictício para apresentação.",
      pacienteId,
      new Date().toISOString(),
    ],
  );
}

async function popularProntuarios(
  client: PoolClient,
  pacienteIds: Map<number, number>,
) {
  for (
    const paciente of pacientes
  ) {
    const id =
      pacienteIds.get(
        paciente.codigoAntigo,
      );

    if (!id) {
      continue;
    }

    await criarPeso(
      client,
      id,
      Math.max(
        paciente.peso - 0.4,
        1,
      ),
      90,
      "Pesagem anterior - DEMO.",
    );

    await criarPeso(
      client,
      id,
      paciente.peso,
      5,
      "Pesagem atual - DEMO.",
    );

    await criarVacina(
      client,
      id,
      paciente.especie ===
        "Felino"
        ? "Vacina Múltipla - Gatos"
        : "Vacina Múltipla - Cães",
      "Reforço anual",
      120,
      245,
    );
  }

  const mel =
    pacienteIds.get(920001);

  const thor =
    pacienteIds.get(920003);

  const luna =
    pacienteIds.get(920004);

  const bob =
    pacienteIds.get(920006);

  const nina =
    pacienteIds.get(920007);

  if (
    !mel ||
    !thor ||
    !luna ||
    !bob ||
    !nina
  ) {
    throw new Error(
      "Pacientes principais da demonstração não foram encontrados.",
    );
  }

  await criarAnotacao(
    client,
    mel,
    "Tutor prefere contato por WhatsApp. Informação fictícia para demonstração.",
  );

  await criarAnotacao(
    client,
    thor,
    "Paciente dócil durante manipulação. Registro demonstrativo.",
  );

  await criarAnotacao(
    client,
    luna,
    "Paciente fica mais tranquila quando permanece na caixa de transporte até o atendimento.",
  );

  await criarPlano(
    client,
    mel,
  );

  await criarPlano(
    client,
    thor,
  );

  await criarPlano(
    client,
    luna,
  );

  const atendimentoMel =
    await criarAtendimento(
      client,
      mel,
      {
        motivo:
          "Prurido recorrente e vermelhidão na pele.",
        anamnese:
          "Tutor relata coceira principalmente após passeios e contato com grama. Alimentação e ingestão de água mantidas.",
        exame:
          "Paciente alerta. Pele com discreta vermelhidão em região abdominal, sem outras alterações relevantes no exame demonstrativo.",
        diagnostico:
          "Suspeita de dermatite alérgica.",
        conduta:
          "Orientado acompanhamento clínico e investigação conforme evolução.",
        diasAtras: 12,
      },
    );

  await criarRetorno(
    client,
    mel,
    atendimentoMel,
  );

  const dermatiteId =
    await obterOuCriarDoenca(
      client,
      "Dermatite alérgica",
      "CANINO",
      "Dermatologia",
    );

  await criarPatologia(
    client,
    mel,
    atendimentoMel,
    dermatiteId,
    "Dermatite alérgica",
    "EM_ACOMPANHAMENTO",
  );

  await criarExame(
    client,
    mel,
    atendimentoMel,
    "Hemograma completo",
    "Hematologia",
    "Parâmetros demonstrativos sem alterações relevantes.",
  );

  const atendimentoThor =
    await criarAtendimento(
      client,
      thor,
      {
        motivo:
          "Incômodo em ouvido direito.",
        anamnese:
          "Tutor percebeu aumento de coceira na região auricular nos últimos dias.",
        exame:
          "Discreto eritema em conduto auditivo direito no exame fictício.",
        diagnostico:
          "Suspeita de otite externa.",
        conduta:
          "Orientado acompanhamento clínico e avaliação de evolução.",
        diasAtras: 20,
      },
    );

  const otiteId =
    await obterOuCriarDoenca(
      client,
      "Otite externa",
      "CANINO",
      "Otologia",
    );

  await criarPatologia(
    client,
    thor,
    atendimentoThor,
    otiteId,
    "Otite externa",
    "TRATADA",
  );

  await criarExame(
    client,
    thor,
    atendimentoThor,
    "Citologia otológica",
    "Citologia",
    "Resultado fictício registrado para demonstração do histórico.",
  );

  await criarAtendimento(
    client,
    luna,
    {
      motivo:
        "Consulta preventiva de rotina.",
      anamnese:
        "Tutor não relata alterações comportamentais, alimentares ou urinárias.",
      exame:
        "Paciente alerta e responsiva. Exame demonstrativo sem alterações relevantes.",
      diagnostico:
        "Avaliação preventiva.",
      conduta:
        "Manter acompanhamento preventivo e calendário vacinal.",
      diasAtras: 30,
    },
  );

  await criarAtendimento(
    client,
    bob,
    {
      motivo:
        "Avaliação clínica de rotina.",
      anamnese:
        "Tutor relata paciente ativo e alimentação habitual.",
      exame:
        "Paciente alerta, hidratado e responsivo durante avaliação fictícia.",
      diagnostico:
        "Sem suspeita clínica relevante no momento da demonstração.",
      conduta:
        "Manter acompanhamento preventivo.",
      diasAtras: 16,
    },
  );

  await criarAtendimento(
    client,
    nina,
    {
      motivo:
        "Revisão anual.",
      anamnese:
        "Sem queixas no momento. Alimentação, ingestão de água e comportamento habituais.",
      exame:
        "Exame clínico fictício sem alterações relevantes.",
      diagnostico:
        "Consulta preventiva.",
      conduta:
        "Manter calendário preventivo atualizado.",
      diasAtras: 7,
    },
  );

  await criarVacina(
    client,
    mel,
    "Anti-rábica",
    "Reforço anual",
    115,
    250,
  );

  await criarVacina(
    client,
    thor,
    "Gripe Anual",
    "Reforço anual",
    60,
    305,
  );

  await criarVacina(
    client,
    luna,
    "Anti-rábica",
    "Reforço anual",
    90,
    275,
  );
}

async function main() {
  if (
    !process.env.DATABASE_URL
  ) {
    throw new Error(
      "DATABASE_URL não encontrada no arquivo .env.",
    );
  }

  const client =
    await pool.connect();

  try {
    console.log("");
    console.log(
      "========================================",
    );
    console.log(
      "   DADOS DE DEMONSTRAÇÃO - MRA VET",
    );
    console.log(
      "========================================",
    );
    console.log("");

    await client.query(
      "BEGIN",
    );

    console.log(
      "Limpando dados DEMO antigos...",
    );

    await limparDemo(
      client,
    );

    console.log(
      "Criando 10 clientes fictícios...",
    );

    const clienteIds =
      await criarClientes(
        client,
      );

    console.log(
      "Criando 12 pacientes fictícios...",
    );

    const pacienteIds =
      await criarPacientes(
        client,
        clienteIds,
      );

    console.log(
      "Criando prontuários demonstrativos...",
    );

    await popularProntuarios(
      client,
      pacienteIds,
    );

    await client.query(
      "COMMIT",
    );

    console.log("");
    console.log(
      "========================================",
    );
    console.log(
      "DADOS DEMO CRIADOS COM SUCESSO",
    );
    console.log(
      "========================================",
    );
    console.log(
      `Clientes: ${clientes.length}`,
    );
    console.log(
      `Pacientes: ${pacientes.length}`,
    );
    console.log(
      "Incluído também:",
    );
    console.log(
      "- histórico de peso",
    );
    console.log(
      "- vacinas",
    );
    console.log(
      "- anotações",
    );
    console.log(
      "- planos",
    );
    console.log(
      "- atendimentos",
    );
    console.log(
      "- retorno",
    );
    console.log(
      "- patologias",
    );
    console.log(
      "- exames",
    );
    console.log("");
    console.log(
      "Sugestão para a apresentação: abra Ana Souza - DEMO > Mel.",
    );
    console.log("");
  } catch (error) {
    await client.query(
      "ROLLBACK",
    );

    console.error("");
    console.error(
      "ERRO AO CRIAR DADOS DEMO",
    );
    console.error(
      error,
    );

    process.exitCode = 1;
  } finally {
    client.release();

    await pool.end();
  }
}

main();