import fs from 'fs';

import XPL from '#XPL';

const xpl = new XPL();

const code = fs.readFileSync('./test/test.xpl', { encoding: 'UTF-8' });

xpl.eval(code);
