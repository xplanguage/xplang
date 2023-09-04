import Listener from '#Listener';

class Table {
  constructor(db, formulaic) {
    this.db = db;
    this.formulaic = formulaic;
  }

  addTable(tbl, parent = '__TABLE') {
    let batch = [];
    let data = [];

    if (tbl.batch()) batch = this.getBatch(tbl.batch().children);

    if (tbl.tableData()) data = this.getData(tbl.tableData().children);

    this.db.addTable(null, null, parent, batch, data);
  }

  getBatch(batch) {
    const batchItems = [];

    batch.forEach((batchItem) => {
      if (!batchItem?.batchLabel) return;

      const item = {};

      item.private = batchItem.private !== false;
      item.protect = batchItem.protect !== false;

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
        item.type = batchItem.type().typeLabel().getText();
      }

      item.label = batchItem.batchLabel().getText();

      item.mutable = batchItem.mutable !== false;
      item.nullable = batchItem.nullable !== false;

      item.unique = batchItem.unique !== false;

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

          const value = this.formulaic.createValue(dataItem);
          item.value = this.formulaic.getIndex(value);
        }

        row.push(item);
      });

      rows.push(row);
    });
    return rows;
  }
}

class Formulaic {
  // TODO: implement creating custom type fields
  createValue(value) { return -1; }

  // TODO: implement returning index of custom field table
  getIndex(value) { return -2; }
}

export default class Walker extends Listener {
  constructor(xpl) {
    super();
    this.xpl = xpl;
    this.table = new Table(xpl.db, new Formulaic());

    if (typeof process !== 'object') document.xplDebug = [];
  }

  // TODO: exitFreeFormulaic entry point

  // TODO: patchDef entry point

  exitTable(ctx) {
    if (typeof process !== 'object') document.xplDebug.push(ctx);
    this.table.addTable(ctx);
  }
}
