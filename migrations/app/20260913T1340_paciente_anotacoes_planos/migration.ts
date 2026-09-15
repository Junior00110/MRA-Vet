#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/21a03c0dcd2fe0d603ffa8c04bc8645a8be8418e94ab312e4d392cc5ecfb583b/contract';
import endContract from '../../snapshots/21a03c0dcd2fe0d603ffa8c04bc8645a8be8418e94ab312e4d392cc5ecfb583b/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/5d1ac9f2e44f2cc5e5d2997269388e616cea050221837bfe9102edb04331e6a3/contract';
import startContract from '../../snapshots/5d1ac9f2e44f2cc5e5d2997269388e616cea050221837bfe9102edb04331e6a3/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'pacienteAnotacao',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('criadoPorNome', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('criadoPorUsuarioId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('pacienteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('texto', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'pacientePlano',
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
          col('numeroCarteirinha', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('observacoes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pacienteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('validade', 'date', { codecRef: { codecId: 'pg/date-string@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacienteAnotacao',
        index: 'pacienteAnotacao_pacienteId_idx_8734dc3f',
        columns: ['pacienteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacientePlano',
        index: 'pacientePlano_pacienteId_idx_8734dc3f',
        columns: ['pacienteId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacienteAnotacao',
        foreignKey: {
          name: 'pacienteAnotacao_pacienteId_fkey',
          columns: ['pacienteId'],
          references: { schema: 'public', table: 'paciente', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacientePlano',
        foreignKey: {
          name: 'pacientePlano_pacienteId_fkey',
          columns: ['pacienteId'],
          references: { schema: 'public', table: 'paciente', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
