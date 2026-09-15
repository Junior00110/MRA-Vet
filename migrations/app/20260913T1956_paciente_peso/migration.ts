#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/5bfa2e0fe14e201ae729128e40288dff0d532534c63b2cf964efb257553af588/contract';
import startContract from '../../snapshots/5bfa2e0fe14e201ae729128e40288dff0d532534c63b2cf964efb257553af588/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/db373f13f9f0d94bd8f7a75c60aa5c5b994141e9d680c96c96a5033afe58674a/contract';
import endContract from '../../snapshots/db373f13f9f0d94bd8f7a75c60aa5c5b994141e9d680c96c96a5033afe58674a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'pacientePeso',
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
          col('dataPesagem', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('observacoes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pacienteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('peso', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('profissionalNome', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('profissionalUsuarioId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacientePeso',
        index: 'pacientePeso_pacienteId_idx_8734dc3f',
        columns: ['pacienteId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacientePeso',
        foreignKey: {
          name: 'pacientePeso_pacienteId_fkey',
          columns: ['pacienteId'],
          references: { schema: 'public', table: 'paciente', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
