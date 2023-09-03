import express from 'express';

const app = express();

app.set('view engine', 'ejs');

app.use('/xpl/antlr4', express.static('./node_modules/antlr4/dist'));
app.use('/xpl/sqlite-wasm', express.static('./node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/'));
app.use('/xpl/bindings', express.static('./syntax/bindings'));
app.use('/xpl/src', express.static('./src'));
app.use('/xpl/test', express.static('./test'));

let testFile = process.env.XPL_TESTFILE || 'test/testSyntax.xpl';
testFile = `./xpl/${testFile}`;

app.get('/', (req, res) => {
  res.render('index', { version: Date.now(), testFile });
});

app.listen(process.env.XPL_PORT || 8080);
