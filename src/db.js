import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

import Statements from '#DBStatements';

export default class DB {
  constructor() {
    this.sqlite = false;
    this.loaded = false;

    sqlite3InitModule()
      .then((sqlite) => new sqlite.oo1.DB(':memory:', 'ct'))
      .then((sqlite) => this.createDb(sqlite))
      .then((sqlite) => {
        this.sqlite = sqlite;
      });
  }

  async sql() {
    if (this.sqlite) return this.sqlite;

    for (let attempts = 0; attempts < 10; attempts += 1) {
      if (this.sqlite) return this.sqlite;

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }

    throw new Error('sqlite fail');
  }

  async createDb(sqlite) {
    this.stmt = new Statements();
    // await this.stmt.compile(sqlite);

    await sqlite.exec({ sql: 'PRAGMA journal_mode=WAL;' });

    await sqlite.exec({ sql: 'SAVEPOINT createDb;' });

    await sqlite.exec({
      sql: this.table2sql('xpl_types', [
        {
          name: 'parentId',
          type: 'INTEGER',
          notnull: true,
          pk: false,
        },
        {
          name: 'typeId',
          type: 'INTEGER',
          notnull: false,
          pk: true,
        },
      ]),
    });

    const rootTypes = [
      { parentId: 1, type: 1 }, // __NULL / @@
      { parentId: 1, type: 2 }, // __FORMULA / @@@
      { parentId: 1, type: 3 }, // __TABLE / #
      /*      { parentId: 3, type: 4 }, // __MODULE / #! -m ???
      { parentId: 3, type: 5 }, // __PATCH / @@:: () {}
      { parentId: 3, type: 6 }, // __NUMBER
      { parentId: 6, type: 7 }, // __BOOLEAN / &
      { parentId: 6, type: 8 }, // __STRING / $
      */
    ];

    rootTypes.forEach(async (rootType) => {
      await sqlite.exec({
        sql: [
          'INSERT INTO xpl_types VALUES($parentId, NULL);',
        ],
        bind: { $parentId: rootType.parentId },
      });
    });

    await sqlite.exec({
      sql: this.table2sql('xpl_instances', [
        {
          name: 'moduleId',
          type: 'INTEGER',
          notnull: true,
          pk: false,
        },
        {
          name: 'patchId',
          type: 'INTEGER',
          notnull: true,
          pk: false,
        },
        {
          name: 'typeId',
          type: 'INTEGER',
          notnull: true,
          pk: false,
        },
        {
          name: 'instanceId',
          type: 'INTEGER',
          notnull: false,
          pk: true,
        },
      ]),
    });

    await sqlite.exec({
      sql: [
        'INSERT INTO xpl_instances VALUES(1, 1, 3, NULL);',
      ],
    });

    await sqlite.exec({
      sql: this.table2sql('xpl_type_3', [
        {
          name: '__INSTANCE_ID',
          type: 'INTEGER',
          notnull: true,
          pk: false,
        },
        {
          name: '__ROW',
          type: 'INTEGER',
          notnull: false,
          pk: true,
        },
      ]),
    });

    await sqlite.exec({ sql: 'RELEASE createDb;' });

    return sqlite;
  }

  async addType(parentId = 3, batch = []) {
    await this.sql().then((sql) => sql.exec({ sql: 'SAVEPOINT addType;' }));

    let rowId = null;
    await this.sql().then((sql) => sql.exec({
      sql: [
        'INSERT INTO xpl_types VALUES($parentId, NULL);',
        'SELECT last_insert_rowid();',
      ],
      bind: { $parentId: parentId },
      callback: (row) => {
        [rowId] = row;
      },
    }));

    const tableInfo = await this.sql().then((sql) => sql.selectObjects(`
        PRAGMA TABLE_INFO('xpl_type_${parentId}');
    `));

    // console.log(this.table2sql(`xpl_type_${rowId}`, tableInfo));

    await this.sql().then((sql) => sql.exec({ sql: 'RELEASE addType;' }));

    return rowId;
  }

  // async addInstance(moduleId, patchId, typeId, batch = []) {}

  table2sql(name, fields = []) {
    const fieldString = fields.map((field) => {
      const notnull = field.notnull ? ' NOT NULL' : '';
      const pk = field.pk ? ' PRIMARY KEY' : '';

      return `\t${field.name} ${field.type}${notnull}${pk}`;
    }).join(',\n');

    return `CREATE TABLE ${name} (\n${fieldString}\n) STRICT;`;
  }

  async dumpTypes() {
    return this.sql().then((sql) => sql.selectObjects(`
      SELECT * FROM xpl_types;
    `));
  }

  async dumpInstances() {
    return this.sql().then((sql) => sql.selectObjects(`
      SELECT * FROM xpl_instances;
    `));
  }
}
