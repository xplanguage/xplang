import express from 'express';

const app = express();

app.set('view engine', 'ejs');

app.use('/xpl/antlr4', express.static('./node_modules/antlr4/dist'));
app.use('/xpl/bindings', express.static('./syntax/bindings'));
app.use('/xpl/src', express.static('./src'));

app.get('/', (req, res) => {
  res.render('index', { version: Date.now() });
});

app.listen(process.env.XPL_PORT || 8080);
