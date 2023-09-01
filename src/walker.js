import Listener from '#Listener';

export default class Walker extends Listener {
  constructor() {
    super();

    if (typeof process !== 'object') document.xplDebug = [];
  }

  _exitFreeFormulaic(ctx) {
    if (typeof process !== 'object') document.xplDebug.push(ctx);
  }

  exitTable(ctx) {
    if (typeof process !== 'object') document.xplDebug.push(ctx);
    XplTable.addTable(ctx);
  }
}

class XplTable {

  static addTable(table) {
    let batch = [];

    if (table['batch']) batch = XplTable.getBatch(table.batch().children);

    console.log(batch);
  }

  static getBatch(batch) {
    const batchItems = [];
    batch.forEach((batchItem) => {
      const item = {};

      // TODO: replace "numbers" with WASM primitives
      if (!batchItem.type()) { item.primitive = true }

      item.private = batchItem.private ? true : false;
      item.protect = batchItem.protect ? true : false;

      const bitem = batchItem.type();

      if (!batchItem.type()) { item.type = "_number" }
      else if (batchItem.type().typeString()) { item.type = "_string" }
      else if (batchItem.type().typeBoolean()) { item.type = "_boolean" }
      else if (batchItem.type().typeTable()) { item.type = "_table" }
      else if (batchItem.type().typeFormulaic()) { item.type = "_formulaic" }
      else if (batchItem.type().null_()) { item.type = "_null" }
      else {
        item.type = batchItem.type().typeLabel().getText();
      }

      item.label = batchItem.batchLabel().getText();

      item.mutable = batchItem.mutable ? true : false;
      item.nullable = batchItem.nullable ? true : false;

      item.unique = batchItem.unique ? true : false;

      if (batchItem.batchDefault) {
        item.default = batchItem.batchDefault().getText();
      } else {
        item.default = null;
      }

      batchItems.push(item);
    });

    return batchItems;
  }
}
