import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

export default class DB {
  constructor() {
    this.sqlite = false;

    sqlite3InitModule()
      .then((sqlite3) => {
        this.sqlite = new sqlite3.oo1.DB(':memory:', 'ct');
      }).then(() => this.createDb());
  }

  async createDb() {
    await this.sql().then((sql) => sql.exec({
        sql: `CREATE TABLE xpl_tables (
            id INTEGER PRIMARY KEY,
            parent_id INTEGER NOT NULL,
            label VARCHAR
          );`,
    }));

    const adam = await this.sql().then((sql) => sql.prepare(`
      INSERT INTO xpl_tables VALUES(NULL, ?, ?);
    `));

    // the null table
    adam.bind([1, `@@`,]);
    adam.step();
    adam.reset();

    // the formulaic table
    adam.bind([1, `@@@`,]);
    adam.step();
    adam.reset();

    // the table type
    adam.bind([1, `__TABLE`,]);
    adam.step();
    adam.reset();

    // the number type
    adam.bind([3, `__NUMBER`,]);
    adam.step();
    adam.reset();

    // dump xpl_tables for debugging
    this.$dumpTables = await this.sql()
      .then((sql) => sql.exec(
        `SELECT * FROM xpl_tables AS tbl
      `));

    // precompile all prepared statements
    this.$getParentId = await this.sql()
      .then((sql) => sql.prepare(
        `
      SELECT
          tbl.id
          FROM xpl_tables AS tbl
          WHERE tbl.label = ?
      `));
  }

  async dumpTables() {
    await this.sql();

    await this.$dumpTables.step();
    const tables = await this.$dumpTables.get({});
    await this.$dumpTables.reset();
    return tables;
  }

  async getParentId(parentType) {
    await this.sql();

    await this.$getParentId.bind(parentType);
    await this.$getParentId.step();
    const parentId = await this.$getParentId.get({}).id;
    await this.$getParentId.reset();
    return parentId;
  }

  async addTable(
    module = null,
    patch = null,
    parent = `__TABLE`,
    label = null,
    batch,
    data
  ) {
    // console.table(batch);
    // console.table(data);

    console.log(await this.dumpTables());
    console.log(await this.getParentId(parent));

    return;

    /*
    await this.sql().then((sql) => sql.selectObjects(
        `SELECT * FROM xpl_tables;`
      )).then((tbl) => console.table(tbl));
    */
  }

  sql() {
    return new Promise((resolve, reject) => {
      if (this.sqlite) resolve(this.sqlite);

      let attempts = 0;
      const loadingSqlite = setInterval(() => {
        if (attempts > 5) {
          clearInterval(loadingSqlite);
          reject(Error('failed to load sqlite'));
        }
        if (this.sqlite) resolve(this.sqlite);
        attempts += 1;
      }, 500);
    });
  }
}
