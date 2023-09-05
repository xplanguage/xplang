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
    await sqlite.exec({
      sql: `CREATE TABLE xpl_tables (
            moduleId INTEGER NOT NULL,
            patchId INTEGER NOT NULL,
            parentId INTEGER NOT NULL,
            tableId INTEGER PRIMARY KEY
          );`,
    });

    this.stmt = new Statements();
    await this.stmt.compile(sqlite);

    await this.addTable(0, 0, 1);
    await this.addTable(0, 0, 1);
    await this.addTable(0, 0, 1);
    await this.addTable(0, 0, 3);

    return sqlite;
  }

  async dumpTables() {
    return this.sql().then((sql) => sql.selectObjects(`
      SELECT * FROM xpl_tables;
    `));
  }

  async addTable(
    moduleId = null,
    patchId = null,
    parentId = 3, // table table
    batch = [],
    data = [],
  ) {
    await this.stmt.$addTable.bind({
      $moduleId: moduleId,
      $patchId: patchId,
      $parentId: parentId,
    });
    await this.stmt.$addTable.step();
    await this.stmt.$addTable.reset();

    // TODO: return tableId
  }
}
