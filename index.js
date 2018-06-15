'use strict';

const fs = require('fs');
const targetUri = require('./targetUri.json');
const getWeiboCn = require('./getWeiboCn');

const minDate = new Date(2018, 3, 1);

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
