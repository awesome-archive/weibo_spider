'use strict';

// weibo.cn html parse
const getWeiboCn = require('./getWeiboCn');
let targetUri = require('./targetUri');


// 串行
reduceTarget();
function reduceTarget() {
  if (!targetUri.length) {
    console.log('done');
    return;
  }
  let target = targetUri.shift();
  console.log(`\n${target} is crawing... 剩余 ${targetUri.length} 条.\n`);
  getWeiboCn(target, new Date(2017, 10, 20)).then(() => {
    reduceTarget();
  });
}



// 并行
// Promise.all(targetUri.map(target => {
//   return getWeiboCn(target, new Date(2017, 6, 1));
// })).then(() => {
//   console.log('done');
// });



// const moment = require('moment');
// // weibo restful json api
// const getWeibo = require('./getWeibo');
// const targets = require('./targets');

// // getWeibo(link, moment('2017-09-01').toDate()).then(() => {
// //   console.log('done');
// // });

// Promise.all(targets.map(link => {
//   return getWeibo(link);
// })).then(() => {
//   console.log('done');
// })