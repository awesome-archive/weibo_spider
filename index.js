'use strict';

const fs = require('fs');
const getWeiboCn = require('./getWeiboCn');
let { minDate, targetUri } = require('./config');

try {
  let tmpUri = fs.readFileSync('./target.txt', 'utf8').trim().split('\n');
  if (tmpUri && tmpUri.length) targetUri = tmpUri;
} catch(e) {
  // do nothing
}

async function reduceTarget() {
  for (let i = 0, len = targetUri.length; i < len; i++) {
    const target = targetUri[i];
    await getWeiboCn(target, minDate);
    console.log(`\n${target}已抓取完成，剩余${len - 1 - i}条。\n`);
  }
  console.log('done');
  process.exit();
}

reduceTarget();

process.on('uncaughtException', err => {
  fs.appendFileSync('error.log', new Date().toLocaleString() + '\n' + err.stack + '\n\n', 'utf8');
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  fs.appendFileSync('error.log', `${new Date().toLocaleString()}\n未处理的rejection: ${String(p)}\n原因:${reason.stack}\n\n`, 'utf8');
  process.exit(1);
});
