'use strict';

// weibo.cn html parse
const targetUri = require('./targetUri.json');
const getWeiboCn = require('./getWeiboCn');

const minDate = new Date(2018, 0, 1);

(function reduceTarget() {
  let target = targetUri.shift();
  if (!target) {
    console.log('done!');
    process.exit();
  }
  console.log(`\n${target} is crawing... 剩余 ${targetUri.length} 条.\n`);
  getWeiboCn(target, minDate).then(() => {
    reduceTarget();
  });
})();

process.on('uncaughtException', () => {
  process.exit(1);
});

process.on('unhandledRejection', () => {
  process.exit(1);
});
