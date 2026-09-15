#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/21a03c0dcd2fe0d603ffa8c04bc8645a8be8418e94ab312e4d392cc5ecfb583b/contract';
import startContract from '../../snapshots/21a03c0dcd2fe0d603ffa8c04bc8645a8be8418e94ab312e4d392cc5ecfb583b/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/22828e8b5a6393baf1798242d850cf06006897ed8319d9da62b0fad1393fe3ef/contract';
import endContract from '../../snapshots/22828e8b5a6393baf1798242d850cf06006897ed8319d9da62b0fad1393fe3ef/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'pacienteAtendimento',
        columns: [
          col('anamnese', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('conduta', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('dataAtendimento', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('diagnosticoSuspeita', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('exameClinico', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('motivoConsulta', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('observacoes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pacienteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
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
        table: 'pacienteAtendimento',
        index: 'pacienteAtendimento_pacienteId_idx_8734dc3f',
        columns: ['pacienteId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacienteAtendimento',
        foreignKey: {
          name: 'pacienteAtendimento_pacienteId_fkey',
          columns: ['pacienteId'],
          references: { schema: 'public', table: 'paciente', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
