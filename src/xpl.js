import antlr4 from 'antlr4';

import Lexer from '#Lexer';
import Parser from '#Parser';
import Walker from '#Walker';

export default class XPL {
  getTree(code) {
    const chars = new antlr4.InputStream(code.toString());
    const lexer = new Lexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new Parser(tokens);

    parser.buildParseTrees = true;

    return parser.parse();
  }

  eval(code) {
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(
      new Walker(),
      this.getTree(code),
    );
  }
}
