export default class Transpiler {
  constructor(sql) {
    this.sql = sql;
  }

  async addTable(tbl, parent = 2) {
    let batch = [];
    let data = [];

    if (tbl.batch()) batch = this.getBatch(tbl.batch().children);

    if (tbl.tableData()) data = this.getData(tbl.tableData().children);

    const typeId = await this.addType(parent, batch);

    // TODO: Implement instance
    // const tableInstance = await this.db.addInstance(tableType, data);

    // TODO: return instanceId
  }

  getBatch(batch) {
    const batchItems = [];

    batch.forEach((batchItem) => {
      if (!batchItem?.batchName) return;

      const item = {};

      item.private = batchItem.priv() ? true : false;
      item.protect = batchItem.prot() ? true : false;

      if (!batchItem.type()) {
        item.type = '_number';
      } else if (batchItem.type().typeString()) {
        item.type = '_string';
      } else if (batchItem.type().typeBoolean()) {
        item.type = '_boolean';
      } else if (batchItem.type().typeTable()) {
        item.type = '_table';
      } else if (batchItem.type().typeFormulaic()) {
        item.type = '_formulaic';
      } else if (batchItem.type().null_()) {
        item.type = '_null';
      } else {
        item.type = batchItem.type().typeName().getText();
      }

      item.name = batchItem.batchName().getText();

      item.mutable = batchItem.mutable() ? true : false;
      item.nullable = batchItem.nullable() ? true : false;

      item.unique = batchItem.unique() ? true : false;

      if (item.type === '_null') {
        item.primitive = true;
        item.default = null;
        batchItems.push(item);
        return;
      }

      // primitives store value, other stores pointer

      if (item.type === '_number' || item.type === '_boolean') {
        // TODO: The primitives should be wasm primitives
        item.primitive = true;
        // allowing null is okay even if not nullable, since values
        // can be added as arguments or config --set insertions
        item.default = batchItem.batchDefault()?.getText() || null;
        batchItems.push(item);
        return;
      }

      item.primitive = false;

      if (batchItem.batchDefault()) {
        const value = this.formulaic.createValue(batchItem.batchDefault());
        item.default = this.formulaic.getIndex(value);
      } else {
        item.default = null;
      }

      batchItems.push(item);
    });

    return batchItems;
  }

  batch2table(batch) {
    return batch.map((field) => ({
      name: field.name,
      type: 'INTEGER',
      notnull: field.nullable ? 0 : 1,
      pk: 0,
      unique: field.unique ? 1 : 0,
      priv: field.priv? 1 : 0,
      prot: field.prot? 1 : 0,
      mutable: field.mutable ? 1 : 0,
    }));
  }

  table2sql(name, fields = []) {
    const fieldString = fields.map((field) => {
      const notnull = field.notnull ? ' NOT NULL' : '';
      const pk = field.pk ? ' PRIMARY KEY' : '';
      const unique = field.unique ? ' UNIQUE' : '';

      let privprot = '';
      if (field.private) privprot = '!!';
      if (field.protected) privprot = '!';

      let mutable = '';
      if (field.mutable) mutable = '*';

      return `\t"${privprot}${field.name}${mutable}" ${field.type}${notnull}${pk}${unique}`;
    }).join(',\n');

    return `CREATE TABLE "${name}" (\n${fieldString}\n) STRICT;`;
  }

  getData(data) {
    const rows = [];
    data.forEach((dataRow) => {
      const row = [];

      dataRow.tableField().forEach((dataItem) => {
        const item = {
          primitive: undefined,
          value: undefined,
        };

        if (dataItem.formulaic().null_()) {
          item.primitive = true;
          item.value = null;
        } else if (dataItem.formulaic().number()) {
          item.primitive = true;
          item.value = dataItem.formulaic().getText();
        } else {
          item.primitive = false;

          // TODO: Implement formulas
          // const value = this.formulaic.createValue(dataItem);
          // item.value = this.formulaic.getIndex(value);
        }

        row.push(item);
      });

      rows.push(row);
    });
    return rows;
  }

  async addType(parentId = 3, batch = []) {
    await this.sql.exec({ sql: 'SAVEPOINT addType;' });

    let rowId = null;
    await this.sql.exec({
      sql: [
        'INSERT INTO xpl_types VALUES($parentId, NULL);',
        'SELECT last_insert_rowid();',
      ],
      bind: { $parentId: parentId },
      callback: (row) => {
        [rowId] = row;
      },
    });

    const parentTable = await this.getTableDetails(`xpl_type_${parentId}`);

    const childTable = this.batch2table(batch);

    await this.sql.exec({
      sql: this.table2sql(`xpl_type_${rowId}`, [...parentTable, ...childTable]),
    });

    await this.sql.exec({ sql: 'RELEASE addType;' });

    // TODO: Figure out how to do private, protected, and (maybe) default value?
    return rowId;
  }

  async getTableDetails(table) {
    await this.sql.exec({ sql: 'SAVEPOINT getTableDetails;' });

    const tableDetails = await this.sql.selectObjects(`
      PRAGMA TABLE_XINFO("${table}");
    `);

    tableDetails.forEach((column, i) => {
      tableDetails[i].unique = 0;
    });

    const tableIndexList = await this.sql.selectObjects(`
      PRAGMA INDEX_LIST("${table}");
    `);

    await tableIndexList.forEach(async (column) => {
      const tableIndexInfo = await this.sql.selectObjects(`
        PRAGMA INDEX_INFO("${column.name}");
      `);

      tableDetails.forEach((tdColumn, i) => {
        if (tdColumn.cid === tableIndexInfo[0].cid) {
          tableDetails[i].unique = column.unique;
        }
      });
    });

    await this.sql.exec({ sql: 'RELEASE getTableDetails;' });

    const flags = /^(?<priv>!)?(?<prot>!)?(?<name>[^!*]+)(?<mutable>[*])?$/;
    tableDetails.forEach((column, i) => {
      const { groups } = column.name.match(flags);
      tableDetails[i].mutable = groups.mutable ? 1 : 0;
      tableDetails[i].priv = groups.priv ? 1 : 0;
      tableDetails[i].prot = groups.prot ? 1 : 0;

      tableDetails[i].name = groups.name;
    });

    console.table(tableDetails);

    return tableDetails;
  }
}
