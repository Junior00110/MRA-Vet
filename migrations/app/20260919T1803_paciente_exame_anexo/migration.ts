#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1d59fafc5d6331c250d2427de4ff70ae1f67ff50599d89258a680ea44d9f3d89/contract';
import endContract from '../../snapshots/1d59fafc5d6331c250d2427de4ff70ae1f67ff50599d89258a680ea44d9f3d89/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/5401d2a2cd2fac5c999ed4ac140c27c62e0e0e65d933ee506afec81e20ddc148/contract';
import startContract from '../../snapshots/5401d2a2cd2fac5c999ed4ac140c27c62e0e0e65d933ee506afec81e20ddc148/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'pacienteExameAnexo',
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
          col('exameId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('mimeType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nomeArmazenado', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nomeOriginal', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('profissionalNome', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('profissionalUsuarioId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('storageKey', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tamanhoBytes', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'pacienteExameAnexo',
        constraint: 'pacienteExameAnexo_storageKey_key',
        columns: ['storageKey'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacienteExameAnexo',
        index: 'pacienteExameAnexo_exameId_idx_5f86ea62',
        columns: ['exameId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacienteExameAnexo',
        foreignKey: {
          name: 'pacienteExameAnexo_exameId_fkey',
          columns: ['exameId'],
          references: { schema: 'public', table: 'pacienteExame', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
