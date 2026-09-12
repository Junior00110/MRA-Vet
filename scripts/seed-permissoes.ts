import { db } from '../src/prisma/db.js';

async function main() {
  console.log('Iniciando seed de setores, perfis e permissões...');

  // =========================
  // SETORES
  // =========================

  const clinica = await db.orm.public.Setor.upsert({
    create: {
      nome: 'Clínica',
      codigo: 'CLINICA',
      ativo: true,
    },
    update: {
      nome: 'Clínica',
      ativo: true,
    },
    conflictOn: {
      codigo: 'CLINICA',
    },
  });

  const banhoTosa = await db.orm.public.Setor.upsert({
    create: {
      nome: 'Banho & Tosa',
      codigo: 'BANHO_TOSA',
      ativo: true,
    },
    update: {
      nome: 'Banho & Tosa',
      ativo: true,
    },
    conflictOn: {
      codigo: 'BANHO_TOSA',
    },
  });

  const administrativo = await db.orm.public.Setor.upsert({
    create: {
      nome: 'Administrativo',
      codigo: 'ADMINISTRATIVO',
      ativo: true,
    },
    update: {
      nome: 'Administrativo',
      ativo: true,
    },
    conflictOn: {
      codigo: 'ADMINISTRATIVO',
    },
  });

  console.log('Setores OK:', {
    clinica: clinica.id,
    banhoTosa: banhoTosa.id,
    administrativo: administrativo.id,
  });

  // =========================
  // PERFIS
  // =========================

  const master = await db.orm.public.Perfil.upsert({
    create: {
      nome: 'Master',
      tipo: 'MASTER',
      ativo: true,
    },
    update: {
      ativo: true,
    },
    conflictOn: {
      nome: 'Master',
      tipo: 'MASTER',
    },
  });

  const gestor = await db.orm.public.Perfil.upsert({
    create: {
      nome: 'Gestor',
      tipo: 'GESTOR',
      ativo: true,
    },
    update: {
      ativo: true,
    },
    conflictOn: {
      nome: 'Gestor',
      tipo: 'GESTOR',
    },
  });

  const recepcionista = await db.orm.public.Perfil.upsert({
    create: {
      nome: 'Recepcionista',
      tipo: 'RECEPCIONISTA',
      ativo: true,
    },
    update: {
      ativo: true,
    },
    conflictOn: {
      nome: 'Recepcionista',
      tipo: 'RECEPCIONISTA',
    },
  });

  const veterinario = await db.orm.public.Perfil.upsert({
    create: {
      nome: 'Veterinário',
      tipo: 'VETERINARIO',
      ativo: true,
    },
    update: {
      ativo: true,
    },
    conflictOn: {
      nome: 'Veterinário',
      tipo: 'VETERINARIO',
    },
  });

  console.log('Perfis OK');

  // =========================
  // PERMISSÕES
  // =========================

  const permissoes = [
    // CLIENTES
    ['cliente.visualizar', 'Visualizar clientes'],
    ['cliente.criar', 'Cadastrar clientes'],
    ['cliente.editar', 'Editar clientes'],

    // PACIENTES
    ['paciente.visualizar', 'Visualizar pacientes'],
    ['paciente.criar', 'Cadastrar pacientes'],
    ['paciente.editar', 'Editar pacientes'],

    // PRONTUÁRIO
    ['prontuario.visualizar', 'Visualizar prontuário'],
    ['prontuario.criar', 'Criar prontuário'],
    ['prontuario.editar', 'Editar prontuário'],

    // AGENDA
    ['agenda.visualizar', 'Visualizar agenda'],
    ['agenda.criar', 'Criar agendamento'],
    ['agenda.editar', 'Alterar agendamento'],
    ['agenda.checkin', 'Realizar check-in'],

    // ATENDIMENTOS
    ['atendimento.criar', 'Criar atendimento'],
    ['atendimento.visualizar', 'Visualizar atendimentos'],
    ['atendimento.editar', 'Editar atendimentos'],

    // RECEITAS E EXAMES
    ['receita.emitir', 'Emitir receitas'],
    ['exame.solicitar', 'Solicitar exames'],

    // VACINAS / PREVENTIVOS
    ['vacina.visualizar', 'Visualizar vacinas'],
    ['vacina.registrar', 'Registrar vacinas'],
    ['preventivo.registrar', 'Registrar preventivos'],

    // VENDAS
    ['venda.criar', 'Realizar venda'],
    ['venda.visualizar', 'Visualizar vendas'],
    ['venda.cancelar', 'Cancelar vendas'],
    ['venda.desconto', 'Aplicar desconto'],

    // ORÇAMENTO
    ['orcamento.criar', 'Criar orçamento'],
    ['orcamento.editar', 'Editar orçamento'],

    // FINANCEIRO
    ['financeiro.visualizar', 'Visualizar financeiro'],
    ['financeiro.editar', 'Editar financeiro'],

    // ESTOQUE
    ['estoque.visualizar', 'Visualizar estoque'],
    ['estoque.editar', 'Editar estoque'],
    ['estoque.ajustar', 'Realizar ajustes de estoque'],

    // USUÁRIOS
    ['usuario.criar', 'Criar usuários'],
    ['usuario.editar', 'Editar usuários'],
    ['usuario.desativar', 'Desativar usuários'],
    ['usuario.permissoes', 'Alterar permissões de usuários'],

    // CONFIGURAÇÕES
    ['configuracao.editar', 'Editar configurações'],

    // UNIDADES
    ['unidade.visualizar', 'Visualizar unidades'],
    ['unidade.editar', 'Administrar unidades'],
  ] as const;

  const permissaoMap = new Map<string, number>();

  for (const [codigo, descricao] of permissoes) {
    const permissao = await db.orm.public.Permissao.upsert({
      create: {
        codigo,
        descricao,
        ativo: true,
      },
      update: {
        descricao,
        ativo: true,
      },
      conflictOn: {
        codigo,
      },
    });

    permissaoMap.set(codigo, permissao.id);
  }

  console.log(`Permissões OK: ${permissaoMap.size}`);

  // =========================
  // FUNÇÃO AUXILIAR
  // =========================

  async function vincular(
    perfilId: number,
    codigoPermissao: string,
    escopo: 'OWN' | 'UNIT' | 'ALL' | null = null,
  ) {
    const permissaoId = permissaoMap.get(codigoPermissao);

    if (!permissaoId) {
      throw new Error(
        `Permissão não encontrada: ${codigoPermissao}`,
      );
    }

    await db.orm.public.PerfilPermissao.upsert({
      create: {
        perfilId,
        permissaoId,
        escopo,
      },
      update: {
        escopo,
      },
      conflictOn: {
        perfilId,
        permissaoId,
      },
    });
  }

  // =========================
  // MASTER
  // =========================

  for (const [codigo] of permissoes) {
    await vincular(master.id, codigo, 'ALL');
  }

  // =========================
  // GESTOR
  // =========================

  const permissoesGestor = [
    'cliente.visualizar',
    'cliente.criar',
    'cliente.editar',

    'paciente.visualizar',
    'paciente.criar',
    'paciente.editar',

    'prontuario.visualizar',
    'prontuario.criar',
    'prontuario.editar',

    'agenda.visualizar',
    'agenda.criar',
    'agenda.editar',
    'agenda.checkin',

    'atendimento.criar',
    'atendimento.visualizar',
    'atendimento.editar',

    'receita.emitir',
    'exame.solicitar',

    'vacina.visualizar',
    'vacina.registrar',
    'preventivo.registrar',

    'venda.criar',
    'venda.visualizar',
    'venda.cancelar',
    'venda.desconto',

    'orcamento.criar',
    'orcamento.editar',

    'financeiro.visualizar',
    'financeiro.editar',

    'estoque.visualizar',
    'estoque.editar',
    'estoque.ajustar',

    'usuario.criar',
    'usuario.editar',
    'usuario.desativar',
    'usuario.permissoes',

    'configuracao.editar',

    'unidade.visualizar',
    'unidade.editar',
  ];

  for (const codigo of permissoesGestor) {
    await vincular(gestor.id, codigo, 'ALL');
  }

  // =========================
  // RECEPCIONISTA
  // =========================

  const permissoesRecepcionista = [
    'cliente.visualizar',
    'cliente.criar',
    'cliente.editar',

    'paciente.visualizar',
    'paciente.criar',
    'paciente.editar',

    'agenda.visualizar',
    'agenda.criar',
    'agenda.editar',
    'agenda.checkin',

    'vacina.visualizar',

    'orcamento.criar',
    'orcamento.editar',

    'venda.criar',
    'venda.visualizar',
    'venda.cancelar',
    'venda.desconto',
  ];

  for (const codigo of permissoesRecepcionista) {
    await vincular(recepcionista.id, codigo, 'UNIT');
  }

  // IMPORTANTE:
  // prontuario.visualizar NÃO está sendo concedido
  // à recepção enquanto essa regra não for aprovada.

  // =========================
  // VETERINÁRIO
  // =========================

  const permissoesVeterinario = [
    'cliente.visualizar',
    'cliente.criar',
    'cliente.editar',

    'paciente.visualizar',
    'paciente.criar',
    'paciente.editar',

    'agenda.visualizar',

    'atendimento.criar',
    'atendimento.visualizar',

    'prontuario.visualizar',
    'prontuario.criar',
    'prontuario.editar',

    'receita.emitir',
    'exame.solicitar',

    'vacina.visualizar',
    'vacina.registrar',
    'preventivo.registrar',

    'orcamento.criar',

    'venda.criar',
    'venda.visualizar',
    'venda.cancelar',
    'venda.desconto',
  ];

  for (const codigo of permissoesVeterinario) {
    let escopo: 'OWN' | 'UNIT' | 'ALL' | null = 'OWN';

    if (
      codigo.startsWith('cliente.') ||
      codigo.startsWith('paciente.') ||
      codigo === 'vacina.visualizar' ||
      codigo === 'agenda.visualizar'
    ) {
      escopo = 'UNIT';
    }

    await vincular(veterinario.id, codigo, escopo);
  }

  console.log('');
  console.log('========================================');
  console.log('SEED FINALIZADO COM SUCESSO');
  console.log('========================================');
  console.log('Setores: 3');
  console.log('Perfis: 4');
  console.log(`Permissões: ${permissaoMap.size}`);
  console.log('');
}

main().catch((error) => {
  console.error('');
  console.error('ERRO AO EXECUTAR SEED');
  console.error(error);
  process.exit(1);
});