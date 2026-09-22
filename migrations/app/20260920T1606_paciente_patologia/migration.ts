#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/5b97a057d73caa2f32421a7fbd230f60e5fcd6c19b53a874dec5611902579393/contract';
import startContract from '../../snapshots/5b97a057d73caa2f32421a7fbd230f60e5fcd6c19b53a874dec5611902579393/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f18f1124634f986ee835f2c2583de629da150035bb87e8142aa8f5888be10687/contract';
import endContract from '../../snapshots/f18f1124634f986ee835f2c2583de629da150035bb87e8142aa8f5888be10687/contract.json' with { type: 'json' };
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
        table: 'pacientePatologia',
        columns: [
          col('atendimentoId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
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
          col('dataRegistro', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('observacoes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pacienteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('patologiaOrigemId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('profissionalNome', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('profissionalUsuarioId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'pacientePatologia_status_check_0fb0281a',
            "\"status\" IN ('SUSPEITA', 'CONFIRMADA', 'RESOLVIDA', 'SEM_PROBLEMA_CLINICO')",
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'pacienteAtendimento',
        column: col('statusAtendimento', 'text', {
          notNull: true,
          default: lit('FINALIZADO'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'pacienteAtendimento',
        constraint: 'pacienteAtendimento_statusAtendimento_check_1e2f0699',
        expression:
          "\"statusAtendimento\" IN ('EM_ANDAMENTO', 'AGUARDANDO_PATOLOGIA', 'FINALIZADO')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacientePatologia',
        index: 'pacientePatologia_atendimentoId_idx_b14914dc',
        columns: ['atendimentoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacientePatologia',
        index: 'pacientePatologia_pacienteId_idx_8734dc3f',
        columns: ['pacienteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacientePatologia',
        index: 'pacientePatologia_patologiaOrigemId_idx_4352d26d',
        columns: ['patologiaOrigemId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacientePatologia',
        foreignKey: {
          name: 'pacientePatologia_pacienteId_fkey',
          columns: ['pacienteId'],
          references: { schema: 'public', table: 'paciente', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacientePatologia',
        foreignKey: {
          name: 'pacientePatologia_atendimentoId_fkey',
          columns: ['atendimentoId'],
          references: { schema: 'public', table: 'pacienteAtendimento', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacientePatologia',
        foreignKey: {
          name: 'pacientePatologia_patologiaOrigemId_fkey',
          columns: ['patologiaOrigemId'],
          references: { schema: 'public', table: 'pacientePatologia', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
