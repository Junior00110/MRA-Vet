#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/1d59fafc5d6331c250d2427de4ff70ae1f67ff50599d89258a680ea44d9f3d89/contract';
import startContract from '../../snapshots/1d59fafc5d6331c250d2427de4ff70ae1f67ff50599d89258a680ea44d9f3d89/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/5b97a057d73caa2f32421a7fbd230f60e5fcd6c19b53a874dec5611902579393/contract';
import endContract from '../../snapshots/5b97a057d73caa2f32421a7fbd230f60e5fcd6c19b53a874dec5611902579393/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'pacienteAtendimento',
        column: col('atendimentoOrigemId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'pacienteAtendimento',
        column: col('evolucao', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'pacienteAtendimento',
        column: col('tipo', 'text', {
          notNull: true,
          default: lit('CONSULTA'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'pacienteAtendimento',
        constraint: 'pacienteAtendimento_tipo_check_10b78058',
        expression: "\"tipo\" IN ('CONSULTA', 'RETORNO')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacienteAtendimento',
        index: 'pacienteAtendimento_atendimentoOrigemId_idx_b3773bde',
        columns: ['atendimentoOrigemId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacienteAtendimento',
        foreignKey: {
          name: 'pacienteAtendimento_atendimentoOrigemId_fkey',
          columns: ['atendimentoOrigemId'],
          references: { schema: 'public', table: 'pacienteAtendimento', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
