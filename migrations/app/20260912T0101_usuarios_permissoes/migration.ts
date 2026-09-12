#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/5d1ac9f2e44f2cc5e5d2997269388e616cea050221837bfe9102edb04331e6a3/contract';
import endContract from '../../snapshots/5d1ac9f2e44f2cc5e5d2997269388e616cea050221837bfe9102edb04331e6a3/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/948ce99830977ef9160bbf441ce431fe4bc5da515e410b3705c8f42460a57961/contract';
import startContract from '../../snapshots/948ce99830977ef9160bbf441ce431fe4bc5da515e410b3705c8f42460a57961/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'perfil',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tipo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'perfil_tipo_check_3b83720c',
            "\"tipo\" IN ('MASTER', 'GESTOR', 'RECEPCIONISTA', 'VETERINARIO')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'perfilPermissao',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('escopo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('perfilId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('permissaoId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'perfilPermissao_escopo_check_02c188df',
            "\"escopo\" IN ('OWN', 'UNIT', 'ALL')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'permissao',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('codigo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('descricao', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'setor',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('codigo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'setor_codigo_check_6f643a5b',
            "\"codigo\" IN ('CLINICA', 'BANHO_TOSA', 'ADMINISTRATIVO')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'unidade',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('codigo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'usuario',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isMaster', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('senhaHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'usuarioSetor',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('perfilId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('setorId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('usuarioId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'usuarioUnidade',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('unidadeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('usuarioId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'perfil',
        constraint: 'perfil_nome_tipo_key',
        columns: ['nome', 'tipo'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'perfilPermissao',
        constraint: 'perfilPermissao_perfilId_permissaoId_key',
        columns: ['perfilId', 'permissaoId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'permissao',
        constraint: 'permissao_codigo_key',
        columns: ['codigo'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'setor',
        constraint: 'setor_codigo_key',
        columns: ['codigo'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'unidade',
        constraint: 'unidade_codigo_key',
        columns: ['codigo'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'usuario',
        constraint: 'usuario_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'usuarioSetor',
        constraint: 'usuarioSetor_usuarioId_setorId_key',
        columns: ['usuarioId', 'setorId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'usuarioUnidade',
        constraint: 'usuarioUnidade_usuarioId_unidadeId_key',
        columns: ['usuarioId', 'unidadeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'perfilPermissao',
        index: 'perfilPermissao_perfilId_idx_18f1fe5e',
        columns: ['perfilId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'perfilPermissao',
        index: 'perfilPermissao_permissaoId_idx_32efd59e',
        columns: ['permissaoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'usuarioSetor',
        index: 'usuarioSetor_perfilId_idx_18f1fe5e',
        columns: ['perfilId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'usuarioSetor',
        index: 'usuarioSetor_setorId_idx_e3349e5c',
        columns: ['setorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'usuarioSetor',
        index: 'usuarioSetor_usuarioId_idx_5f01c7d6',
        columns: ['usuarioId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'usuarioUnidade',
        index: 'usuarioUnidade_unidadeId_idx_af675c1c',
        columns: ['unidadeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'usuarioUnidade',
        index: 'usuarioUnidade_usuarioId_idx_5f01c7d6',
        columns: ['usuarioId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'perfilPermissao',
        foreignKey: {
          name: 'perfilPermissao_perfilId_fkey',
          columns: ['perfilId'],
          references: { schema: 'public', table: 'perfil', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'perfilPermissao',
        foreignKey: {
          name: 'perfilPermissao_permissaoId_fkey',
          columns: ['permissaoId'],
          references: { schema: 'public', table: 'permissao', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'usuarioSetor',
        foreignKey: {
          name: 'usuarioSetor_usuarioId_fkey',
          columns: ['usuarioId'],
          references: { schema: 'public', table: 'usuario', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'usuarioSetor',
        foreignKey: {
          name: 'usuarioSetor_setorId_fkey',
          columns: ['setorId'],
          references: { schema: 'public', table: 'setor', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'usuarioSetor',
        foreignKey: {
          name: 'usuarioSetor_perfilId_fkey',
          columns: ['perfilId'],
          references: { schema: 'public', table: 'perfil', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'usuarioUnidade',
        foreignKey: {
          name: 'usuarioUnidade_usuarioId_fkey',
          columns: ['usuarioId'],
          references: { schema: 'public', table: 'usuario', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'usuarioUnidade',
        foreignKey: {
          name: 'usuarioUnidade_unidadeId_fkey',
          columns: ['unidadeId'],
          references: { schema: 'public', table: 'unidade', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
