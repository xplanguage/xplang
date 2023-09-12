import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

import antlr4 from 'antlr4';

import Lexer from '#Lexer';
import Parser from '#Parser';
import Walker from '#Walker';

import Transpiler from '#Transpiler';

export default class XPL {
  constructor() {
    this.sql = false;
    this.tpl = false;

    sqlite3InitModule()
      .then((sql) => new sql.oo1.DB(':memory:', 'ct'))
      .then((sql) => sql.exec('PRAGMA journal_mode=WAL;'))
      .then((sql) => sql.exec('SAVEPOINT createDb;'))
      .then((sql) => sql.exec(`
          CREATE TABLE xpl_types (
            parentId INTEGER NOT NULL,
            typeId INTEGER PRIMARY KEY
          );

          CREATE TABLE xpl_instances (
            moduleId INTEGER NOT NULL,
            patchId INTEGER NOT NULL,
            typeId INTEGER NOT NULL,
            instanceId INTEGER PRIMARY KEY
          );

          -- __TABLE
          CREATE TABLE xpl_type_2 (
            __instanceId INTEGER NOT NULL,
            __row INTEGER PRIMARY KEY
          );

          INSERT INTO xpl_types VALUES (1, NULL); -- __NULL
          INSERT INTO xpl_types VALUES (1, NULL); -- __TABLE
        `))
      .then((sql) => sql.exec('RELEASE createDb;'))
      .then((sql) => {
        this.sql = sql;
        this.tpl = new Transpiler(this.sql);
      })
      .then(() => this.tpl.addType(2, [ // __FORMULA
        {
          name: 'formulaId',
          type: 'INTEGER',
          notnull: true,
          pk: false,
        },
      ]))
      .then(() => this.tpl.addType(2, [ // __MODULE
        {
          name: 'alias',
          type: 'VARCHAR',
          notnull: true,
          pk: false,
        },
        {
          name: 'uri',
          type: 'VARCHAR',
          notnull: true,
          pk: false,
        },
        {
          name: 'edition',
          type: 'VARCHAR',
          notnull: true,
          pk: false,
        },
      ]));
  }

  async sqlStart() {
    if (this.sql) return this.sql;

    for (let attempts = 0; attempts < 10; attempts += 1) {
      if (this.sql) return this.sql;

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }

    throw new Error('sqlite fail');
  }

  getTree(code) {
    const chars = new antlr4.InputStream(code.toString());
    const lexer = new Lexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new Parser(tokens);

    parser.buildParseTrees = true;

    return parser.parse();
  }

  eval(code) {
    this.sqlStart().then(() => {
      antlr4.tree.ParseTreeWalker.DEFAULT.walk(
        new Walker(this),
        this.getTree(code),
      );
    });
  }
}
