import Listener from '#Listener';

export default class Walker extends Listener {
  constructor() {
    super();

    if (typeof process !== 'object') document.xplDebug = [];
  }

  exitFreeFormulaic(ctx) {
    console.table(ctx.getText());
    if (typeof process !== 'object') document.xplDebug.push(ctx);
  }
}
