#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/22828e8b5a6393baf1798242d850cf06006897ed8319d9da62b0fad1393fe3ef/contract';
import startContract from '../../snapshots/22828e8b5a6393baf1798242d850cf06006897ed8319d9da62b0fad1393fe3ef/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/5bfa2e0fe14e201ae729128e40288dff0d532534c63b2cf964efb257553af588/contract';
import endContract from '../../snapshots/5bfa2e0fe14e201ae729128e40288dff0d532534c63b2cf964efb257553af588/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'pacienteAnotacao',
        column: col('ativo', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
