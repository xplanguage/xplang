import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

export default class DB {
  constructor() {
    this.sqlite = false;

    sqlite3InitModule()
      .then((sqlite3) => this.sqlite = new sqlite3.oo1.DB('xpl', 'ct'));
  }

  async addTable(batch, data) {
    const x = await this.sql().then(sql => sql.selectArray("SELECT 1 + 1;"));
    console.log("test");
    console.log(batch, data);
  }

  sql() {
    return new Promise((resolve, reject) => {
      if (this.sqlite) resolve(this.sqlite);

      let attempts = 0;
      const loadingSqlite = setInterval(() => {
        if (attempts > 5) reject("failed to load sqlite");
        if (this.sqlite) resolve(this.sqlite);
        attempts++;
      }, 500);
    });
  }
}
