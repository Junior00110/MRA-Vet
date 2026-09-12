#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/948ce99830977ef9160bbf441ce431fe4bc5da515e410b3705c8f42460a57961/contract';
import endContract from '../../snapshots/948ce99830977ef9160bbf441ce431fe4bc5da515e410b3705c8f42460a57961/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'cliente',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('bairro', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('cep', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('cidade', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('codigoAntigo', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('complemento', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('cpf', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('endereco', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('estado', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('numero', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('observacoes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('telefone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('whatsapp', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'paciente',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('castrado', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('clienteId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('codigoAntigo', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('corPelagem', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('dataNascimento', 'date', { codecRef: { codecId: 'pg/date-string@1' } }),
          col('especie', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('microchip', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('observacoes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('peso', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('raca', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sexo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'cliente',
        constraint: 'cliente_codigoAntigo_key',
        columns: ['codigoAntigo'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'paciente',
        constraint: 'paciente_codigoAntigo_key',
        columns: ['codigoAntigo'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'paciente',
        index: 'paciente_clienteId_idx_7ae16308',
        columns: ['clienteId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'paciente',
        foreignKey: {
          name: 'paciente_clienteId_fkey',
          columns: ['clienteId'],
          references: { schema: 'public', table: 'cliente', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
