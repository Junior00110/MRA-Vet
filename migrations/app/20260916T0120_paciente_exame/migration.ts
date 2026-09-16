#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/5401d2a2cd2fac5c999ed4ac140c27c62e0e0e65d933ee506afec81e20ddc148/contract';
import endContract from '../../snapshots/5401d2a2cd2fac5c999ed4ac140c27c62e0e0e65d933ee506afec81e20ddc148/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/afb87027184f0717a9def726e4320e2f5848289763b0ae35b4ed93ad0f776326/contract';
import startContract from '../../snapshots/afb87027184f0717a9def726e4320e2f5848289763b0ae35b4ed93ad0f776326/contract.json' with { type: 'json' };
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
        table: 'pacienteExame',
        columns: [
          col('atendimentoId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
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
          col('dataRealizacao', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('dataResultado', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('dataSolicitacao', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('laboratorio', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('observacoes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pacienteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('profissionalNome', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('profissionalUsuarioId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('resultado', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('SOLICITADO'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('tipo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'pacienteExame_status_check_a75c9294',
            "\"status\" IN ('SOLICITADO', 'REALIZADO', 'RESULTADO_DISPONIVEL', 'CANCELADO')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacienteExame',
        index: 'pacienteExame_atendimentoId_idx_b14914dc',
        columns: ['atendimentoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacienteExame',
        index: 'pacienteExame_pacienteId_idx_8734dc3f',
        columns: ['pacienteId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacienteExame',
        foreignKey: {
          name: 'pacienteExame_pacienteId_fkey',
          columns: ['pacienteId'],
          references: { schema: 'public', table: 'paciente', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacienteExame',
        foreignKey: {
          name: 'pacienteExame_atendimentoId_fkey',
          columns: ['atendimentoId'],
          references: { schema: 'public', table: 'pacienteAtendimento', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
