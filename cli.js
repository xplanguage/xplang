import fs from 'fs';

import XPL from '#XPL';

const xpl = new XPL();

const testFile = process.env.XPL_TESTFILE || './test/test.xpl';

const code = fs.readFileSync(testFile, { encoding: 'UTF-8' });

xpl.eval(code);
