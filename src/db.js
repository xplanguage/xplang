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

    await sqlite.exec({
      sql: `CREATE TABLE xpl_types (
            parentId INTEGER NOT NULL,
            typeId INTEGER PRIMARY KEY
          );`,
    });

    const rootTypes = [
      { parentId: 1, type: 1 }, // __NULL / @@
      { parentId: 1, type: 2 }, // __FORMULA / @@@
      { parentId: 1, type: 3 }, // __TABLE / #
      { parentId: 3, type: 4 }, // __MODULE / #! -m ???
      { parentId: 3, type: 5 }, // __PATCH / @@:: () {}
      { parentId: 3, type: 6 }, // __NUMBER
      { parentId: 6, type: 7 }, // __BOOLEAN / &
      { parentId: 6, type: 8 }, // __STRING / $
    ];

    rootTypes.forEach(async (rootType) => {
      await sqlite.exec({
        sql: [
          'INSERT INTO xpl_types VALUES($parentId, NULL);',
        ],
        bind: { $parentId: rootType.parentId },
      });
    });

    return sqlite;
  }

  async addType(moduleId, patchId, parentId = 3, batch = []) {
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

    return rowId;
  }

  async dumpTypes() {
    return this.sql().then((sql) => sql.selectObjects(`
      SELECT * FROM xpl_types;
    `));
  }
}
