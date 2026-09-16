#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/afb87027184f0717a9def726e4320e2f5848289763b0ae35b4ed93ad0f776326/contract';
import endContract from '../../snapshots/afb87027184f0717a9def726e4320e2f5848289763b0ae35b4ed93ad0f776326/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/db373f13f9f0d94bd8f7a75c60aa5c5b994141e9d680c96c96a5033afe58674a/contract';
import startContract from '../../snapshots/db373f13f9f0d94bd8f7a75c60aa5c5b994141e9d680c96c96a5033afe58674a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'pacienteVacina',
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
          col('dataAplicacao', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('dose', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('fabricante', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lote', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('observacoes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pacienteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('profissionalNome', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('profissionalUsuarioId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('proximaDose', 'date', { codecRef: { codecId: 'pg/date-string@1' } }),
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
        table: 'pacienteVacina',
        index: 'pacienteVacina_pacienteId_idx_8734dc3f',
        columns: ['pacienteId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacienteVacina',
        foreignKey: {
          name: 'pacienteVacina_pacienteId_fkey',
          columns: ['pacienteId'],
          references: { schema: 'public', table: 'paciente', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
