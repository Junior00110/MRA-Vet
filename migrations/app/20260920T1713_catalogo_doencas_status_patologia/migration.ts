#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/25dd399e6846636ff5e2da9cd5283b812f624af0df041b5f24f3f750e310e308/contract';
import endContract from '../../snapshots/25dd399e6846636ff5e2da9cd5283b812f624af0df041b5f24f3f750e310e308/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f18f1124634f986ee835f2c2583de629da150035bb87e8142aa8f5888be10687/contract';
import startContract from '../../snapshots/f18f1124634f986ee835f2c2583de629da150035bb87e8142aa8f5888be10687/contract.json' with { type: 'json' };
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
      this.dropCheckConstraint({
        schema: 'public',
        table: 'pacientePatologia',
        constraint: 'pacientePatologia_status_check_0fb0281a',
      }),
      this.createTable({
        schema: 'public',
        table: 'doencaVeterinaria',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('categoria', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('especie', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sinonimos', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'doencaVeterinaria_especie_check_992bef08',
            "\"especie\" IN ('CANINO', 'FELINO', 'AMBOS')",
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'pacientePatologia',
        column: col('doencaId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'doencaVeterinaria',
        constraint: 'doencaVeterinaria_nome_especie_key',
        columns: ['nome', 'especie'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'pacientePatologia',
        constraint: 'pacientePatologia_status_check_1a591222',
        expression:
          "\"status\" IN ('SUSPEITA', 'EM_ACOMPANHAMENTO', 'TRATADA', 'SEM_PROBLEMA_CLINICO')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'pacientePatologia',
        index: 'pacientePatologia_doencaId_idx_09d96f81',
        columns: ['doencaId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pacientePatologia',
        foreignKey: {
          name: 'pacientePatologia_doencaId_fkey',
          columns: ['doencaId'],
          references: { schema: 'public', table: 'doencaVeterinaria', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
