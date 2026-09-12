import 'dotenv/config';
import { randomBytes, scryptSync } from 'node:crypto';
import { db } from '../src/prisma/db.js';

const EMAIL_MASTER = 'waldsoncardoso1@gmail.com';
const NOME_MASTER = 'Master MRA Vet';

const UNIDADE_NOME = 'Mr Zoo BeiraMar';
const UNIDADE_CODIGO = 'MRZOO_BEIRAMAR';

function gerarHashSenha(senha: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, salt, 64).toString('hex');

  return `scrypt$${salt}$${hash}`;
}

async function main() {
  console.log('');
  console.log('========================================');
  console.log('CRIAÇÃO DO USUÁRIO MASTER - MRA VET');
  console.log('========================================');
  console.log('');

  const senha = process.env['MASTER_PASSWORD'];

  if (!senha) {
    throw new Error(
      'MASTER_PASSWORD não definida. Defina a senha no terminal antes de executar o script.',
    );
  }

  if (senha.length < 8) {
    throw new Error(
      'A senha do Master deve possuir pelo menos 8 caracteres.',
    );
  }

  // ========================================
  // UNIDADE
  // ========================================

  const unidade = await db.orm.public.Unidade.upsert({
    create: {
      nome: UNIDADE_NOME,
      codigo: UNIDADE_CODIGO,
      ativo: true,
    },

    update: {
      nome: UNIDADE_NOME,
      ativo: true,
    },

    conflictOn: {
      codigo: UNIDADE_CODIGO,
    },
  });

  console.log(`Unidade OK: ${unidade.nome}`);

  // ========================================
  // PERFIL MASTER
  // ========================================

  const perfilMaster = await db.orm.public.Perfil.upsert({
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

  // ========================================
  // SETOR ADMINISTRATIVO
  // ========================================

  const setorAdministrativo = await db.orm.public.Setor.upsert({
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

  // ========================================
  // SETOR CLÍNICA
  // ========================================

  const setorClinica = await db.orm.public.Setor.upsert({
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

  // ========================================
  // USUÁRIO MASTER
  // ========================================

  const senhaHash = gerarHashSenha(senha);

  const usuario = await db.orm.public.Usuario.upsert({
    create: {
      nome: NOME_MASTER,
      email: EMAIL_MASTER,
      senhaHash,
      ativo: true,
      isMaster: true,
    },

    update: {
      nome: NOME_MASTER,
      senhaHash,
      ativo: true,
      isMaster: true,
    },

    conflictOn: {
      email: EMAIL_MASTER,
    },
  });

  console.log(`Usuário Master OK: ${usuario.email}`);

  // ========================================
  // MASTER → ADMINISTRATIVO
  // ========================================

  await db.orm.public.UsuarioSetor.upsert({
    create: {
      usuarioId: usuario.id,
      setorId: setorAdministrativo.id,
      perfilId: perfilMaster.id,
      ativo: true,
    },

    update: {
      perfilId: perfilMaster.id,
      ativo: true,
    },

    conflictOn: {
      usuarioId: usuario.id,
      setorId: setorAdministrativo.id,
    },
  });

  // ========================================
  // MASTER → CLÍNICA
  // ========================================

  await db.orm.public.UsuarioSetor.upsert({
    create: {
      usuarioId: usuario.id,
      setorId: setorClinica.id,
      perfilId: perfilMaster.id,
      ativo: true,
    },

    update: {
      perfilId: perfilMaster.id,
      ativo: true,
    },

    conflictOn: {
      usuarioId: usuario.id,
      setorId: setorClinica.id,
    },
  });

  // ========================================
  // MASTER → UNIDADE
  // ========================================

  await db.orm.public.UsuarioUnidade.upsert({
    create: {
      usuarioId: usuario.id,
      unidadeId: unidade.id,
    },

    update: {},

    conflictOn: {
      usuarioId: usuario.id,
      unidadeId: unidade.id,
    },
  });

  console.log('');
  console.log('========================================');
  console.log('MASTER CRIADO COM SUCESSO');
  console.log('========================================');
  console.log(`Nome: ${usuario.nome}`);
  console.log(`E-mail: ${usuario.email}`);
  console.log(`Unidade: ${unidade.nome}`);
  console.log('Setores: Administrativo + Clínica');
  console.log('Perfil: MASTER');
  console.log('');
}

main().catch((error) => {
  console.error('');
  console.error('ERRO AO CRIAR MASTER');
  console.error(error);
  process.exit(1);
});