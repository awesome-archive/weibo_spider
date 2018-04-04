'use strict';

// weibo.cn html parse
const getWeiboCn = require('./getWeiboCn');
const targetUri = require('./targetUri.json');

(function reduceTarget() {
  let target = targetUri.shift();
  if (!target) {
    console.log('done!');
    process.exit();
  }
  console.log(`\n${target} is crawing... 剩余 ${targetUri.length} 条.\n`);
  getWeiboCn(target, new Date(2018, 0, 1)).then(() => {
    reduceTarget();
  });
})();

process.on('uncaughtException', () => {
  process.exit(1);
});

process.on('unhandledRejection', () => {
  process.exit(1);
});
