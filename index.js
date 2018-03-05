'use strict';

// weibo.cn html parse
const getWeiboCn = require('./getWeiboCn');
const targetUri = require('./targetUri.json');

(function reduceTarget() {
  if (!targetUri.length) {
    console.log('done');
    setInterval(() => {
      console.log(new Date());
    }, 1000 * 60);
    return;
  }
  let target = targetUri.shift();
  console.log(`\n${target} is crawing... 剩余 ${targetUri.length} 条.\n`);
  getWeiboCn(target, new Date(2018, 2, 3)).then(() => {
    reduceTarget();
  });
})();
